/*
 * Callback URLs of the OAuth sign-ins: the lib_OAuth pages getToken.html (Microsoft, OpenID), getTokenGoogle.html and
 * getTokenLinkedIn.html, where the provider sends the user back and which give its answer to the application.
 *
 * Each callback is <base>/projects/lib_OAuth/<page>, where the base is a Convertigo base URL:
 * - by default https://c8ocloud.convertigo.net/convertigo, the callback registered on the OAuth applications of
 *   Convertigo (as before the symbol existed);
 * - the symbol lib_oauth.callback.base_url when it is set: a server that uses OAuth applications of its own sets it to
 *   its own base (as https://forms.example.com/convertigo) and registers these URLs as redirect URIs at Microsoft,
 *   Google and LinkedIn. The lib_OAuth pages of a server give the answer to the applications of their own origin.
 *
 * The redirect URI is the only thing that changes: the OAuth action (state), the callback pages and the login sequences
 * of lib_OAuth are the same for every base.
 *
 * Loaded by the sequence GetOAuthCallbacks (include) and by tests/oauth-callback-url.test.cjs under Node: the functions
 * oauthCallbackBase and oauthCallbackUrls use no engine object.
 */

// The base of the callbacks when the symbol is not set.
var OAUTH_CALLBACK_DEFAULT_BASE = "https://c8ocloud.convertigo.net/convertigo";

// The callback page of each provider, in the answer of GetOAuthCallbacks.
var OAUTH_CALLBACK_PAGES = {
	microsoft: "getToken.html",
	openid: "getToken.html",
	google: "getTokenGoogle.html",
	linkedin: "getTokenLinkedIn.html"
};

// An http(s) base URL: scheme, host (name or [IPv6]), optional port and path. No credentials, query, fragment, space or
// percent sign: the OAuth action adds the redirect URI to the authorize URL without encoding it.
var OAUTH_CALLBACK_BASE = /^https?:\/\/(?:[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*|\[[0-9A-Fa-f:.]+\])(?::\d{1,5})?(?:\/[A-Za-z0-9._~+\/-]*)?$/;

// The base of a value without trailing slashes: "" when the value is empty (or an environment variable the engine could
// not resolve, left as %NAME%), null when it is not an http(s) base URL. A value that already names the folder of the
// pages (.../projects/lib_OAuth) or one of its pages is cut to the base.
function oauthCallbackBase(value) {
	var text = value == null ? "" : String(value).replace(/^\s+|\s+$/g, "");
	if (text === "" || /%[^%\s]*%/.test(text)) {
		return "";
	}
	text = text.replace(/\/+$/, "").replace(/\/projects\/lib_OAuth(?:\/[^\/]*)?$/, "").replace(/\/+$/, "");
	return OAUTH_CALLBACK_BASE.test(text) ? text : null;
}

// The callbacks of the providers for the value of the symbol lib_oauth.callback.base_url:
// {base, source, invalidSymbol, microsoft, openid, google, linkedin}. source is "symbol" when the symbol gives the base,
// else "default" (c8ocloud). A symbol that is set but invalid is ignored (invalidSymbol true): the default is kept.
function oauthCallbackUrls(symbolValue) {
	var symbol = oauthCallbackBase(symbolValue);
	var result = {
		base: symbol || OAUTH_CALLBACK_DEFAULT_BASE,
		source: symbol ? "symbol" : "default",
		invalidSymbol: symbol === null
	};
	for (var provider in OAUTH_CALLBACK_PAGES) {
		if (Object.prototype.hasOwnProperty.call(OAUTH_CALLBACK_PAGES, provider)) {
			result[provider] = result.base + "/projects/lib_OAuth/" + OAUTH_CALLBACK_PAGES[provider];
		}
	}
	return result;
}

// In the engine (sequence GetOAuthCallbacks): the callbacks for the symbol of this server. The symbol is compiled as a
// reference, so a %NAME% value takes the value of the environment variable NAME.
function oauthCallbacksOfServer() {
	var symbols = com.twinsoft.convertigo.engine.Engine.theApp.databaseObjectsManager;
	return oauthCallbackUrls(symbols.getCompiledValue("${lib_oauth.callback.base_url=}"));
}

if (typeof module === "object" && module && module.exports) {
	module.exports = {
		OAUTH_CALLBACK_DEFAULT_BASE: OAUTH_CALLBACK_DEFAULT_BASE,
		OAUTH_CALLBACK_PAGES: OAUTH_CALLBACK_PAGES,
		oauthCallbackBase: oauthCallbackBase,
		oauthCallbackUrls: oauthCallbackUrls
	};
}
