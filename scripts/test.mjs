import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
import { testImprovements } from './test-improvements.mjs';

const root = resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = resolve(root, '.' + path);
    if (!file.startsWith(root + '/')) throw Error('Invalid path');
    res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.statusCode=404; res.end('Not found'); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;
await mkdir('test-results', {recursive:true});
const browser = await chromium.launch({executablePath:process.env.BROWSER_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), args:['--no-sandbox']});
let checks = 0;
async function audit(page) {
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(800);
  await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
  const result = await page.evaluate(()=>axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
  assert.deepEqual(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})), []);
}
async function openManualSeats(page) {
  const button = page.getByRole('button',{name:'Обрати місце на схемі',exact:true});
  if (!await button.isVisible()) await page.locator('.seat-picker > summary').click();
  await button.click();
}
const pass = name => { checks++; console.log('PASS ' + name); };
try {
  const locales = [['/','uk','Автобус в Італію'],['/ru/','ru','Автобус в Италию'],['/it/','it','Autobus per l’Italia']];
  for (const [path,lang,h1] of locales) {
    const html = await readFile(root + path + 'index.html','utf8');
    assert(!html.includes('{{'));
    assert(html.includes(`<html lang="${lang}">`));
    assert.match(html, /rel="canonical" href="https:\/\//);
    assert.match(html, /property="og:image" content="https:\/\//);
    assert.match(html, /property="og:url" content="https:\/\//);
    assert.equal((html.match(/rel="alternate" hreflang=/g) || []).length,4);
    assert(html.includes('FAQPage') && html.includes('LocalBusiness'));
    assert(!/support\.js|unpkg\.com|fonts\.googleapis/.test(html));
    assert(html.includes('/assets/vendor/react.production.min.js') && html.includes('/assets/vendor/react-dom.production.min.js'));
    const context = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:863}});
    const page=await context.newPage();
    await page.goto(base+path);
    assert((await page.locator('h1').innerText()).includes(h1));
    await page.locator('.faq-item summary').nth(2).click();
    assert(await page.locator('.faq-item').nth(2).getAttribute('open') !== null);
    await context.close();
    pass('static HTML, SEO and no-JS FAQ ' + path);
  }
  const robots=await readFile(root+'/robots.txt','utf8');
  assert.equal((robots.match(/User-agent:/g)||[]).length,1);
  assert(!/Disallow|GPTBot|Claude|Perplexity/.test(robots));
  const sitemap=await readFile(root+'/sitemap.xml','utf8');
  for (const path of ['/ru/','/it/','/oferta.html','/privacy.html']) assert(sitemap.includes(path));
  pass('sitemap and unified robots');

  for (const width of [320,360,390,430,768,1280]) {
    const context=await browser.newContext({viewport:{width,height:863},locale:'ru-RU',isMobile:width<=430,hasTouch:width<=430,deviceScaleFactor:width===390?3:1});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
    await page.addInitScript(()=>localStorage.setItem('avi_lang','it'));
    const requests=[];
    page.on('request',r=>requests.push(r));
    await page.route('https://script.google.com/**', route => route.fulfill({json:{success:true,seats:[{seat:2,status:'taken'},{seat:3,status:'blocked'}]}}));
    for (const [path,lang] of locales) {
      await page.goto(base+path,{waitUntil:'networkidle'});
      assert.equal(await page.locator('html').getAttribute('lang'),lang);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
      assert.equal(await page.locator('#v3seats').count(),0);
      assert(await page.locator('[data-v=direction]').evaluateAll(els=>els.every(el=>el.scrollWidth<=el.clientWidth)));
      assert(await page.locator('header a[hreflang]').evaluateAll(els=>els.every(el=>el.getBoundingClientRect().height>=44)));
      await page.locator('.faq-item summary').nth(1).click();
      assert(await page.locator('.faq-item').nth(1).getAttribute('open') !== null);
      assert.equal(await page.locator('#v3stops [style*="border-radius:16px"]').count(),6);
      for (const image of await page.locator('img').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(el=>el.decode());
      }
    }
    await page.goto(base+'/',{waitUntil:'networkidle'});
    const selects=page.locator('#v3search select');
    await selects.nth(0).selectOption('lviv');
    await selects.nth(1).selectOption('trieste');
    await selects.nth(2).selectOption({index:1});
    assert.equal(await page.locator('[data-v=seat]').count(),0);
    await openManualSeats(page);
    await page.waitForFunction(()=>document.querySelector('[data-v="seat"][data-status="taken"]'));
    if(width===390) await audit(page);
    const taken=page.locator('[data-v="seat"]').filter({hasText:/^2$/});
    assert(await taken.isDisabled());
    assert.equal(await taken.evaluate(el=>getComputedStyle(el).textDecorationLine),'line-through');
    await page.locator('[data-v="seat"]').filter({hasText:/^1$/}).click();
    assert.equal(await page.locator('[data-v="seat"]').filter({hasText:/^1$/}).getAttribute('aria-pressed'),'true');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
    if (width<=430) {
      assert(await page.locator('[data-v=seat]').first().evaluate(el=>el.getBoundingClientRect().width>=44));
      assert(await page.locator('#v3pax input').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=16));
      assert(await page.locator('#v3search label span').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=13));
      assert(await page.locator('.date-strip').evaluate(el=>el.scrollWidth>el.clientWidth));
      await page.locator('.date-strip').evaluate(el=>el.scrollLeft=el.scrollWidth);
      if(width===390) {
        await page.locator('#v3seats').scrollIntoViewIfNeeded();
        await page.screenshot({path:'test-results/mobile-seats.png'});
        await page.locator('#v3pax').scrollIntoViewIfNeeded();
        await page.screenshot({path:'test-results/mobile-form.png'});
      }
    } else if(width===1280) {
      const size=await page.locator('h1').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
      assert(size>=64 && size<=72);
      assert.equal((await page.locator('.faq-layout').evaluate(el=>getComputedStyle(el).gridTemplateColumns)).split(' ').length,2);
    }
    for(const path of ['/oferta.html','/privacy.html']) {
      await page.goto(base+path,{waitUntil:'networkidle'});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
      assert(await page.locator('h1').isVisible());
      if(width===390) await audit(page);
    }
    assert.equal(requests.filter(r=>r.url()===base+'/' && r.resourceType()!=='document').length,0);
    assert.deepEqual(errors,[]);
    await page.evaluate(()=>sessionStorage.clear());
    await page.goto(base+'/');
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(750);
    await page.screenshot({path:`test-results/${width}-home.png`,fullPage:true});
    await context.close();
    pass('locales, assets, booking layout and legal pages at '+width+'px');
  }

  const context=await browser.newContext({viewport:{width:390,height:863}});
  const page=await context.newPage();
  let applications=0, mode='success', saved;
  await page.route('https://script.google.com/**', async route=>{
    if(route.request().method()==='POST') {
      applications++; saved=route.request().postDataJSON();
      return route.fulfill({json:mode==='success'?{success:true,id:'TEST-001'}:mode==='conflict'?{success:false,error:'seat_taken',seats:[1]}:{success:false,error:'network'}});
    }
    return route.fulfill({json:{success:true,seats:mode==='conflict'?[{seat:1,status:'taken'}]:[]}});
  });
  await page.goto(base+'/');
  const selects=page.locator('#v3search select');
  await selects.nth(0).selectOption('lviv');
  await selects.nth(1).selectOption('trieste');
  await selects.nth(2).selectOption({index:1});
  await openManualSeats(page);
  await page.locator('[data-v="seat"]').filter({hasText:/^1$/}).click();
  await page.locator('#v3pax input[type="text"]').nth(0).fill('Тест');
  await page.locator('#v3pax input[type="text"]').nth(1).fill('Пасажир');
  await page.locator('#v3pax input[type="tel"]').fill('1');
  await page.locator('input[type="checkbox"]').check();
  const submit=page.getByRole('button',{name:'Надіслати заявку',exact:true}).first();
  await submit.click();
  assert.equal(applications,0);
  await page.locator('#v3pax input[type="tel"]').fill('+380 67 123 45 67');
  mode='conflict';
  await submit.click();
  await page.waitForFunction(()=>document.querySelector('[role="alert"]'));
  assert.equal(applications,1);
  assert.equal(await page.locator('[data-v="seat"]').filter({hasText:/^1$/}).getAttribute('aria-pressed'),'false');
  mode='error';
  await page.locator('[data-v="seat"]').filter({hasText:/^4$/}).click();
  await submit.click();
  await page.getByText('Не вдалося надіслати заявку. Спробуйте ще раз.',{exact:true}).first().waitFor();
  const fallback = page.locator('.send-fallback a.fallback-wa');
  assert((await fallback.getAttribute('href')).includes('text='));
  assert(decodeURIComponent(await fallback.getAttribute('href')).includes('Тест Пасажир'));
  assert((await page.locator('.send-fallback').innerText()).includes('+380 67 470 46 17'));
  await audit(page);
  await fallback.scrollIntoViewIfNeeded();
  await page.screenshot({path:'test-results/mobile-send-error.png'});
  assert.equal(applications,2);
  mode='success';
  await submit.click();
  await page.getByRole('dialog').waitFor();
  assert.equal(saved.totalEur,120);
  assert.equal(saved.seats,'4');
  assert.equal(saved.phone,'+380671234567');
  assert.equal(new Date(saved.departureDate+'T12:00:00Z').getUTCDay(),3);
  assert.equal(new Date(saved.date+'T12:00:00Z').getUTCDay(),2);
  assert(saved.message.includes(saved.departureDate.split('-').reverse().join('.')));
  assert(saved.message.includes('Точну точку повідомить менеджер'));
  assert.equal(applications,3);
  assert(await page.getByRole('dialog').innerText().then(s=>s.includes('TEST-001')));
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(),0);
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
  await context.close();
  pass('phone validation, seat conflict, retry, price, confirmation and Escape (mock API only)');
  await testP0(browser,base,pass);
  await testImprovements(browser,base,pass);
  console.log(`${checks} scenario groups passed. No real applications submitted.`);
} finally {
  await browser.close();
  await new Promise(done=>server.close(done));
}

async function testP0(browser,base,pass) {
  const {Component,T} = await import('../src/booking.js');
  const model = new Component({defaultLang:'ua',initialNow:'2026-12-28T12:00:00Z'});
  for(const [phone,valid,normalized] of [
    ['0671234567',true,'+380671234567'], ['671234567',true,'+380671234567'],
    ['380671234567',true,'+380671234567'], ['+380671234567',true,'+380671234567'],
    ['+38067123456',false], ['+3806712345678',false],
    ['+39123456789',true],['+3912345678901',true],['+3912345678',false],['+39123456789012',false],
    ['+38+0671234567',false],['abc',false],['+380 67 1234567',false]
  ]) {
    assert.equal(model.validPhone(phone),valid,phone);
    if(normalized) assert.equal(model.normalizePhone(phone),normalized);
  }
  for(const [dir,cities,weekday] of [
    ['ua_it',['rivne','lviv','stryi','uzhhorod'],3],
    ['it_ua',['trieste','venezia','padova','rovigo'],6],
    ['ua_it',['kryvyi','kropyv','cherkasy','kyiv','zhytomyr'],2],
    ['it_ua',['ferrara','bologna','imola','forli','rimini','pesaro','ancona','pescara'],5]
  ]) {
    for(const from of cities) {
      model.state={...model.state,dir,from};
      const options=model.dateOptions();
      for(const option of options) assert.equal(new Date(option.k+'T12:00:00Z').getUTCDay(),weekday,from);
      model.state.dateOut=options[0].k;
      assert.equal(new Date(model.serviceDate()+'T12:00:00Z').getUTCDay(),dir==='ua_it'?2:5);
      assert.equal(model.missing().some(label=>/^Місце/.test(label)),false);
    }
  }
  const offer=await readFile('dist/oferta.html','utf8');
  assert(offer.includes(T.ua.payNote));
  assert.equal(T.ua.faq.items[1].a,T.ua.payNote);
  assert(!/оплата[^.]*онлайн|платіжну карту|комісія платіжної/i.test(offer));
  pass('country phone rules, normalization, all city weekdays, year rollover and consistent cash payment');

  const context=await browser.newContext({viewport:{width:390,height:863},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  let gets=0,posts=0,lastPayload,mode='success';
  await page.addInitScript(()=>{
    window.testVisibility='visible';
    Object.defineProperty(document,'visibilityState',{get:()=>window.testVisibility});
  });
  await page.clock.install({time:new Date('2026-10-07T12:00:00Z')});
  await page.route('https://script.google.com/**',route=>{
    if(route.request().method()==='POST') {
      posts++;lastPayload=route.request().postDataJSON();
      return route.fulfill({json:{success:true,id:'ANY-TEST'}});
    }
    gets++;
    if(mode==='hang') return;
    return route.fulfill({json: mode==='error'?{success:false}:{success:true,seats:[]}});
  });
  await page.goto(base+'/');
  const selects=page.locator('#v3search select');
  await selects.nth(0).selectOption('lviv');
  await selects.nth(1).selectOption('trieste');
  await selects.nth(2).selectOption({index:1});
  const date=await selects.nth(2).inputValue();
  assert.equal(gets,0,'any seat must not depend on a sheet request');
  assert((await page.locator('#v3results').innerText()).includes(date.split('-').reverse().join('.')));
  assert((await page.locator('#v3seats').innerText()).includes(date.split('-').reverse().join('.')));
  const messenger=page.locator('a[href*="wa.me"]').filter({hasText:'WhatsApp'}).first();
  const href=await messenger.getAttribute('href');
  assert(href.includes('text='));
  assert(decodeURIComponent(href).includes('Будь-яке'));
  assert.equal(posts,0);
  await openManualSeats(page);
  await page.waitForFunction(()=>document.querySelector('[data-v=seat]:not(:disabled)'));
  assert.equal(gets,1);
  await page.clock.fastForward(59000);
  assert.equal(gets,1);
  await page.evaluate(()=>window.testVisibility='hidden');
  await page.clock.fastForward(120000);
  assert.equal(gets,1);
  await page.evaluate(()=>{window.testVisibility='visible';document.dispatchEvent(new Event('visibilitychange'));});
  await page.waitForTimeout(100);
  assert.equal(gets,2);
  mode='hang';
  await openManualSeats(page);
  assert.equal(gets,3);
  await page.clock.fastForward(10001);
  await page.getByText(T.ua.ui.seatsUnavailable,{exact:true}).waitFor();
  await page.locator('#v3pax input[type=text]').nth(0).fill('Тест');
  await page.locator('#v3pax input[type=text]').nth(1).fill('Безмісця');
  await page.locator('#v3pax input[type=tel]').fill('0671234567');
  await page.locator('input[type=checkbox]').check();
  await page.getByRole('button',{name:'Надіслати заявку',exact:true}).first().click();
  await page.getByRole('dialog').waitFor();
  assert.equal(posts,1);
  assert.equal(lastPayload.seats,'');
  assert.equal(lastPayload.seatPreference,'any');
  assert.equal(lastPayload.phone,'+380671234567');
  assert((await page.getByRole('dialog').innerText()).includes('Точну точку повідомить менеджер'));
  await context.close();
  pass('optional seats, no default sheet dependency, active-tab 60s polling, 10s timeout and booking despite failed seats');
}
