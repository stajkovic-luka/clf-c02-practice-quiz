# AWS CLF-C02 Quiz

Lagana, frontend-only web aplikacija za pripremu **AWS Certified Cloud Practitioner (CLF-C02)** ispita.
Bez backend-a, bez baze — sva pitanja žive u jednom `questions.json` fajlu koji možeš slobodno dopunjavati.

- **Pitanja na engleskom** (kao na pravom ispitu), **objašnjenja na srpskom**, uz link do zvanične AWS dokumentacije kod svakog pitanja.
- Kompletan kviz (sva pitanja, izmešano) ili vežbanje po jednoj od 4 CLF-C02 oblasti.
- Feedback i detaljno objašnjenje odmah nakon svakog odgovora.
- Završni prikaz: ukupan procenat, statistika po oblastima i pregled pogrešnih odgovora.
- **Lebdeća beleška** (dugme 📝 dole-desno): unos tokom vežbanja, prevlačenje po ekranu i
  export u `.txt` na tvoj računar. Sadržaj se **ne čuva nigde u storage-u** — postoji samo u
  memoriji dok je stranica otvorena; jedini način čuvanja je download u `.txt`.

## Struktura projekta

```
aws-clf-c02-quiz/
├── index.html                  # Ulazni HTML (Vite)
├── package.json                # Skripte i zavisnosti
├── vite.config.js              # Vite + React + Tailwind (v4) plugin
├── .gitignore
├── README.md
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # State machine: home → quiz → results
    ├── index.css               # Tailwind import + sitne dorade
    ├── domains.js              # Metapodaci domena (nazivi, težine, boje)
    ├── data/
    │   └── questions.json      # ← BAZA PITANJA (jedino mesto za dodavanje sadržaja)
    ├── utils/
    │   └── quiz.js             # Mešanje (Fisher–Yates), priprema i validacija pitanja
    └── components/
        ├── HomeScreen.jsx      # Izbor moda kviza
        ├── QuizScreen.jsx      # Pitanje, opcije, feedback, objašnjenje
        ├── ResultsScreen.jsx   # Skor, statistika po oblastima, pregled grešaka
        └── StickyNote.jsx      # Lebdeća beleška (drag + export .txt, bez storage-a)
```

## Pokretanje lokalno

Potreban **Node.js 20+** (proveri sa `node -v`).

```bash
npm install     # jednom
npm run dev     # razvojni server na http://localhost:5173
```

Produkcioni build i lokalni pregled istog:

```bash
npm run build     # generiše dist/
npm run preview   # servira dist/ na http://localhost:4173
```

## Kako dodati nova pitanja

Otvori `src/data/questions.json` i dodaj objekat u niz. Šema:

```json
{
  "ID": 27,
  "Domain": 3,
  "QuestionText": "Question text in English (as on the exam)...",
  "Options": ["Option A", "Option B", "Option C", "Option D"],
  "CorrectAnswer": "C",
  "Explanation": "Detaljno objašnjenje na srpskom — zašto je odgovor tačan i zašto su ostali pogrešni.",
  "Reference": "https://aws.amazon.com/..."
}
```

- `Domain`: 1 = Cloud Concepts, 2 = Security and Compliance, 3 = Cloud Technology and Services, 4 = Billing, Pricing, and Support.
- `CorrectAnswer`: slovo opcije (`"A"`–`"D"`).
- `Reference` je opciono — prikazuje se kao link na AWS dokumentaciju.
- Aplikacija meša redosled pitanja **i** opcija pri svakom pokretanju, pa redosled u fajlu ne igra ulogu.
- Nevalidni uneti (npr. izostavljeno objašnjenje) se preskaču uz upozorenje u konzoli — aplikacija ne pada.

## Deploy na GitHub + Vercel

1. **GitHub** (iz korena projekta):

   ```bash
   git init
   git add .
   git commit -m "AWS CLF-C02 quiz"
   git branch -M main
   git remote add origin https://github.com/<tvoj-user>/aws-clf-c02-quiz.git
   git push -u origin main
   ```

2. **Vercel**: prijavi se na [vercel.com](https://vercel.com) → **Add New → Project** → uvezi repo.
   Vercel automatski prepoznaje **Vite** (Build Command: `npm run build`, Output: `dist`) → **Deploy**. Bez env promenljivih, bez dodatne konfiguracije.

   Alternativno preko CLI-ja: `npm i -g vercel && vercel --prod`.

## Napomene o tačnosti sadržaja (oktobar 2026)

- Težine domena (24% / 30% / 34% / 12%) i format ispita (65 pitanja, 90 min, 100 USD) prema zvaničnoj stranici ispita.
- Pitanja o **AWS Support planovima** i **Free Tier**-u odražavaju aktuelno stanje: tokom 2025. AWS je ukinuo klasične Developer/Business planove (novi lineup: Basic / Business Support+ / Enterprise Support / Unified Operations) i uveo kreditni Free Tier model za nove naloge ($100 odmah, do $200 kroz 6 meseci). Detalji su u objašnjenjima pitanja 25 i 26.
- Svako pitanje nosi link do zvanične AWS stranice/dokumentacije — proveri pre ispita ako je prošlo više od par meseci.
