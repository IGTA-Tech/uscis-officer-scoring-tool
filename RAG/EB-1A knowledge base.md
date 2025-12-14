# ULTIMATE VISA SCORING BLUEPRINT: EB-1A VISA CLASSIFICATION ## Executive
Summary The EB-1A visa classification (Employment-Based First Preference: Extraordinary
Ability) is designed for foreign nationals who demonstrate extraordinary ability in the sciences,
arts, education, business, or athletics. This blueprint provides a comprehensive framework for
evaluating EB-1A petitions using the mandatory two-step Kazarian approach established by
USCIS policy. Under the Kazarian framework, adjudication proceeds through two distinct steps:
1. **Initial Evidence Evaluation**: An objective determination of whether the applicant meets at
least 3 of 10 regulatory criteria (or has received a qualifying major international award). 2.
**Final Merits Determination**: A holistic assessment of whether the totality of evidence
demonstrates that the applicant has extraordinary ability with sustained national or international
acclaim and is among a small percentage at the very top of their field. This distinction is crucial,
as meeting the minimum three criteria does not automatically guarantee approval; the evidence
must collectively demonstrate the petitioner's standing at the top of their field. The blueprint
integrates both steps into a consistent scoring system with clear thresholds for approval
likelihood. The framework enables consistent, data-driven adjudication predictions while
accounting for the unique aspects of each case. It includes detailed field-specific guidance for
sciences, business, arts, technology, education, and athletics, with tailored evidence evaluation
approaches for each domain. Implemented as an n8n workflow with multiple specialized agents,
the system provides automated document classification, evidence mapping, criteria scoring, and
final merits evaluation. The comprehensive output includes detailed strengths and weaknesses
analysis with specific recommendations for evidence improvement. ## Version Information
Based on analysis of USCIS regulatory criteria, policy guidance, and AAO decisions for EB-1A
visas (2019-2025). Current Version: 2.1.0 (Last Updated: April 2025) ## Evaluation Structure {
"scoringBlueprint": { "title": "ULTIMATE VISA SCORING BLUEPRINT: EB-1A VISA
CLASSIFICATION", "versionInfo": "Based on analysis of USCIS regulatory criteria, policy
guidance, and AAO decisions for EB-1A visas (2019-2025)", "evaluationPaths": [ { "pathType":
"major_award", "criteria": [ { "id": "EB1A-0", "name": "One-Time Major International Award",
"maxPoints": 100, "description": "Receipt of a major, internationally recognized award provides
automatic qualification (e.g., Nobel Prize).", "autoApproval": true, "evidenceTypes": [ "Award
certificate/notification", "Documentation of award significance", "Media coverage of award",
"Evidence of international recognition", "Information about selection process", "Letter from
awarding organization" ], "evidenceWeighting": [ {"type": "Award certificate/official notice",
"weight": "Required"}, {"type": "Documentation of award significance", "weight": "25%"}, {"type":
"Media coverage", "weight": "25%"}, {"type": "Evidence of international recognition", "weight":
"25%"}, {"type": "Selection process documentation", "weight": "15%"}, {"type": "Letter from
awarding authority", "weight": "10%"} ], "exampleAwards": [ {"name": "Nobel Prize", "field":
"Various Sciences/Literature/Peace"}, {"name": "Pulitzer Prize", "field": "Journalism/Literature"},
{"name": "Fields Medal", "field": "Mathematics"}, {"name": "Academy Award (Oscar)", "field":
"Film"}, {"name": "Olympic Medal", "field": "Sports"}, {"name": "Turing Award", "field": "Computer
Science"} ] } ] }, { "pathType": "standard_criteria", "requirement": "Satisfy at least three of the
following ten criteria.", "criteria": [ { "id": "EB1A-1", "name": "Lesser Nationally/Internationally
Recognized Prizes/Awards", "maxPoints": 25, "description": "Receipt of lesser nationally or
internationally recognized prizes or awards for excellence in the field of endeavor.",
"evidenceTypes": [ "Award certificates", "Documentation of award significance/prestige",
"Evidence of competitive selection process", "Media coverage of award
ceremony/announcement", "Letters from awarding organizations", "Information about previous
recipients", "Documentation of award's international/national recognition" ],
"evidenceWeighting": [ {"type": "Award certificates", "weight": "Required"}, {"type":
"Documentation of award significance", "weight": "20%"}, {"type": "Competitive selection
evidence", "weight": "20%"}, {"type": "Media coverage", "weight": "15%"}, {"type": "Letters from
awarding organizations", "weight": "15%"}, {"type": "Information about previous recipients",
"weight": "15%"}, {"type": "Evidence of national/international recognition", "weight": "15%"} ],
"strongEvidence": "Awards from recognized national/international professional organizations;
awards with documented prestige and competitive selection; awards covered by significant
media", "weakEvidence": "Internal company awards; local awards with limited scope; certificates
of appreciation; awards without evidence of significance or recognition" }, { "id": "EB1A-2",

"name": "Membership in Associations Requiring Outstanding Achievement", "maxPoints": 25,
"description": "Membership in associations in the field that require outstanding achievements of
their members, as judged by recognized experts.", "evidenceTypes": [ "Membership
certificates/cards", "Documentation of association's selection criteria", "Evidence that
membership requires outstanding achievement", "Bylaws or rules showing exclusive nature of
membership", "Letters from association officials", "Evidence of evaluation by experts",
"Documentation of association's prestige" ], "evidenceWeighting": [ {"type": "Membership proof",
"weight": "Required"}, {"type": "Association's selection criteria", "weight": "25%"}, {"type":
"Evidence of achievement requirement", "weight": "25%"}, {"type": "Bylaws/rules on exclusivity",
"weight": "15%"}, {"type": "Letters from association officials", "weight": "15%"}, {"type": "Evidence
of expert evaluation", "weight": "10%"}, {"type": "Documentation of association prestige",
"weight": "10%"} ], "strongEvidence": "Fellowship/membership in elite scientific/professional
societies requiring nomination and peer evaluation; documented selection criteria requiring
outstanding achievements", "weakEvidence": "Standard professional memberships based on
education/fee payment; memberships without documented selection criteria; union
memberships" }, { "id": "EB1A-3", "name": "Published Material About the Beneficiary",
"maxPoints": 25, "description": "Published material about the person in professional or major
trade publications or other major media, relating to their work in the field.", "evidenceTypes": [
"Complete copies of articles/publications", "Evidence of publication significance (circulation data,
impact factor)", "Translations with certification (if applicable)", "Documentation that material
focuses on beneficiary", "Evidence of author's credentials", "Publication metadata (date, author,
title)", "Evidence of media outlet prestige" ], "evidenceWeighting": [ {"type": "Complete
publication copies", "weight": "Required"}, {"type": "Publication significance evidence", "weight":
"20%"}, {"type": "Focus on beneficiary", "weight": "20%"}, {"type": "Author credentials", "weight":
"15%"}, {"type": "Publication metadata", "weight": "15%"}, {"type": "Media outlet prestige",
"weight": "15%"}, {"type": "Translations if needed", "weight": "15%"} ], "strongEvidence": "Feature
articles about the person's work in recognized publications; profiles in major media; substantive
discussion of the person's achievements", "weakEvidence": "Press releases issued by
employer; brief mentions or quotes in articles; publications without evidence of significance; self-
promotional material" }, { "id": "EB1A-4", "name": "Participation as Judge of the Work of Others",
"maxPoints": 25, "description": "Participation as a judge of the work of others in the same or an
allied field of specialization.", "evidenceTypes": [ "Invitation letters to serve as judge", "Program
materials listing beneficiary as judge", "Documentation of selection criteria for judges",
"Evidence of event/competition prestige", "Letters confirming judging role", "Peer review
evidence (journal reviews)", "Grant review panel documentation", "Editorial board appointments"
], "evidenceWeighting": [ {"type": "Official invitation/appointment documents", "weight":
"Required"}, {"type": "Program materials", "weight": "20%"}, {"type": "Judge selection criteria",
"weight": "20%"}, {"type": "Event/competition prestige", "weight": "15%"}, {"type": "Confirmation
letters", "weight": "15%"}, {"type": "Documentation of specialized knowledge", "weight": "15%"},
{"type": "Evidence of responsibility level", "weight": "15%"} ], "strongEvidence": "Journal peer
reviewer with documentation from editors; dissertation committee service; competition judge
with formal invitation; grant panel reviewer", "weakEvidence": "Informal judging without
documentation; supervising employees; mentoring; judging claims without evidence of actual
participation" }, { "id": "EB1A-5", "name": "Original Contributions of Major Significance",
"maxPoints": 25, "description": "Original scientific, scholarly, artistic, athletic, or business-related
contributions of major significance in the field.", "evidenceTypes": [ "Expert letters describing
contributions", "Patents and commercialization evidence", "Citation indices and patterns",
"Documentation of implementation by others", "Evidence of influence on field direction",
"Testimonials from independent experts", "Media coverage of contributions", "Commercial
success metrics", "Policy impacts" ], "evidenceWeighting": [ {"type": "Expert letters from
independent sources", "weight": "20%"}, {"type": "Patents/intellectual property", "weight": "15%"},
{"type": "Citation evidence", "weight": "15%"}, {"type": "Implementation evidence", "weight":
"15%"}, {"type": "Field direction influence", "weight": "15%"}, {"type": "Commercial/practical
impact metrics", "weight": "10%"}, {"type": "Media/industry recognition", "weight": "10%"} ],
"strongEvidence": "High citation counts with field benchmarks; patents with evidence of
utilization; documented implementation of innovations; multiple independent expert testimonials
with specific impact examples", "weakEvidence": "Claims of future impact without current

evidence; vague testimonials without specifics; patents without evidence of usage/significance;
contributions without demonstrated recognition" }, { "id": "EB1A-6", "name": "Authorship of
Scholarly Articles", "maxPoints": 25, "description": "Authorship of scholarly articles in the field, in
professional or major trade publications or other major media.", "evidenceTypes": [ "Complete
copies of articles", "Journal/publication impact factors", "Citation data for articles", "Evidence of
peer review process", "Documentation of authorship role", "Publication acceptance rates",
"Evidence of journal/publication prestige", "Invited article documentation" ],
"evidenceWeighting": [ {"type": "Complete article copies", "weight": "Required"}, {"type":
"Journal/publication impact factors", "weight": "20%"}, {"type": "Citation metrics", "weight":
"20%"}, {"type": "Peer review evidence", "weight": "15%"}, {"type": "Authorship role clarification",
"weight": "15%"}, {"type": "Publication prestige evidence", "weight": "15%"}, {"type": "Acceptance
rate documentation", "weight": "15%"} ], "strongEvidence": "Publications in high-impact, peer-
reviewed journals; well-cited articles; publications in prestigious outlets with documented
significance", "weakEvidence": "Non-scholarly publications; brief abstracts; blog posts without
evidence of significance; publications without evidence of impact/prestige" }, { "id": "EB1A-7",
"name": "Display at Artistic Exhibitions/Showcases", "maxPoints": 25, "description": "Display of
the person's work at artistic exhibitions or showcases (primarily for arts fields).",
"evidenceTypes": [ "Exhibition catalogs/programs", "Documentation of exhibition significance",
"Media coverage of exhibitions", "Selection process for exhibitions", "Letters from
curators/organizers", "Visitor/audience metrics", "Evidence of exhibition prestige" ],
"evidenceWeighting": [ {"type": "Exhibition documentation", "weight": "Required"}, {"type":
"Exhibition significance evidence", "weight": "25%"}, {"type": "Selection process", "weight":
"20%"}, {"type": "Media coverage", "weight": "15%"}, {"type": "Curator/organizer letters",
"weight": "15%"}, {"type": "Audience metrics", "weight": "15%"}, {"type": "Venue prestige
evidence", "weight": "10%"} ], "strongEvidence": "Work displayed in major museums/galleries;
juried exhibitions with documented prestige; featured roles in significant
performances/showcases", "weakEvidence": "Non-artistic displays (scientific posters, etc.);
local/community exhibitions without evidence of significance; student exhibitions" }, { "id":
"EB1A-8", "name": "Leading/Critical Role for Distinguished Organizations", "maxPoints": 25,
"description": "Performance of a leading or critical role for organizations or establishments that
have a distinguished reputation.", "evidenceTypes": [ "Employment verification letters",
"Organization charts showing position", "Evidence of organization's distinguished reputation",
"Documentation of role's critical nature", "Letters describing accomplishments in role", "Project
success metrics under leadership", "Team size/budget responsibility evidence", "Organization
awards/recognition" ], "evidenceWeighting": [ {"type": "Employment verification", "weight":
"Required"}, {"type": "Organization reputation evidence", "weight": "20%"}, {"type": "Position
description", "weight": "20%"}, {"type": "Organizational structure documentation", "weight":
"15%"}, {"type": "Letters from superiors", "weight": "15%"}, {"type": "Role significance evidence",
"weight": "15%"}, {"type": "Success metrics in role", "weight": "15%"} ], "strongEvidence":
"Leadership role with documented impact at prestigious organization; evidence of critical
contributions to organization's success; leadership of significant teams/projects with measurable
outcomes", "weakEvidence": "Mid-level roles without evidence of impact; roles at organizations
without evidence of distinguished reputation; titles without context of responsibilities" }, { "id":
"EB1A-9", "name": "High Salary/Remuneration", "maxPoints": 25, "description": "Command of a
high salary or other significantly high remuneration for services, in relation to others in the field.",
"evidenceTypes": [ "Salary verification (offer letters, contracts)", "Tax returns/W-2 forms",
"Comparative salary data for field", "Geographic-specific salary comparisons", "Letters from
industry experts on compensation", "Bureau of Labor Statistics data", "Industry salary surveys",
"Evidence of additional compensation (equity, etc.)" ], "evidenceWeighting": [ {"type": "Salary
verification documents", "weight": "Required"}, {"type": "Comparative salary data", "weight":
"25%"}, {"type": "Geographic-specific comparisons", "weight": "20%"}, {"type": "Expert letters on
compensation", "weight": "15%"}, {"type": "BLS or official statistics", "weight": "15%"}, {"type":
"Industry surveys", "weight": "15%"}, {"type": "Additional compensation evidence", "weight":
"10%"} ], "strongEvidence": "Documented salary/compensation significantly above field norms
(e.g., 90th percentile) with proper comparative data; equity/alternative compensation with clear
valuation evidence", "weakEvidence": "Salary without comparative context; slightly above-
average compensation; broad comparisons not specific to field/location; unverifiable

compensation claims" }, { "id": "EB1A-10", "name": "Commercial Success in Performing Arts",
"maxPoints": 25, "description": "Commercial success in the performing arts, as shown by box
office receipts or record, cassette, compact disk, or video sales.", "evidenceTypes": [ "Box office
records/receipts", "Album/recording sales figures", "Streaming/download statistics",
"Certifications (Gold/Platinum records)", "Ticket sales documentation", "Comparative
commercial performance data", "Royalty statements", "Contracts with commercial terms" ],
"evidenceWeighting": [ {"type": "Commercial success documentation", "weight": "Required"},
{"type": "Comparative industry data", "weight": "25%"}, {"type": "Sales/revenue verification",
"weight": "20%"}, {"type": "Official certifications", "weight": "15%"}, {"type": "Media coverage of
success", "weight": "15%"}, {"type": "Field context", "weight": "15%"}, {"type": "Sustained
commercial performance", "weight": "10%"} ], "strongEvidence": "Verified high box office
receipts; certified gold/platinum records; documented top-selling performances with comparative
context; evidence of commercial success relative to industry standards", "weakEvidence":
"Modest sales/attendance without industry context; local/limited commercial success; unverified
claims without supporting documentation" } ] }, { "pathType": "comparable_evidence",
"requirement": "Used when standard criteria do not readily apply to the occupation; must satisfy
at least three comparable criteria with explanation of why standard criteria don't apply.",
"criteria": [ { "id": "EB1A-C1", "originalCriterion": "Prizes/Awards", "maxPoints": 25,
"evidenceTypes": [ "Recognition in fields without formal awards", "Selection for elite
programs/residencies", "Competitive grants/fellowships", "Ranked placements in significant
competitions", "Special designations by industry groups", "Funded research proposals with low
acceptance rates" ], "evidenceWeighting": [ {"type": "Documentation of recognition", "weight":
"Required"}, {"type": "Evidence of competitive selection", "weight": "25%"}, {"type": "Prestige of
recognizing entity", "weight": "25%"}, {"type": "Selectivity metrics", "weight": "20%"}, {"type":
"Field expert letters", "weight": "15%"}, {"type": "Comparative significance evidence", "weight":
"15%"} ] }, { "id": "EB1A-C2", "originalCriterion": "Membership in Associations", "maxPoints": 25,
"evidenceTypes": [ "Invitation to exclusive research groups", "Selection for limited-access
platforms/communities", "Invitation-only think tanks or consortia", "Access to restricted
facilities/resources", "Special clearances or credentials", "Exclusive professional networks with
vetting" ], "evidenceWeighting": [ {"type": "Documentation of exclusive access", "weight":
"Required"}, {"type": "Selectivity of group/platform", "weight": "25%"}, {"type": "Vetting process
evidence", "weight": "25%"}, {"type": "Reputation of organizing entity", "weight": "20%"}, {"type":
"Expert confirmation letters", "weight": "15%"}, {"type": "Evidence of exclusive nature", "weight":
"15%"} ] }, { "id": "EB1A-C3", "originalCriterion": "Published Material", "maxPoints": 25,
"evidenceTypes": [ "Online platforms with significant followings", "Specialized industry
databases/references", "Case studies featuring the beneficiary", "Industry standard
documentation citing work", "Inclusion in educational materials/curricula", "Digital media with
verifiable metrics", "Product documentation referencing contributions" ], "evidenceWeighting": [
{"type": "Complete documentation", "weight": "Required"}, {"type": "Platform/venue significance",
"weight": "25%"}, {"type": "Focus on beneficiary", "weight": "20%"}, {"type": "Audience/reach
metrics", "weight": "20%"}, {"type": "Expert verification letters", "weight": "15%"}, {"type":
"Evidence of recognition quality", "weight": "20%"} ] }, { "id": "EB1A-C4", "originalCriterion":
"Judging Work of Others", "maxPoints": 25, "evidenceTypes": [ "Technical mentorship programs
with selection", "Code/design review responsibilities", "Technology stack decision authority",
"Quality assurance gate responsibilities", "Security review authority", "Incubator/accelerator
selection committees", "Product/feature approval authority" ], "evidenceWeighting": [ {"type":
"Official authorization documentation", "weight": "Required"}, {"type": "Selection for evaluation
role", "weight": "25%"}, {"type": "Impact of evaluation decisions", "weight": "25%"}, {"type":
"Specialized expertise requirement", "weight": "15%"}, {"type": "Scope of evaluation authority",
"weight": "15%"}, {"type": "Organization reputation", "weight": "20%"} ] }, { "id": "EB1A-C5",
"originalCriterion": "Original Contributions", "maxPoints": 25, "evidenceTypes": [ "User adoption
metrics for innovations", "Industry standard proposals/implementations", "Performance
improvements with metrics", "Technical debt reduction measurements", "System reliability
improvements", "Cost reduction innovations", "Process optimization metrics", "Security
vulnerability discoveries" ], "evidenceWeighting": [ {"type": "Contribution documentation",
"weight": "Required"}, {"type": "Adoption/implementation evidence", "weight": "25%"}, {"type":
"Measurable impact metrics", "weight": "25%"}, {"type": "Independent verification", "weight":

"20%"}, {"type": "Field expert testimonials", "weight": "15%"}, {"type": "Evidence of originality",
"weight": "15%"} ] }, { "id": "EB1A-C6", "originalCriterion": "Scholarly Articles", "maxPoints": 25,
"evidenceTypes": [ "Open-source contributions with wide adoption", "Technical documentation
with high impact", "White papers with industry influence", "Product specifications defining
standards", "Technical blog posts with significant readership", "Data visualizations with
educational impact", "Technical talks with substantial viewership" ], "evidenceWeighting": [
{"type": "Complete contribution documentation", "weight": "Required"}, {"type": "Adoption/usage
metrics", "weight": "25%"}, {"type": "Impact measurements", "weight": "20%"}, {"type": "Peer
recognition evidence", "weight": "20%"}, {"type": "Expert verification of significance", "weight":
"15%"}, {"type": "Evidence of knowledge advancement", "weight": "20%"} ] }, { "id": "EB1A-C7",
"originalCriterion": "Artistic Exhibitions", "maxPoints": 25, "evidenceTypes": [ "Digital portfolio
with substantial viewership", "Virtual/augmented reality exhibitions", "Trade show
demonstrations of innovation", "Product launch showcases", "Technology demonstrations at
major events", "Interactive installations with significant audience" ], "evidenceWeighting": [
{"type": "Exhibition documentation", "weight": "Required"}, {"type": "Audience/engagement
metrics", "weight": "25%"}, {"type": "Selection/invitation evidence", "weight": "20%"}, {"type":
"Impact documentation", "weight": "20%"}, {"type": "Expert verification letters", "weight": "15%"},
{"type": "Venue/platform prestige", "weight": "20%"} ] }, { "id": "EB1A-C8", "originalCriterion":
"Critical Employment", "maxPoints": 25, "evidenceTypes": [ "Technical lead for open-source
projects", "Community leadership roles", "Platform/technology evangelism positions",
"Standards committee participation", "Advisory roles for technical organizations", "Founding
technical roles in startups", "Special project leadership positions" ], "evidenceWeighting": [
{"type": "Role documentation", "weight": "Required"}, {"type": "Organization/project significance",
"weight": "25%"}, {"type": "Leadership evidence", "weight": "25%"}, {"type": "Impact of
contribution", "weight": "15%"}, {"type": "Selection process for role", "weight": "15%"}, {"type":
"Expert verification of criticality", "weight": "20%"} ] }, { "id": "EB1A-C9", "originalCriterion": "High
Salary", "maxPoints": 25, "evidenceTypes": [ "Equity compensation with valuation", "Profit-
sharing arrangements", "Royalty/licensing agreements", "Special compensation packages",
"Non-traditional value exchange", "Revenue percentage agreements", "User/subscriber-based
compensation models" ], "evidenceWeighting": [ {"type": "Compensation documentation",
"weight": "Required"}, {"type": "Valuation evidence", "weight": "25%"}, {"type": "Comparative
value analysis", "weight": "25%"}, {"type": "Expert verification of value", "weight": "15%"}, {"type":
"Evidence of exceptional nature", "weight": "15%"}, {"type": "Field-specific context", "weight":
"20%"} ] }, { "id": "EB1A-C10", "originalCriterion": "Commercial Success", "maxPoints": 25,
"evidenceTypes": [ "App downloads/active users", "User engagement metrics", "Digital content
monetization", "E-commerce conversion rates", "Platform-specific success indicators",
"Subscription/membership growth", "Online marketplace performance" ], "evidenceWeighting": [
{"type": "Success metrics documentation", "weight": "Required"}, {"type": "Industry comparative
data", "weight": "25%"}, {"type": "Revenue/usage verification", "weight": "20%"}, {"type": "Growth
trajectory evidence", "weight": "15%"}, {"type": "Media/industry recognition", "weight": "15%"},
{"type": "Expert verification letters", "weight": "25%"} ] } ] } ], "thresholds": { "standardEvidence": [
{"likelihood": "Strong Approval", "pointRange": "85-200", "description": "Evidence substantially
exceeds requirements, demonstrating overwhelming case for extraordinary ability. Satisfies at
least 4 criteria strongly (20+ pts) or 3 exceptionally (23+ pts)."}, {"likelihood": "Likely Approval",
"pointRange": "70-84", "description": "Evidence clearly meets requirements, presenting a
convincing case. Satisfies at least 3 criteria solidly (18+ pts) with strong final merits support."},
{"likelihood": "Borderline Case", "pointRange": "55-69", "description": "Evidence meets minimum
requirements but may have weaknesses in final merits determination. Satisfies 3 criteria, but
quality inconsistent (avg 15-17 pts). High RFE risk."}, {"likelihood": "Likely Denial", "pointRange":
"0-54", "description": "Evidence fails to meet minimum requirements. Either fails to satisfy 3
criteria or evidence is weak/unconvincing (<15 pts per criterion) or final merits determination is
unfavorable."} ], "comparableEvidence": [ {"likelihood": "Strong Approval", "pointRange": "80-
200", "description": "Comparable evidence substantially demonstrates extraordinary ability.
Compelling explanation of criteria inapplicability and exceptionally strong evidence (min 20+ pts
for 3 criteria)."}, {"likelihood": "Likely Approval", "pointRange": "65-79", "description":
"Comparable evidence clearly demonstrates extraordinary ability. Convincing explanation and
strong evidence (min 18+ pts for 3 criteria)."}, {"likelihood": "Borderline Case", "pointRange":

"50-64", "description": "Comparable evidence minimally demonstrates ability. Adequate
explanation of inapplicability, inconsistent quality (avg 15-17 pts). High RFE risk."}, {"likelihood":
"Likely Denial", "pointRange": "0-49", "description": "Comparable evidence fails to demonstrate
ability. Lacks adequate explanation of criteria inapplicability or evidence is weak (<15 pts)."} ] },
"finalMeritsAdjustmentFactors": [ {"factor": "Field Standing", "pointImpact": "-10 to +10",
"description": "Assessment of beneficiary's standing relative to others. Top tier in field (+5 to
+10), accomplished but not elite (-5 to +5), not at top tier (-10 to -5)."}, {"factor": "Acclaim
Consistency", "pointImpact": "-10 to +10", "description": "Evaluation of sustained acclaim.
Consistent over years (+5 to +10), recent/sporadic (0 to +5), limited/brief (-10 to 0)."}, {"factor":
"Independent Verification", "pointImpact": "-10 to +10", "description": "Assessment of
independent sources. Strong independent verification (+5 to +10), limited independent (0 to +5),
primarily self-serving (-10 to 0)."}, {"factor": "Evidence Relevance", "pointImpact": "-10 to +10",
"description": "Evaluation of directness to extraordinary ability. Directly related (+5 to +10),
somewhat related (0 to +5), tangential/minimal relevance (-10 to 0)."} ], "kazarianProcess": {
"description": "The two-step Kazarian framework for adjudication as mandated by USCIS
policy.", "step1": { "name": "Initial Evidence Evaluation", "description": "Objective determination
of whether evidence meets at least 3 of 10 regulatory criteria.", "standard": "Preponderance of
the evidence (more likely than not) that each claimed criterion is satisfied.", "considerations": [
"Each criterion is evaluated independently on its own merits", "Quality is considered only to
determine if criterion requirements are met", "No evaluation of overall acclaim at this stage",
"Must meet at least 3 criteria to proceed to Step 2", "One-time major award automatically
qualifies for Step 2" ] }, "step2": { "name": "Final Merits Determination", "description": "Holistic
assessment of whether totality of evidence demonstrates extraordinary ability.", "standard":
"Preponderance of evidence that petitioner has sustained national/international acclaim and is
among small percentage at top of field.", "considerations": [ "All evidence considered in totality,
including evidence not specifically claimed under criteria", "Quality and significance of
accomplishments evaluated in field context", "Sustained acclaim over time must be
demonstrated", "Evidence must show petitioner is among elite few at top of field", "Meeting 3
criteria does not guarantee approval; totality must convince officer of extraordinary ability" ] } },
"fieldSpecificGuidance": { "sciences": { "description": "Including natural sciences, medicine,
engineering, mathematics, etc.", "specificConsiderations": [ "Citation metrics are particularly
important - provide benchmarks for field/subfield", "Patent utilization and commercialization
evidence strengthens contributions", "Peer review activities should be documented with journal
quality metrics", "Expert letters should include specifics about how work changed field
practices", "Journal impact factors and publication metrics enhance scholarly articles criterion" ],
"evidenceExamples": [ "Citation reports showing ranking compared to peers in field", "Patents
with licensing/implementation documentation", "Journal peer review invitations with confirmation
of completion", "Grant awards with selection rate information", "Software/algorithms with
documented industry adoption", "Clinical protocol changes based on research" ],
"commonRFEIssues": [ "Failure to demonstrate research impact beyond publication",
"Insufficient context for citation metrics", "Letters lacking specific examples of contribution
impact", "Unclear delineation of individual contribution in team research" ], "benchmarks": {
"citations": { "exceptional": {"description": "Top 5% in field", "examples": {"Biology": ">500 total,
h-index >25", "Chemistry": ">400 total, h-index >22", "Physics": ">350 total, h-index >20",
"Mathematics": ">200 total, h-index >15"}}, "strong": {"description": "Top 10% in field",
"examples": {"Biology": "300-500 total, h-index 20-25", "Chemistry": "250-400 total, h-index 18-
22", "Physics": "200-350 total, h-index 15-20", "Mathematics": "100-200 total, h-index 10-15"}},
"moderate": {"description": "Top 25% in field", "examples": {"Biology": "150-300 total, h-index 15-
20", "Chemistry": "120-250 total, h-index 14-18", "Physics": "100-200 total, h-index 10-15",
"Mathematics": "50-100 total, h-index 7-10"}} }, "journalImpact": { "exceptional": {"description":
"Top tier journals", "examples": {"Medicine": "NEJM, Lancet, JAMA (IF>30)", "Biology": "Cell,
Nature, Science (IF>20)", "Engineering": "Nature Materials, Advanced Materials (IF>15)"}},
"strong": {"description": "High-impact specialized journals", "examples": {"Medicine":
"Specialized journals (IF 10-30)", "Biology": "Field-leading journals (IF 10-20)", "Engineering":
"Top field journals (IF 5-15)"}}, "moderate": {"description": "Respected peer-reviewed journals",
"examples": {"Medicine": "Peer-reviewed journals (IF 5-10)", "Biology": "Established journals (IF
5-10)", "Engineering": "Standard field journals (IF 3-5)"}} }, "grants": { "exceptional":

{"description": "Principal Investigator on major grants", "examples": {"NIH R01": ">$1M", "NSF":
">$500K", "DOE": ">$750K"}}, "strong": {"description": "PI or Co-PI on competitive grants",
"examples": {"NIH R21": "$250K-$1M", "NSF": "$100K-$500K", "Foundation": "$100K-$500K"}},
"moderate": {"description": "Key personnel on grants", "examples": {"Institutional grants":
"$50K-$250K", "Early career awards": "$50K-$150K", "Foundation": "$25K-$100K"}} } } },
"business": { "description": "Including executives, entrepreneurs, finance, management, etc.",
"specificConsiderations": [ "Leading/critical role criterion often central - must show organization's
reputation", "High salary must be contextualized with industry-specific comparisons", "Equity
and alternative compensation can substitute for salary with proper valuation", "Startup founders
should emphasize company valuation, funding, and achievements", "Original contributions
should show quantifiable business impact" ], "evidenceExamples": [ "Company valuation
documentation and funding rounds", "Market share growth under leadership",
"Revenue/profitability metrics attributed to innovations", "Comparative compensation data with
industry percentiles", "Media coverage in major business publications", "Industry awards with
selection criteria" ], "commonRFEIssues": [ "Insufficient evidence of organization's distinguished
reputation", "Failure to document critical nature of role beyond title", "High salary claims without
proper industry/geographic context", "Difficulty establishing field-wide recognition vs. company-
specific success" ], "benchmarks": { "companyMetrics": { "exceptional": {"description": "Leading
companies/unicorns", "examples": {"Valuation": ">$500M", "Revenue growth": ">100%
annually", "Market share": "Industry leader (top 3)"}}, "strong": {"description": "Successful
established businesses", "examples": {"Valuation": "$50M-$500M", "Revenue growth": "50-100%
annually", "Market share": "Significant presence (top 10)"}}, "moderate": {"description": "Growing
companies", "examples": {"Valuation": "$5M-$50M", "Revenue growth": "25-50% annually",
"Market share": "Notable competitor"}} }, "funding": { "exceptional": {"description": "Major
funding/investment", "examples": {"Venture capital": "Series C+ ($30M+)", "Private equity":
"Major investment ($50M+)", "IPO/acquisition": "Successful exit ($100M+)"}}, "strong":
{"description": "Significant funding", "examples": {"Venture capital": "Series A/B ($5M-$30M)",
"Angel investment": "Large round ($1M-$5M)", "Strategic partnership": "Major corporate
partner"}}, "moderate": {"description": "Early funding", "examples": {"Seed funding":
"$500K-$2M", "Angel investment": "$250K-$1M", "Grants/competitions": "$100K-$500K"}} },
"salary": { "exceptional": {"description": "Top 1% compensation", "examples": {"Technology
exec": ">$500K base + equity", "Finance": ">$750K total comp", "Management": ">$400K +
significant bonus"}}, "strong": {"description": "Top 5% compensation", "examples": {"Technology
exec": "$300K-$500K + equity", "Finance": "$400K-$750K total comp", "Management":
"$250K-$400K + bonus"}}, "moderate": {"description": "Top 10% compensation", "examples":
{"Technology exec": "$200K-$300K + equity", "Finance": "$250K-$400K total comp",
"Management": "$180K-$250K + bonus"}} } } }, "arts": { "description": "Including fine arts,
performing arts, design, literature, etc.", "specificConsiderations": [ "Exhibitions/showcases
criterion central for visual/performing artists", "Commercial success important for performing
artists", "Critical reviews from recognized publications strengthen case", "Awards should be
contextualized with information about prestige/selectivity", "Original contributions may focus on
artistic innovation and influence" ], "evidenceExamples": [ "Exhibition catalogs from major
galleries/museums", "Performance recordings with audience/venue documentation", "Sales/box
office figures with comparative industry data", "Critical reviews in major publications",
"Commissioning agreements with prestigious institutions", "Evidence of artistic style influence on
field" ], "commonRFEIssues": [ "Local vs. national/international recognition confusion",
"Insufficient documentation of exhibition/venue prestige", "Commercial success claims without
comparative context", "Difficulty quantifying artistic influence" ], "benchmarks": { "exhibitions": {
"exceptional": {"description": "Elite venues/events", "examples": {"Visual arts": "Major museums
(MoMA, Tate, etc.)", "Performance": "Carnegie Hall, Kennedy Center", "Design": "Major
international exhibitions"}}, "strong": {"description": "Important venues", "examples": {"Visual
arts": "Established galleries, regional museums", "Performance": "Professional symphony halls,
theaters", "Design": "Industry showcases, design weeks"}}, "moderate": {"description":
"Professional venues", "examples": {"Visual arts": "Commercial galleries, juried exhibitions",
"Performance": "Mid-size theaters, festivals", "Design": "Professional showcases"}} }, "sales": {
"exceptional": {"description": "Major commercial success", "examples": {"Visual art": ">$100K
per work, auction presence", "Music": "Gold/platinum records, major streaming numbers",

"Books": "Bestseller lists, major sales"}}, "strong": {"description": "Successful professional",
"examples": {"Visual art": "$20K-$100K per work", "Music": "Strong sales/streaming across
markets", "Books": "Strong sales, multiple printings"}}, "moderate": {"description": "Established
professional", "examples": {"Visual art": "$5K-$20K per work", "Music": "Commercial releases
with measurable audience", "Books": "Commercial publication with decent sales"}} }, "reviews": {
"exceptional": {"description": "Major critical acclaim", "examples": {"Major publications": "NY
Times, Guardian, etc.", "Scope": "Feature articles, major reviews", "Tone": "Recognized as
leader/innovator"}}, "strong": {"description": "Positive critical reception", "examples":
{"Publications": "Respected field journals/media", "Scope": "Dedicated reviews", "Tone": "Strong
positive assessment"}}, "moderate": {"description": "Professional recognition", "examples":
{"Publications": "Industry/regional publications", "Scope": "Mentions in larger pieces", "Tone":
"Positive acknowledgment"}} } } }, "technology": { "description": "Including software, IT, digital
innovation, etc.", "specificConsiderations": [ "Comparable evidence often useful for non-
academic accomplishments", "Open source contributions can substitute for scholarly articles",
"User metrics/adoption rate demonstrate impact of innovations", "Technical presentations at
major conferences show field recognition", "Industry standards contributions show field-wide
impact" ], "evidenceExamples": [ "GitHub repository statistics (stars, forks, contributors)", "User
adoption metrics with industry context", "Codebases/systems with documented wide
implementation", "Conference presentation invitations for major industry events", "Technical blog
posts with significant readership metrics", "Technology standard contributions with adoption
evidence" ], "commonRFEIssues": [ "Insufficient explanation for comparable evidence use",
"Failure to demonstrate technical innovation beyond implementation", "Difficulty proving
individual contribution in collaborative projects", "Incomplete documentation of adoption/impact
metrics" ], "benchmarks": { "codeContributions": { "exceptional": {"description": "Major impact
projects", "examples": {"GitHub metrics": ">5K stars, >1K forks", "Contributors": "Core
contributor to major library/tool", "Adoption": "Industry-standard technology"}}, "strong":
{"description": "Significant projects", "examples": {"GitHub metrics": "1K-5K stars, 250-1K forks",
"Contributors": "Key contributor to important projects", "Adoption": "Widely used in industry"}},
"moderate": {"description": "Recognized projects", "examples": {"GitHub metrics": "250-1K stars,
50-250 forks", "Contributors": "Regular contributor to established projects", "Adoption": "Used by
multiple companies/teams"}} }, "techInnovations": { "exceptional": {"description": "Revolutionary
innovations", "examples": {"Patents": "Foundational technology with licensing", "Adoption":
"Industry-changing implementation", "Impact": "Creates new market/capability"}}, "strong":
{"description": "Important innovations", "examples": {"Patents": "Significant improvements with
implementation", "Adoption": "Widely implemented technology", "Impact": "Major
efficiency/capability improvement"}}, "moderate": {"description": "Valuable innovations",
"examples": {"Patents": "Useful improvements with some adoption", "Adoption": "Implementation
at several companies", "Impact": "Measurable improvement to existing processes"}} },
"techReach": { "exceptional": {"description": "Industry-wide influence", "examples": {"Tech talks":
"Keynote at major conferences", "Blog posts": ">100K readers, widely shared",
"Courses/tutorials": "Industry standard learning resources"}}, "strong": {"description": "Significant
reach", "examples": {"Tech talks": "Speaker at established conferences", "Blog posts": "25K-
100K readers", "Courses/tutorials": "Popular learning resources"}}, "moderate": {"description":
"Professional reach", "examples": {"Tech talks": "Regular conference presenter", "Blog posts":
"5K-25K readers", "Courses/tutorials": "Useful learning resources with audience"}} } } },
"education": { "description": "Including professors, researchers, educational innovation, etc.",
"specificConsiderations": [ "Teaching excellence alone insufficient - must show field-wide
impact", "Publication citation metrics important for academic positions", "Grant funding as
evidence of recognition in field", "Educational innovations must show adoption beyond home
institution", "Editorial roles demonstrate field recognition" ], "evidenceExamples": [ "Citation
metrics for publications with field benchmarks", "Grant award documentation with selection
rates", "Invited lectures at prestigious institutions", "Educational methods with documented
adoption by other institutions", "Dissertation committee service across institutions", "Leadership
in academic professional organizations" ], "commonRFEIssues": [ "Focusing on teaching
excellence rather than field-wide impact", "Limited evidence of recognition outside home
institution", "Insufficient documentation of academic reputation metrics", "Confusing institutional
service with field-wide recognition" ], "benchmarks": { "academicRoles": { "exceptional":

{"description": "Elite academic positions", "examples": {"Faculty rank": "Full Professor at
research university", "Chair/Director": "Department Chair, Center Director", "Reputation": "Top-
tier institution in field"}}, "strong": {"description": "Established academic positions", "examples":
{"Faculty rank": "Associate Professor at research university", "Leadership": "Program Director,
Graduate Coordinator", "Reputation": "Strong research institution"}}, "moderate": {"description":
"Academic positions", "examples": {"Faculty rank": "Assistant Professor or Associate at teaching
institution", "Roles": "Significant committee responsibilities", "Reputation": "Accredited
institution"}} }, "teaching": { "exceptional": {"description": "Transformative educator", "examples":
{"Innovation": "Created widely-adopted teaching methods", "Recognition": "Major teaching
awards", "Impact": "Influence on educational standards"}}, "strong": {"description": "Outstanding
educator", "examples": {"Innovation": "Notable teaching methods adopted by others",
"Recognition": "Institutional/regional awards", "Impact": "Invited educational presentations"}},
"moderate": {"description": "Effective educator", "examples": {"Innovation": "Documented
teaching improvements", "Recognition": "Positive evaluations, local awards", "Impact":
"Mentorship success"}} }, "academicLeadership": { "exceptional": {"description": "Field-wide
influence", "examples": {"Professional orgs": "President/Chair of major organization",
"Conferences": "Chair of major international conference", "Journals": "Editor-in-Chief of leading
journal"}}, "strong": {"description": "Strong leadership roles", "examples": {"Professional orgs":
"Board member/officer", "Conferences": "Program committee for significant conferences",
"Journals": "Associate Editor or Editorial Board"}}, "moderate": {"description": "Active
leadership", "examples": {"Professional orgs": "Committee member", "Conferences": "Session
chair/organizer", "Journals": "Regular reviewer for respected journals"}} } } }, "athletics": {
"description": "Including athletes, coaches, sports science, etc.", "specificConsiderations": [
"Performance metrics must be contextualized with field rankings", "Coaching achievements can
be documented through athlete success", "Commercial endorsements can demonstrate field
recognition", "Media coverage of sporting achievements strengthens case",
"Olympic/international competition participation shows high level" ], "evidenceExamples": [
"Competition results with ranking information", "National/international team selection
documentation", "Coaching records with athlete achievement documentation", "Sports science
innovations with implementation evidence", "Media coverage in major sports publications",
"Commercial endorsement contracts with value metrics" ], "commonRFEIssues": [ "Failing to
demonstrate sustained achievement at highest level", "Insufficient context for performance
metrics", "Local vs. international recognition confusion", "Difficulty proving coaching contribution
to athlete success" ], "benchmarks": { "competition": { "exceptional": {"description": "Elite
competitor", "examples": {"Olympics/World": "Medalist, finalist", "Professional": "Top-tier league
star player", "Rankings": "Top 20 world ranking"}}, "strong": {"description": "High-level
competitor", "examples": {"Olympics/World": "Qualification, participant", "Professional": "First
division regular player", "Rankings": "Top 50-100 world ranking"}}, "moderate": {"description":
"Established competitor", "examples": {"International": "International competition experience",
"Professional": "Professional league player", "Rankings": "National ranking, regional
recognition"}} }, "coaching": { "exceptional": {"description": "Elite coach", "examples": {"Level":
"Olympic/World Championship coach", "Athletes": "Coached multiple elite athletes", "Results":
"Medal-winning athletes, champions"}}, "strong": {"description": "High-level coach", "examples":
{"Level": "National team, professional team", "Athletes": "Developed high-performing athletes",
"Results": "Consistent competitive success"}}, "moderate": {"description": "Established coach",
"examples": {"Level": "College, development programs", "Athletes": "Improved athlete
performance", "Results": "Regional/conference success"}} }, "sportScience": { "exceptional":
{"description": "Field-changing contributions", "examples": {"Innovation": "Widely-adopted
training methods", "Research": "Definitive studies in field", "Implementation": "Used by elite
programs/athletes"}}, "strong": {"description": "Significant contributions", "examples":
{"Innovation": "Important training modifications", "Research": "Well-cited research in field",
"Implementation": "Adopted by multiple programs"}}, "moderate": {"description": "Valuable
contributions", "examples": {"Innovation": "Useful technique improvements", "Research":
"Published research with application", "Implementation": "Documented performance
improvements"}} } } } }, "comparableEvidenceGuidance": { "description": "Guidelines for when
and how to properly use comparable evidence when standard criteria don't readily apply to
petitioner's occupation.", "requirements": [ "Must first demonstrate that at least one criterion

does not readily apply to occupation", "Explanation must be detailed, specific, and credible - not
generic claims", "Comparable evidence must be of similar caliber/significance to standard
criteria", "Cannot substitute for one-time major achievement - only for criteria in 3-out-of-10
path", "Still subject to final merits determination like standard criteria", "Cannot use to bypass
criteria that could apply but petitioner lacks evidence" ], "presentationGuidance": [ "Explicitly
label as 'Comparable Evidence in lieu of Criterion X'", "Two-part explanation required: (1) why
criterion doesn't apply, (2) why substitute evidence is comparable", "Include documentation that
standard criterion truly doesn't readily apply to field", "Provide supporting evidence that alternate
evidence is recognized sign of excellence", "Include expert testimony on why comparable
evidence demonstrates field recognition" ], "exampleScenarios": [ { "scenario": "Software
Engineer (Industry)", "inapplicableCriterion": "Scholarly Articles", "explanation": "In-house
proprietary code/research not publicly published", "comparableEvidence": "Major conference
presentations, technical blog posts with high traffic metrics, open-source contributions with wide
adoption", "documentationNeeded": "Invitation letters, viewership metrics, industry expert letters
confirming significance, adoption statistics" }, { "scenario": "Startup Founder",
"inapplicableCriterion": "High Salary", "explanation": "Founders often take minimal salary while
building company", "comparableEvidence": "Equity valuation, venture funding secured, company
valuation metrics", "documentationNeeded": "Investment documentation, valuation by
independent experts, comparative analysis to industry standards" }, { "scenario": "Athletic
Coach", "inapplicableCriterion": "Awards for Excellence", "explanation": "Coaches themselves
don't compete for medals/championships", "comparableEvidence": "Athletes' achievements
under coaching, selection to coach national teams", "documentationNeeded": "Athletes' results
documentation, coaching appointment letters, expert testimony on coaching contribution" }, {
"scenario": "Fashion Model", "inapplicableCriterion": "Scholarly Articles", "explanation": "Field
doesn't involve scholarly publication", "comparableEvidence": "Magazine covers/editorials in
major fashion publications, runway selection for top designers", "documentationNeeded":
"Publication evidence, designer selection letters, industry expert testimony, comparison to
industry elite" }, { "scenario": "Video Game Designer", "inapplicableCriterion": "Artistic
Exhibitions", "explanation": "Digital interactive media not traditionally exhibited in artistic
showcases", "comparableEvidence": "Game download/user metrics, critic reviews, industry
award recognition", "documentationNeeded": "User statistics with industry comparisons, review
compilation with source credibility, award significance documentation" } ] }, "policyUpdates": {
"description": "Recent USCIS policy updates affecting EB-1A adjudications (2019-2025).",
"updates": [ { "date": "September 2023", "title": "EB-1 Criteria Clarification", "summary":
"Expanded guidance on each criterion with specific examples, especially for STEM fields.",
"keyPoints": [ "Provided field-specific examples for each criterion", "Clarified comparable
evidence usage for certain occupations", "Added guidance on what constitutes 'major
significance' in contributions", "Expanded acceptable evidence for non-academic achievements"
], "impact": "More flexible approach to evidence requirements, especially for applicants outside
academia." }, { "date": "October 2024", "title": "Policy Manual Updates", "summary": "Further
clarifications on specific criteria and evidence interpretation.", "keyPoints": [ "Team awards now
explicitly counted under awards criterion if individual is named recipient", "Past memberships
(not just current) now allowed for membership criterion", "Published material criterion simplified -
no longer requires proof of work value in the article", "Artistic exhibitions criterion limited to
actual artistic displays, not scientific/business presentations" ], "impact": "Broader recognition of
collaborative achievements and simplified evidence requirements for certain criteria." } ] },
"commonRFEIssues": { "evidenceQuality": [ {"issue": "Insufficient context for achievements",
"mitigation": "Provide comparative metrics, field benchmarks, and independent validation"},
{"issue": "Lack of evidence for award/publication significance", "mitigation": "Include selection
criteria, circulation data, impact factors, and prestige indicators"}, {"issue": "Weak or generic
reference letters", "mitigation": "Obtain detailed, specific letters from independent experts with
concrete examples of impact"}, {"issue": "Self-promotional materials without verification",
"mitigation": "Include third-party validation from recognized sources"} ], "processIssues": [
{"issue": "Criteria claimed without sufficient evidence", "mitigation": "Focus on strongest 3-5
criteria with robust documentation rather than claiming all possible criteria"}, {"issue": "Poor
organization of evidence", "mitigation": "Use clear indexing, evidence mapping to criteria, and
summary tables"}, {"issue": "Missing evidence of sustained acclaim", "mitigation": "Demonstrate

continuous achievement over time, not just isolated accomplishments"}, {"issue": "Insufficient
explanation of comparable evidence", "mitigation": "Provide detailed, specific explanation of
criteria inapplicability and comparable significance"} ], "fieldSpecificIssues": [ {"issue":
"Academic achievements without wider impact", "mitigation": "Show recognition and
implementation beyond home institution"}, {"issue": "Business achievements without industry
context", "mitigation": "Provide industry metrics, market impact, and third-party validation"},
{"issue": "Technical contributions without adoption evidence", "mitigation": "Document
implementation, user metrics, and industry recognition"}, {"issue": "Artistic achievements without
recognition context", "mitigation": "Include critical reception, audience metrics, and comparison
to field leaders"} ] }, "finalMeritsConsiderations": { "description": "Key factors USCIS considers in
the Final Merits Determination after criteria are met.", "positiveFactors": [ {"factor": "High citation
counts relative to field", "impact": "Demonstrates work is highly valued by peers"}, {"factor":
"Publications in highest-impact journals", "impact": "Shows achievement at top tier of field"},
{"factor": "Experience at leading institutions", "impact": "Suggests petitioner is sought by elite
organizations"}, {"factor": "Invited talks at major conferences", "impact": "Indicates recognition as
expert by peers"}, {"factor": "Principal investigator on competitive grants", "impact": "Shows peer
recognition of research leadership"}, {"factor": "Continuous stream of achievements", "impact":
"Demonstrates sustained acclaim over time"}, {"factor": "Recognition across subfields", "impact":
"Shows broader impact beyond narrow specialization"}, {"factor": "Implementation of work by
others", "impact": "Proves real-world significance of contributions"} ], "negativeFactors": [
{"factor": "Achievements primarily in distant past", "impact": "Suggests lack of sustained recent
acclaim"}, {"factor": "Recognition limited to one institution", "impact": "Indicates lack of field-wide
impact"}, {"factor": "Achievements primarily as team member", "impact": "May obscure
individual's specific contributions"}, {"factor": "Limited independent verification", "impact":
"Reduces credibility of accomplishment claims"}, {"factor": "Evidence limited to potential/future
impact", "impact": "Fails to show actual realized significance"}, {"factor": "Minimal evidence
beyond meeting criteria", "impact": "May not prove being at very top of field"}, {"factor":
"Recognition in very narrow subfield", "impact": "May not demonstrate broader field
significance"} ], "bestPractices": [ "Include strong narrative tying evidence together into cohesive
story of excellence", "Provide clear benchmarking of achievements against field standards",
"Demonstrate continuous, recent, and ongoing recognition", "Include independent expert
verification from recognized authorities", "Show both depth (specialization) and breadth
(influence beyond niche)", "Address both quantity and quality of achievements with proper
context", "Focus on realized, not potential, impact and significance" ] },
"implementationSchema": { "description": "Framework for implementing an automated document
scoring tool to evaluate EB-1A petition strength.", "processingSteps": [ { "step": 1, "name":
"Document Intake and Classification", "description": "Initial processing of submitted documents
to identify evidence types", "actions": [ "OCR processing of physical documents", "Document
classification using NLP models", "Metadata extraction (dates, names, organizations)", "Initial
validation of document completeness" ], "n8nImplementation": { "nodes": [ { "name":
"DocumentOCRNode", "description": "Performs OCR on scanned documents and exports text in
searchable format", "parameters": { "resolution": "300dpi", "outputFormat": "text",
"languageDetection": true } }, { "name": "DocumentClassifierNode", "description": "Categorizes
documents by type and relevance to specific criteria", "parameters": { "classificationModel":
"EB1A-DocClassifier-v2", "confidenceThreshold": 0.75, "criteriaMapping": true } }, { "name":
"MetadataExtractorNode", "description": "Pulls relevant dates, names, and organizational
information", "parameters": { "entityRecognition": true, "dateNormalization": true,
"organizationValidation": true } } ] }, "confidenceScoring": { "formula": "0.4*OCRQuality +
0.4*ClassifierConfidence + 0.2*MetadataCompleteness", "thresholds": { "high": ">0.85",
"medium": "0.7-0.85", "low": "<0.7" }, "lowConfidenceAction": "Flag for human review of
document classification" } }, { "step": 2, "name": "Evidence Mapping", "description": "Matching
submitted evidence to specific EB-1A criteria", "actions": [ "Categorization of documents by
criteria relevance", "Identification of primary and supporting evidence", "Detection of evidence
gaps requiring additional documentation", "Cross-reference against field-specific guidelines" ],
"n8nImplementation": { "nodes": [ { "name": "CriteriaMapperNode", "description": "Maps
documents to specific criteria and identifies primary vs. supporting evidence", "parameters": {
"criteriaDefinitions": "EB1A_criteria_definitions.json", "relevanceThreshold": 0.65,

"primaryEvidenceThreshold": 0.8 } }, { "name": "GapAnalyzerNode", "description": "Identifies
missing or weak evidence areas", "parameters": { "requiredEvidenceTypes":
"EB1A_required_evidence.json", "minimumEvidencePerCriterion": 2, "criteriaWeightings":
"EB1A_criteria_weights.json" } }, { "name": "FieldSpecificValidatorNode", "description": "Applies
field-specific validation rules", "parameters": { "fieldDetection": true, "fieldRules":
"EB1A_field_specific_rules.json", "customValidators": true } } ] }, "documentRelevanceScoring": {
"primaryEvidence": "0.8-1.0 relevance score to criterion", "supportingEvidence": "0.4-0.79
relevance score to criterion", "weakEvidence": "0.2-0.39 relevance score to criterion",
"irrelevantEvidence": "<0.2 relevance score to criterion", "formula": "DocRelevance =
0.6*ContentSimilarity + 0.2*MetadataAlignment + 0.2*ContextualClues", "contributionFormula":
"DocContribution = DocRelevance * DocQuality * DocSignificance" }, "confidenceScoring": {
"formula": "0.5*AverageDocRelevance + 0.3*MappingCompleteness +
0.2*FieldProfileConfidence", "thresholds": { "high": ">0.8", "medium": "0.6-0.8", "low": "<0.6" },
"lowConfidenceAction": "Flag for human review of evidence mapping" } }, { "step": 3, "name":
"Kazarian Step 1: Criteria Scoring", "description": "Evaluating whether each claimed criterion is
met based on submitted evidence", "actions": [ "Assessment of evidence quality and
completeness for each criterion", "Application of evidence weightings from blueprint",
"Determination of whether each criterion is satisfied (binary)", "Calculation of strength score per
criterion (0-25 points)" ], "n8nImplementation": { "nodes": [ { "name": "EvidenceQualityNode",
"description": "Evaluates evidence quality for each document against criterion-specific
standards", "parameters": { "qualityMetrics": "EB1A_evidence_quality_metrics.json",
"documentWeighting": true, "sourceCredibilityScoring": true } }, }, { "name":
"CriteriaEvaluatorNode", "description": "Determines if each claimed criterion is satisfied (binary)
and calculates quality score", "parameters": { "criteriaDefinitions":
"EB1A_criteria_definitions.json", "evidenceWeightings": "EB1A_evidence_weights.json",
"thresholdForSatisfaction": 0.55 } }, { "name": "Step1SummarizerNode", "description": "Produces
summary of which criteria are met with corresponding point scores", "parameters": {
"criteriaCountThreshold": 3, "pointScale": "0-25", "confidenceMetrics": true } } ] },
"criterionScoreCalculation": { "formula": "CriterionScore = Sum(DocContribution) *
EvidenceCompletenessMultiplier * EvidenceQualityMultiplier",
"evidenceCompletenessMultiplier": { "allRequired": 1.0, "missingMinor": 0.8,
"missingSignificant": 0.5, "missingCritical": 0.1 }, "evidenceQualityMultiplier": { "exceptional": 1.2,
"strong": 1.0, "adequate": 0.8, "weak": 0.5, "insufficient": 0.2 }, "satisfactionThreshold": "15 points
generally required to satisfy a criterion" }, "confidenceScoring": { "formula":
"0.4*EvidenceCompleteness + 0.4*EvidenceQuality + 0.2*EvidenceConsistency", "thresholds": {
"high": ">0.8", "medium": "0.6-0.8", "low": "<0.6" }, "lowConfidenceAction": "Flag for human
review of criterion satisfaction determination" } }, { "step": 4, "name": "Kazarian Step 2: Final
Merits Determination", "description": "Holistic assessment of whether totality of evidence
demonstrates extraordinary ability", "actions": [ "Evaluation of sustained acclaim indicators",
"Analysis of comparative standing in field", "Assessment of independent verification strength",
"Calculation of field-specific context adjustments" ], "n8nImplementation": { "nodes": [ { "name":
"SustainedAcclaimNode", "description": "Analyzes chronology and consistency of
achievements", "parameters": { "timeframeAnalysis": true, "achievementContinuity": true,
"recentAccomplishmentWeight": 1.2 } }, { "name": "FieldComparisonNode", "description":
"Compares achievements to field benchmarks", "parameters": { "fieldBenchmarks":
"EB1A_field_benchmarks.json", "percentileCalculation": true, "fieldSpecificAdjustments": true } },
{ "name": "IndependentVerificationNode", "description": "Evaluates independence and credibility
of verification sources", "parameters": { "sourceIndependenceMetrics": true, "credibilityScoring":
true, "disinterestednessEvaluation": true } }, { "name": "FinalMeritsNode", "description":
"Calculates final merits adjustments", "parameters": { "adjustmentFactors":
"EB1A_adjustment_factors.json", "fieldSpecificContexts": true, "finalSynergyEvaluation": true } }
] }, "meritAdjustmentCalculation": { "fieldStanding": { "formula": "FS = (FieldPercentile * 0.7) +
(RecognitionBreadth * 0.3)", "topTier": "FS > 0.9 → +5 to +10 points", "accomplished": "FS 0.6-
0.9 → -5 to +5 points", "notTopTier": "FS < 0.6 → -10 to -5 points" }, "acclaimConsistency": {
"formula": "AC = (RecentAchievements * 0.6) + (LongevityOfRecognition * 0.4)", "consistent":
"AC > 0.85 → +5 to +10 points", "recentSporadic": "AC 0.5-0.85 → 0 to +5 points", "limitedBrief":
"AC < 0.5 → -10 to 0 points" }, "independentVerification": { "formula": "IV =

(SourceIndependence * 0.5) + (SourceCredibility * 0.3) + (VerificationBreadth * 0.2)", "strong":
"IV > 0.8 → +5 to +10 points", "limited": "IV 0.5-0.8 → 0 to +5 points", "selfServing": "IV < 0.5 →
-10 to 0 points" }, "evidenceRelevance": { "formula": "ER = (DirectRelevance * 0.7) +
(SignificanceToField * 0.3)", "directlyRelated": "ER > 0.8 → +5 to +10 points",
"somewhatRelated": "ER 0.4-0.8 → 0 to +5 points", "tangential": "ER < 0.4 → -10 to 0 points" } },
"confidenceScoring": { "formula": "0.3*FieldStandingConfidence +
0.3*AcclaimConsistencyConfidence + 0.2*IndependentVerificationConfidence +
0.2*EvidenceRelevanceConfidence", "thresholds": { "high": ">0.75", "medium": "0.5-0.75", "low":
"<0.5" }, "lowConfidenceAction": "Flag for human review of final merits determination" } }, {
"step": 5, "name": "Final Classification", "description": "Determination of overall case strength
and approval likelihood", "actions": [ "Calculation of total score across criteria", "Application of
final merits adjustments", "Threshold-based classification of case strength", "RFE risk
assessment" ], "n8nImplementation": { "nodes": [ { "name": "TotalScoreCalculatorNode",
"description": "Calculates final adjusted score based on criteria and merits", "parameters": {
"criteriaScores": "input from Step 3", "meritsAdjustments": "input from Step 4", "formulaType":
"weighted" } }, { "name": "ClassificationNode", "description": "Applies threshold logic to
determine approval likelihood", "parameters": { "thresholdDefinitions":
"EB1A_approval_thresholds.json", "classificationLabels": ["Strong Approval", "Likely Approval",
"Borderline Case", "Likely Denial"], "confidenceScoring": true } }, { "name": "RFERiskNode",
"description": "Evaluates risk of RFE and identifies specific risk areas", "parameters": {
"rfePatterns": "EB1A_RFE_patterns.json", "weaknessDetection": true, "mitigationSuggestions":
true } } ] }, "scoreCalculation": { "totalScore": "Sum of top 3-5 criterion scores (max 25 points
each)", "adjustedScore": "TotalScore + Sum of merit adjustment factors (±40 possible)",
"classificaticationLogic": "Apply appropriate threshold from consolidated table based on
evaluation path (standard/comparable)", "rfeRiskFormula": "RFEIndex = (WeakCriteriaCount *
0.4) + (IncompleteEvidenceCount * 0.3) + (LowConfidenceAreas * 0.3)", "rfeRiskLevels": {
"high": "RFEIndex > 0.6", "moderate": "RFEIndex 0.3-0.6", "low": "RFEIndex < 0.3" } },
"confidenceScoring": { "formula": "0.4*Step1Confidence + 0.4*Step2Confidence +
0.2*EvidenceConsistency", "thresholds": { "high": ">0.8", "medium": "0.6-0.8", "low": "<0.6" },
"lowConfidenceAction": "Flag for human review of final classification" } }, { "step": 6, "name":
"Output Generation", "description": "Creation of comprehensive case analysis report", "actions":
[ "Summary of evidence evaluation by criterion", "Detailed Kazarian analysis with supporting
explanation", "Identification of strengths and weaknesses", "Visual representation of scoring and
classification" ], "n8nImplementation": { "nodes": [ { "name": "ReportGeneratorNode",
"description": "Creates comprehensive analysis report", "parameters": { "reportTemplate":
"EB1A_report_template.json", "criteriaBreakdown": true, "meritsSummary": true,
"strengthWeaknessSummary": true } }, { "name": "VisualizationNode", "description": "Generates
visual representations of scores and classification", "parameters": { "chartTypes": ["radar", "bar",
"heatmap"], "comparativeBenchmarks": true, "interactiveElements": true } }, { "name":
"OutputFormatterNode", "description": "Formats final output in specified format (PDF, JSON,
HTML)", "parameters": { "outputFormats": ["PDF", "JSON", "HTML"], "securityFeatures": true,
"accessibilityCompliance": true } } ] } } ], "outputFormat": { "type": "JSON", "schema": {
"caseMetadata": { "petitionerName": "string", "beneficiaryName": "string", "fieldOfExpertise":
"string", "processingDate": "date", "automatedAssessmentId": "string" }, "kazarianStep1": {
"criteriaAnalysis": [ { "id": "string (e.g., EB1A-1)", "name": "string", "claimed": "boolean",
"satisfied": "boolean", "supportingDocuments": ["string"], "strengthScore": "number (0-25)",
"evaluationNotes": "string", "confidenceLevel": "number (0-1)" } ], "satisfiedCount": "number",
"majorAward": { "claimed": "boolean", "satisfied": "boolean", "awardName": "string",
"evaluationNotes": "string" }, "step1Passed": "boolean" }, "kazarianStep2": {
"finalMeritsAnalysis": { "fieldStanding": { "assessment": "string", "adjustmentPoints": "number",
"supportingEvidence": ["string"], "evaluationNotes": "string" }, "acclaimConsistency": {
"assessment": "string", "adjustmentPoints": "number", "supportingEvidence": ["string"],
"evaluationNotes": "string" }, "independentVerification": { "assessment": "string",
"adjustmentPoints": "number", "supportingEvidence": ["string"], "evaluationNotes": "string" },
"evidenceRelevance": { "assessment": "string", "adjustmentPoints": "number",
"supportingEvidence": ["string"], "evaluationNotes": "string" }, "totalAdjustment": "number" } },
"finalAssessment": { "rawCriteriaScore": "number", "adjustedFinalScore": "number",

"classification": "string (e.g., Strong Approval, Likely Approval)", "confidenceLevel": "number (0-
1)", "strengthsAnalysis": { "keyStrengths": ["string"], "distinguishingFactors": ["string"],
"compellingEvidence": ["string"] }, "weaknessAnalysis": { "keyWeaknesses": ["string"],
"gapsInEvidence": ["string"], "potentialRFETriggers": ["string"] }, "recommendedActions":
["string"] } } }, "integrationPoints": { "documentManagementSystem": "API endpoint for retrieving
submitted documents", "caseManagementSystem": "API endpoint for updating case status and
analysis", "reportingSystem": "API endpoint for generating final reports", "clientPortal": "API
endpoint for sharing analysis with attorneys/clients" } }, "versionControlProtocol": { "description":
"Framework for maintaining and updating the EB-1A scoring blueprint over time", "updateCycle":
{ "regularUpdates": [ { "frequency": "Quarterly", "scope": "Minor adjustments to criteria
weightings, evidence evaluations, and field-specific guidance", "triggers": [ "Statistical analysis
of recent USCIS approvals/RFEs/denials", "AAO decision patterns showing shifts in
interpretation", "Attorney feedback on recent adjudications" ], "implementation": [ "Update
evidence weightings", "Refine field-specific benchmarks", "Adjust RFE pattern detection", "Tune
threshold boundaries between categories" ], "documentation": [ "Version numbering: vX.Y where
Y increments for quarterly updates", "Changelog of specific adjustments", "Statistical justification
for changes", "Retroactive testing on recent cases" ] }, { "frequency": "Annual", "scope": "Major
review of entire blueprint including thresholds, criteria, and implementation logic", "triggers": [
"Comprehensive analysis of full-year approval trends", "Significant shifts in field-specific
standards", "Technical improvements in implementation capabilities", "Feedback from
immigration attorneys and users" ], "implementation": [ "Update base threshold definitions",
"Revise field-specific guidance comprehensively", "Enhance implementation schema with new
capabilities", "Modernize technical infrastructure" ], "documentation": [ "Version numbering:
vX+1.0 for annual major updates", "Comprehensive documentation of changes", "Migration
guide for implementation systems", "Comparative analysis with previous version" ] } ],
"eventTriggeredUpdates": [ { "trigger": "USCIS Policy Memorandum", "response": "Immediate
analysis and targeted update to affected criteria/thresholds", "timeline": "Within 30 days of
publication", "implementation": [ "Policy impact analysis", "Targeted adjustments to affected
criteria", "Special version release (vX.Y.Z where Z indicates policy update)" ] }, { "trigger":
"Significant AAO Precedent Decision", "response": "Analysis and adjustment of criterion
interpretation", "timeline": "Within 60 days of publication", "implementation": [ "Precedent
analysis document", "Adjustment to specific criterion evaluation", "Notification to implementation
partners" ] }, { "trigger": "Legislative Change", "response": "Comprehensive system revision if
necessary", "timeline": "Aligned with effective date of legislation", "implementation": [ "Legal
analysis of changes", "Comprehensive blueprint revision if needed", "Major version increment
(vX+1.0)" ] } ] }, "qualityControl": { "testingMethodology": [ { "method": "Retroactive Case
Testing", "description": "Apply updated criteria to previously adjudicated cases to verify
alignment", "metrics": [ "Match rate with actual outcomes", "False positive/negative rates", "RFE
prediction accuracy" ], "acceptanceCriteria": "Minimum 85% alignment with actual outcomes" }, {
"method": "Attorney Panel Review", "description": "Expert review of changes by immigration
attorneys", "process": [ "Blind comparison of old vs. new criteria", "Case study evaluations",
"Feedback incorporation" ], "acceptanceCriteria": "Majority attorney agreement with changes" },
{ "method": "Statistical Validation", "description": "Statistical analysis of system performance",
"metrics": [ "Consistency across similar cases", "Field-specific accuracy", "Criteria distribution
analysis" ], "acceptanceCriteria": "No statistically significant bias across fields" } ],
"versionArchiving": { "policy": "All previous versions maintained with complete documentation",
"accessControl": "Prior versions accessible for historical cases", "migrationProtocol": "Clear
guidance for transitioning between versions" } }, "changelogManagement": { "documentation": [
"Detailed change history with rationale", "Before/after comparison for significant changes",
"Policy reference citations for adjustments", "Statistical justification for threshold changes" ],
"communication": [ "Release notes for each version update", "Implementation guidance for
technical teams", "Attorney training materials for significant changes", "Client-friendly summaries
of impact" ] } } } } } ## Consolidated Final Scoring Table The EB-1A blueprint employs a
comprehensive scoring system with clearly defined thresholds that determine approval
likelihood. This table integrates both standard and comparable evidence paths with their
respective point ranges and approval probabilities: | Classification | Point Range | Satisfaction
Level | Description | |----------------|-------------|-------------------|-------------| | **Strong Approval** | 85-

200 | Standard Evidence | Evidence substantially exceeds requirements, demonstrating
overwhelming case for extraordinary ability. Satisfies at least 4 criteria strongly (20+ pts) or 3
exceptionally (23+ pts). | | **Strong Approval** | 80-200 | Comparable Evidence | Comparable
evidence substantially demonstrates extraordinary ability. Compelling explanation of criteria
inapplicability and exceptionally strong evidence (min 20+ pts for 3 criteria). | | **Likely
Approval** | 70-84 | Standard Evidence | Evidence clearly meets requirements, presenting a
convincing case. Satisfies at least 3 criteria solidly (18+ pts) with strong final merits support. | |
**Likely Approval** | 65-79 | Comparable Evidence | Comparable evidence clearly demonstrates
extraordinary ability. Convincing explanation and strong evidence (min 18+ pts for 3 criteria). | |
**Borderline Case** | 55-69 | Standard Evidence | Evidence meets minimum requirements but
may have weaknesses in final merits determination. Satisfies 3 criteria, but quality inconsistent
(avg 15-17 pts). High RFE risk. | | **Borderline Case** | 50-64 | Comparable Evidence |
Comparable evidence minimally demonstrates ability. Adequate explanation of inapplicability,
inconsistent quality (avg 15-17 pts). High RFE risk. | | **Likely Denial** | 0-54 | Standard
Evidence | Evidence fails to meet minimum requirements. Either fails to satisfy 3 criteria or
evidence is weak/unconvincing (<15 pts per criterion) or final merits determination is
unfavorable. | | **Likely Denial** | 0-49 | Comparable Evidence | Comparable evidence fails to
demonstrate ability. Lacks adequate explanation of criteria inapplicability or evidence is weak
(<15 pts). | ## Final Merits Adjustment Impact The final score can be adjusted by up to ±40
points based on the Final Merits Determination factors: | Adjustment Factor | Point Impact |
Positive Assessment | Neutral Assessment | Negative Assessment | |-------------------|--------------|--
-------------------|-------------------|---------------------| | Field Standing | -10 to +10 | Top tier in field (+5
to +10) | Accomplished but not elite (-5 to +5) | Not at top tier (-10 to -5) | | Acclaim Consistency |
-10 to +10 | Consistent over years (+5 to +10) | Recent/sporadic (0 to +5) | Limited/brief (-10 to
0) | | Independent Verification | -10 to +10 | Strong independent verification (+5 to +10) | Limited
independent verification (0 to +5) | Primarily self-serving (-10 to 0) | | Evidence Relevance | -10
to +10 | Directly related to extraordinary ability (+5 to +10) | Somewhat related (0 to +5) |
Tangential/minimal relevance (-10 to 0) | ## Real-World Example: Evaluation of a Scientist To
illustrate how the scoring system works in practice, let's examine a sample case: ### Case
Background - **Beneficiary**: Dr. Jane Smith, Cancer Research Scientist - **Field**: Molecular
Biology/Oncology - **Education**: Ph.D. from Stanford University (2015) - **Current Position**:
Senior Researcher at Memorial Sloan Kettering Cancer Center ### Kazarian Step 1: Criteria
Evaluation | Criterion | Evidence | Score | Satisfied? | |-----------|----------|-------|------------| |
Awards/Prizes | Young Investigator Award from American Association for Cancer Research
(national recognition, competitive selection) | 17/25 | Yes | | Membership in Associations |
Elected Member of American Society for Cell Biology (requires nomination and election based
on contributions) | 16/25 | Yes | | Published Material About | Featured in 3 articles in scientific
publications about her breakthrough research on cancer cell metabolism | 15/25 | Yes | | Judging
Work of Others | Regular peer reviewer for Cancer Research and Cell Metabolism journals (15
reviews completed) | 18/25 | Yes | | Original Contributions | Developed novel method for
targeting cancer cell metabolism; cited 280 times; implemented at 3 research centers | 22/25 |
Yes | | Scholarly Articles | 12 peer-reviewed publications; 4 in high-impact journals (IF>10);
average 25 citations per paper | 20/25 | Yes | | Leading/Critical Role | Lab Director managing 6
researchers; secured $1.2M in grant funding | 15/25 | Yes | | High Salary | $145,000 annual
salary (75th percentile for field and location) | 13/25 | No | **Step 1 Result**: Satisfies 7 of 8
claimed criteria (exceeding the required 3) **Raw Score Calculation**: Top 5 criteria scores = 22
+ 20 + 18 + 17 + 16 = 93 points ### Kazarian Step 2: Final Merits Determination | Adjustment
Factor | Analysis | Points | |-------------------|----------|--------| | Field Standing | Strong researcher
but not yet among the very top tier of cancer researchers globally | +2 | | Acclaim Consistency |
Consistent publications and recognition since 2017, with increasing impact | +7 | | Independent
Verification | Multiple independent sources verify impact; citations from researchers worldwide |
+8 | | Evidence Relevance | All evidence directly related to scientific contributions in oncology
research | +8 | | Total Adjustment | | +25 | **Final Adjusted Score**: 93 + 25 = 118 points ###
Final Classification - **Classification**: Strong Approval (Standard Evidence path, score 118) -
**Confidence Level**: 0.85 (High) - **RFE Risk Level**: Low ### Key Strengths and
Recommendations - Exceptional strength in Original Contributions (22/25) with significant
citation evidence - Strong publication record with high-impact journals (20/25) - Multiple criteria

exceeded the 15-point threshold - Recommend emphasizing the implementation of research
methods at other institutions - Consider obtaining additional independent expert letters to further
strengthen the case This example demonstrates how the blueprint applies both the objective
criterion-by-criterion evaluation and the holistic final merits assessment to arrive at a final
classification with high confidence. ## Automated Implementation Details ### n8n Workflow
Configuration The EB-1A scoring system is implemented as an n8n workflow with specialized
nodes for each processing step. The workflow utilizes multiple AI agents working together to
handle different aspects of the assessment, from document processing to final classification.
```json { "nodes": [ { "parameters": { "path": "/api/eb1a/intake", "responseMode":
"responseNode", "options": {} }, "name": "Document Intake Webhook", "type": "n8n-nodes-
base.webhook", "typeVersion": 1, "position": [ 250, 300 ] }, { "parameters": { "documentType":
"petition", "options": { "ocrEngine": "tesseract", "language": "eng", "resolution": "300dpi" } },
"name": "Document OCR", "type": "custom.ocrNode", "typeVersion": 1, "position": [ 450, 300 ] }, {
"parameters": { "modelName": "EB1A-DocClassifier-v2", "confidenceThreshold": 0.75,
"criteriaMapping": true }, "name": "Document Classification", "type": "custom.docClassifierNode",
"typeVersion": 1, "position": [ 650, 300 ] }, { "parameters": { "entityTypes": ["person",
"organization", "date", "award"], "dateNormalization": true, "organizationValidation": true },
"name": "Metadata Extraction", "type": "custom.entityExtractorNode", "typeVersion": 1,
"position": [ 850, 300 ] }, { "parameters": { "criteriaDefinitions": "EB1A_criteria_definitions.json",
"evidenceWeightings": "EB1A_evidence_weights.json", "fieldSpecificContext": true }, "name":
"Criteria Mapper", "type": "custom.criteriaMapperNode", "typeVersion": 1, "position": [ 1050, 300
] }, { "parameters": { "evidenceQualityMetrics": true, "sourceCredibility": true, "fieldBenchmarks":
true, "criteriaThresholds": "EB1A_criteria_thresholds.json" }, "name": "Kazarian Step 1", "type":
"custom.kazarianStep1Node", "typeVersion": 1, "position": [ 1250, 300 ] }, { "parameters": {
"fieldStandingEvaluation": true, "acclaimConsistencyAnalysis": true,
"independentVerificationAssessment": true, "evidenceRelevanceScoring": true,
"adjustmentFactors": "EB1A_adjustment_factors.json" }, "name": "Kazarian Step 2", "type":
"custom.kazarianStep2Node", "typeVersion": 1, "position": [ 1450, 300 ] }, { "parameters": {
"scoreCalculation": "weighted", "thresholdDefinitions": "EB1A_approval_thresholds.json",
"rfePatterns": "EB1A_RFE_patterns.json" }, "name": "Final Classification", "type":
"custom.classificationNode", "typeVersion": 1, "position": [ 1650, 300 ] }, { "parameters": {
"reportTemplate": "EB1A_report_template.json", "visualizations": ["radar", "bar", "timeline"],
"outputFormats": ["PDF", "JSON", "HTML"] }, "name": "Report Generator", "type":
"custom.reportGeneratorNode", "typeVersion": 1, "position": [ 1850, 300 ] }, { "parameters": {
"url": "=data.webhookUrl", "sendQuery": false, "sendBody": true, "sendHeaders": false,
"headerParameters": {}, "queryParameters": {}, "bodyParameters": { "reportUrl": "={{
$node[\"Report Generator\"].json[\"reportUrl\"] }}", "classification": "={{ $node[\"Final
Classification\"].json[\"classification\"] }}", "score": "={{ $node[\"Final
Classification\"].json[\"score\"] }}", "rfeRisk": "={{ $node[\"Final Classification\"].json[\"rfeRisk\"] }}"
}, "options": {} }, "name": "Callback Service", "type": "n8n-nodes-base.httpRequest",
"typeVersion": 1, "position": [ 2050, 300 ] } ], "connections": { "Document Intake Webhook": {
"main": [ [ { "node": "Document OCR", "type": "main", "index": 0 } ] ] }, "Document OCR": {
"main": [ [ { "node": "Document Classification", "type": "main", "index": 0 } ] ] }, "Document
Classification": { "main": [ [ { "node": "Metadata Extraction", "type": "main", "index": 0 } ] ] },
"Metadata Extraction": { "main": [ [ { "node": "Criteria Mapper", "type": "main", "index": 0 } ] ] },
"Criteria Mapper": { "main": [ [ { "node": "Kazarian Step 1", "type": "main", "index": 0 } ] ] },
"Kazarian Step 1": { "main": [ [ { "node": "Kazarian Step 2", "type": "main", "index": 0 } ] ] },
"Kazarian Step 2": { "main "Kazarian Step 2": { "main": [ [ { "node": "Final Classification", "type":
"main", "index": 0 } ] ] }, "Final Classification": { "main": [ [ { "node": "Report Generator", "type":
"main", "index": 0 } ] ] }, "Report Generator": { "main": [ [ { "node": "Callback Service", "type":
"main", "index": 0 } ] ] } } } Sample Output Format Below is an example of the JSON output from
a completed EB-1A assessment: json{ "caseMetadata": { "petitionerName": "Memorial Sloan
Kettering Cancer Center", "beneficiaryName": "Jane Smith, Ph.D.", "fieldOfExpertise": "Cancer
Research/Molecular Biology", "processingDate": "2025-04-15", "automatedAssessmentId":
"EB1A-20250415-J12345" }, "kazarianStep1": { "criteriaAnalysis": [ { "id": "EB1A-1", "name":
"Nationally/Internationally Recognized Prizes/Awards", "claimed": true, "satisfied": true,
"supportingDocuments": [ "AACR Young Investigator Award Certificate (2022)", "AACR Selection

Committee Letter", "Cancer Research Journal coverage of award" ], "strengthScore": 17,
"evaluationNotes": "Award is nationally recognized in the field with competitive selection process
(8% acceptance rate). AACR is a prestigious organization, though award is limited to early-
career scientists.", "confidenceLevel": 0.85 }, { "id": "EB1A-2", "name": "Membership in
Associations Requiring Outstanding Achievement", "claimed": true, "satisfied": true,
"supportingDocuments": [ "American Society for Cell Biology Membership Certificate", "ASCB
Membership Committee Letter", "ASCB Bylaws showing nomination requirements" ],
"strengthScore": 16, "evaluationNotes": "ASCB membership requires nomination and review of
scientific contributions. Evidence shows rigorous selection process with ~20% acceptance
rate.", "confidenceLevel": 0.82 }, { "id": "EB1A-5", "name": "Original Contributions of Major
Significance", "claimed": true, "satisfied": true, "supportingDocuments": [ "Citation reports (280
citations total)", "Implementation letters from 3 research centers", "Letters from 4 independent
experts confirming significance", "Patent documentation for novel method" ], "strengthScore":
22, "evaluationNotes": "Strong evidence of significant contributions with exceptional
independent validation. Method has been implemented at multiple research centers with
documented impact.", "confidenceLevel": 0.92 }, { "id": "EB1A-6", "name": "Authorship of
Scholarly Articles", "claimed": true, "satisfied": true, "supportingDocuments": [ "12 peer-reviewed
publications (4 in high-impact journals)", "Citation analysis showing above-field-average
metrics", "Journal impact factor documentation", "Evidence of peer review process" ],
"strengthScore": 20, "evaluationNotes": "Strong publication record with multiple articles in high-
impact journals (top 15% in field). Citation metrics show consistent impact above field average.",
"confidenceLevel": 0.88 } ], "satisfiedCount": 7, "majorAward": { "claimed": false, "satisfied":
false, "awardName": null, "evaluationNotes": "No major international award claimed." },
"step1Passed": true }, "kazarianStep2": { "finalMeritsAnalysis": { "fieldStanding": { "assessment":
"Accomplished researcher with strong recognition in field, but not yet at very top tier globally",
"adjustmentPoints": 2, "supportingEvidence": [ "Citation metrics in top 15% of field",
"Recognition primarily at national level", "Strong but not elite institutional affiliation" ],
"evaluationNotes": "Beneficiary has established strong reputation but not yet considered among
the top researchers globally in cancer research." }, "acclaimConsistency": { "assessment":
"Consistent record of achievement with increasing impact", "adjustmentPoints": 7,
"supportingEvidence": [ "Publication history shows consistent output since 2017", "Citation
impact shows upward trajectory", "Recent awards indicate growing recognition" ],
"evaluationNotes": "Strong evidence of sustained and increasing recognition over 7+ year
period." }, "independentVerification": { "assessment": "Strong independent verification from
multiple sources", "adjustmentPoints": 8, "supportingEvidence": [ "Letters from 6 independent
experts across 4 institutions", "Implementation of methods at 3 separate research centers",
"Citations from researchers in 15+ countries" ], "evaluationNotes": "Exceptionally strong
independent verification from multiple sources across different institutions." },
"evidenceRelevance": { "assessment": "Evidence directly relates to claimed extraordinary
ability", "adjustmentPoints": 8, "supportingEvidence": [ "All evidence directly related to cancer
research field", "Strong connection between claimed expertise and evidence", "Publications and
contributions align with stated specialization" ], "evaluationNotes": "All evidence is highly
relevant to beneficiary's claimed area of expertise." }, "totalAdjustment": 25 } },
"finalAssessment": { "rawCriteriaScore": 93, "adjustedFinalScore": 118, "classification": "Strong
Approval", "confidenceLevel": 0.85, "strengthsAnalysis": { "keyStrengths": [ "Exceptional
evidence of original contributions (22/25 points)", "Strong publication record with high citation
impact (20/25 points)", "Extensive independent verification from multiple sources", "Consistent
trajectory of recognition and achievement", "Evidence of practical implementation of research" ],
"distinguishingFactors": [ "Novel cancer research method adopted by multiple institutions",
"Citation metrics in top 15% of field", "Strong letters from independent experts across multiple
institutions" ], "compellingEvidence": [ "Implementation of research methods at 3 major research
centers", "280 citations of published work across 15+ countries", "Competitive membership in
prestigious professional association" ] }, "weaknessAnalysis": { "keyWeaknesses": [
"Recognition primarily at national rather than international level", "Not yet at very top tier of
researchers in field globally" ], "gapsInEvidence": [ "Limited international awards/recognition",
"High salary criterion not fully established" ], "potentialRFETriggers": [ "Low risk - multiple criteria
exceeded minimum threshold", "Strong final merits determination with +25 adjustment" ] },

"recommendedActions": [ "Consider obtaining additional letters from international experts",
"Strengthen salary comparison with more field-specific data", "Include more evidence of
international recognition beyond citations" ] } } Multi-Agent Coordination The implementation
uses five specialized AI agents working in concert: Document Processor Agent Handles OCR
and initial document classification Extracts metadata from documents Confidence scoring:
DocumentConfidence = (OCRQuality * 0.4) + (ClassificationAccuracy * 0.4) +
(MetadataCompleteness * 0.2) Evidence Mapper Agent Maps documents to specific criteria
Calculates document relevance scores Identifies evidence gaps Confidence scoring:
MappingConfidence = (RelevanceAccuracy * 0.5) + (EvidenceCompleteness * 0.3) +
(FieldContextAlignment * 0.2) Criteria Evaluator Agent Evaluates evidence against criteria
requirements Calculates criterion-specific scores Determines criterion satisfaction (binary)
Confidence scoring: CriterionConfidence = (EvidenceQuality * 0.5) + (EvidenceCompleteness *
0.3) + (ConsistencyAcrossSources * 0.2) Merits Analyzer Agent Evaluates holistic case strength
Analyzes field standing, acclaim consistency, etc. Calculates final merit adjustments Confidence
scoring: MeritsConfidence = (FieldContextConfidence * 0.3) + (EvidenceConsistency * 0.4) +
(IndependentVerificationStrength * 0.3) Classification Agent Combines scores from all criteria
Applies merit adjustments Determines final classification Identifies strengths and weaknesses
Confidence scoring: FinalConfidence = (Step1Confidence * 0.4) + (Step2Confidence * 0.4) +
(EvidenceCompleteness * 0.2) Each agent produces a confidence score for its evaluation
component. When confidence falls below threshold levels (typically 0.6), human review is
triggered to ensure accuracy. Document Mapping and Weighting The blueprint implements a
sophisticated document mapping system that determines how evidence relates to specific
criteria: Document Relevance Scoring Documents are scored for relevance to each criterion
using the following formula: DocRelevanceScore = ContentRelevance * 0.6 + MetadataMatch *
0.2 + ContextualFactors * 0.2 Where: ContentRelevance: Semantic relevance of document
content to criterion (0-1) MetadataMatch: Match between document metadata and criterion
requirements (0-1) ContextualFactors: Field-specific relevance factors (0-1) Document
Contribution Weighting The weight each document contributes to a criterion score is determined
by: DocContribution = DocRelevance * DocQuality * DocSignificance Where: DocRelevance:
Relevance score (0-1) DocQuality: Assessment of document credibility/authority (0-1)
DocSignificance: Importance of evidence type for the specific criterion (0-1) Documents are
classified into four categories based on relevance score: Primary Evidence: 0.8-1.0 relevance
(full weight) Supporting Evidence: 0.4-0.79 relevance (partial weight) Weak Evidence: 0.2-0.39
relevance (minimal weight) Irrelevant: <0.2 relevance (no weight) This sophisticated mapping
system ensures that each piece of evidence contributes appropriately to the criteria it best
supports, avoiding double-counting while still recognizing evidence that may support multiple
criteria. Confidence Scoring Model The confidence scoring system provides a crucial quality
control mechanism at each stage of the evaluation process. This enables the system to flag
cases requiring human review and provides transparency about the reliability of the
assessment. Confidence Formula for Final Classification The final confidence score is
calculated using a weighted combination of confidence scores from each processing stage:
FinalConfidence = (Step1Confidence * 0.4) + (Step2Confidence * 0.4) +
(EvidenceCompleteness * 0.2) Where: Step1Confidence: Average confidence scores across all
evaluated criteria Step2Confidence: Confidence in final merits determination
EvidenceCompleteness: Assessment of evidence completeness (0-1) Confidence Thresholds
and Actions The system uses the following confidence thresholds to trigger appropriate actions:
Confidence LevelScore RangeActionHigh0.8-1.0Automated processing proceedsMedium0.6-
0.79Flagged for supervisor reviewLow<0.6Flagged for specialist review and possible attorney
consultation For example, if the system calculates a Final Classification Confidence of 0.55, it
would flag the case for specialist review with the following note: json"confidenceIssues": [ {
"stage": "Kazarian Step 2", "confidence": 0.48, "reason": "Insufficient independent verification of
field standing", "recommendedAction": "Expert review needed for final merits determination" } ]
This comprehensive confidence scoring system ensures quality control throughout the
evaluation process, identifying specific areas where human expertise may be required to
supplement the automated analysis. Sample Output Visualization The system generates visual
representations of the evaluation results to facilitate easier understanding: Criteria Radar Chart
Original Contributions (22/25) ^ | | | Awards (17/25) <-------- + --------> Publications (20/25) | | | v

Membership (16/25) Final Score Gauge ^ / \ / \ / \ / \ / \ / \ / \ Denial | 118 | Strong Approval \ / \ / \
/ \ / \ / \ / \ / v Timeline Visualization 2017 ---------- 2019 ---------- 2021 ---------- 2023 ---------- 2025
| | | | | | | | | | v v v v v First First First major Award Current publication citation implementation
recognition assessment Version Control Implementation The blueprint implements a robust
version control system to maintain consistency while allowing for updates based on changing
USCIS policies and adjudication trends. Version Numbering System v[Major].[Minor].[Patch]
Example: v2.1.0 Where: Major: Significant structural changes to criteria or evaluation
methodology Minor: Updates to weights, thresholds, or field-specific guidance Patch: Bug fixes
or minor clarifications Change Management Workflow Identification Monitor USCIS policy
updates, AAO decisions, and approval statistics Collect user feedback and system performance
metrics Identify areas for improvement Analysis Analyze impact of proposed changes Test
changes on historical cases Document expected improvements Implementation Update
configuration files and models Version control in code repository Document changes in
changelog Validation Run validation tests on historical cases Compare outcomes with previous
version Verify alignment with current USCIS trends Deployment Deploy updates with version
tags Notify users of changes Provide training materials as needed Sample Version History
v2.1.0 (April 2025) Updated field benchmarks for science and technology fields Added new
comparable evidence examples for startup founders Refined confidence scoring formulas for
improved accuracy Updated policy guidance based on USCIS October 2024 memo v2.0.0
(January 2025) Major update to scoring algorithm incorporating Kazarian framework Added
comprehensive field-specific guidance Implemented confidence scoring system Enhanced
document mapping with relevance weighting v1.2.3 (October 2024) Updated thresholds based
on recent AAO decisions Fixed issues with document classification for medical publications
Improved RFE risk assessment accuracy This version control system ensures that the
evaluation framework remains current with changing immigration policies and adjudication
trends while maintaining transparency and consistency in case evaluations. Conclusion The EB-
1A Scoring Blueprint provides a comprehensive framework for evaluating extraordinary ability
petitions in accordance with USCIS requirements and the Kazarian two-step analysis. Key
features include: Structured Evaluation Framework: Clear criteria definitions with evidence
requirements Detailed point-based scoring system with defined thresholds Comprehensive
implementation of Kazarian two-step analysis Field-Specific Guidance: Tailored benchmarks for
different fields (sciences, business, arts, etc.) Field-specific evidence examples and common
RFE issues Customized evaluation metrics for different disciplines Automated Implementation:
Detailed workflow for document processing and analysis Multi-agent system with specialized
components Confidence scoring for quality control Comprehensive output format with
visualizations Version Control: Structured update process for policy changes Robust testing and
validation procedures Detailed change management documentation This blueprint provides a
complete framework for evaluating EB-1A petitions with consistency, accuracy, and
transparency, while maintaining alignment with evolving USCIS policies and adjudication trends.
By implementing this system, practitioners can improve case preparation, identify potential
weaknesses before filing, and maximize approval chances for qualifying applicants.