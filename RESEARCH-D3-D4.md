# CLF-C02 istraživanje i predaja: D3 + D4

**Datum provjere:** 18. 10. 2026.

**Fragment:** `research-d3-d4.json`
**Status:** integrisano u `src/data/questions.json`; ID 368 je naknadno uklonjen u reviziji zastarelog sadržaja.

## Opseg

| Domena | Novi ID-jevi | Broj | Višestruki odgovor |
| --- | --- | ---: | ---: |
| D3 Cloud Technology and Services | 284–333 | 50 | 5 |
| D4 Billing, Pricing, and Support | 334–383, bez 368 | 49 | 7 |
| Ukupno | 284–383, bez 368 | 99 | 12 (11 × Choose 2, 1 × Choose 3) |

Pitanja su originalno napisana; javni izvori o pripremi ispita korišteni su za mapu tema, bez preuzimanja formulacija ili navodnih stvarnih ispitnih pitanja. AWS ne objavljuje kompletan skup aktuelnih ispitnih zadataka, pa se ne može garantovati identitet sa stvarnim ispitom.

## Zvanična osnova

- [CLF-C02 vodič, domen 3](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain3.html): metode pristupa, globalna infrastruktura, compute, baze, mreža, storage, AI/ML, analitika i ostali in-scope servisi.
- [CLF-C02 vodič, domen 4](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain4.html): modeli cijena, billing i cost alati, Organizations, tehnički resursi i podrška.
- [In-scope AWS services](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html): provjera da se servisi nalaze u trenutnom obuhvatu.
- [AWS Support planovi](https://docs.aws.amazon.com/awssupport/latest/user/aws-support-plans.html) i [obavijest o povlačenju starih planova](https://docs.aws.amazon.com/awssupport/latest/user/support-plans-eos.html): trenutni planovi su Basic, Business Support+, Enterprise Support i Unified Operations. Developer, Business i Enterprise On-Ramp su prijelazne/legacy kategorije do 1. 1. 2027.; pitanje koje je ispitivalo datum povlačenja uklonjeno je.
- [AWS Free i Paid account plan](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html): nova pitanja izbjegavaju zastarjeli model jednogodišnjeg Free Tier-a.
- [S3 storage klase](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html), [ALB](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html), [NLB](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html), [SNS + SQS](https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html), [Savings Plans](https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html) i [Cost and Usage Reports](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html): primarni izvori za česta razlikovanja.

Svako pitanje u JSON-u ima sopstveni zvanični AWS `Reference` URL i kratko objašnjenje koje navodi pravilo za tačan odgovor.

## Pokrivenost i provjera

- D3: pristup (Console/CLI/SDK), hibridni cloud, Regions/AZ/edge, EC2 porodice, ECS/Fargate, EBS/EFS/S3, RDS/DocumentDB/Neptune/SCT, VPN/PrivateLink/Transit Gateway/ALB/NLB, Athena/Glue/Quick Sight/EMR/OpenSearch, SageMaker AI i specijalizovani AI servisi, SNS + SQS, SES, Connect, X-Ray i developerski alati.
- D4: EC2/S3/Lambda dimenzije cijena; Savings Plans i RI plaćanje; Cost Explorer, CUR, Budgets, Anomaly Detection, tagovi i Cost Categories; Organizations; aktuelni Free/Paid plan; Support planovi, Trusted Advisor, Health API, re:Post, Prescriptive Guidance, APN, Marketplace i Professional Services.
- JSON provjera: **99** zapisa; ID-jevi **284–383** uz rezervisan/uklonjen **368**; **50 D3** i **49 D4**; očekivana polja, četiri opcije za jedan odgovor ili pet za više odgovora, validna slova odgovora i bez ponovljenih opcija.
- **70 jedinstvenih referenci** u zadržanom fragmentu; sve su vratile HTTP 200 na datum prvobitne provjere. Naziv Amazon WorkSpaces Applications naveden je zajedno sa starim imenom AppStream 2.0 koje još stoji u vodiču za ispit.
- Upoređeno s početnih **183** pitanja u `src/data/questions.json`: nema identičnog teksta; najviša jednostavna Jaccard sličnost tokena je ispod 0,4. Ručno su uklonjena vidljiva semantička ponavljanja (npr. generička pitanja o On-Demand, Pricing Calculator, Trusted Advisor kategorijama i Cost Explorer istoriji).

## Javna literatura za coverage, bez kopiranja

- [GitHub: cloudcertprep](https://github.com/nastaso/cloudcertprep) i [GitHub: aws-bootcamp-cloud-practitioner](https://github.com/dominickcg/aws-bootcamp-cloud-practitioner): provjera širine tema.
- [r/AWSCertifications pregled pripremnih izvora](https://www.reddit.com/r/AWSCertifications/comments/1d1xg1p/aws_certified_cloud_practitioner_clfc02_ccp/): signali da kandidati miješaju podršku i billing.
- ExamTopics i Quizlet su pretraženi samo radi raspona scenarija. Zbog mogućih zastarjelih ili spornih odgovora nisu korišteni kao dokaz tačnosti niti je njihov tekst preuzet.

## Napomene za sljedeću iteraciju

1. ID-jevi 120 i 368 su uklonjeni i ne treba ih automatski ponovo koristiti. Novi zapisi treba da počnu nakon 387.
2. Podaci o AWS Support planovima, Free Tier-u i tarifama su vremenski promjenjivi. Ponovno provjeriti službene izvore pri narednoj iteraciji.
3. `research-d3-d4-builder.py` je reproducibilan interni alat za nastanak fragmenta i determinističko miješanje opcija; ne pokretati ga nakon ručnih izmjena finalnog JSON-a bez pregleda diff-a.
