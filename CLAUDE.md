# CV – Paweł Steckiewicz

Strona CV/portfolio dostępna pod adresem https://stecudesign.github.io/cv/

## Stack technologiczny

- **HTML** – jeden plik `index.html`, brak frameworków
- **CSS** – `style.css` (własne klasy + CSS variables), ładowany **przed** Tailwind
- **Tailwind CDN** – wstrzykiwany przez `<script>` w `<head>`, co oznacza że Tailwind styluje **po** `style.css` przy tej samej specyficzności
- **JavaScript** – `script.js` (vanilla JS, bez bundlera)
- **Fonty** – Google Fonts: Poppins (400, 600, 700, 800)
- **Hosting** – GitHub Pages (branch `main`, katalog root)

## Struktura plików

```
index.html          – cała treść strony (jednofikowy layout)
style.css           – wszystkie style niestandardowe
script.js           – animacje, menu, modals, scroll reveal, mobile accordion
img/
  logo/             – logotypy firm (PNG, SVG, JPG)
  omnie/            – zdjęcia do sekcji "O mnie"
  projekty/         – screenshoty projektów
  tools/            – ikony narzędzi
  kursy/            – skany certyfikatów
  hobby/            – zdjęcia do sekcji hobby
video/              – pliki wideo projektów + okładki
scripts/            – narzędzia deweloperskie (smoke-test.js, check-encoding.ps1)
```

## System kolorów (3 poziomy)

Zdefiniowany w `:root` w `style.css`. **Nigdy nie używaj hardkodowanych wartości** – zawsze korzystaj ze zmiennych.

| Zmienna | Wartość | Zastosowanie | Kontrast/białe |
|---|---|---|---|
| `--text-heading` | `#0f172a` | Nagłówki, tytuły sekcji, nazwy firm | 17:1 |
| `--text-main` | `#1e293b` | Treść, listy, nazwy stanowisk | 11:1 |
| `--text-muted` | `#64748b` | Metadane, etykiety, eyebrow, opisy | 4.6:1 |
| `--primary` | `#ff4d00` | Akcenty, linki, ikony marki | — |
| `--primary-dark` | `#d94100` | Hover na primary | — |
| `--secondary` | `#020617` | Tło ciemnych sekcji (hero, kontakt) | — |
| `--white` | `#ffffff` | Tekst na ciemnym tle | — |

**Sekcje ciemne** (hero, kontakt): używaj `#fff` i `rgba(255,255,255,x)` – te sekcje mają `data-nav-theme="dark"`.  
**Sekcje jasne** (doświadczenie, projekty, narzędzia): używaj wyłącznie `--text-heading`, `--text-main`, `--text-muted`.

## Ważna zasada: Tailwind CDN vs. style.css

Tailwind CDN jest wstrzykiwany przez `<script>` po parsowaniu `<head>`, więc jego klasy **nadpisują** `style.css` przy tej samej specyficzności (0,1,0). Konsekwencje:

- Jeśli element ma i klasę CSS (np. `.exp-feature-role`) i klasę Tailwind (np. `text-text-main`), **Tailwind wygrywa**.
- Aby CSS nadpisał Tailwind, użyj wyższej specyficzności (np. dodaj selektor rodzica) lub dodaj deklarację do klasy już obecnej w CSS, którą Tailwind nie nadpisuje.
- Nie dodawaj inline kolorów przez Tailwind (np. `text-[#262626]`). Zamiast tego: ustaw zmienną CSS i użyj jej w `style.css`.

## Architektura JS (`script.js`)

- **Burger menu** – otwieranie/zamykanie nawigacji mobilnej
- **Scroll reveal** – IntersectionObserver animujący karty, sekcje, certyfikaty
- **Inline experience headers** – dynamicznie budowane headery w kartach doświadczenia
- **Mobile accordion** – składane karty doświadczenia na ekranach ≤768px
- **Video modal** – odtwarzacz wideo dla projektów
- **Certificate modal** – podgląd certyfikatów w lightboxie
- **Nav theme switch** – zmiana motywu burgera przy scrollu między sekcjami (data-nav-theme)
- **Counter animation** – animowane liczniki statystyk w hero

## Sekcje strony (anchory)

| Anchor | Sekcja |
|---|---|
| `#o-mnie` | Hero + "O mnie" |
| `#doswiadczenie` | Doświadczenie zawodowe |
| `#projekty` | Projekty |
| `#certyfikaty` | Certyfikaty i szkolenia |
| `#umiejetnosci` | Narzędzia |
| `#hobby` | Zainteresowania |
| `#kontakt` | Kontakt |

## Responsywność

Breakpointy w `style.css`:
- `≤1100px` – układ tablet, reflow siatki projektów
- `≤900px` – układ mobilny, hero stats w kolumnie
- `≤768px` – mobile accordion dla doświadczenia (sekcja `#doswiadczenie`)
- `≤640px` – pełna wersja mobilna, wszystkie gridy 1-kolumnowe

## Dostępność

- Semantyczny HTML5 (`<article>`, `<section>`, `<nav>`, `<aside>`, `<figure>`)
- `aria-label`, `aria-hidden`, `aria-modal` na kluczowych elementach
- `data-nav-theme` na sekcjach do zmiany kontrastu burgera
- `prefers-reduced-motion` obsługiwany w CSS (wyłącza animacje)
- WCAG AA – minimalny kontrast tekstu 4.5:1 (wymagany dla normalnego tekstu)

## Uruchamianie lokalnie

Strona nie wymaga serwera – otwórz `index.html` bezpośrednio w przeglądarce lub przez Live Server w VS Code. Tailwind CDN wymaga połączenia z internetem.

## Deploy

Push na branch `main` → automatyczny deploy przez GitHub Pages. Brak CI/CD, brak budowania.
