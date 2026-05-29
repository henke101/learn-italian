# Ponte — deployment

Statisk PWA, bygger på React (förbundlad i `bundle.js`). Inga build-steg behövs för att deploya — alla filer är klara.

## Filer i den här mappen

| Fil | Vad |
|---|---|
| `index.html` | Entrypoint |
| `bundle.js` | Hela appen (React + UI + 515 fraspar), ~208 KB minifierad |
| `sw.js` | Service worker — cachar allt vid första besöket för 100% offline |
| `manifest.json` | PWA-manifest för "Add to Home Screen" |
| `icon-192.png`, `icon-512.png` | App-ikoner |
| `apple-touch-icon.png` | iOS-ikon för hemskärm |

## Deploya på GitHub Pages

Från terminalen, ersätt `<USERNAME>` med ditt GitHub-användarnamn:

```bash
# 1. Skapa repot på github.com först (publikt, t.ex. "ponte-italiano")
#    Inget README, ingen .gitignore — tomt.

# 2. I den här mappen:
git init
git add .
git commit -m "Initial Ponte deploy"
git branch -M main
git remote add origin https://github.com/<USERNAME>/ponte-italiano.git
git push -u origin main

# 3. På github.com → ditt repo → Settings → Pages:
#    - Source: "Deploy from a branch"
#    - Branch: main / (root)
#    - Save

# 4. Vänta ~1 minut. URL:en blir:
#    https://<USERNAME>.github.io/ponte-italiano/
```

## Använd på iPhone

1. Öppna URL:en i **Safari** (måste vara Safari på iOS för PWA-funktioner)
2. Tryck Share-ikonen (rutan med uppåtpilen)
3. Scrolla → "Add to Home Screen" / "Lägg till på hemskärmen"
4. Klart — ikonen ligger på hemskärmen, öppnar fullskärm utan webbläsare-chrome
5. Efter första öppningen är allt cachat. Funkar offline.

## Offline-test

Efter installation: aktivera flygplansläge → öppna ikonen → den ska fungera normalt. Service workern serverar allt från cache.

Notera: webbläsarens TTS-uttal (klick-för-att-höra) kräver internet på vissa iOS-versioner. Resten av appen är 100% offline.

## Uppdatera senare

Ändra filerna, `git add . && git commit -m "..." && git push`. GitHub Pages bygger om automatiskt på ~1 minut. När du öppnar appen nästa gång tar service workern in den nya versionen vid omladdning (kan kräva en hård reload).
