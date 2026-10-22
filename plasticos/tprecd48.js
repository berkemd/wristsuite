(function (root) {
  "use strict";

  // Only fixed campaign tokens can reach Apple. Never forward arbitrary URLs,
  // ad identifiers, personal information, or query strings to the destination.
  function appStoreURL(pageURL) {
    let source = "meta";
    try {
      const candidate = new URL(pageURL).searchParams.get("utm_source");
      if (candidate === "fb" || candidate === "ig") source = candidate;
    } catch (_) {
      // Invalid or missing page URL uses the same safe campaign destination.
    }
    const destination = new URL(
      "https://apps.apple.com/app/apple-store/id6799756600",
    );
    destination.searchParams.set("pt", "127358997");
    destination.searchParams.set("ct", `plasticos_tprecd48_${source}_20261022`);
    destination.searchParams.set("mt", "8");
    return destination.href;
  }

  if (root.document && root.location) {
    const destination = appStoreURL(root.location.href);
    root.document.querySelectorAll("a[data-app-store]").forEach((link) => {
      link.href = destination;
    });
  }
})(typeof window === "object" ? window : globalThis);
