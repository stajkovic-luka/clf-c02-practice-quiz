# AWS CLF-C02 Quiz

Lagana, frontend-only web aplikacija za pripremu **AWS Certified Cloud Practitioner (CLF-C02)** ispita.
Bez backend-a, bez baze — sva pitanja žive u jednom `questions.json` fajlu koji možeš slobodno dopunjavati.

**Produkcija:** [aws-clf-c02-quiz-two.vercel.app](https://aws-clf-c02-quiz-two.vercel.app)

- **Pitanja na engleskom** (kao na pravom ispitu), **objašnjenja na srpskom**, uz link do zvanične AWS dokumentacije kod svakog pitanja.
- **Practice Mode:** cela baza ili jedan domen, štoperica, obavezna potvrda odgovora pre sledećeg pitanja, trenutno objašnjenje i **Show Answer**.
- **Simulation Mode:** nasumičnih 65 pitanja (D1 16, D2 19, D3 22, D4 8), odbrojavanje 90 minuta, slobodna navigacija i **Mark for review**; bez prikaza odgovora do predaje.
- Završni izveštaj simulacije: procenjeni skalirani skor 100–1000, prag 700, rezultat po sva četiri domena i pregled svih pitanja sa odgovorima i objašnjenjima.
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
    ├── App.jsx                 # State machine: home → practice/simulation → results
    ├── index.css               # Tailwind import + sitne dorade
    ├── domains.js              # Metapodaci domena (nazivi, težine, boje)
    ├── data/
    │   └── questions.json      # ← BAZA PITANJA (jedino mesto za dodavanje sadržaja)
    ├── utils/
    │   └── quiz.js             # Mešanje (Fisher–Yates), priprema i validacija pitanja
    └── components/
        ├── HomeScreen.jsx      # Izbor Practice ili Simulation moda
        ├── PracticeScreen.jsx  # Potvrda, Show Answer i instant feedback
        ├── QuizScreen.jsx      # Ispitna simulacija bez instant feedback-a
        ├── ResultsScreen.jsx   # Skor, domeni i pregled odgovora
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
npm test          # provera izbora pitanja i bodovanja
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
- `CorrectAnswer`: slovo opcije (`"A"`–`"D"`) ili niz slova za pitanja sa više tačnih odgovora (`["A", "C"]`).
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
- U simulaciji su težine za 65 pitanja zaokružene na najbližu raspodelu celih brojeva 16/19/22/8. Nasumičnih 15 pitanja ima skriven status neocenjenih, a 50 se boduje. Pitanja sa više odgovora nose poen samo ako su svi izbori tačni.
- Aplikacija računa **lokalnu procenu** po traženoj formuli `Math.round(100 + (tačnih_od_50 / 50) * 900)` i prikazuje PASS od 700 poena. [AWS potvrđuje 50 ocenjenih, 15 neocenjenih pitanja i skalu 100–1000 sa pragom 700](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html), ali [zvanični rezultat statistički izjednačava između verzija ispita](https://aws.amazon.com/certification/policies/after-testing/); AWS ne objavljuje ovu linearnu formulu. Prikazani broj je zato procena, ne predviđanje zvaničnog ishoda.
- Pitanja o **AWS Support planovima** i **Free Tier**-u odražavaju aktuelno stanje: trenutni planovi su Basic / Business Support+ / Enterprise Support / Unified Operations; postojeći Developer i Business planovi imaju najavljen kraj podrške 1. januara 2027. Novi Free Tier model koristi kredite za nove naloge. Detalji su u objašnjenjima pitanja 25 i 26.
- Pitanja o Snowball Edge za nove korisnike i o datumu gašenja Developer Support plana uklonjena su iz aktivne baze. Razlozi i izvori su u [reviziji sadržaja](RESEARCH-HANDOFF.md).
- Svako pitanje nosi link do zvanične AWS stranice/dokumentacije — proveri pre ispita ako je prošlo više od par meseci.
