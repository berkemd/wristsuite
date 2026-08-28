#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
 BASIN IKONU KAPISI

 28 Agustos 2026'da olculdu: sitenin ana sayfasindaki 12 basin
 gorselinin 8'i, App Store'da YAYINDA OLAN ikondan tamamen farkli bir
 tasarim tasiyordu. Depodaki ikon dogruydu, gonderilen yapi dogruydu,
 magaza sayfasi dogruydu — YANLIS OLAN TEK YER halka acik siteydi ve
 kimse fark etmemisti, cunku hicbir kapi oraya bakmiyordu.

     "Depodaki dogru, yayindakini duzeltmez."

 Bu kapi her basin gorselini, o uygulamanin MAGAZADA CANLI OLAN
 ikonuyla karsilastiriyor. Kaynak depo degil, magazanin kendisi:
 kullanicinin gordugu ikon orada.

 ESIK: 10/255. Ayni ikonun iki yeniden kodlamasi ~1-2 fark veriyor;
 farkli tasarimlar 28-72 arasinda olculdu. Esik ikisinin arasinda ve
 ikisinden de uzak.
=====================================================================
"""
import io, json, pathlib, sys, urllib.request
from PIL import Image
import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from _asc import api

ESIK = 10.0
UYGULAMALAR = {
    "daylume": 6796813768, "forgn": 6761314575, "lumezone": 6796814594,
    "nestria": 6799198327, "plasticos": 6799756600, "poywx": 6777477818,
    "rodewatch": 6796814335, "skry": 6790419436, "stemmata": 6805161453,
    "trailhome": 6796813984, "vagotakt": 6796814920, "voxwhisper": 6796815308,
}

def canli(app_id, px=256):
    s, b = api("/v1/apps/%d/appStoreVersions?limit=8&include=build" % app_id)
    tercih = None
    for v in b.get("data", []):
        st = v["attributes"]["appStoreState"]
        bid = (v["relationships"].get("build", {}).get("data") or {}).get("id")
        if bid and st == "READY_FOR_SALE":
            tercih = bid; break
        if bid and tercih is None:
            tercih = bid
    if not tercih: return None
    s2, b2 = api("/v1/builds/%s" % tercih)
    t = b2["data"]["attributes"].get("iconAssetToken")
    if not t: return None
    u = t["templateUrl"].replace("{w}", str(px)).replace("{h}", str(px)).replace("{f}", "png")
    return Image.open(io.BytesIO(urllib.request.urlopen(u, timeout=60).read())).convert("RGB")

def fark(a, b, n=128):
    return float(np.abs(np.asarray(a.resize((n, n), Image.LANCZOS), float) -
                        np.asarray(b.resize((n, n), Image.LANCZOS), float)).mean())

def main(kok):
    kok = pathlib.Path(kok)
    if not kok.is_dir():
        print("  !! basin klasoru yok: %s" % kok); return 4
    kirmizi, olculen = [], 0
    for ad, aid in sorted(UYGULAMALAR.items()):
        p = kok / ("%s.png" % ad)
        if not p.exists():
            print("  !! %s.png YOK — sitede kullanilan bir gorsel eksik" % ad)
            kirmizi.append((ad, None)); continue
        c = canli(aid)
        if c is None:
            print("  !! %-11s magazadaki ikon okunamadi — OLCULEMEDI" % ad)
            kirmizi.append((ad, None)); continue
        d = fark(c, Image.open(p).convert("RGB"))
        olculen += 1
        if d >= ESIK:
            kirmizi.append((ad, d))
            print("  KIRMIZI %-11s fark %7.3f" % (ad, d))
        else:
            print("  temiz   %-11s fark %7.3f" % (ad, d))
    # BOS KUME YESIL DEGILDIR: hicbir sey olculmediyse kapi dusmeli.
    if olculen == 0:
        print("  !! hicbir gorsel olculemedi — kapi olcmuyor"); return 4
    print()
    if kirmizi:
        print("  %d gorsel magazadaki ikonla ayni DEGIL." % len(kirmizi))
        return 1
    print("  %d basin gorseli magazadaki canli ikonla ayni." % olculen)
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "press"))
