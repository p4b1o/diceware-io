# CyberGuru Diceware

Dwujęzyczny generator haseł metodą [Diceware](https://theworld.com/~reinhold/diceware.html). Hasła powstają **w 100% lokalnie w przeglądarce** — serwer serwuje wyłącznie stronę i pliki słowników.

## Funkcje

- Generowanie haseł z polskich lub angielskich słów (metoda Diceware)
- Automatyczny wybór języka: polskie IP dostaje PL, pozostałe IP dostają EN
- Ręczne przełączanie języka flagami w menu (`?lang=pl` / `?lang=en`)
- Kryptograficznie bezpieczne losowanie (`crypto.getRandomValues()`)
- Dynamiczna entropia i ocena jakości hasła
- Konfigurowalna liczba słów, separator, wielkość liter
- Opcjonalna cyfra i znak specjalny
- Kopiowanie do schowka i eksport do `.txt`
- Działanie offline po pierwszym załadowaniu (Service Worker)

## Wzór entropii

Entropia to:

```
entropia ≈ log₂(liczba_możliwych_wyników)
```

W Diceware przestrzenią wyboru są słowa, więc podstawowy wzór to:

```
entropia = liczba_słów_w_haśle × log₂(liczba_słów_w_słowniku)
```

Przykład: 6 słów z listy 7776 słów:

```
log₂(7776⁶) = 6 × log₂(7776) ≈ 77,5 bitów
```

Dla zwykłego hasła znakowego przestrzenią wyboru są znaki. Przykład: 12 znaków losowanych z 94 drukowalnych znaków:

```
log₂(94¹²) = 12 × log₂(94) ≈ 78,7 bitów
```

Jeśli użytkownik włączy opcjonalną cyfrę, znak specjalny, losową wielkość liter albo separator między słowami, aplikacja dolicza dodatkową przestrzeń wyszukiwania:

```
+ log₂(10)                              # jedna losowa cyfra
+ log₂(liczba_znaków_specjalnych)       # jeden losowy znak specjalny
+ liczba_liter_z_losową_wielkością × log₂(2)
+ (liczba_słów - 1) × log₂(3)           # spacja / myślnik / kropka
+ (liczba_słów - 1) × długość × log₂(94) # własny separator
```

`Brak` separatora daje 0 bitów dla separatora. `Spacja`, `Myślnik` i `Kropka` dają taki sam wkład, bo są traktowane jako trzy popularne warianty separatora. Stały format liter (`Tytułowe`, `małe`, `DUŻE`) nie jest doliczany jako entropia. Tryb `Losowe` dla wielkości liter jest doliczany, bo generator losuje wielkość każdej litery niezależnie.

UI pokazuje rozkład entropii na składniki, np. `słowa + cyfra + znak specjalny`, żeby łatwo sprawdzić, które opcje faktycznie zmieniają wynik.

Im większy słownik i więcej słów w haśle, tym wyższa entropia (trudniejsze do złamania).

## Estimated time to crack

Aplikacja pokazuje też orientacyjny czas łamania offline dla wybranego typu hasha:

```
czas ≈ 2^(entropia - 1) / liczba_prób_na_sekundę
```

Używane prędkości są przybliżeniami dla mocnego ataku offline:

- MD5: 300 GH/s
- NTLM: 300 GH/s
- SHA-1: 100 GH/s
- SHA-256: 45 GH/s
- bcrypt cost 12: 200 kH/s

To szacunek porównawczy, a nie gwarancja. Realny wynik zależy od sprzętu atakującego, kosztu hasha, słowników, reguł mutacji i tego, ile formatu hasła atakujący faktycznie zna.

## Uruchomienie lokalne

```bash
# Utwórz i aktywuj wirtualne środowisko (opcjonalnie)
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Zainstaluj zależności
pip install -r requirements.txt

# Uruchom serwer
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Otwórz w przeglądarce: [http://localhost:8000](http://localhost:8000)

## Uruchomienie przez Docker

```bash
# Zbuduj obraz
docker build -t cyberguru-diceware .

# Uruchom kontener
docker run -d -p 8000:8000 --name diceware cyberguru-diceware
```

Aplikacja będzie dostępna pod adresem [http://localhost:8000](http://localhost:8000).

## Podmiana słownika

Pliki słowników znajdują się w:

```
app/static/wordlists/diceware-pl.txt
app/static/wordlists/diceware-en.txt
```

Format pliku:
- jedno słowo na linię, **lub**
- format Diceware: `11111 słowo` (kod numeryczny + spacja + słowo)
- puste linie i linie zaczynające się od `#` są ignorowane

**Ważne:** Dołączony polski plik zawiera rozbudowany zestaw polskich słów (~3 900 pozycji). W produkcji zalecamy użycie pełnego, zweryfikowanego słownika Diceware PL (np. autorskiej listy z co najmniej 7776 słowami dla pełnej entropii 5 kości). Angielski słownik to oficjalna lista EFF `eff_large_wordlist.txt` (7776 słów).

## Wykrywanie języka

Język można wymusić parametrem:

```
/?lang=pl
/?lang=en
```

Bez parametru aplikacja sprawdza nagłówki kraju ustawiane przez proxy/CDN, np. `CF-IPCountry`, `X-Vercel-IP-Country`, `X-Country-Code` lub `X-Appengine-Country`. `PL` renderuje wersję polską, każdy inny kraj wersję angielską. Lokalnie (`127.0.0.1`) domyślnie używana jest wersja polska.

Po podmianie pliku:
1. Zaktualizuj wersję cache w `app/static/js/sw.js` (stała `CACHE_NAME`), aby użytkownicy pobrali nowy słownik.
2. Zrestartuj serwer (lub przebuduj kontener Docker).

## Bezpieczeństwo

- **Hasła nigdy nie są wysyłane na serwer.** Generowanie odbywa się wyłącznie w JavaScript po stronie klienta.
- Serwer FastAPI nie posiada endpointu generującego hasła — służy tylko do serwowania plików statycznych i szablonu HTML.
- Losowanie opiera się na `crypto.getRandomValues()`, nie na `Math.random()`.
- Historia haseł nie jest zapisywana.

## Struktura projektu

```
app/
  main.py                 # FastAPI — serwowanie strony i plików statycznych
  templates/
    index.html            # Szablon Jinja2
  static/
    css/style.css
    js/app.js             # Logika generatora
    js/sw.js              # Service Worker (offline)
    img/                  # Grafiki
    wordlists/
      diceware-pl.txt     # Słownik polskich słów
      diceware-en.txt     # Oficjalny angielski słownik EFF
requirements.txt
Dockerfile
README.md
```

## Technologie

- **Backend:** Python 3.12, FastAPI, Uvicorn, Jinja2
- **Frontend:** HTML, CSS, vanilla JavaScript (bez frameworków)
- **Wdrożenie:** Docker, VPS

## Licencja

© 2024 Paweł Hordyński Cyberguru — [sklep@pawelhordynski.com](mailto:sklep@pawelhordynski.com)
