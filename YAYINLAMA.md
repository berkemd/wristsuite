# Site Yayınlama (5 dakika, 0 $)

Bu klasör tek bir GitHub Pages deposudur: yayınlanacak **6 uygulamanın**
destek+gizlilik sayfaları, beklemedeki GesturAir'in (silinmeyen) sayfaları,
GesturAir alıcısı ve basın görselleri.

```bash
cd site
git init && git add -A && git commit -m "Wrist Suite sites"
# GitHub'da 'wristsuite' adında boş bir public repo aç, sonra:
git remote add origin https://github.com/berkemd/wristsuite.git
git branch -M main && git push -u origin main
# GitHub → repo → Settings → Pages → Branch: main / (root) → Save
```

Yayın adresin: `https://berkemd.github.io/wristsuite/`

App Store Connect alanlarına yapıştırılacak URL'ler (yayınlanacak 6 uygulama
başına — `daylume`, `rodewatch`, `lumezone`, `trailhome`, `vagotakt`,
`voxwhisper`):
- Support URL: `https://berkemd.github.io/wristsuite/<uygulama>/`
- Privacy Policy URL: `https://berkemd.github.io/wristsuite/<uygulama>/privacy.html`

GesturAir **beklemede** (bkz. `gesturair/BEKLEMEDE.md`): ürün gönderilmiyor,
bu yüzden App Store Connect'e girilecek bir URL'i yok. Sayfaları yine de
yayınlanır — `site/gesturair/` durum bildirimiyle, `site/receiver/` ise
klavye/tıklama ile sürülen çalışan bir PDF sunucusu olarak duruyor. Alıcı
adresi (`https://berkemd.github.io/wristsuite/receiver/`) artık hiçbir mağaza
açıklamasında veya inceleme notunda geçmez.
