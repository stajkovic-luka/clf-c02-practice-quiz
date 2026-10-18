// Metapodaci o CLF-C02 domenima — nazivi i težine (%) su iz zvaničnog AWS exam guide-a.
// Napomena: class stringovi su completi jer Tailwind skenira izvorni kod —
// dinamicno spajanje klasa (npr. `bg-${color}-500`) ne bi bilo prepoznato.
export const DOMAINS = {
  1: {
    code: 'D1',
    name: 'Cloud Concepts',
    nameSr: 'Osnovni koncepti cloud-a',
    weight: '24%',
    description: 'Vrednost cloud-a, prednosti, CapEx vs OpEx, deljena odgovornost, principi dizajna.',
    chip: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    bar: 'bg-orange-500',
    accentBorder: 'hover:border-orange-500/50',
  },
  2: {
    code: 'D2',
    name: 'Security and Compliance',
    nameSr: 'Bezbednost i usklađenost',
    weight: '30%',
    description: 'IAM (korisnici, role, politike, MFA), Organizations, Artifact, WAF/Shield, KMS.',
    chip: 'bg-red-500/15 text-red-300 border-red-500/30',
    bar: 'bg-red-500',
    accentBorder: 'hover:border-red-500/50',
  },
  3: {
    code: 'D3',
    name: 'Cloud Technology and Services',
    nameSr: 'Cloud tehnologije i servisi',
    weight: '34%',
    description: 'Compute, storage, baze, mreže, globalna infrastruktura, CloudWatch/CloudTrail.',
    chip: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    bar: 'bg-sky-500',
    accentBorder: 'hover:border-sky-500/50',
  },
  4: {
    code: 'D4',
    name: 'Billing, Pricing, and Support',
    nameSr: 'Naplata, cenovni modeli i podrška',
    weight: '12%',
    description: 'Free Tier, On-Demand/Reserved/Savings Plans/Spot, Cost Explorer, Budgets, Support planovi.',
    chip: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    bar: 'bg-emerald-500',
    accentBorder: 'hover:border-emerald-500/50',
  },
};

export const DOMAIN_IDS = [1, 2, 3, 4];
