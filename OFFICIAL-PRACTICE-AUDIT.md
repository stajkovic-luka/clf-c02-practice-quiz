# CLF-C02 official-practice audit

Checked 2026-10-18 against the AWS-owned [re:Invent CLF-C02 exam-preparation PDF](https://d1.awsstatic.com/events/Summits/reinvent2023/TNC108_Exam-prep-AWS-Certified-Cloud-Practitioner.pdf), which reviews 15 public practice items. The PDF was downloaded as data and text-extracted locally; no code from external files was executed. The current [AWS exam guide](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html) and linked service documentation, rather than a 2023 slide answer alone, determined the present-day answers.

| Public practice concept (PDF page) | Bank outcome |
| --- | --- |
| Global low latency: multi-Region placement and CloudFront (21) | Added an original combined Choose 2 scenario, ID 384 |
| RDS Multi-AZ and Reliability pillar (30) | Existing coverage |
| Rehost a complete on-premises server with MGN (39) | Added original scenario, ID 385 |
| Lambda request-count and duration pricing (48) | Existing coverage |
| Customer duties in shared responsibility (59) | Existing coverage |
| Alert on root console sign-in using CloudTrail and CloudWatch (68) | Added original Choose 2 scenario, ID 386 |
| Programmatic access key ID and secret key (77) | Existing coverage |
| Dedicated private connection with Direct Connect (88) | Existing coverage |
| Relational order data in Amazon RDS (97) | Existing coverage |
| S3 object storage and durability (106) | Added original combined Choose 2 scenario, ID 387 |
| Amazon Polly text-to-speech (115) | Existing coverage |
| Amazon Macie discovery of sensitive S3 data (124) | Existing coverage |
| EC2 Spot discount (135) | Existing coverage |
| AWS Organizations governance and consolidated billing (144) | Existing coverage |
| Support plan with phone access (153) | Existing coverage; current plan names and entitlements verified separately |

The public [AWS Skill Builder official practice-question set](https://skillbuilder.aws/learn/E4W52ZKK6P/official-practice-question-set-aws-certified-cloud-practitioner-clfc02--english/RJSZKD3MG3) has 20 questions but requires enrollment; its contents were not accessed here. AWS describes these sets as examples of *exam style*. Neither public practice source verifies that its questions appeared on a live CLF-C02 sitting. AWS says disclosure of live exam content violates the [Certification Program Agreement](https://aws.amazon.com/certification/policies/general-information/). The bank therefore does not label any item as an authenticated past exam question and does not reproduce a practice question verbatim.

Corrections to prior IDs 105 and 168 were based on the current [EC2 penetration-testing policy](https://aws.amazon.com/security/penetration-testing/) and [Trusted Advisor Priority prerequisites](https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor-priority.html). IDs 141, 167, and 181 were also made precise using official EBS, Trusted Advisor, and Billing documentation; references are recorded in the JSON.
