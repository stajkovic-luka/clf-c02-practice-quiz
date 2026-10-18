# CLF-C02 research handoff — D1 and D2

Updated: 2026-10-18. Scope: 100 original questions in `research-d1-d2.json`, IDs 184–283 (50 D1, 50 D2). The existing 183 entries were read but not changed. Questions and options were written afresh; community and practice sites were used only to spot topic gaps, never as an answer authority or source of copied wording. No external source can prove the current live exam item pool.

## Authoritative coverage

- [Official CLF-C02 D1 outline](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain1.html): cloud benefits, Well-Architected pillars, AWS CAF, migration strategies, TCO/licensing/rightsizing.
- [Official CLF-C02 D2 outline](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain2.html): shared responsibility, security and compliance, IAM and federation, protective and detective services.
- [Official in-scope services](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html): used as the service-level boundary. AWS CloudHSM is explicitly in scope; Audit Manager is absent from the non-exhaustive service list, so the candidate Audit Manager question was replaced.
- [AWS CAF overview](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/overview-aws-cloud-adoption-framework.html), [Well-Architected pillars](https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html), [AWS migration strategies](https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html).
- [Shared responsibility model](https://aws.amazon.com/compliance/shared-responsibility-model/), [IAM policy evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html), [Organizations SCPs](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html), plus per-question official `Reference` links.

Secondary coverage checks included GitHub open-source practice repositories, r/AWSCertifications discussions, ExamTopics discussion listings, Quizlet cards, and training blogs. These sources sometimes describe retired support plans or confuse exam recollections with official guidance. The AWS exam guide and current product documentation determine the answers.

## Validation performed

- Schema: 100/100 records accepted by the app's `validateQuestions`; all shuffled correct-answer mappings preserved by `prepareQuestion`.
- Format: single-answer questions have four options; `Choose 2` and `Choose 3` have at least five options; the requested count matches the answer-array length.
- Content: every explanation states the relevant AWS rule or service distinction and links to an official AWS source. HTTP HEAD checks returned 200 for all 41 unique official reference URLs after the final edits.
- Uniqueness: no identical stems to the initial 183 questions; two close repetitions were replaced with Security Hub CSPM and Lambda package-scanning scenarios. Deliberately varied scenarios may test the same underlying syllabus objective.

## Inherited findings for the next editor

Historical findings from the earlier append-only pass. The user subsequently authorized corrections: IDs 105, 141, 168, and 181 have now been updated in `src/data/questions.json`; the list below records the original issues. ID 164 remains a CLF-level simplification. See `RESEARCH-HANDOFF.md` for current status.

1. **ID 105** says ordinary penetration testing of one's own EC2 instance requires prior AWS approval. [AWS policy](https://aws.amazon.com/security/penetration-testing/) allows it without prior approval on permitted services. C2 and certain simulations do require approval. Both the stem/options and explanation need revision.
2. **ID 168** says Business Support+ includes Trusted Advisor Priority. [AWS prerequisites](https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor-priority.html) restrict Priority to Enterprise Support and Unified Operations. The current option set has no correct response; it must be rewritten.
3. **ID 141** has the right answer for shared managed file systems, but its explanation says EBS can attach to only one instance. [EBS Multi-Attach](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes-multi.html) is an exception for supported volumes; a clustered file system is needed for concurrent access.
4. **ID 164** treats Aurora Serverless auto-pause as universal. [AWS docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) limit scale-to-zero to supported engine versions/configurations. Add that condition to the wording.
5. **ID 181** calls Free Tier tracking a special AWS Budgets budget type. [AWS Billing docs](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/tracking-free-tier-usage.html) describe Free Tier usage alerts and optional zero-spend/usage budgets instead.

The current official [D4 exam outline](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain4.html) lists Basic, Business Support+, Enterprise Support, and Unified Operations. Developer and Business are legacy plans being retired; don't create new questions whose correct answer depends on them as current default tiers.
