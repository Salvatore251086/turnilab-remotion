# TurniLab — Remotion Video Generator

Genera automaticamente video MP4 verticali (1080x1920) per TikTok/Reels
mostrando l'app TurniLab in azione. Ogni push su `main` avvia il rendering su GitHub Actions.

## Struttura del video (15 secondi / 450 frame a 30fps)

| Scena | Durata | Contenuto |
|-------|--------|-----------|
| 1 | 0–3s | Dashboard con turni vuoti e alert rossi |
| 2 | 3–6s | Click animato su "Applica Template" |
| 3 | 6–12s | Turni che si compilano giorno per giorno |
| 4 | 12–15s | CTA finale con URL |

## Setup (una volta sola)

### 1. Clona il repository
```bash
git clone https://github.com/TUO_USERNAME/turnilab-remotion.git
cd turnilab-remotion
npm install
```

### 2. Testa in locale (opzionale)
```bash
npm start
# Apri http://localhost:3000 — vedi l'anteprima nel browser
```

### 3. Configura Google Drive (opzionale)
Nel tuo repository GitHub → Settings → Secrets → Actions, aggiungi:

- `GDRIVE_CREDENTIALS` — JSON delle credenziali service account Google
- `GDRIVE_FOLDER_ID` — ID della cartella Google Drive dove salvare il video

Se non configuri questi secret, il video viene salvato come artifact scaricabile
direttamente da GitHub Actions (disponibile per 7 giorni).

### 4. Avvia il rendering
Ogni push su `main` avvia automaticamente il rendering.
Oppure vai su GitHub → Actions → "Render TurniLab Video" → "Run workflow".

### 5. Scarica il video
GitHub → Actions → seleziona l'ultimo run → Artifacts → `turnilab-video`

## Come modificare il video

Per cambiare testi, colori o sequenza apri:
`src/compositions/TurniLabVideo.jsx`

Le scene sono modulari — puoi aggiungere nuove scene (Scena B, C) duplicando
il pattern esistente e registrando nuove `<Composition>` in `src/index.jsx`.

## Costo infrastruttura

- GitHub Actions free tier: 2.000 minuti/mese — ogni render ~3 minuti = ~660 video/mese gratis
- Google Drive: gratis fino a 15GB
- Totale: €0/mese
