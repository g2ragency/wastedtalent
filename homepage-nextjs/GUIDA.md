# Guida Rapida - Homepage Wasted Talent United

## ✅ Cosa è stato creato:

1. **Header** - Menù fisso in alto con:

   - Menu sinistra: SHOP, LOOKBOOK, ABOUT
   - Logo centrale: WTU (box nero)
   - Menu destra: € EUR (IT), LOGIN, CART

2. **Hero Section** - Schermata fullscreen con:

   - Titolo grande centrato
   - Bottone "SHOP NOW" con freccia
   - Slider dots in basso

3. **Design minimalista** - Sfondo bianco/beige pulito come nel mockup

## 🎨 Come personalizzare i contenuti:

### Da WordPress Admin:

1. Vai su `http://wasted-talent.local/wp-admin`
2. Menu → **Homepage Manager**
3. Compila:

   - **Titolo**: `Wasted Talent United`
   - **Sottotitolo**: `FW 2026`
   - **Testo CTA**: `SHOP NOW`
   - **Link CTA**: `/shop` o URL della tua pagina shop
   - **Immagine di sfondo**: Carica un'immagine (opzionale per sfondo grigio chiaro)

4. Salva

## 🚀 Come avviare Next.js:

### Opzione 1 - Dal Finder:

1. Apri Finder
2. Vai a `/Users/veronika.nikitina/Local Sites/wasted-talent/homepage-nextjs`
3. Tasto destro → Servizi → Nuovo Terminale nella cartella
4. Digita: `npm run dev`

### Opzione 2 - Dal Terminale:

```bash
cd "/Users/veronika.nikitina/Local Sites/wasted-talent/homepage-nextjs"
npm run dev
```

5. Apri browser: `http://localhost:3000`

## 📝 Dati di default (se WordPress non risponde):

Se non riesci a configurare WordPress, modifica temporaneamente:
`homepage-nextjs/src/lib/api.ts`

Cerca la sezione "Ritorna dati di fallback" e modifica:

```typescript
return {
  hero: {
    title: "Wasted Talent United",
    subtitle: "FW 2026",
    cta_text: "SHOP NOW",
    cta_link: "/shop",
    background_image: "",
  },
  // ...
};
```

## 🎯 Prossimi step:

- [ ] Attiva plugin "Homepage Manager" in WordPress
- [ ] Configura contenuti Hero Section
- [ ] Avvia Next.js con `npm run dev`
- [ ] Testa su http://localhost:3000
- [ ] Eventualmente: Deploy su Vercel per produzione

## ⚙️ Personalizzazioni avanzate:

### Cambiare il logo:

Modifica `src/components/Header.tsx` linea 38-44

### Aggiungere voci menu:

Modifica `src/components/Header.tsx` nelle sezioni Left Menu (linea 17-37) e Right Menu (linea 50-75)

### Modificare colori:

Modifica `src/app/globals.css` nelle variabili CSS (linea 4-11)
