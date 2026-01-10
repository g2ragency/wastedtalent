# Homepage Next.js per WordPress

Homepage dinamica Next.js integrata con WordPress tramite REST API.

## Caratteristiche

- ✅ **Server-Side Rendering (SSR)** con Next.js 14
- ✅ **Incremental Static Regeneration (ISR)** - cache 60 secondi
- ✅ **TypeScript** per type safety
- ✅ **Tailwind CSS** per styling
- ✅ **Ottimizzazione immagini** con Next.js Image
- ✅ **Integrazione WordPress** tramite REST API

## Installazione

1. Installa le dipendenze:

```bash
npm install
```

2. Configura le variabili d'ambiente:
   Copia `.env.local` e modifica l'URL del tuo WordPress:

```
NEXT_PUBLIC_WP_API_URL=http://tuo-sito.local/wp-json/homepage-manager/v1
```

3. Avvia il server di sviluppo:

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## Comandi

- `npm run dev` - Avvia development server
- `npm run build` - Build per produzione
- `npm start` - Avvia server produzione
- `npm run lint` - Esegui linting

## Struttura

```
src/
├── app/
│   ├── layout.tsx       # Layout principale
│   ├── page.tsx         # Homepage
│   └── globals.css      # Stili globali
├── components/
│   ├── HeroSection.tsx
│   ├── FeaturedProducts.tsx
│   └── AboutSection.tsx
└── lib/
    └── api.ts           # API WordPress
```

## Deploy

### Vercel (raccomandato)

1. Push su GitHub
2. Importa progetto su Vercel
3. Configura variabile d'ambiente `NEXT_PUBLIC_WP_API_URL`
4. Deploy!

### Altro hosting

```bash
npm run build
npm start
```

## Fonts

Copia i font dalla cartella del tema WordPress:

```
wp-content/themes/themebase/inc/assets/fonts/
```

In:

```
homepage-nextjs/public/fonts/
```

## Note

- ISR revalidation impostata a 60 secondi
- Modifiche in WordPress visibili dopo max 60 secondi
- Per aggiornamento immediato: `npm run build`
