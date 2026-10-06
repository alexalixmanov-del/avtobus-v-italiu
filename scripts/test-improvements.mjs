import assert from 'node:assert/strict';

const storageKey = 'avtobus.booking-draft.v1';

export async function testImprovements(browser, base, pass) {
  let posts = 0, payload;
  async function setup(width = 390) {
    const context = await browser.newContext({viewport:{width,height:844},isMobile:width<600,hasTouch:width<600});
    const page = await context.newPage();
    await page.route('https://script.google.com/**', route => {
      if (route.request().method() === 'POST') {
        posts++; payload = route.request().postDataJSON();
        return route.fulfill({json:{success:true,id:'FORM-TEST'}});
      }
      return route.fulfill({json:{success:true,seats:[{seat:2,status:'taken'}]}});
    });
    await page.goto(base+'/', {waitUntil:'networkidle'});
    return {context,page};
  }
  async function chooseRoute(page, direction = 'ua_it', passengers = '1') {
    if (direction === 'it_ua') await page.locator('[data-v=direction]').nth(1).click();
    const select = page.locator('#v3search select');
    await select.nth(0).selectOption(direction === 'ua_it' ? 'lviv' : 'trieste');
    await select.nth(1).selectOption(direction === 'ua_it' ? 'trieste' : 'lviv');
    await select.nth(2).selectOption({index:1}); await select.nth(3).selectOption(passengers);
  }
  async function person(page, number = 1, phone = '0671234567') {
    await page.locator(`#passenger-${number}-first`).fill('Test');
    await page.locator(`#passenger-${number}-last`).fill('Passenger');
    await page.locator(`#passenger-${number}-phone`).fill(phone);
    await page.locator(`#passenger-${number}-phone`).blur();
  }
  async function clickSticky(page) {
    await page.locator('[data-v=mbar] button').click();
  }
  async function focused(page, id) {
    await page.waitForFunction(id => document.activeElement?.id === id, id);
    await page.waitForFunction(id => {
      const box = document.getElementById(id).closest('[data-field]').getBoundingClientRect();
      return box.top >= 60 && box.bottom <= innerHeight - 10;
    }, id);
  }
  async function checkA11y(page) {
    await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
    const result=await page.evaluate(()=>axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
    assert.deepEqual(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[]);
  }

  {
    const {context,page}=await setup(); await chooseRoute(page);
    await person(page,1,'+38022336669999999');
    await page.locator('#booking-consent').check();
    await page.locator('#passenger-1-phone-error').waitFor();
    assert((await page.locator('#passenger-1-phone-error').innerText()).includes('Номер задовгий'));
    const before=posts; await clickSticky(page); await focused(page,'passenger-1-phone');
    assert.equal(posts,before);
    assert.equal(await page.locator('#passenger-1-phone').getAttribute('aria-describedby'),'passenger-1-phone-error');
    await page.screenshot({path:'test-results/mobile-phone-fixed.png'});
    await checkA11y(page);
    for (const [value,text] of [['','Вкажіть телефон'],['+38067','Номер закороткий'],['+391234','Після +39'],['+39123456789012','Номер задовгий'],['+38+067','кодом країни']]) {
      await page.locator('#passenger-1-phone').fill(value); await page.locator('#passenger-1-phone').blur();
      assert((await page.locator('#passenger-1-phone-error').innerText()).includes(text),value);
    }
    await page.locator('#passenger-1-phone').fill('0671234567');
    assert.equal(await page.locator('#passenger-1-phone-error').count(),0);
    await page.locator('#booking-consent').uncheck(); await clickSticky(page); await focused(page,'booking-consent');
    assert.equal(await page.locator('#booking-consent').getAttribute('aria-invalid'),'true');
    assert((await page.locator('#booking-consent-error').innerText()).includes('Підтвердьте згоду'));
    assert.equal(posts,before);
    await page.screenshot({path:'test-results/mobile-consent-fixed.png'});
    await page.locator('#booking-consent').check(); await page.locator('#booking-email').fill('invalid-email');
    await page.locator('#booking-email').blur(); await page.locator('#booking-email-error').waitFor();
    await clickSticky(page); await focused(page,'booking-email');
    assert.equal(posts,before); assert.equal(await page.locator('#booking-email').getAttribute('aria-invalid'),'true');
    assert((await page.locator('#booking-email-error').innerText()).includes('name@gmail.com'));
    await page.locator('#booking-email').fill('');
    await page.locator('#passenger-1-last').fill('');
    await page.locator('#v3seats button').filter({hasText:'Надіслати заявку'}).click();
    await focused(page,'passenger-1-last'); assert.equal(posts,before);
    await page.locator('#passenger-1-last').fill('Passenger'); await page.locator('#passenger-1-last').blur();
    await clickSticky(page); await page.getByRole('dialog').waitFor();
    assert.equal(posts,before+1); assert.equal(payload.phone,'+380671234567'); assert.equal(payload.email,'');
    assert.equal(await page.evaluate(key=>sessionStorage.getItem(key),storageKey),null);
    await page.reload({waitUntil:'networkidle'}); assert.equal(await page.locator('#booking-from').inputValue(),'');
    await context.close();
    pass('mobile sticky and ticket share validation: phone blur, first-error focus, email, consent, optional email and one successful mock POST');
  }

  {
    const {context,page}=await setup(); await chooseRoute(page,'it_ua','2');
    await person(page,1,'+38022336669999999'); await person(page,2,'+393201234567');
    await page.locator('#booking-email').fill('test@example.com'); await page.locator('#booking-consent').check();
    assert((await page.locator('[data-v=trust]').innerText()).includes('щосуботи'));
    await page.locator('.seat-picker > summary').click();
    await page.getByRole('button',{name:'Обрати місце на схемі',exact:true}).click();
    await page.locator('[data-v=seat]').filter({hasText:/^1$/}).click();
    await page.locator('[data-v=seat]').filter({hasText:/^3$/}).click();
    await page.locator('#v3pax details').first().locator('summary').click();
    await page.getByRole('button',{name:'+1 kg',exact:true}).click();
    const selectedDate=await page.locator('#booking-date').inputValue();
    for (const [label,path,lang,phoneMessage,schedule] of [
      ['Русский','/ru/','ru','Номер слишком длинный','субботу'],
      ['Italiano','/it/','it','Numero troppo lungo','sabato'],
      ['Українська','/','uk','Номер задовгий','щосуботи']
    ]) {
      await page.getByRole('link',{name:label,exact:true}).click(); await page.waitForURL(base+path);
      await page.waitForSelector('#passenger-2-phone');
      assert.equal(await page.locator('html').getAttribute('lang'),lang);
      assert.equal(await page.locator('#booking-from').inputValue(),'trieste');
      assert.equal(await page.locator('#booking-to').inputValue(),'lviv');
      assert.equal(await page.locator('#booking-date').inputValue(),selectedDate);
      assert.equal(await page.locator('#passenger-1-first').inputValue(),'Test');
      assert.equal(await page.locator('#passenger-1-phone').inputValue(),'+38022336669999999');
      assert.equal(await page.locator('#passenger-2-phone').inputValue(),'+393201234567');
      assert.equal(await page.locator('#booking-email').inputValue(),'test@example.com');
      assert(await page.locator('#booking-consent').isChecked());
      assert.equal(await page.locator('[data-v=seat][aria-pressed=true]').count(),2);
      assert((await page.locator('#passenger-1-phone-error').innerText()).includes(phoneMessage));
      assert((await page.locator('[data-v=trust]').innerText()).includes(schedule));
      assert((await page.locator('[data-v=mbar]').innerText()).includes('241'));
      assert(!await page.evaluate(()=>Object.keys(localStorage).some(k=>k.includes('draft'))));
    }
    await page.locator('#passenger-1-phone').fill('0671234567');await page.locator('#passenger-1-phone').blur();
    await clickSticky(page);await page.getByRole('dialog').waitFor();
    assert.equal(payload.paxCount,2);assert.equal(payload.extraKg,1);assert.equal(payload.seats,'1, 3');
    assert.equal(await page.evaluate(key=>sessionStorage.getItem(key),storageKey),null);
    await context.close();
    pass('UA/RU/IT preserve same-session draft, reverse route, date, all passengers, baggage, consent and freshly checked seats; success clears draft');
  }

  for (const width of [320,390,430,768,1280]) {
    const {context,page}=await setup(width);await chooseRoute(page);
    const metrics=await page.evaluate(()=>({formY:document.getElementById('v3pax').getBoundingClientRect().top,
      bar:document.querySelector('[data-v=mbar]').getBoundingClientRect().height,
      columns:getComputedStyle(document.querySelector('.onboard-grid')).gridTemplateColumns.split(' ').length}));
    assert.equal(await page.locator('.seat-picker').getAttribute('open'),null);
    assert.equal(await page.locator('[data-v=seat]').count(),0);
    assert.equal(await page.locator('[data-v=mbar] a').count(),0);
    assert.equal(await page.locator('[data-v=mbar] button').count(),1);
    if (width<600) { assert(metrics.bar<=70,JSON.stringify(metrics));assert(metrics.formY<1750,JSON.stringify(metrics)); }
    if (width===390) assert(metrics.formY<1500,JSON.stringify(metrics));
    assert.equal(metrics.columns,width===1280?3:width===768?2:1);
    await page.locator('.trip-details > summary').click();
    assert((await page.locator('.trip-details').innerText()).includes('Точну точку повідомить менеджер'));
    await page.locator('.trip-details > summary').click();
    await page.locator('.seat-picker > summary').click();await page.getByRole('button',{name:'Обрати місце на схемі',exact:true}).click();
    await page.locator('[data-v=seat]').first().waitFor();
    if(width<600) assert(await page.locator('[data-v=seat]').first().evaluate(el=>el.getBoundingClientRect().width>=44));
    await page.locator('.seat-picker > summary').click();
    assert.equal(await page.locator('.seat-picker').getAttribute('open'),null);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
    if(width===390 || width===1280) {
      await page.evaluate(()=>scrollTo(0,0));await page.evaluate(()=>document.fonts.ready);
      await page.screenshot({path:`test-results/${width}-compact-booking.png`,fullPage:true});
    }
    await context.close();
  }
  pass('compact mobile route/form, collapsed optional seats, 66px one-button bar, 3x2 desktop benefits and no horizontal overflow');

  {
    const {context,page}=await setup();
    await page.addInitScript(()=>Object.defineProperty(window,'sessionStorage',{get(){throw new Error('Storage blocked');}}));
    await page.reload();await chooseRoute(page);await person(page);await page.locator('#booking-consent').check();
    await clickSticky(page);await page.getByRole('dialog').waitFor();await context.close();
    for(const raw of ['not json',JSON.stringify({version:1,updatedAt:Date.now()-172800000,dir:'it_ua',from:'trieste',to:'lviv',lead:{first:'Stale'}})]) {
      const c=await browser.newContext();await c.addInitScript(({key,raw})=>sessionStorage.setItem(key,raw),{key:storageKey,raw});
      const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/');
      await p.waitForFunction(key=>!sessionStorage.getItem(key),storageKey);
      assert.equal(await p.locator('#booking-from').inputValue(),'');assert.equal(await p.locator('#v3pax').count(),0);assert.deepEqual(errors,[]);await c.close();
    }
    const autofill=await setup();await chooseRoute(autofill.page);
    const inspector=await autofill.context.newCDPSession(autofill.page);
    await inspector.send('DOM.enable');await inspector.send('CSS.enable');
    const {root}=await inspector.send('DOM.getDocument');
    const {nodeId}=await inspector.send('DOM.querySelector',{nodeId:root.nodeId,selector:'#passenger-1-phone'});
    await inspector.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:['autofill']});
    const appearance=await autofill.page.locator('#passenger-1-phone').evaluate(el=>({
      autofill:el.matches(':-webkit-autofill'),text:getComputedStyle(el).webkitTextFillColor,shadow:getComputedStyle(el).boxShadow}));
    assert(appearance.autofill);assert.equal(appearance.text,'rgb(245, 248, 252)');
    assert(appearance.shadow.includes('rgb(28, 43, 62)'));
    await autofill.page.locator('#passenger-1-phone').fill('+38022336669999999');await autofill.page.locator('#passenger-1-phone').blur();
    assert.equal(await autofill.page.locator('#passenger-1-phone').getAttribute('aria-invalid'),'true');
    assert((await autofill.page.locator('#passenger-1-phone').evaluate(el=>getComputedStyle(el).boxShadow)).includes('rgb(48, 32, 42)'));
    await autofill.context.close();
    pass('blocked/malformed/expired storage does not break booking; themed autofill and invalid state verified in Chromium (physical Safari pending)');
  }
}
