// node --test tests/*.test.cjs
// The callback URLs of the OAuth sign-ins (js/oauth_callback_url.js, sequence GetOAuthCallbacks, LoginComponent).
//
// Up to 8.4.0.13 the Microsoft, Google, LinkedIn and OpenID buttons of LoginComponent sent every user back to the
// lib_OAuth pages of c8ocloud, written in each action: a customer on its own server, with OAuth applications of its own,
// could not use its own redirect URIs. The callbacks are still the c8ocloud pages by default, and the pages of the server
// named by the symbol lib_oauth.callback.base_url when it is set.
//
// The Rhino test needs java and the Rhino jars (RHINO_JARS classpath, else the Gradle caches); it is skipped without them.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const helperPath = path.join(root, 'js/oauth_callback_url.js');
const { OAUTH_CALLBACK_DEFAULT_BASE, OAUTH_CALLBACK_PAGES, oauthCallbackBase, oauthCallbackUrls } = require(helperPath);

const own = 'https://forms.example.com/convertigo';
const cloud = 'https://c8ocloud.convertigo.net/convertigo';
const pages = (base) => ({
  microsoft: `${base}/projects/lib_OAuth/getToken.html`,
  openid: `${base}/projects/lib_OAuth/getToken.html`,
  google: `${base}/projects/lib_OAuth/getTokenGoogle.html`,
  linkedin: `${base}/projects/lib_OAuth/getTokenLinkedIn.html`,
});
const byDefault = { base: cloud, source: 'default', invalidSymbol: false, ...pages(cloud) };

test('without the symbol, the callbacks are the lib_OAuth pages of c8ocloud, as up to 8.4.0.13, for each provider', () => {
  assert.equal(OAUTH_CALLBACK_DEFAULT_BASE, cloud);
  for (const symbol of [undefined, null, '', '   ', '\n']) {
    assert.deepEqual(oauthCallbackUrls(symbol), byDefault, JSON.stringify(symbol));
  }
  assert.deepEqual(Object.keys(OAUTH_CALLBACK_PAGES).sort(), ['google', 'linkedin', 'microsoft', 'openid']);
  // the URLs written in the OAuth actions up to 8.4.0.13
  assert.equal(byDefault.microsoft, 'https://c8ocloud.convertigo.net/convertigo/projects/lib_OAuth/getToken.html');
  assert.equal(byDefault.google, 'https://c8ocloud.convertigo.net/convertigo/projects/lib_OAuth/getTokenGoogle.html');
  assert.equal(byDefault.linkedin, 'https://c8ocloud.convertigo.net/convertigo/projects/lib_OAuth/getTokenLinkedIn.html');
});

test('the symbol lib_oauth.callback.base_url gives the base: a server with OAuth applications of its own', () => {
  assert.deepEqual(oauthCallbackUrls(own), { base: own, source: 'symbol', invalidSymbol: false, ...pages(own) });
  assert.equal(oauthCallbackUrls(` ${own}\n`).microsoft, `${own}/projects/lib_OAuth/getToken.html`);
  // a port, a path behind a reverse proxy, a server mapped at the root, an IPv6 address, a development Studio
  for (const base of ['https://forms.example.com:8443/convertigo', 'https://www.example.com/apps/c8o/convertigo',
    'https://forms.example.com', 'http://[::1]:18080/convertigo', 'http://localhost:18080/convertigo', 'http://c8o_server:28080/convertigo']) {
    assert.deepEqual(oauthCallbackUrls(base), { base, source: 'symbol', invalidSymbol: false, ...pages(base) });
  }
  // the c8ocloud base itself, written out
  assert.deepEqual(oauthCallbackUrls(cloud), { ...byDefault, source: 'symbol' });
});

test('trailing slashes, and a value naming the folder of the pages or a page, give the same base', () => {
  for (const value of [`${own}/`, `${own}///`, `${own}/projects/lib_OAuth`, `${own}/projects/lib_OAuth/`,
    `${own}/projects/lib_OAuth/getToken.html`, `${own}/projects/lib_OAuth/getTokenGoogle.html`]) {
    assert.equal(oauthCallbackBase(value), own, value);
    assert.deepEqual(oauthCallbackUrls(value), { base: own, source: 'symbol', invalidSymbol: false, ...pages(own) }, value);
  }
  assert.equal(oauthCallbackBase('https://forms.example.com/'), 'https://forms.example.com');
});

test('a symbol that is not an http(s) base URL is ignored and reported: the c8ocloud pages are kept', () => {
  for (const value of ['forms.example.com/convertigo', 'ftp://forms.example.com/convertigo', 'javascript:alert(1)',
    '//forms.example.com/convertigo', 'https://user:pass@forms.example.com/convertigo',
    'https://forms.example.com/convertigo?x=1', 'https://forms.example.com/convertigo#x',
    'https://forms.example.com/con vertigo', 'https://forms.example.com/convertigo&state=1',
    'https://forms.example.com/a%2Fb', 'https://forms.example.com\\convertigo', 'https://', '"https://x/convertigo"']) {
    assert.equal(oauthCallbackBase(value), null, value);
    assert.deepEqual(oauthCallbackUrls(value), { ...byDefault, invalidSymbol: true }, value);
  }
});

test('an environment variable the engine could not resolve (%NAME%) counts as no symbol', () => {
  assert.equal(oauthCallbackBase('%OAUTH_CALLBACK_BASE%'), '');
  assert.deepEqual(oauthCallbackUrls('%OAUTH_CALLBACK_BASE%'), byDefault);
});

// The sequence and the component.

test('GetOAuthCallbacks answers the callbacks of js/oauth_callback_url.js for the symbol of the server', () => {
  const sequence = read('_c8oProject/sequences/GetOAuthCallbacks.yaml');
  assert.match(read('c8oProject.yaml'), /\n  ↓GetOAuthCallbacks \[sequences\.GenericSequence\]: 🗏 sequences\/GetOAuthCallbacks\.yaml\n/);
  assert.match(sequence, /\n  expression: \|\n    include\("js\/oauth_callback_url\.js"\);\n    var callbacks = oauthCallbacksOfServer\(\);\n/);
  assert.match(sequence, /log\.warn\("\[lib_UserManager_ui_ngx\] the symbol lib_oauth\.callback\.base_url is not an http\(s\) base URL/);
  for (const name of ['base', 'source', 'microsoft', 'openid', 'google', 'linkedin']) {
    assert.match(sequence, new RegExp(`\\n↓${name} \\[steps\\.ElementStep-\\d+\\]: \\n  comment: [^\\n]+\\n  expression: callbacks\\.${name}\\n  nodeName: ${name}\\n`), name);
  }
  // no input: the symbol is read by the helper, never from a variable a request could set
  assert.doesNotMatch(sequence, /\[variables\./);
  assert.match(fs.readFileSync(helperPath, 'utf8'), /getCompiledValue\("\$\{lib_oauth\.callback\.base_url=\}"\)/);
  assert.doesNotMatch(sequence, /\$\{/);
});

const component = read('_c8oProject/mobileSharedComponents/LoginComponent.yaml');

// The beanData of the OAuthLoginAction actions of LoginComponent, by name.
function oauthActions() {
  const actions = {};
  for (const m of component.matchAll(/↓(\w+) \[ngx\.components\.UIDynamicAction-\d+\]: \n +beanData: \|\n +'\{\n((?: +"[^\n]*\n)+) +\}'/g)) {
    if (!m[2].includes('"ionBean": "OAuthLoginAction"')) continue;
    const props = {};
    for (const line of m[2].split('\n')) {
      const prop = /^ +"(\w+)": "(.*)",?$/.exec(line);
      if (prop) props[prop[1]] = prop[2].replace(/''/g, "'").replace(/\\"/g, '"').replace(/\\\//g, '/');
    }
    actions[m[1]] = props;
  }
  return actions;
}

test('the four OAuth buttons of LoginComponent listen to GetOAuthCallbacks, each with the page of its provider', () => {
  const actions = oauthActions();
  assert.deepEqual(Object.keys(actions).sort(), ['OAuthLoginAzureAD', 'OAuthLoginGoogle', 'OAuthLoginLinkedIN', 'OAuthLoginOpenID']);
  const listen = (key) => `source:{"filter":"Sequence","project":"lib_UserManager_ui_ngx","input":"listen(['lib_UserManager_ui_ngx.GetOAuthCallbacks'])?.${key}"}`;
  assert.equal(actions.OAuthLoginGoogle.callbackurl, listen('google'));
  assert.equal(actions.OAuthLoginGoogle.loginRequestable, 'plain:lib_OAuth.loginGoogleWithCode');
  assert.equal(actions.OAuthLoginLinkedIN.callbackurl, listen('linkedin'));
  assert.equal(actions.OAuthLoginLinkedIN.provider, 'plain:linkedin');
  assert.equal(actions.OAuthLoginAzureAD.callbackurl, listen('microsoft'));
  // the OpenID button keeps its openidCallbackUrl variable, empty by default
  assert.equal(actions.OAuthLoginOpenID.callbackurl, "script:this.openidCallbackUrl ? this.openidCallbackUrl : this.listen(['lib_UserManager_ui_ngx.GetOAuthCallbacks'])?.openid");
  assert.match(component, /↓openidCallbackUrl \[ngx\.components\.UICompVariable-1783000000128\]: \n(?:  [^\n]*\n)*  value: ''''''$/);
  assert.match(read('_c8oProject/mobilePages/Signin.yaml'), /↓openidCallbackUrl \[ngx\.components\.UIUseVariable-1771593576077\]: \n(?: {6}[^\n]*\n)+? {10}- MobileSmartSourceType: script:''\n/);
});

test('LoginComponent reads the callbacks when it starts', () => {
  const at = component.indexOf('↓PageEvent [ngx.components.UIPageEvent-');
  assert.notEqual(at, -1);
  const pageEvent = component.substring(at, component.indexOf('\n↓', at + 1));
  // beside lib_OAuth.GetOAuthCredentials, whose answer gives the client ids the buttons listen to
  assert.match(pageEvent, /\n  ↓CallSequence \[ngx\.components\.UIDynamicAction-\d+\]: \n    beanData: '\{"ionBean":"CallSequenceAction","requestable":"plain:lib_OAuth\.GetOAuthCredentials"\}'/);
  assert.match(pageEvent, /\n  ↓CallOAuthCallbacks \[ngx\.components\.UIDynamicAction-\d+\]: \n    beanData: '\{"ionBean":"CallSequenceAction","requestable":"plain:lib_UserManager_ui_ngx\.GetOAuthCallbacks"\}'\n    comment: \|\n      [^\n]+(?:\n|$)/);
  assert.doesNotMatch(pageEvent, /UIControlVariable/);
});

test('no page or component of the library writes a callback URL: they all come from GetOAuthCallbacks', () => {
  const files = [];
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.yaml')) files.push(full);
  });
  walk(path.join(root, '_c8oProject'));
  for (const file of files) {
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /c8ocloud[^\n]*getToken/, path.relative(root, file));
  }
});

// The helper in the Rhino engine of the sequence, the symbol of the server stubbed.

function rhinoClasspath() {
  if (process.env.RHINO_JARS) return process.env.RHINO_JARS;
  const base = path.join(os.homedir(), '.gradle/caches/modules-2/files-2.1/org.mozilla');
  const jar = (name) => {
    const dir = path.join(base, name);
    if (!fs.existsSync(dir)) return null;
    const versions = fs.readdirSync(dir).filter((v) => /^1\.(7|8|9)\./.test(v)).sort().reverse();
    for (const version of versions) {
      for (const hash of fs.readdirSync(path.join(dir, version))) {
        const file = path.join(dir, version, hash, `${name}-${version}.jar`);
        if (fs.existsSync(file)) return file;
      }
    }
    return null;
  };
  const rhino = jar('rhino');
  return rhino ? [rhino, jar('rhino-tools')].filter(Boolean).join(path.delimiter) : null;
}

const classpath = rhinoClasspath();
const javaAvailable = spawnSync('java', ['-version']).status === 0;

test('in Rhino, the sequence reads the compiled symbol of the server', { skip: !(javaAvailable && classpath) && 'java or Rhino not available' }, () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oauth-callback-'));
  try {
    const script = path.join(dir, 'run.js');
    fs.writeFileSync(script, `
      var asked = [];
      var symbol = arguments[0];
      // the engine package com is a read-only global of the shell: the helper runs where com is the stub
      var stub = { twinsoft: { convertigo: { engine: { Engine: { theApp: { databaseObjectsManager: {
        getCompiledValue: function (value) { asked.push(String(value)); return new java.lang.String(symbol); }
      } } } } } } };
      var source = String(readFile(${JSON.stringify(helperPath)}));
      var callbacks = (function (com) {
        eval(source);
        return oauthCallbacksOfServer();
      })(stub);
      print(JSON.stringify({ asked: asked, callbacks: callbacks }));
    `);
    const run = (symbol) => {
      const res = spawnSync('java', ['-cp', classpath, 'org.mozilla.javascript.tools.shell.Main', '-version', '200', script, symbol], { encoding: 'utf8' });
      assert.equal(res.status, 0, res.stderr);
      return JSON.parse(res.stdout.trim().split('\n').pop());
    };
    let out = run('');
    assert.deepEqual(out.asked, ['${lib_oauth.callback.base_url=}']);
    assert.deepEqual(out.callbacks, byDefault);
    out = run(`${own}/`);
    assert.deepEqual(out.callbacks, { base: own, source: 'symbol', invalidSymbol: false, ...pages(own) });
    out = run('forms.example.com');
    assert.deepEqual(out.callbacks, { ...byDefault, invalidSymbol: true });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
