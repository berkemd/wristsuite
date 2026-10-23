"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const script = fs.readFileSync(
  path.join(__dirname, "../plasticos/tprecd48.js"),
  "utf8",
);
function appStoreURL(pageURL) {
  const link = { href: "fallback" };
  vm.runInNewContext(script, {
    URL,
    window: {
      location: { href: pageURL },
      document: { querySelectorAll: () => [link] },
    },
  });
  return link.href;
}
const base = "https://berkemd.github.io/wristsuite/plasticos/tprecd48.html";

test("Facebook and Instagram clicks keep distinct fixed Apple campaign tokens", () => {
  for (const source of ["fb", "ig"]) {
    const destination = new URL(appStoreURL(`${base}?utm_source=${source}`));
    assert.equal(destination.origin, "https://apps.apple.com");
    assert.equal(destination.pathname, "/app/apple-store/id6799756600");
    assert.equal(
      destination.searchParams.get("ct"),
      `plasticos_tprecd48_${source}_20261022`,
    );
    assert.equal(destination.searchParams.get("pt"), "127358997");
    assert.equal(destination.searchParams.get("mt"), "8");
    assert.equal([...destination.searchParams].length, 3);
  }
});

test("untrusted query input cannot redirect or leak personal/ad data", () => {
  for (const input of [
    `${base}?utm_source=https://evil.example&email=person@example.com&ad_id=secret`,
    `${base}?utm_source=fb%26email%3Dprivate`,
    `${base}?utm_source=an&fbclid=private`,
    `${base}?next=javascript:alert(1)`,
    "not a URL",
  ]) {
    const destination = new URL(appStoreURL(input));
    assert.equal(destination.origin, "https://apps.apple.com");
    assert.equal(
      destination.searchParams.get("ct"),
      "plasticos_tprecd48_20261022",
    );
    assert.equal([...destination.searchParams].length, 3);
  }
});

test("both actual page CTAs are updated without storage, network, or purchase", () => {
  const anchors = [{ href: "fallback" }, { href: "fallback" }];
  const browser = {
    location: { href: `${base}?utm_source=ig` },
    document: {
      querySelectorAll(selector) {
        assert.equal(selector, "a[data-app-store]");
        return anchors;
      },
    },
  };
  const code = fs.readFileSync(
    path.join(__dirname, "../plasticos/tprecd48.js"),
    "utf8",
  );
  vm.runInNewContext(code, { window: browser, URL });
  assert.equal(anchors[0].href, appStoreURL(browser.location.href));
  assert.equal(anchors[1].href, anchors[0].href);
});

test("page preserves free/paid and education boundaries with working fallback links", () => {
  const html = fs.readFileSync(
    path.join(__dirname, "../plasticos/tprecd48.html"),
    "utf8",
  );
  assert.match(html, /lang="tr"/);
  assert.equal((html.match(/data-app-store/g) || []).length, 2);
  const text = html.replace(/\s+/g, " ");
  assert.match(text, /Tam içerik uygulama içi satın alma gerektirir/);
  assert.match(text, /Hasta bakımında karar vermek için kullanılmaz/);
  assert.match(text, /tek seferlik satın alma/);
  assert.match(html, /tprecd48\.js/);
  assert.doesNotMatch(
    html,
    /plasticos_study_20261001|fbq\(|gtag\(|googletagmanager|<iframe/,
  );
  for (const file of ["privacy.html", "terms.html", "support.html"]) {
    assert.ok(fs.existsSync(path.join(__dirname, "../plasticos", file)));
  }
});

// Apple requires campaign tokens of at most 30 characters, including fallbacks.
test("Apple campaign length contract includes unlabelled and malformed links", () => {
  for (const input of [
    base,
    `${base}?utm_source=fb`,
    `${base}?utm_source=ig`,
    `${base}?utm_source=unknown`,
    "not a URL",
  ]) {
    const destination = new URL(appStoreURL(input));
    const token = destination.searchParams.get("ct");
    assert.ok(
      token && token.length <= 30,
      `Invalid Apple campaign length: ${token}`,
    );
  }
});
