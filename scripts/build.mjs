import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { parseFragment } from 'parse5';
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import React from 'react';
import { renderToString } from 'react-dom/server';

// Compile the archived template during the build. The browser receives ordinary
// React code, not a template parser, eval(), or a second request for the HTML.
const read = path => readFile(path, 'utf8');
const quote = JSON.stringify;
const attrNames = { class: 'className', for: 'htmlFor', onclick: 'onClick', onchange: 'onChange',
  oninput: 'onInput', onfocus: 'onFocus', onblur: 'onBlur', tabindex: 'tabIndex', readonly: 'readOnly',
  maxlength: 'maxLength', autocomplete: 'autoComplete', inputmode: 'inputMode',
  srcset: 'srcSet', crossorigin: 'crossOrigin', hreflang: 'hrefLang',
  'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin',
  'fill-rule': 'fillRule', 'clip-rule': 'clipRule' };
const boolAttrs = new Set(['disabled', 'checked', 'hidden', 'required', 'multiple', 'selected', 'readonly']);
let key = 0;
function expression(raw, scope) {
  const value = raw.trim();
  if (['true', 'false', 'null', 'undefined'].includes(value)) return value;
  if (!/^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/.test(value)) throw Error('Unsupported expression: ' + value);
  return (scope.has(value.split('.')[0]) ? '' : 'v.') + value;
}
function interpolate(text, scope) {
  const parts = text.split(/\{\{([\s\S]*?)\}\}/g);
  if (parts.length === 3 && !parts[0] && !parts[2]) return expression(parts[1], scope);
  return parts.map((part, i) => i % 2 ? `(${expression(part, scope)} ?? '')` : quote(part)).join(' + ');
}
function compile(node, scope = new Set()) {
  if (node.nodeName === '#text') return interpolate(node.value, scope);
  if (!node.tagName) return 'null';
  const attrs = Object.fromEntries(node.attrs.map(a => [a.name, a.value]));
  const kids = node.childNodes || [];
  if (node.tagName === 'sc-if') return `(${interpolate(attrs.value, scope)} ? h(React.Fragment, null, ${kids.map(n => compile(n, scope)).join(',')}) : null)`;
  if (node.tagName === 'sc-for') {
    const name = attrs.as || 'item';
    if (!/^[A-Za-z_$][\w$]*$/.test(name)) throw Error('Invalid loop variable');
    const nested = new Set([...scope, name]);
    return `(${interpolate(attrs.list, scope)} || []).map((${name}, index) => h(React.Fragment, {key:index}, ${kids.map(n => compile(n, nested)).join(',')}))`;
  }
  const props = [`key:${key++}`];
  for (const [name, value] of Object.entries(attrs)) {
    if (name.startsWith('hint-')) continue;
    const prop = attrNames[name] || name;
    let code = interpolate(value, scope);
    if (name === 'style') code = `css(${code})`;
    if (boolAttrs.has(name) && value === '') code = 'true';
    props.push(`${quote(prop)}:${code}`);
  }
  const tag = node.tagName.replace(/^x-raw-/, '');
  return `h(${quote(tag)}, {${props.join(',')}}, ${kids.length ? kids.map(n => compile(n, scope)).join(',') : ''})`;
}
// HTML parsers discard custom control-flow tags inside select/option elements.
// Protect these raw-text/select containers before parsing, then unwrap in compile.
const source = (await read('src/home.html')).replace(/<(\/)?(select|option|textarea)(?=[\s>])/gi, '<$1x-raw-$2');
const template = parseFragment(source);
await mkdir('.build', { recursive: true });
await writeFile('.build/template.js', `import React from 'react';
const h = React.createElement;
function css(text) {
  if (typeof text !== 'string') return text;
  return Object.fromEntries(text.split(';').filter(Boolean).map(declaration => {
    const colon = declaration.indexOf(':');
    const name = declaration.slice(0, colon).trim();
    const key = name.startsWith('--') ? name : name.replace(/^-ms-/, 'ms-').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return [key, declaration.slice(colon + 1).trim()];
  }));
}
export const renderTemplate = v => h(React.Fragment, null, ${template.childNodes.map(n => compile(n)).join(',')});
`);
const { Component, T } = await import('../src/booking.js');
const origin = new URL(process.env.SITE_URL || 'https://avtobus-v-italiu.dg-s.space');
if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) {
  throw Error('SITE_URL must be an HTTPS origin, e.g. https://example.com');
}
const site = origin.origin;
const now = new Date().toISOString();
const lastmod = process.env.SITE_LASTMOD || new Intl.DateTimeFormat('sv-SE', {timeZone:'Europe/Kyiv'}).format(new Date(now));
if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod) || isNaN(Date.parse(lastmod))) throw Error('Invalid SITE_LASTMOD');
const locales = [{code:'ua', lang:'uk', path:'/'}, {code:'ru', lang:'ru', path:'/ru/'}, {code:'it', lang:'it', path:'/it/'}];
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const json = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const alternates = locales.map(l => `<link rel="alternate" hreflang="${l.lang}" href="${site}${l.path}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${site}/">`;
let baseHead = await read('src/head.html');
baseHead = baseHead.replace(/<template id="__bundler_thumbnail">[\s\S]*?<\/template>/, '')
  .replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta (?:name="description"|property="og:[^"]+")[^>]*>/g, '')
  .replace(/<link rel="preload" as="image"[^>]*>/, '')
  .replace('Unbounded:wght@500;700;800&family=Manrope:wght@500;600;700;800', 'Unbounded:wght@500;800&family=Manrope:wght@500;700')
  .replaceAll('./favicon-', '/favicon-');
const removeExternalFonts = html => html.replace(/<link[^>]*https:\/\/fonts\.(googleapis|gstatic)\.com[^>]*>/g, '');
baseHead = removeExternalFonts(baseHead).replace(/  #v3stops, #v3faq, footer \{[^}]+\}/, '');
const styles = await read('src/improvements.css');
await rm('dist', {recursive:true, force:true});
await mkdir('dist/assets', {recursive:true});
await cp('public', 'dist', {recursive:true});
await mkdir('dist/assets/vendor', {recursive:true});
await cp('node_modules/react/umd/react.production.min.js', 'dist/assets/vendor/react.production.min.js');
await cp('node_modules/react-dom/umd/react-dom.production.min.js', 'dist/assets/vendor/react-dom.production.min.js');
let fontCss = '';
await mkdir('dist/assets/fonts', {recursive:true});
for (const [family, weights] of [['manrope',[500,700]], ['unbounded',[500,800]]]) {
  for (const weight of weights) {
    const css = await read(`node_modules/@fontsource/${family}/${weight}.css`);
    for (const face of css.matchAll(/@font-face \{[^}]+\}/g)) {
      const file = face[0].match(/\.\/files\/([^()]+)\.woff2/)[1] + '.woff2';
      if (/greek|vietnamese/.test(file)) continue;
      await cp(`node_modules/@fontsource/${family}/files/${file}`, `dist/assets/fonts/${file}`);
      fontCss += face[0].replace(/src:[^;]+;/, `src: url('/assets/fonts/${file}') format('woff2');`) + '\n';
    }
  }
  await cp(`node_modules/@fontsource/${family}/LICENSE`, `dist/assets/fonts/${family}-LICENSE.txt`);
}
await build({entryPoints:['src/entry.js'], bundle:true, minify:true, outfile:'dist/assets/app.js',
  define:{'process.env.NODE_ENV':'"production"'}, target:['es2020'], plugins:[{
    name:'local-react-umd', setup(builder) {
      builder.onResolve({filter:/^react(?:-dom\/client)?$/}, args=>({path:args.path,namespace:'local-react'}));
      builder.onLoad({filter:/.*/,namespace:'local-react'}, args=>({
        contents:args.path==='react' ? 'export default window.React;' : 'export const hydrateRoot = window.ReactDOM.hydrateRoot;', loader:'js'
      }));
    }
  }]});
const clientVersion = createHash('sha256').update(await read('dist/assets/app.js')).digest('hex').slice(0,12);
for (const locale of locales) {
  const t = T[locale.code];
  const title = Component.META[locale.code].title;
  const description = t.hero.sub + ' ' + t.ui.summary;
  const canonical = site + locale.path;
  const props = {defaultLang:locale.code, initialNow:now};
  const markup = renderToString(React.createElement(Component, props));
  const schema = {'@context':'https://schema.org', '@graph':[
    {'@type':'LocalBusiness','@id':site+'/#business', name:'Avtobus v Italiu', url:site+'/',
      image:site+'/hero-1600.webp', telephone:['+380674704617','+393245958718'], email:'Oktobus109@gmail.com',
      areaServed:[{'@type':'Country',name:'Ukraine'},{'@type':'Country',name:'Italy'}]},
    {'@type':'FAQPage','@id':canonical+'#faq', inLanguage:locale.lang,
      mainEntity:t.faq.items.map(q => ({'@type':'Question',name:q.q,acceptedAnswer:{'@type':'Answer',text:q.a}}))}
  ]};
  const seo = `<title>${escape(title)}</title><meta name="description" content="${escape(description)}">
<link rel="canonical" href="${canonical}">${alternates}
<meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}">
<meta property="og:locale" content="${{ua:'uk_UA',ru:'ru_UA',it:'it_IT'}[locale.code]}">
<meta property="og:image" content="${site}/hero-1600.webp">
<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900">
<script type="application/ld+json">${json(schema)}</script>`;
  const html = `<!DOCTYPE html><html lang="${locale.lang}"><head><meta charset="utf-8">${baseHead}${seo}
<style>${fontCss}${styles}</style><script defer src="/assets/vendor/react.production.min.js"></script><script defer src="/assets/vendor/react-dom.production.min.js"></script><script defer src="/assets/app.js?v=${clientVersion}"></script></head><body>
<div id="app">${markup}</div><script id="app-props" type="application/json">${json(props)}</script>
<noscript><p class="no-js">${t.ui.helpSub} <a href="tel:+380674704617">+380 67 470 46 17</a> · <a href="https://wa.me/380674704617">WhatsApp</a></p></noscript></body></html>`;
  const directory = 'dist' + (locale.path === '/' ? '' : locale.path);
  await mkdir(directory, {recursive:true});
  await writeFile(directory+'/index.html', html);
}
for (const name of ['oferta','privacy']) {
  const html = removeExternalFonts(await read(`src/${name}.html`)).replaceAll('./brand-sm.png', '/brand-sm.webp')
    .replaceAll('./favicon-', '/favicon-')
    .replace('Unbounded:wght@500;700;800&family=Manrope:wght@500;600;700;800', 'Unbounded:wght@500;800&family=Manrope:wght@500;700')
    .replace('</head>', `<link rel="canonical" href="${site}/${name}.html"><style>${fontCss}${styles}</style></head>`);
  await writeFile(`dist/${name}.html`, html);
}
const paths = [...locales.map(l => l.path), '/oferta.html', '/privacy.html'];
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.map(path => `<url><loc>${site}${path}</loc><lastmod>${lastmod}</lastmod>${locales.some(l => l.path === path) ? locales.map(l => `<xhtml:link rel="alternate" hreflang="${l.lang}" href="${site}${l.path}"/>`).join('') + `<xhtml:link rel="alternate" hreflang="x-default" href="${site}/"/>` : ''}</url>`).join('\n')}
</urlset>`);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
console.log(`Built 3 locales and 2 legal pages for ${site}; lastmod ${lastmod}.`);
