/**
 * Criterion Templates and Evidence Suggestions
 *
 * Provides suggested evidence types and examples for each criterion
 * across all supported visa types.
 */

export interface CriterionTemplate {
  number: number;
  name: string;
  shortName: string;
  description: string;
  evidenceTypes: string[];
  strongExamples: string[];
  commonWeaknesses: string[];
  tips: string[];
}

export const O1A_CRITERIA: CriterionTemplate[] = [
  {
    number: 1,
    name: 'Nationally or internationally recognized prizes or awards',
    shortName: 'Awards',
    description: 'Documentation of receipt of nationally or internationally recognized prizes or awards for excellence in the field.',
    evidenceTypes: [
      'Award certificates',
      'Medal documentation',
      'Prize announcements',
      'Selection criteria documents',
      'Competition statistics',
    ],
    strongExamples: [
      'Nobel Prize, Fields Medal, Turing Award',
      'National science foundation awards',
      'Best paper awards at top-tier conferences',
      'Industry innovation awards from recognized bodies',
      'Government medals of honor in the field',
    ],
    commonWeaknesses: [
      'Participation certificates mistaken for awards',
      'Internal company awards',
      'Awards with unclear selection criteria',
      'Awards from unknown organizations',
      'No evidence of national/international recognition',
    ],
    tips: [
      'Include selection criteria and number of competitors',
      'Show the prestige of the awarding organization',
      'Document media coverage of the award',
      'Include letters explaining significance',
    ],
  },
  {
    number: 2,
    name: 'Membership in associations requiring outstanding achievements',
    shortName: 'Memberships',
    description: 'Documentation of membership in associations that require outstanding achievements of their members.',
    evidenceTypes: [
      'Membership certificates',
      'Organization bylaws showing requirements',
      'Nomination letters',
      'Evidence of selective admission process',
    ],
    strongExamples: [
      'National Academy of Sciences/Engineering/Medicine',
      'IEEE Fellow, ACM Fellow',
      'Professional societies with <5% acceptance rate',
      'Invitation-only industry groups',
    ],
    commonWeaknesses: [
      'Pay-to-join organizations',
      'Student memberships',
      'Organizations without achievement requirements',
      'Memberships requiring only degree completion',
    ],
    tips: [
      'Document the membership requirements clearly',
      'Show percentage of applicants accepted',
      'Include nomination/election process details',
      'Compare to total professionals in field',
    ],
  },
  {
    number: 3,
    name: 'Published material about the beneficiary',
    shortName: 'Press/Media',
    description: 'Published material in professional or major trade publications or major media about the beneficiary.',
    evidenceTypes: [
      'News articles',
      'Magazine features',
      'TV/radio interview transcripts',
      'Professional publication profiles',
      'Circulation/viewership statistics',
    ],
    strongExamples: [
      'New York Times, Wall Street Journal profiles',
      'Major trade publication features',
      'Documentary appearances',
      'TED talks or equivalent',
    ],
    commonWeaknesses: [
      'Press releases written by the beneficiary',
      'Paid advertisements',
      'Blog posts on unknown sites',
      'Social media mentions',
      'Articles about company, not individual',
    ],
    tips: [
      'Include circulation/viewership data',
      'Show the article is ABOUT the beneficiary, not just quoting them',
      'Provide translations with certifications',
      'Document the publication\'s credibility',
    ],
  },
  {
    number: 4,
    name: 'Participation as a judge of others\' work',
    shortName: 'Judging',
    description: 'Evidence of participation as a judge of the work of others in the same or an allied field.',
    evidenceTypes: [
      'Peer review invitations',
      'Journal editor appointments',
      'Grant review panel letters',
      'Competition judging documentation',
      'Thesis committee letters',
    ],
    strongExamples: [
      'Peer reviewer for top-tier journals',
      'Grant review panelist for NSF, NIH',
      'Program committee for major conferences',
      'PhD thesis examiner at other institutions',
    ],
    commonWeaknesses: [
      'One-time informal reviews',
      'Internal company code reviews',
      'Reviewing work of subordinates',
      'No evidence of actual judging activity',
    ],
    tips: [
      'Document frequency and duration of judging',
      'Show prestige of the venue/organization',
      'Include thank you letters from journals',
      'Quantify number of reviews completed',
    ],
  },
  {
    number: 5,
    name: 'Original contributions of major significance',
    shortName: 'Contributions',
    description: 'Evidence of original scientific, scholarly, or business-related contributions of major significance.',
    evidenceTypes: [
      'Patents (with evidence of adoption)',
      'Expert letters detailing impact',
      'Citation analysis',
      'Licensing agreements',
      'Implementation documentation',
    ],
    strongExamples: [
      'Widely-cited foundational papers',
      'Patents licensed by major companies',
      'Algorithms/methods adopted industry-wide',
      'Standards authored or co-authored',
    ],
    commonWeaknesses: [
      'Generic expert letters without specifics',
      'Patents that haven\'t been used',
      'Contributions without documented impact',
      'Team achievements without individual role clarity',
    ],
    tips: [
      'Expert letters should detail SPECIFIC impact',
      'Include independent adoption evidence',
      'Document citations and their context',
      'Show downstream applications',
    ],
  },
  {
    number: 6,
    name: 'Authorship of scholarly articles',
    shortName: 'Publications',
    description: 'Evidence of authorship of scholarly articles in the field in professional journals or other major media.',
    evidenceTypes: [
      'Published papers',
      'Journal impact factors',
      'Citation counts',
      'H-index documentation',
      'Conference proceedings',
    ],
    strongExamples: [
      'Nature, Science, Cell publications',
      'Top-tier field-specific journals',
      'Highly-cited papers (top 1-10%)',
      'Invited review articles',
    ],
    commonWeaknesses: [
      'Publications in predatory journals',
      'Conference abstracts only',
      'Co-authorship with minor contribution',
      'Self-published or non-peer-reviewed work',
    ],
    tips: [
      'Include journal impact factors',
      'Document citation counts in context',
      'Show acceptance rates for venues',
      'Clarify individual contribution if co-authored',
    ],
  },
  {
    number: 7,
    name: 'Employment in a critical or essential capacity',
    shortName: 'Critical Role',
    description: 'Evidence of employment in a critical or essential capacity for organizations with a distinguished reputation.',
    evidenceTypes: [
      'Offer letters with title/responsibilities',
      'Organizational charts',
      'Letters from leadership',
      'Evidence of organization\'s reputation',
      'Project documentation',
    ],
    strongExamples: [
      'Chief Scientist, VP of Engineering',
      'Lead architect of major product',
      'Principal Investigator on major grants',
      'Founded key division or product line',
    ],
    commonWeaknesses: [
      'Standard employee roles',
      'Job at organization without distinguished reputation',
      'Title without evidence of actual critical role',
      'Self-employed without organizational context',
    ],
    tips: [
      'Show why the role was CRITICAL, not just senior',
      'Document organization\'s distinguished reputation',
      'Include specific achievements in the role',
      'Show how departure would impact organization',
    ],
  },
  {
    number: 8,
    name: 'High salary or remuneration',
    shortName: 'High Salary',
    description: 'Evidence that the beneficiary has commanded a high salary or other remuneration.',
    evidenceTypes: [
      'Tax returns',
      'Pay stubs',
      'Offer letters',
      'Bureau of Labor Statistics data',
      'Industry salary surveys',
    ],
    strongExamples: [
      'Top 10% salary for occupation/region',
      'Significant equity compensation',
      'Multi-million dollar speaking fees',
      'Large consulting rates',
    ],
    commonWeaknesses: [
      'Salary near median for field',
      'No comparison data provided',
      'Stock options without vesting evidence',
      'Future salary offers (not current)',
    ],
    tips: [
      'Include BLS or equivalent comparison data',
      'Show percentile ranking',
      'Document total compensation including equity',
      'Use geographic-appropriate comparisons',
    ],
  },
];

export const O1B_CRITERIA: CriterionTemplate[] = [
  {
    number: 1,
    name: 'Nomination for or receipt of significant awards',
    shortName: 'Awards',
    description: 'Nomination for or receipt of significant national or international awards or prizes in the field.',
    evidenceTypes: [
      'Award nominations/wins',
      'Award significance documentation',
      'Competition details',
    ],
    strongExamples: [
      'Academy Award, Emmy, Grammy nomination',
      'Tony Award',
      'Cannes Film Festival awards',
      'National arts foundation awards',
    ],
    commonWeaknesses: [
      'Local or regional awards only',
      'Awards from unknown organizations',
      'Participation certificates',
    ],
    tips: [
      'Document the prestige of the award',
      'Show competition level',
      'Include previous notable winners',
    ],
  },
  // Add more O-1B criteria...
];

export const P1A_CRITERIA: CriterionTemplate[] = [
  {
    number: 1,
    name: 'Significant participation in a prior season with a major U.S. sports league',
    shortName: 'Prior US League',
    description: 'Evidence of significant participation with a major U.S. sports league.',
    evidenceTypes: [
      'Team contracts',
      'Game statistics',
      'Roster listings',
    ],
    strongExamples: [
      'Starting player in NFL, NBA, MLB, NHL',
      'Regular season participation statistics',
      'All-star selections',
    ],
    commonWeaknesses: [
      'Practice squad only',
      'Minor league participation',
      'Very limited playing time',
    ],
    tips: [
      'Document games played and statistics',
      'Show level of participation',
      'Include team achievements during tenure',
    ],
  },
  // Add more P-1A criteria...
];

export const EB1A_CRITERIA: CriterionTemplate[] = [
  // Similar to O-1A but with EB-1A specific guidance
  ...O1A_CRITERIA.map(criterion => ({
    ...criterion,
    tips: [
      ...criterion.tips,
      'EB-1A requires meeting 3+ criteria with sustained national/international acclaim',
    ],
  })),
];

export const VISA_TEMPLATES: Record<string, CriterionTemplate[]> = {
  'O-1A': O1A_CRITERIA,
  'O-1B': O1B_CRITERIA,
  'P-1A': P1A_CRITERIA,
  'EB-1A': EB1A_CRITERIA,
};

export function getTemplatesForVisa(visaType: string): CriterionTemplate[] {
  return VISA_TEMPLATES[visaType] || O1A_CRITERIA;
}
