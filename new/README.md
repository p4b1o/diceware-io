# CyberGuru OSINT Team - Strona WWW

Strona internetowa z formularzem kontaktowym - SvelteKit + Node.js API z Mailgun.

## Tech Stack

- **Frontend:** SvelteKit (adapter-static)
- **API:** Node.js + Express
- **Email:** Mailgun API (EU infrastructure)
- **Server:** Nginx + PM2
- **SSL:** Let's Encrypt

## Wymagania

Create `.env` file in the root of project and fill it with data:
```

- Node.js 18+ (LTS)
- npm
- PM2 (dla deploymentu)

## Lokalne uruchomienie

### 1. Instalacja zależności

```bash
npm ci
```

### 2. Skopiuj `.env.example` do `api/.env`

```bash
cp api/.env.example api/.env
```

Otwórz `api/.env` i podmień wartości na swoje klucze Mailgun:

```env
MAILGUN_API_KEY=twój-klucz-api-mailgun-tutaj
MAILGUN_API_USERNAME=api
RECAPTCHA_SECRET_KEY=secret
PORT=3001
```

### 3. Uruchom projekt

```bash
# Frontend (tryb deweloperski)
npm run dev

# Budowanie produkcji
npm run build

# Pokaż podgląd zbudowanej wersji
npm run preview
```

## Struktura projektu

```
cyberguruosintteam/
├── src/                          # Frontend SvelteKit
│   ├── app.html                  # Szablon HTML
│   ├── routes/
│   │   ├── api/                  # Endpointy API (nie dołącz do production)
│   │   ├── Home/
│   │   │   └── ui/               # Komponenty:
│   │   │       ├── Contact.svelte   # Formularz kontaktowy
│   │   │       ├── Home.svelte      # Strona główna
│   │   │       └── ...
│   │   ├── +layout.svelte
│   │   └── +page.svelte
│   └── lib/
│       └── utils/
├── api/                          # Backend API
│   ├── index.js                  # Serwer Express
│   ├── package.json
│   └── .env                      # !!! NIE COMMITOWAĆ !!!
├── static/                       # Statyczne pliki (svg, png)
├── build/                        # Zbudowany frontend (gitignore)
├── package.json
├── svelte.config.js
└── vite.config.ts
```

## Deployment

### 1. Zbuduj aplikację

```bash
npm run build
```

Powstanie folder `build/` z gotowymi plikami.

### 2. Przygotuj API

Skopiuj folder `api/` na serwer razem z buildem.

### 3. Konfiguracja na serwerze

```bash
# 1. Skopiuj build i API
tar -czf cyberguruosintteam.tar.gz build/ api/ package*.json svelte.config.js

# 2. Skopiuj na serwer
scp cyberguruosintteam.tar.gz user@cyberguru-gw:/tmp/

# 3. Na serwerze
sudo mkdir -p /var/www/cyberguruosintteam
tar -xzf /tmp/cyberguruosintteam.tar.gz -C /var/www/cyberguruosintteam
cd /var/www/cyberguruosintteam

# 4. Zainstaluj zależności API
cd api && npm ci

# 5. Stwórz .env
sudo bash -c 'cat > api/.env << EOF
MAILGUN_API_KEY=your-key-here
MAILGUN_API_USERNAME=api
PORT=3001
EOF'

# 6. Uruchom z PM2
pm2 start api/index.js --name cyberguruosintteam-api
pm2 save
pm2 startup

# 7. Nginx config
# (patrz sekcja "Konfiguracja Nginx")
```

### 4. Instrukcje konfiguracji SSL

```bash
# Instalacja Certbot
sudo apt install -y certbot python3-certbot-nginx

# Pobranie certyfikatu
sudo certbot --nginx -d cyberguru.team -d www.cyberguru.team

# Auto-odnawianie certyfikatu
sudo certbot renew --dry-run
```

## Konfiguracja Nginx

```nginx
server {
    listen 80;
    server_name cyberguru.team www.cyberguru.team;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cyberguru.team www.cyberguru.team;

    root /var/www/cyberguruosintteam/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    ssl_certificate /etc/letsencrypt/live/cyberguru.team/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cyberguru.team/privkey.pem;
}
```

## Zmienne środowiskowe

| Zmienna | Opis | Przykład |
|---------|------|----------|
| `MAILGUN_API_KEY` | Klucz API Mailgun | `key-xxx` |
| `MAILGUN_API_USERNAME` | Username dla autoryzacji | `api` |
| `PORT` | Port dla API | `3001` |

## Email z formularza

- **Od:** CyberGuru OSINT Team <osint@m.pawelhordynski.com>
- **Reply-To:** email wypełniony w formularzu
- **Do:** pawel.hordynski@it-develop.pl

## Bezpieczeństwo

- ⚠️ **NIGDY** nie commituj plików `.env`!
- `api/.env` powinien zawierać prawdziwe klucze
- Dodać `.env` do `.gitignore`

## Status

✅ Deployment online: https://cyberguru.team
