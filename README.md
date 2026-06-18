<div align="center">

# CyberGuru Diceware

**Dwujęzyczny generator silnych, zapamiętywalnych haseł metodą Diceware.**<br>
Hasła są generowane lokalnie w przeglądarce. Serwer dostarcza tylko stronę, statyczne pliki i słowniki.

[![Live demo](https://img.shields.io/badge/live-diceware.io-e52329?style=for-the-badge)](https://diceware.io)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-latest-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[Demo](https://diceware.io) · [Jak działa](#jak-to-działa) · [Bezpieczeństwo](#bezpieczeństwo) · [Uruchomienie lokalne](#uruchomienie-lokalne) · [Deployment](#deployment)

</div>

---

## Co To Jest

CyberGuru Diceware to lekka aplikacja webowa do generowania passphrase, czyli długich haseł złożonych ze słów. Zamiast tworzyć losowy ciąg znaków typu `v4$Kz!9pQ`, aplikacja generuje hasła, które są dużo łatwiejsze do zapamiętania, a jednocześnie mogą mieć bardzo wysoką entropię.

Projekt jest zbudowany nowoczesnie z SvelteKit: cała aplikacja jest kompilowana do statycznych plików, a logika generowania hasła działa po stronie klienta w TypeScript. Serwer jedynie serwuje plik HTML i zasoby statyczne.

## Najważniejsze Funkcje

- Generowanie haseł metodą Diceware z polskich lub angielskich słów.
- Losowanie oparte o `crypto.getRandomValues()`, bez `Math.random()`.
- Hasło nigdy nie trafia do backendu.
- Dynamiczne liczenie entropii i orientacyjnego czasu łamania.
- Obsługa kilku profili ataku: MD5, NTLM, SHA-1, SHA-256 i bcrypt.
- Konfigurowalna liczba słów, separator, wielkość liter, cyfra i znak specjalny.
- Automatyczny wybór języka na podstawie nagłówków proxy/CDN.
- Obsługa parametru `?lang=pl` i `?lang=en` do wymuszenia języka.
- Kopiowanie do schowka i Export jako plik tekstowy.
- Service Worker do działania offline i cache'owania plików.
- Responsywny interfejs zbudowany w Svelte.
- Gotowy `Dockerfile` do deploymentu.

## Tech Stack

| Warstwa | Technologia |
| --- | --- |
| Frontend | SvelteKit, TypeScript, Vite |
| Styling | CSS |
| Zarządzanie stanem | Svelte Stores |
| Deployment | Static adapter, Nginx, PM2 |
| Build | Vite |
| Tłumaczenia | i18n (Svelte Stores) |

## Jak To Działa

1. Przeglądarka pobiera skompilowaną aplikację SvelteKit (statyczne pliki HTML/CSS/JS).
2. Pobierana jest lokalizacja i wybrany słownik słów.
3. TypeScript generuje indeksy słów lokalnie przy pomocy `crypto.getRandomValues()`.
4. Aplikacja składa passphrase zgodnie z wybranymi ustawieniami (liczba słów, separator, itd).
5. Entropia i szacowany czas łamania są liczone po stronie klienta.
6. Serwer nie otrzymuje hasła, nie zapisuje historii i nie ma endpointu generującego hasła.

```text
browser
  ├─ downloads static app (HTML/CSS/JS)
  ├─ downloads wordlist
  ├─ generates random words locally
  ├─ calculates entropy locally
  └─ never sends the passphrase back to the server
```

## Bezpieczeństwo

Model bezpieczeństwa jest prosty: serwer nie powinien wiedzieć, jakie hasło zostało wygenerowane.

- Generowanie odbywa się w przeglądarce użytkownika.
- Losowość pochodzi z Web Crypto API: `crypto.getRandomValues()`.
- SvelteKit kompiluje się do statycznych plików HTML, CSS i JavaScript.
- Serwer jedynie serwuje pliki statyczne i słowniki.
- Brak backendu renderującego hasła ani zmiennych środowiskowych do haseł.
- Brak zapisu historii haseł, logów haseł i sesji użytkownika.
- Hasło jest generowane i przechowywane wyłącznie w pamięci przeglądarki.

## Entropia

W Diceware przestrzenią wyboru są słowa. Podstawowy wzór:

```text
entropia = liczba_słów × log2(liczba_słów_w_słowniku)
```

Przykład dla 6 słów z listy 7776 słów:

```text
log2(7776^6) = 6 × log2(7776) ≈ 77.5 bitów
```

Aplikacja dolicza dodatkową przestrzeń dla wybranych opcji:

```text
+ log2(10)                                # jedna losowa cyfra
+ log2(liczba_znaków_specjalnych)         # jeden losowy znak specjalny
+ liczba_liter_z_losową_wielkością × log2(2)
+ (liczba_słów - 1) × log2(3)             # spacja / myślnik / kropka
+ (liczba_słów - 1) × długość × log2(94)  # własny separator
```

Stała wielkość liter (`Tytułowe`, `małe`, `DUŻE`) nie jest doliczana jako entropia, bo nie zwiększa losowej przestrzeni wyszukiwania. Tryb `Losowe` jest doliczany, ponieważ wielkość każdej litery jest losowana niezależnie.

## Estimated Time To Crack

Aplikacja pokazuje orientacyjny czas łamania offline dla wybranego typu hasha:

```text
czas ≈ 2^(entropia - 1) / liczba_prób_na_sekundę
```

Aktualnie używane przybliżenia:

| Algorytm | Przyjęta szybkość |
| --- | ---: |
| MD5 | 300 GH/s |
| NTLM | 300 GH/s |
| SHA-1 | 100 GH/s |
| SHA-256 | 45 GH/s |
| bcrypt cost 12 | 200 kH/s |

To szacunek porównawczy, nie gwarancja. Realny wynik zależy od sprzętu atakującego, kosztu hasha, reguł mutacji, słowników i tego, ile formatu hasła atakujący zna.

## Wymagania

- Node.js 18+ (LTS)
- npm

## Uruchomienie Lokalne

### 1. Instalacja zależności

```bash
npm install
```

### 2. Uruchomienie w trybie deweloperskim

```bash
npm run dev
```

Aplikacja będzie dostępna pod `http://localhost:3300`.

### 3. Budowanie do produkcji

```bash
npm run build
```

Zostanie stworzony folder `build/` z gotowymi do deploymentu plikami statycznymi, które nalezy przenieść na serwer razem z package.json i package-lock.json.

## Wymuszenie Języka

Język można wymusić parametrem URL:

```bash
http://localhost:3300/?lang=pl
http://localhost:3300/?lang=en
```

Bez parametru aplikacja sprawdza nagłówki kraju ustawiane przez proxy/CDN:

- `CF-IPCountry`
- `X-Vercel-IP-Country`
- `X-Country-Code`
- `X-Appengine-Country`

`PL` renderuje wersję polską. Każdy inny kraj dostaje wersję angielską.

## Docker

```bash
npm run build
docker build -t cyberguru-diceware .
docker run -d \
  --name diceware \
  --restart unless-stopped \
  -p 8000:8000 \
  cyberguru-diceware
```

Aplikacja będzie dostępna pod `http://localhost:8000`.

## Deployment

### 1. Zbuduj aplikację

```bash
npm run build
```

Powstanie folder `build/` z gotowymi, statycznymi plikami, które nalezy przenieść na serwer razem z package.json i package-lock.json.

### 2. Konfiguracja na serwerze

Przed uruchomieniem aplikacji należy uruchomić komendę `npm install`, która zainstaluje zależności, które nie są częścią bundle. 

### 3. Uruchomienie aplikacji

Aplikację nalezy uruchamiać z node polceniem `node /build`. Jeśli chcemy uruchomić ją na innym porcie niż default należy dodać --PORT.

## Słowniki

Pliki słowników znajdują się w `static/wordlists/`:

```text
static/wordlists/diceware-pl.txt
static/wordlists/diceware-en.txt
```

Obsługiwany format:

```text
11111 słowo
11112 inne-słowo
```

Dozwolony jest też prosty format: jedno słowo na linię. Puste linie i linie zaczynające się od `#` są ignorowane.

W repozytorium są dwa słowniki:

- `diceware-pl.txt` — polski słownik roboczy, około 3900 pozycji.
- `diceware-en.txt` — angielska lista EFF, 7776 pozycji.

Po podmianie słownika uruchom ponownie dev server lub zbuduj produkcję. Service Worker automatycznie pobierze nową wersję plików.

## Struktura Projektu

```text
diceware-io/
├── src/                                # SvelteKit frontend
│   ├── app.html                        # Szablon HTML
│   ├── app.css                         # Globalne style
│   ├── routes/
│   │   ├── +layout.server.ts           # Layout serwera
│   │   ├── +layout.svelte              # Layout komponentu
│   │   ├── +page.svelte                # Strona główna
│   │   ├── +page.ts                    # Server load
│   │   └── Home/
│   │       ├── Home.svelte             # Główny komponent
│   │       ├── app.ts                  # Logika aplikacji
│   │       └── ui/                     # Komponenty UI
│   │           ├── Generator.svelte    # Generator haseł
│   │           ├── PasswordQuality.svelte
│   │           ├── CrackTime.svelte
│   │           ├── Settings.svelte
│   │           └── generator.store.ts  # Svelte Store dla generatora
│   ├── lib/
│   │   ├── components/                 # Komponenty UI
│   │   ├── stores/                     # Svelte Stores (język, toast, itd)
│   │   ├── types/                      # TypeScript typy
│   │   ├── utils/                      # Funkcje pomocnicze
│   │   ├── constans/                   # Stałe aplikacji
│   │   ├── translations.ts             # Słownik tłumaczeń
│   │   └── images/                     # Obrazy
│   └── app.d.ts                        # TypeScript deklaracje
├── static/                             # Statyczne pliki
│   ├── img/                            # Obrazy
│   ├── js/
│   │   ├── app.js                      # App-specific JS
│   │   └── sw.js                       # Service Worker
│   └── wordlists/                      # Słowniki Diceware
│       ├── diceware-pl.txt             # Polski słownik
│       └── diceware-en.txt             # Angielski słownik
├── build/                              # Zbudowany frontend (gitignore)
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Przydatne Komendy

```bash
# Lokalny dev server
npm run dev

# Budowanie do produkcji
npm run build

# Podgląd produkcji lokalnie
npm run preview

# Linting i type-checking
npm run lint
npm run check

# Rebuild obrazu Docker
docker build -t cyberguru-diceware .

# Produkcyjny smoke test
curl -I https://diceware.io
```

## Roadmap

- [ ] Pełniejsza, zweryfikowana polska lista Diceware 7776 słów
- [ ] Testy jednostkowe dla logiki generatora
- [ ] PWA manifest i ikony instalacji
- [ ] CI/CD workflow dla deploymentu
- [ ] Wsparcie dla więcej kombinacji oddzielacza
- [ ] Tematy ciemny/jasny z persystencją
- [ ] Eksport haseł do różnych formatów

## Autor

Projekt tworzony dla [diceware.io](https://diceware.io).

Kontakt: [sklep@pawelhordynski.com](mailto:sklep@pawelhordynski.com)

## Licencja

© 2026 CyberGuru. Wszelkie prawa zastrzeżone, chyba że w repozytorium zostanie dodany osobny plik licencji.
