# AWS CLF-C02 question-bank handoff

**Checked:** 2026-10-18. **Bank:** `src/data/questions.json`, 385 questions; IDs 120 and 368 are retired and deliberately not reused.

| Domain | Original | Earlier additions | Official-practice audit additions | Current total |
| --- | ---: | ---: | ---: | ---: |
| 1 Cloud Concepts | 40 | 50 | 2 | 92 |
| 2 Security and Compliance | 48 | 50 | 1 | 99 |
| 3 Cloud Technology and Services | 59 | 50 | 1 | 110 |
| 4 Billing, Pricing, and Support | 35 | 49 | 0 | 84 |
| **Total** | **182** | **199** | **4** | **385** |

IDs 184–383 contain 199 retained original scenarios from the earlier expansion. Their source fragments are `research-d1-d2.json` and `research-d3-d4.json`. The D3/D4 fragment can be regenerated with `research-d3-d4-builder.py`; it skips retired ID 368. IDs 384–387 were added after comparison with AWS's public 15-question review in [the official re:Invent CLF-C02 preparation slides](https://d1.awsstatic.com/events/Summits/reinvent2023/TNC108_Exam-prep-AWS-Certified-Cloud-Practitioner.pdf). The new items use original wording and link to current AWS service documentation. The AWS Skill Builder [official 20-question practice set](https://skillbuilder.aws/learn/E4W52ZKK6P/official-practice-question-set-aws-certified-cloud-practitioner-clfc02--english/RJSZKD3MG3) requires enrollment; its question text was not extracted.

## Corrections to inherited items

The user authorized changes where AWS documentation clearly refutes the previous answer or explanation. Original IDs changed: **105, 141, 167, 168, 181**. ID 105 now correctly says a permitted EC2 penetration test does not require prior AWS approval. ID 168 now identifies Enterprise Support and Unified Operations as the two eligible plans for Trusted Advisor Priority, subject to prerequisites. The other three had inaccurate explanations or, for ID 181, an imprecise answer option. Sources are linked in the corresponding JSON objects.

Do not treat public practice material as proof that an item appeared on a live exam. AWS does not publish a verified archive of live CLF-C02 questions. Any alleged dump, forum recollection, or third-party answer key needs independent AWS verification and must not be copied into this bank.

## October 2026 syllabus cleanup

- **ID 120 removed.** Its unqualified recommendation of AWS Snowball Edge for a new offline migration is outdated: AWS [no longer offers Snow Family devices to new customers](https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html). Snowball Edge is absent from the current CLF-C02 in-scope list. The service remains supported for existing customers, so this is a content-pruning choice, not a claim that its technology ceased to exist.
- **ID 368 removed.** It tested the announced retirement date of Developer Support, a legacy plan absent from [current Domain 4 support examples](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain4.html). [AWS Support documentation](https://docs.aws.amazon.com/awssupport/latest/user/aws-support-plans.html) lists the four current plans and says Developer Support ends on 2027-01-01, while existing subscribers can still use it until then. Retirement trivia is not a CLF-C02 objective.
- Legacy/out-of-scope names used as distractors were also replaced in IDs **113, 119, 123, 124, 130, 139, 161, 168, 367, 371**. Correct answers and their option letters remain unchanged, except that ID 371's stem now asks for the minimum current plan to make its answer unambiguous.
- The [explicitly out-of-scope service list](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-out-of-scope-services.html) was cross-checked against every correct service answer. No other correct answer names a listed out-of-scope service. Absence from the non-exhaustive in-scope list alone was not treated as proof that a question cannot appear.

## Items to monitor

- **ID 98:** CLF-level root-account wording is acceptable as a simplified rule, but AWS Organizations has exceptions for closing member accounts and changing member-account root email. Review if the stem is later expanded to organization management.
- **ID 164:** Aurora Serverless auto-pause depends on engine version and configuration. The service-level answer remains appropriate for CLF-C02; avoid adding higher-tier implementation details to this question.

## Next iteration

Search stems and underlying decision rules before appending. Use the [CLF-C02 exam guide](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html) and its [in-scope services](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html), then current service documentation for each answer. The in-scope list is non-exhaustive and can change. Recheck Support plans, Free Tier terms, and service names close to publication. Validate JSON with the app's `validateQuestions`, exercise `prepareQuestion`, and run `npm run build` after edits.
