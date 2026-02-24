# Homepage Manager Plugin

Plugin WordPress per gestire i contenuti dell'homepage Next.js tramite pannello admin.

## Caratteristiche

- **Pannello Admin Intuitivo**: Gestisci tutti i contenuti dell'homepage da WordPress
- **REST API**: Endpoints per Next.js per recuperare i dati
- **Sezioni Gestibili**:
  - Hero Section (titolo, sottotitolo, CTA, immagine di sfondo)
  - Prodotti in Evidenza (integrazione WooCommerce)
  - Chi Siamo (testo e immagine)
  - Testimonial (in sviluppo)

## Installazione

1. Carica la cartella `homepage-manager` in `/wp-content/plugins/`
2. Attiva il plugin dal menu "Plugin" di WordPress
3. Accedi a "Homepage Manager" nel menu admin

## API Endpoints

### Tutte le impostazioni
```
GET /wp-json/homepage-manager/v1/settings
```

### Hero Section
```
GET /wp-json/homepage-manager/v1/hero
```

### Prodotti in Evidenza
```
GET /wp-json/homepage-manager/v1/featured-products
```

### About Section
```
GET /wp-json/homepage-manager/v1/about
```

## Integrazione con Next.js

Esempio di fetch dei dati:

```javascript
const response = await fetch('https://tuosito.com/wp-json/homepage-manager/v1/settings');
const data = await response.json();
```

## Requisiti

- WordPress 5.0+
- PHP 7.4+
- WooCommerce (opzionale, per prodotti in evidenza)

## Supporto

Per assistenza: [tuo-email@esempio.com]
