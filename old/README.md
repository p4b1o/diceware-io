<div align="center">

# CyberGuru Diceware

**Dwujęzyczny generator silnych, zapamiętywalnych haseł metodą Diceware.**<br>
Hasła są generowane lokalnie w przeglądarce. Serwer dostarcza tylko stronę, statyczne pliki i słowniki.

[![Live demo](https://img.shields.io/badge/live-diceware.io-e52329?style=for-the-badge)](https://diceware.io)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Vanilla JS](https://img.shields.io/badge/frontend-vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[Demo](https://diceware.io) · [Jak działa](#jak-to-działa) · [Bezpieczeństwo](#bezpieczeństwo) · [Docker](#docker) · [Roadmap](#roadmap)

</div>

---

## Co To Jest

CyberGuru Diceware to lekka aplikacja webowa do generowania passphrase, czyli długich haseł złożonych ze słów. Zamiast tworzyć losowy ciąg znaków typu `v4$Kz!9pQ`, aplikacja generuje hasła, które są dużo łatwiejsze do zapamiętania, a jednocześnie mogą mieć bardzo wysoką entropię.

Projekt jest zbudowany prosto i świadomie: FastAPI renderuje stronę, a cała właściwa logika generowania hasła działa po stronie klienta w czystym JavaScripcie.

## Najważniejsze Funkcje

- Generowanie haseł metodą Diceware z polskich lub angielskich słów.
- Losowanie oparte o `crypto.getRandomValues()`, bez `Math.random()`.
- Hasło nigdy nie trafia do backendu.
- Dynamiczne liczenie entropii i orientacyjnego czasu łamania.
- Obsługa kilku profili ataku: MD5, NTLM, SHA-1, SHA-256 i bcrypt.
- Konfigurowalna liczba słów, separator, wielkość liter, cyfra i znak specjalny.
- Automatyczny wybór języka na podstawie kraju z nagłówków proxy/CDN.
- Ręczne przełączanie języka przez `?lang=pl` i `?lang=en`.
- Kopiowanie do schowka, eksport do `.txt` i tryb ukrywania hasła.
- Service Worker z cachem plików, żeby aplikacja działała szybciej po pierwszym wejściu.
- Responsywny interfejs bez ciężkich frameworków frontendowych.
- Gotowy `Dockerfile` do wdrożenia na VPS, PaaS albo za reverse proxy.

## Stack

| Warstwa | Technologia |
| --- | --- |
| Backend | Python 3.12, FastAPI, Uvicorn |
| Template engine | Jinja2 |
| Frontend | HTML, CSS, vanilla JavaScript |
| Offline/cache | Service Worker |
| Deployment | Docker, reverse proxy, VPS |
| Analytics | Google Tag Manager |

## Jak To Działa

1. Przeglądarka pobiera stronę oraz wybrany słownik słów.
2. JavaScript losuje indeksy słów lokalnie przy pomocy `crypto.getRandomValues()`.
3. Aplikacja składa passphrase zgodnie z wybranymi ustawieniami.
4. Entropia i szacowany czas łamania są liczone po stronie klienta.
5. Backend nie otrzymuje hasła, nie zapisuje historii i nie ma endpointu generującego hasła.

```text
browser
  ├─ downloads HTML/CSS/JS/wordlist
  ├─ generates random words locally
  ├─ calculates entropy locally
  └─ never sends the passphrase back to the server
```

## Bezpieczeństwo

Model bezpieczeństwa jest prosty: serwer nie powinien wiedzieć, jakie hasło zostało wygenerowane.

- Generowanie odbywa się w przeglądarce użytkownika.
- Losowość pochodzi z Web Crypto API: `crypto.getRandomValues()`.
- FastAPI służy do renderowania strony i serwowania plików statycznych.
- Brak backendowego endpointu typu `/generate-password`.
- Brak zapisu historii haseł, logów haseł i sesji użytkownika.
- Google Tag Manager jest używany do analityki strony, nie do generowania ani przesyłania haseł.

> Uwaga: jak w każdej aplikacji webowej z zewnętrznymi skryptami, pełny model zaufania obejmuje także dostawców ładowanych zasobów. Samo hasło jest jednak generowane i przechowywane wyłącznie w pamięci przeglądarki.

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

## Quick Start

```bash
git clone git@github.com:p4b1o/diceware-io.git
cd diceware-io

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Otwórz:

```text
http://localhost:8000
```

Wymuszenie języka:

```text
http://localhost:8000/?lang=pl
http://localhost:8000/?lang=en
```

## Docker

```bash
docker build -t cyberguru-diceware .
docker run -d \
  --name diceware \
  --restart unless-stopped \
  -p 8000:8000 \
  cyberguru-diceware
```

Aplikacja będzie dostępna pod:

```text
http://localhost:8000
```

Przykład dla reverse proxy na VPS:

```text
diceware.io -> reverse proxy -> 127.0.0.1:8000 -> FastAPI container
```

## Wykrywanie Języka

Język można wymusić parametrem:

```text
/?lang=pl
/?lang=en
```

Bez parametru aplikacja sprawdza nagłówki kraju ustawiane przez proxy/CDN:

- `CF-IPCountry`
- `X-Vercel-IP-Country`
- `X-Country-Code`
- `X-Appengine-Country`

`PL` renderuje wersję polską. Każdy inny kraj dostaje wersję angielską. Lokalnie (`127.0.0.1`) domyślnie używana jest wersja polska.

## Słowniki

Pliki słowników:

```text
app/static/wordlists/diceware-pl.txt
app/static/wordlists/diceware-en.txt
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

Po podmianie słownika zaktualizuj `CACHE_NAME` w `app/static/js/sw.js`, żeby przeglądarki pobrały nową wersję plików.

## Struktura Projektu

```text
app/
  main.py
  templates/
    index.html
  static/
    css/
      style.css
    js/
      app.js
      sw.js
    img/
    wordlists/
      diceware-pl.txt
      diceware-en.txt
Dockerfile
requirements.txt
README.md
```

## Roadmap

- Dodać testy jednostkowe dla parsera słowników i wyboru języka.
- Dodać pełniejszą, zweryfikowaną polską listę Diceware 7776 słów.
- Dodać opcjonalny tryb PWA z manifestem i ikonami instalacji.
- Dodać workflow CI dla lintingu i smoke testu Dockera.
- Dodać screenshoty/GIF do README po przygotowaniu finalnych grafik.

## Przydatne Komendy

```bash
# lokalny dev server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# produkcyjny smoke test
curl -I https://diceware.io

# rebuild obrazu
docker build -t cyberguru-diceware .
```

## Autor

Projekt tworzony przez [Pawła Hordyńskiego](https://github.com/p4b1o) dla [diceware.io](https://diceware.io).

Kontakt: [sklep@pawelhordynski.com](mailto:sklep@pawelhordynski.com)

## Licencja

© 2026 Paweł Hordyński / CyberGuru. Wszelkie prawa zastrzeżone, chyba że w repozytorium zostanie dodany osobny plik licencji.
