# P-1A VISA ITINERARY GENERATION SYSTEM
## Production-Ready RAG & Document Creation Framework

### SYSTEM OBJECTIVE
Create an intelligent system that generates legally compliant, USCIS-ready P-1A visa itineraries by:
1. Taking athlete sport/activity and profile as input
2. Searching/retrieving appropriate U.S. events meeting P-1A international recognition standards
3. Generating two comprehensive documents:
   - Document A: Narrative itinerary with event descriptions and significance explanations
   - Document B: URL reference sheet with links proving each event's P-1A worthiness

### CRITICAL LEGAL FRAMEWORK
All outputs must comply with 8 CFR 214.2(p) requirements:
- Every P-1A petition REQUIRES a detailed itinerary
- Events must have "distinguished reputation" at internationally recognized level
- Itinerary quality can override other favorable factors
- Insufficient itineraries (below 10/25 points) trigger RFEs or denials

---

## PART 1: RAG ARCHITECTURE & KNOWLEDGE BASE

### A. PRIMARY KNOWLEDGE BASE STRUCTURE

#### Sport Category Classification System
```json
{
  "sportCategories": {
    "teamSports": {
      "majorLeagueSports": ["soccer", "basketball", "baseball", "hockey", "football"],
      "internationalTeamSports": ["rugby", "cricket", "volleyball", "handball"],
      "emergingSports": ["lacrosse", "ultimate frisbee", "field hockey"]
    },
    "individualSports": {
      "racquetSports": ["tennis", "squash", "badminton", "table tennis"],
      "combatSports": ["boxing", "MMA", "wrestling", "judo", "karate", "taekwondo"],
      "enduranceSports": ["marathon", "triathlon", "cycling", "swimming", "track and field"],
      "precisionSports": ["golf", "archery", "shooting", "bowling"],
      "extremeSports": ["surfing", "skateboarding", "snowboarding", "BMX"],
      "motorsports": ["auto racing", "motorcycle racing", "karting"]
    },
    "performanceAthletics": {
      "gymnastics": ["artistic", "rhythmic", "trampoline"],
      "figureSports": ["figure skating", "ice dancing", "synchronized swimming"],
      "equestrian": ["show jumping", "dressage", "eventing"]
    },
    "emergingCompetitive": {
      "esports": ["League of Legends", "Dota 2", "Counter-Strike", "Fortnite"],
      "niche": ["chess", "poker", "billiards", "darts"]
    }
  }
}
```

#### Event Quality Tier System
```json
{
  "eventTiers": {
    "tier1_elite": {
      "pointValue": 10,
      "description": "Exclusively major international events or premier league play",
      "examples": [
        "Olympic Games (if U.S. hosted)",
        "World Championships in U.S.",
        "Grand Slam tournaments",
        "Major professional league seasons (NFL, NBA, MLB, NHL, MLS)",
        "World Cup events in U.S."
      ],
      "verificationRequirements": [
        "IOC, FIFA, FIBA, or equivalent international federation sanctioning",
        "Broadcast on major networks (ESPN, NBC, FOX Sports)",
        "Prize money exceeding $1M",
        "Participant field includes top 50 world-ranked athletes",
        "10+ year event history"
      ]
    },
    "tier2_major": {
      "pointValue": 7,
      "description": "Significant international events with distinguished reputation",
      "examples": [
        "Continental championships (Pan American Games, CONCACAF)",
        "Major professional tour events (ATP, WTA, PGA, LPGA)",
        "Professional league playoff games",
        "International federation sanctioned tournaments",
        "U.S. national championships with international participation"
      ],
      "verificationRequirements": [
        "International or continental federation sanctioning",
        "Participants from 10+ countries",
        "Prize money exceeding $100K",
        "Media coverage in major outlets",
        "5+ year event history"
      ]
    },
    "tier3_qualifying": {
      "pointValue": 3,
      "description": "Regional events with international participation",
      "examples": [
        "Qualifier events for major championships",
        "Regional tour stops with international field",
        "Professional development league games",
        "International invitational tournaments",
        "U.S. Open series events"
      ],
      "verificationRequirements": [
        "Sanctioned by recognized sporting body",
        "International participants present",
        "Prize money or professional contracts",
        "Documented competitive standards",
        "Leads to ranking points or major event qualification"
      ]
    },
    "tier4_insufficient": {
      "pointValue": 0,
      "description": "Local/amateur events - AVOID FOR P-1A",
      "examples": [
        "City or regional amateur tournaments",
        "Recreational league games",
        "Exhibition matches with no competitive significance",
        "Newly created events with no track record",
        "Events created specifically for visa applicant"
      ],
      "reasoning": "These events lack international recognition and will trigger RFEs or denials"
    }
  }
}
```

#### U.S. Event Database by Sport (Core Examples)
```json
{
  "eventDatabase": {
    "tennis": {
      "tier1": [
        {
          "name": "US Open",
          "location": "New York, NY",
          "venue": "USTA Billie Jean King National Tennis Center",
          "dates": "Late August - Early September (annual)",
          "sanctioningBody": "United States Tennis Association (USTA) / ITF",
          "significance": "Grand Slam tournament, one of four most prestigious tennis events globally",
          "internationalRecognition": "Attracts top 128 men and women from 50+ countries",
          "prizeMoneyExample": "$65+ million total",
          "mediaEvidence": "Broadcast globally on ESPN, streaming on ESPN+",
          "historyEvidence": "Established 1881 (140+ year history)",
          "urlReferences": [
            "https://www.usopen.org",
            "https://www.atptour.com/en/tournaments/us-open/560/overview",
            "https://www.wtatennis.com/tournament/2023-us-open"
          ]
        },
        {
          "name": "BNP Paribas Open (Indian Wells Masters)",
          "location": "Indian Wells, CA",
          "venue": "Indian Wells Tennis Garden",
          "dates": "March (annual)",
          "sanctioningBody": "ATP / WTA",
          "significance": "ATP Masters 1000 / WTA 1000 event, nicknamed 'Fifth Grand Slam'",
          "internationalRecognition": "96-player draw, participants from 40+ countries",
          "prizeMoneyExample": "$9+ million total",
          "mediaEvidence": "Broadcast on Tennis Channel, ESPN",
          "historyEvidence": "Established 1987 (35+ year history)",
          "urlReferences": [
            "https://www.bnpparibasopen.com",
            "https://www.atptour.com/en/tournaments/indian-wells/404/overview"
          ]
        }
      ],
      "tier2": [
        {
          "name": "Miami Open",
          "location": "Miami, FL",
          "venue": "Hard Rock Stadium",
          "dates": "Late March (annual)",
          "sanctioningBody": "ATP / WTA",
          "significance": "ATP Masters 1000 / WTA 1000 combined event",
          "internationalRecognition": "96-player draws, global participant field",
          "prizeMoneyExample": "$8+ million total",
          "urlReferences": ["https://www.miamiopen.com"]
        }
      ]
    },
    "mma": {
      "tier1": [
        {
          "name": "UFC Events (Various U.S. Locations)",
          "locationsExamples": "Las Vegas NV, New York NY, Los Angeles CA, Miami FL",
          "venuesExamples": "T-Mobile Arena, Madison Square Garden, Honda Center",
          "dates": "Year-round (40+ events annually, ~25 in U.S.)",
          "sanctioningBody": "Nevada Athletic Commission / state athletic commissions",
          "significance": "Premier MMA organization, recognized as highest level of competition",
          "internationalRecognition": "Fighters from 50+ countries, broadcast in 170+ countries",
          "mediaEvidence": "ESPN+ exclusive broadcaster, PPV events",
          "historyEvidence": "Established 1993 (30+ year history)",
          "urlReferences": [
            "https://www.ufc.com",
            "https://www.espn.com/mma/organization/_/id/1/ufc"
          ]
        }
      ],
      "tier2": [
        {
          "name": "Bellator MMA Events",
          "locationsExamples": "Various U.S. cities",
          "sanctioningBody": "State athletic commissions",
          "significance": "Second-largest MMA promotion globally",
          "internationalRecognition": "International fighter roster, global broadcast",
          "urlReferences": ["https://www.bellator.com"]
        },
        {
          "name": "PFL (Professional Fighters League)",
          "locationsExamples": "Various U.S. cities",
          "sanctioningBody": "State athletic commissions",
          "significance": "Tournament-format MMA with $1M championship prizes",
          "internationalRecognition": "ESPN broadcast, international fighters",
          "urlReferences": ["https://www.pflmma.com"]
        }
      ]
    },
    "soccer": {
      "tier1": [
        {
          "name": "MLS Regular Season & Playoffs",
          "locationsExamples": "29 U.S. cities (team-dependent)",
          "dates": "February - October (regular season), October - December (playoffs)",
          "sanctioningBody": "Major League Soccer / U.S. Soccer Federation / FIFA",
          "significance": "Top-tier U.S. professional soccer league, FIFA recognized",
          "internationalRecognition": "Players from 70+ countries, CONCACAF Champions League participation",
          "leagueQualification": "29 teams, $1.3B+ annual revenue (meets 6+ teams, $10M+ requirement)",
          "mediaEvidence": "Apple TV+ exclusive broadcaster ($2.5B deal)",
          "urlReferences": [
            "https://www.mlssoccer.com",
            "https://www.fifa.com/about-fifa/associations/usa"
          ]
        }
      ],
      "tier2": [
        {
          "name": "US Open Cup",
          "locationsExamples": "Various U.S. cities",
          "dates": "March - September (annual)",
          "sanctioningBody": "U.S. Soccer Federation",
          "significance": "Oldest ongoing national soccer competition in U.S. (since 1914)",
          "internationalRecognition": "Winner qualifies for CONCACAF Champions League",
          "urlReferences": ["https://www.ussoccer.com/lamar-hunt-us-open-cup"]
        },
        {
          "name": "International Friendly Matches in U.S.",
          "locationsExamples": "Major U.S. stadiums",
          "dates": "Year-round",
          "sanctioningBody": "FIFA",
          "significance": "Official international matches between national teams",
          "internationalRecognition": "FIFA-sanctioned, often U.S. vs. top-ranked nations or top clubs",
          "urlReferences": ["https://www.ussoccer.com/matches"]
        }
      ]
    },
    "golf": {
      "tier1": [
        {
          "name": "U.S. Open (Golf)",
          "locationsExamples": "Rotates among prestigious U.S. courses",
          "dates": "June (annual)",
          "sanctioningBody": "United States Golf Association (USGA)",
          "significance": "One of four men's major championships",
          "internationalRecognition": "156-player field from global qualifying",
          "prizeMoneyExample": "$20+ million total",
          "urlReferences": ["https://www.usga.org/content/usga/home-page/championships/2024/u-s--open.html"]
        },
        {
          "name": "Masters Tournament",
          "location": "Augusta, GA",
          "venue": "Augusta National Golf Club",
          "dates": "April (annual)",
          "sanctioningBody": "Augusta National Golf Club",
          "significance": "One of four men's major championships, most prestigious in golf",
          "internationalRecognition": "Invitational field of world's best golfers",
          "urlReferences": ["https://www.masters.com"]
        },
        {
          "name": "PGA Championship",
          "locationsExamples": "Rotates among U.S. courses",
          "dates": "May (annual)",
          "sanctioningBody": "PGA of America",
          "significance": "One of four men's major championships",
          "urlReferences": ["https://www.pga.com/pga-championship"]
        }
      ],
      "tier2": [
        {
          "name": "PGA Tour Events",
          "locationsExamples": "Various U.S. locations (40+ annual events)",
          "sanctioningBody": "PGA Tour",
          "significance": "Premier men's professional golf tour",
          "internationalRecognition": "Members from 25+ countries, Official World Golf Ranking points",
          "urlReferences": ["https://www.pgatour.com"]
        },
        {
          "name": "LPGA Tour Events",
          "locationsExamples": "Various U.S. locations (30+ annual events)",
          "sanctioningBody": "LPGA",
          "significance": "Premier women's professional golf tour",
          "internationalRecognition": "Members from 30+ countries",
          "urlReferences": ["https://www.lpga.com"]
        }
      ]
    },
    "basketball": {
      "tier1": [
        {
          "name": "NBA Regular Season & Playoffs",
          "locationsExamples": "30 U.S. cities (team-dependent)",
          "dates": "October - June",
          "sanctioningBody": "National Basketball Association / FIBA recognized",
          "significance": "Premier professional basketball league globally",
          "internationalRecognition": "Players from 40+ countries, broadcast in 215+ countries",
          "leagueQualification": "30 teams, $10B+ annual revenue (exceeds major league definition)",
          "mediaEvidence": "ESPN, TNT, ABC broadcast deals",
          "urlReferences": ["https://www.nba.com"]
        }
      ]
    },
    "marathon": {
      "tier1": [
        {
          "name": "Boston Marathon",
          "location": "Boston, MA",
          "dates": "April (annually, Patriots' Day)",
          "sanctioningBody": "Boston Athletic Association / World Athletics",
          "significance": "World's oldest annual marathon (since 1897), World Marathon Major",
          "internationalRecognition": "30,000+ runners from 100+ countries, strict qualifying standards",
          "mediaEvidence": "NBC broadcast, global media coverage",
          "urlReferences": ["https://www.baa.org/races/boston-marathon"]
        },
        {
          "name": "Chicago Marathon",
          "location": "Chicago, IL",
          "dates": "October (annual)",
          "sanctioningBody": "World Athletics / Abbott World Marathon Majors",
          "significance": "World Marathon Major, known for fast course and world records",
          "internationalRecognition": "45,000+ runners from 100+ countries",
          "urlReferences": ["https://www.chicagomarathon.com"]
        },
        {
          "name": "New York City Marathon",
          "location": "New York, NY",
          "dates": "November (annual)",
          "sanctioningBody": "New York Road Runners / World Athletics",
          "significance": "Largest marathon globally, World Marathon Major",
          "internationalRecognition": "50,000+ runners from 150+ countries",
          "prizeMoneyExample": "$700K+ total",
          "urlReferences": ["https://www.tcsnycmarathon.org"]
        }
      ],
      "tier2": [
        {
          "name": "U.S. Olympic Marathon Trials",
          "locationsExamples": "Varies (Atlanta 2020, Orlando 2024)",
          "dates": "Olympic year (every 4 years)",
          "sanctioningBody": "USA Track & Field",
          "significance": "Determines U.S. Olympic marathon team",
          "internationalRecognition": "Top U.S. marathoners competing for Olympic berths",
          "urlReferences": ["https://www.usatf.org"]
        }
      ]
    },
    "esports": {
      "tier1": [
        {
          "name": "League of Legends Championship Series (LCS)",
          "location": "Los Angeles, CA",
          "venue": "LCS Arena",
          "dates": "Spring & Summer splits (annual)",
          "sanctioningBody": "Riot Games",
          "significance": "Top-tier North American League of Legends professional league",
          "internationalRecognition": "Teams qualify for World Championship, global viewership",
          "prizeMoneyExample": "$200K+ per split",
          "mediaEvidence": "Twitch/YouTube streaming, ESPN coverage",
          "urlReferences": ["https://lolesports.com", "https://nexus.leagueoflegends.com/en-us/esports/"]
        }
      ],
      "tier2": [
        {
          "name": "Major Counter-Strike Tournaments (U.S. hosted)",
          "locationsExamples": "Dallas TX, New York NY, Los Angeles CA",
          "sanctioningBody": "Valve Corporation / ESL / BLAST",
          "significance": "Premier CS:GO/CS2 competitions with $1M+ prize pools",
          "internationalRecognition": "Teams from 20+ countries, global broadcast",
          "urlReferences": ["https://www.eslgaming.com", "https://www.blast.tv"]
        }
      ]
    },
    "boxing": {
      "tier1": [
        {
          "name": "World Championship Fights (U.S. venues)",
          "locationsExamples": "Las Vegas NV, New York NY, Los Angeles CA",
          "venuesExamples": "MGM Grand, Madison Square Garden, Staples Center",
          "sanctioningBody": "WBC, WBA, IBF, WBO / state athletic commissions",
          "significance": "World title bouts in recognized weight classes",
          "internationalRecognition": "Sanctioned by major boxing organizations, PPV broadcast",
          "mediaEvidence": "ESPN, DAZN, Showtime, PPV",
          "urlReferences": ["https://www.wbcboxing.com", "https://www.wbaboxing.com"]
        }
      ]
    },
    "trackAndField": {
      "tier1": [
        {
          "name": "USA Track & Field Outdoor Championships",
          "locationsExamples": "Varies annually (Eugene OR, Sacramento CA historical hosts)",
          "dates": "June-July (annual)",
          "sanctioningBody": "USA Track & Field / World Athletics",
          "significance": "U.S. national championships, Olympic/World Championship qualifying event",
          "internationalRecognition": "Top U.S. athletes, meets World Athletics standards",
          "urlReferences": ["https://www.usatf.org/events/2024/usatf-outdoor-championships"]
        },
        {
          "name": "Diamond League Meetings (U.S. stops)",
          "locationsExamples": "Eugene OR, Doha (if U.S. hosted)",
          "sanctioningBody": "World Athletics",
          "significance": "World Athletics' premier one-day meeting series",
          "internationalRecognition": "Top global athletes, world-class competition",
          "urlReferences": ["https://www.diamondleague.com"]
        }
      ]
    }
  }
}
```

---

## PART 2: RETRIEVAL & MATCHING ALGORITHM

### Input Parameters Required
```json
{
  "athleteInput": {
    "required": {
      "sport": "string (e.g., 'tennis', 'MMA', 'soccer')",
      "athleteLevel": "enum ['elite', 'professional', 'developing']",
      "requestedDuration": "integer (months, 1-36)",
      "startDate": "date (YYYY-MM-DD)",
      "specialization": "string (e.g., 'midfielder', 'welterweight', 'marathoner')"
    },
    "optional": {
      "currentRanking": "string or integer",
      "notableAchievements": "array of strings",
      "teamAffiliation": "string (if applicable)",
      "priorUSCompetition": "boolean",
      "geographicPreferences": "array of U.S. states/cities"
    }
  }
}
```

### Retrieval Process Workflow
```
STEP 1: SPORT CLASSIFICATION
├─ Parse athlete.sport input
├─ Map to sportCategories taxonomy
├─ Identify relevant event database sections
└─ Determine sport-specific requirements

STEP 2: EVENT FILTERING
├─ Query event database for athlete.sport
├─ Filter by athlete.startDate + requestedDuration timeframe
├─ Exclude events below Tier 3 (insufficient for P-1A)
└─ Prioritize events matching athlete.specialization

STEP 3: CALIBRATION TO ATHLETE LEVEL
├─ IF athleteLevel = 'elite':
│   ├─ Prioritize Tier 1 events (60% of itinerary)
│   ├─ Include Tier 2 events (30%)
│   └─ Minimal Tier 3 (10%, only if strategically necessary)
├─ IF athleteLevel = 'professional':
│   ├─ Prioritize Tier 2 events (50%)
│   ├─ Include Tier 1 where realistic (30%)
│   └─ Include Tier 3 as supporting events (20%)
└─ IF athleteLevel = 'developing':
│   ├─ Prioritize Tier 3 qualifying events (50%)
│   ├─ Include Tier 2 where accessible (40%)
│   └─ Aspirational Tier 1 if invitation/contract exists (10%)

STEP 4: WEB SEARCH AUGMENTATION (if needed)
├─ IF event database has < 5 events for sport:
│   ├─ Execute web_search for "{sport} professional tournaments USA 2025-2026"
│   ├─ Execute web_search for "{sport} international competitions United States"
│   ├─ Execute web_search for "{sport} sanctioning body USA events"
│   └─ Filter web results through distinguished reputation criteria
└─ Verify all web-discovered events against P-1A standards

STEP 5: ITINERARY CONSTRUCTION
├─ Chronologically arrange events across requested duration
├─ Ensure no gaps > 1 month without explanation
├─ Balance event frequency (avoid clustering all events in one period)
├─ Include mix of event types (tournaments, league games, championships)
└─ Verify total itinerary scores ≥ 15 points (above Borderline threshold)

STEP 6: DOCUMENTATION COMPILATION
├─ For each event, gather:
│   ├─ Official event URL
│   ├─ Sanctioning body URL
│   ├─ Media coverage URLs (ESPN, sport-specific media)
│   ├─ Historical significance evidence URLs
│   └─ Participant field/prize money documentation URLs
└─ Validate all URLs are active and substantive
```

---

## PART 3: DISTINGUISHED REPUTATION EVALUATION ENGINE

### Automated Event Scoring System
```javascript
function evaluateEventSignificance(event) {
  let significanceScore = 0;
  let significanceFactors = [];
  
  // Factor 1: International Sanctioning (0-4 points)
  if (event.sanctioningBody.includes("FIFA") || 
      event.sanctioningBody.includes("IOC") ||
      event.sanctioningBody.includes("FIBA") ||
      event.sanctioningBody.includes("World Athletics") ||
      event.sanctioningBody.includes("ITF")) {
    significanceScore += 4;
    significanceFactors.push("Sanctioned by premier international federation");
  } else if (event.sanctioningBody.includes("continental") ||
             event.sanctioningBody.includes("regional federation")) {
    significanceScore += 2;
    significanceFactors.push("Sanctioned by continental/regional sports authority");
  }
  
  // Factor 2: Historical Prestige (0-3 points)
  const eventAge = 2025 - event.establishedYear;
  if (eventAge >= 20) {
    significanceScore += 3;
    significanceFactors.push(`${eventAge}-year history demonstrates sustained prestige`);
  } else if (eventAge >= 10) {
    significanceScore += 2;
    significanceFactors.push(`${eventAge}-year track record of competition`);
  } else if (eventAge >= 5) {
    significanceScore += 1;
    significanceFactors.push(`${eventAge}-year history, emerging recognition`);
  }
  
  // Factor 3: Competitive Field Quality (0-4 points)
  if (event.participantField.includes("Olympic athletes") ||
      event.participantField.includes("world champions") ||
      event.participantField.includes("top 10 ranked")) {
    significanceScore += 4;
    significanceFactors.push("Participant field includes Olympic/world championship caliber athletes");
  } else if (event.participantField.includes("national team") ||
             event.participantField.includes("professional")) {
    significanceScore += 3;
    significanceFactors.push("Participant field includes national team members and professionals");
  } else if (event.participantField.includes("international") &&
             event.countriesRepresented >= 10) {
    significanceScore += 2;
    significanceFactors.push(`International field from ${event.countriesRepresented} countries`);
  }
  
  // Factor 4: Media Recognition (0-3 points)
  if (event.mediaCoverage.includes("ESPN") ||
      event.mediaCoverage.includes("NBC") ||
      event.mediaCoverage.includes("FOX Sports") ||
      event.mediaCoverage.includes("CBS Sports")) {
    significanceScore += 3;
    significanceFactors.push("Broadcast on major U.S. television networks");
  } else if (event.mediaCoverage.includes("streaming") ||
             event.mediaCoverage.includes("cable")) {
    significanceScore += 2;
    significanceFactors.push("Available via cable/streaming sports coverage");
  } else if (event.mediaCoverage.includes("online") ||
             event.mediaCoverage.includes("sport-specific media")) {
    significanceScore += 1;
    significanceFactors.push("Covered by sport-specific media outlets");
  }
  
  // Factor 5: Prize Money / Professional Status (0-3 points)
  if (event.prizeMoney >= 1000000) {
    significanceScore += 3;
    significanceFactors.push(`$${(event.prizeMoney/1000000).toFixed(1)}M+ prize money demonstrates elite competition`);
  } else if (event.prizeMoney >= 100000) {
    significanceScore += 2;
    significanceFactors.push(`$${(event.prizeMoney/1000).toFixed(0)}K+ prize money indicates professional status`);
  } else if (event.prizeMoney > 0 || event.isProfessionalEvent) {
    significanceScore += 1;
    significanceFactors.push("Professional competition with prize money");
  }
  
  // Factor 6: International Recognition (0-3 points)
  if (event.countriesRepresented >= 30) {
    significanceScore += 3;
    significanceFactors.push(`Truly global event with participants from ${event.countriesRepresented} countries`);
  } else if (event.countriesRepresented >= 15) {
    significanceScore += 2;
    significanceFactors.push(`International event with participants from ${event.countriesRepresented} countries`);
  } else if (event.countriesRepresented >= 5) {
    significanceScore += 1;
    significanceFactors.push(`Multi-national event with participants from ${event.countriesRepresented} countries`);
  }
  
  return {
    totalScore: significanceScore, // Max 20 points
    tier: significanceScore >= 15 ? "Tier 1 (Elite)" :
          significanceScore >= 10 ? "Tier 2 (Major)" :
          significanceScore >= 5 ? "Tier 3 (Qualifying)" :
          "Tier 4 (Insufficient)",
    factors: significanceFactors,
    p1aWorthiness: significanceScore >= 5 ? "Suitable for P-1A itinerary" : "AVOID - Insufficient for P-1A"
  };
}
```

---

## PART 4: DOCUMENT GENERATION TEMPLATES

### DOCUMENT A: NARRATIVE ITINERARY FORMAT
```markdown
# P-1A VISA PETITION ITINERARY
## [Athlete Name] - [Sport/Activity]
## Petition Period: [Start Date] to [End Date]

### ITINERARY OVERVIEW
This itinerary details [Athlete Name]'s planned participation in internationally recognized [sport] competitions and events within the United States during the requested P-1A visa period. All listed events meet the distinguished reputation standard required by 8 CFR 214.2(p) and demonstrate the international caliber of competition appropriate for P-1A classification.

---

## EVENT 1: [Event Name]

**Dates:** [Specific dates or date range]  
**Location:** [City, State]  
**Venue:** [Specific venue name]  
**Event Type:** [Tournament/League Match/Championship/etc.]

**Event Description:**
[2-3 sentence description of the event, its format, and the athlete's role/participation]

**Distinguished Reputation & International Recognition:**
[Event Name] is [sanctioned/organized] by [Sanctioning Body Name], [describe sanctioning body's international standing]. The event has been held annually since [Year], establishing a [X]-year history of hosting elite [sport] competition.

**Competitive Field & International Participation:**
This event attracts [number] participants from [X] countries, including [notable participant caliber - e.g., "Olympic medalists," "world-ranked athletes," "national team members"]. [Specific examples if available, e.g., "Past champions include [Name], [Achievement]"].

**Media Recognition:**
[Event Name] receives significant media coverage, including [broadcast network/streaming platform] broadcast/streaming to [audience reach]. [Additional media recognition details - print media, sport-specific outlets, etc.].

**Alignment with Athlete's International Recognition:**
[Athlete Name]'s participation in [Event Name] aligns with their international standing as [brief reference to athlete's achievements/ranking]. This event represents an appropriate competitive level for an internationally recognized [sport] athlete.

**Supporting Documentation:**
- Official event invitation/contract (attached as Exhibit [X])
- Event website and registration confirmation
- Sanctioning body recognition letter (if applicable)

---

[REPEAT FORMAT FOR EACH EVENT]

---

## ITINERARY SUMMARY TABLE

| Event # | Event Name | Dates | Location | Event Tier | Sanctioning Body |
|---------|------------|-------|----------|-----------|------------------|
| 1 | [Event Name] | [Dates] | [City, ST] | Tier [1/2/3] | [Organization] |
| 2 | [Event Name] | [Dates] | [City, ST] | Tier [1/2/3] | [Organization] |
| ... | ... | ... | ... | ... | ... |

**Total Events:** [Number]  
**Geographic Coverage:** [X] U.S. states  
**Competition Days:** [Approximate total]  
**International Sanctioning:** [X] of [Total] events sanctioned by international federations

---

## ITINERARY ANALYSIS & P-1A COMPLIANCE

### Coverage & Completeness
This itinerary provides comprehensive coverage of [Athlete Name]'s planned activities throughout the [X]-month requested visa period. Events are distributed across [timeframe breakdown], ensuring sustained competitive activity without excessive gaps.

### Event Quality Assessment
- **Tier 1 (Elite) Events:** [X] events ([XX]% of itinerary)
- **Tier 2 (Major) Events:** [X] events ([XX]% of itinerary)
- **Tier 3 (Qualifying) Events:** [X] events ([XX]% of itinerary)

### International Recognition Standards Met
All listed events meet or exceed the distinguished reputation standard for P-1A classification through:
1. **Sanctioning body recognition** - [X] events sanctioned by international/national federations
2. **Historical prestige** - Average event history: [X] years
3. **Competitive field quality** - International participants from [X] countries represented
4. **Media recognition** - [X] events with major media broadcast/coverage

### Alignment with 8 CFR 214.2(p) Requirements
This itinerary satisfies the mandatory itinerary requirement under 8 CFR 214.2(p)(2)(iv)(A) by providing:
- Specific dates and locations for all events
- Clear identification of events and venues
- Evidence of distinguished reputation for each event
- Demonstration of internationally recognized competition level
- Complete coverage of requested visa period

---

## CONCLUSION

The itinerary presented demonstrates [Athlete Name]'s continued participation in internationally recognized [sport] competitions at the highest levels of the sport. Each event represents a distinguished competition appropriate for an athlete of [his/her] caliber and international standing. The totality of the itinerary establishes the necessity of P-1A classification for [Athlete Name]'s planned U.S. activities.
```

---

### DOCUMENT B: URL REFERENCE SHEET FORMAT
```markdown
# P-1A ITINERARY - URL EVIDENCE REFERENCE SHEET
## [Athlete Name] - [Sport/Activity]
## Supporting Documentation Links for Event Significance

**Purpose of This Document:**  
This reference sheet provides direct URLs to third-party evidence demonstrating the distinguished reputation and international recognition of each event listed in [Athlete Name]'s P-1A itinerary. These links support the petition by allowing USCIS to verify event significance through official sources, sanctioning body websites, media coverage, and historical documentation.

---

## EVENT 1: [Event Name]

### Official Event Information
- **Event Official Website:** [URL]
- **Event Schedule/Draw:** [URL]
- **Registration/Entry Information:** [URL]

### Sanctioning Body Recognition
- **[Sanctioning Body Name] Official Page:** [URL]
- **Sanctioning Body Event Recognition:** [URL to specific event page on federation site]
- **Rules & Regulations (if applicable):** [URL]

### International Recognition Evidence
- **Participant List (showing international field):** [URL]
- **Past Champions/Results (demonstrating history):** [URL]
- **Prize Money/Awards Information:** [URL]

### Media Coverage & Recognition
- **Major Media Coverage:** 
  - [Network/Publication Name]: [URL to article/coverage]
  - [Network/Publication Name]: [URL to broadcast schedule/recap]
- **Sport-Specific Media:**
  - [Publication Name]: [URL]

### Historical Significance
- **Event History Page:** [URL]
- **Wikipedia Entry (if notable):** [URL]
- **Historical Results Database:** [URL]

### Competitive Field Quality
- **Participant Rankings/Bios:** [URL]
- **Notable Athletes Competing:** [URL to roster/entry list]
- **Qualification Standards:** [URL]

### Additional Supporting Evidence
- **Photo Gallery (showing scale/international participation):** [URL]
- **Live Streaming/Broadcast Information:** [URL]
- **Sponsor Information (indicating prestige):** [URL]

---

[REPEAT FORMAT FOR EACH EVENT]

---

## SANCTIONING BODY OVERVIEW

### Primary Governing Organizations Referenced

**[International Federation Name - e.g., FIFA, ITF, World Athletics]**
- **Official Website:** [URL]
- **About Page:** [URL describing organization's international role]
- **Member Nations:** [URL showing global membership]
- **Event Sanctioning Process:** [URL explaining how events gain recognition]

**[National Governing Body - e.g., USTA, USATF, U.S. Soccer]**
- **Official Website:** [URL]
- **Relationship to International Body:** [URL showing affiliation]
- **Event Calendar:** [URL]

---

## GENERAL REFERENCE RESOURCES

### Sport-Specific Rankings & Recognition Systems
- **World Rankings System:** [URL to official ranking site - ATP, WTA, FIFA, etc.]
- **Results Database:** [URL to comprehensive results archive]
- **Hall of Fame/Historical Records:** [URL]

### Media Resources
- **ESPN [Sport] Coverage:** [URL to sport section]
- **[Sport-Specific Major Publication]:** [URL]
- **Olympic/World Championship Archives (if applicable):** [URL]

### U.S. Visa Context
- **USCIS P-1A Information Page:** https://www.uscis.gov/working-in-the-united-states/temporary-workers/p-1a-internationally-recognized-athlete
- **8 CFR 214.2(p) Regulations:** https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.2#p-214.2(p)

---

## URL VERIFICATION LOG

| Event # | Event Name | Total URLs Provided | Last Verified | Status |
|---------|------------|---------------------|---------------|--------|
| 1 | [Event Name] | [X] | [Date] | ✓ Active |
| 2 | [Event Name] | [X] | [Date] | ✓ Active |
| ... | ... | ... | ... | ... |

**Verification Date:** [Date this document was compiled]  
**Total URLs Provided:** [Total count]  
**All URLs Verified Active:** [Yes/No]

---

## NOTES ON URL EVIDENCE USE

1. **Official Sources Prioritized:** This document prioritizes official event websites, sanctioning body pages, and established media outlets over user-generated content.

2. **Archived Content:** If any URL becomes inactive, archived versions may be accessed via the Internet Archive Wayback Machine (https://archive.org).

3. **Language:** Some URLs may link to pages in languages other than English, reflecting the international nature of the events. Google Translate or similar tools can provide translations if needed.

4. **Dynamic Content:** Some URLs (particularly schedules and participant lists) may update as events approach. The information was accurate as of the verification date listed.

5. **Additional Research:** USCIS adjudicators may independently verify event significance through additional research. These URLs provide a starting point for such verification.
```

---

## PART 5: QUALITY CONTROL & RFE PREVENTION MECHANISMS

### Pre-Output Validation Checklist
```javascript
function validateItinerary(generatedItinerary) {
  const validationResults = {
    passed: true,
    errors: [],
    warnings: [],
    score: 0
  };
  
  // CRITICAL ERROR CHECKS (must pass)
  
  // 1. Itinerary exists and is not empty
  if (!generatedItinerary || generatedItinerary.events.length === 0) {
    validationResults.errors.push("CRITICAL: No itinerary provided. P-1A REQUIRES detailed itinerary per 8 CFR 214.2(p)(2)(iv)(A)");
    validationResults.passed = false;
  }
  
  // 2. Minimum event count
  if (generatedItinerary.events.length < 3) {
    validationResults.warnings.push("WARNING: Fewer than 3 events may appear insufficient for sustained activity");
  }
  
  // 3. All events have required fields
  generatedItinerary.events.forEach((event, index) => {
    if (!event.dates || !event.location || !event.venueName || !event.eventName) {
      validationResults.errors.push(`CRITICAL: Event ${index + 1} missing required fields (dates/location/venue/name)`);
      validationResults.passed = false;
    }
  });
  
  // 4. No Tier 4 (insufficient) events
  const tier4Events = generatedItinerary.events.filter(e => e.tier === "Tier 4");
  if (tier4Events.length > 0) {
    validationResults.errors.push(`CRITICAL: ${tier4Events.length} events are Tier 4 (insufficient for P-1A). Remove: ${tier4Events.map(e => e.eventName).join(", ")}`);
    validationResults.passed = false;
  }
  
  // 5. Minimum itinerary score
  const itineraryScore = calculateItineraryScore(generatedItinerary);
  validationResults.score = itineraryScore;
  
  if (itineraryScore < 5) {
    validationResults.errors.push(`CRITICAL: Itinerary score ${itineraryScore}/25 is critically insufficient. USCIS override to "Likely Denial" will occur.`);
    validationResults.passed = false;
  } else if (itineraryScore < 10) {
    validationResults.warnings.push(`WARNING: Itinerary score ${itineraryScore}/25 is weak. USCIS override to "Borderline Case" likely. Add higher-tier events.`);
  } else if (itineraryScore < 15) {
    validationResults.warnings.push(`ADVISORY: Itinerary score ${itineraryScore}/25 is acceptable but could be strengthened with additional Tier 1-2 events.`);
  }
  
  // 6. Sanctioning body verification
  const unsanctionedEvents = generatedItinerary.events.filter(e => !e.sanctioningBody || e.sanctioningBody === "Unknown");
  if (unsanctionedEvents.length > 0) {
    validationResults.warnings.push(`WARNING: ${unsanctionedEvents.length} events lack clear sanctioning body: ${unsanctionedEvents.map(e => e.eventName).join(", ")}`);
  }
  
  // 7. Timeline coverage
  const timelineCoverage = calculateTimelineCoverage(generatedItinerary);
  if (timelineCoverage < 70) {
    validationResults.warnings.push(`WARNING: Itinerary covers only ${timelineCoverage}% of requested visa period. Gaps may trigger RFE.`);
  }
  
  // 8. Geographic diversity (minor check)
  const uniqueStates = new Set(generatedItinerary.events.map(e => e.location.state)).size;
  if (uniqueStates === 1 && generatedItinerary.events.length > 3) {
    validationResults.warnings.push(`ADVISORY: All events in single state. Consider geographic diversity if athlete's sport warrants it.`);
  }
  
  // 9. Event type variety
  const eventTypes = generatedItinerary.events.map(e => e.eventType);
  const uniqueTypes = new Set(eventTypes).size;
  if (uniqueTypes === 1 && generatedItinerary.events.length > 5) {
    validationResults.warnings.push(`ADVISORY: All events are same type (${eventTypes[0]}). Variety (tournaments, league, championships) may strengthen petition.`);
  }
  
  // 10. URL verification
  const urlCount = generatedItinerary.urlReferences.totalUrls;
  const avgUrlsPerEvent = urlCount / generatedItinerary.events.length;
  if (avgUrlsPerEvent < 3) {
    validationResults.warnings.push(`WARNING: Average ${avgUrlsPerEvent.toFixed(1)} URLs per event is low. Aim for 5-8 URLs per event for robust evidence.`);
  }
  
  return validationResults;
}
```

### Common RFE Triggers - Avoidance Protocol
```markdown
## RFE PREVENTION CHECKLIST

### Trigger 1: Vague or Incomplete Itinerary
**Problem:** "Various competitions", missing dates, no specific venues
**Prevention:**
- ✓ Every event has specific name
- ✓ Every event has specific dates (or narrow date range)
- ✓ Every event has city, state, AND venue name
- ✓ Every event has description of nature of activity

### Trigger 2: Local/Regional Events Only
**Problem:** Events lack international recognition, appear to be amateur level
**Prevention:**
- ✓ Zero Tier 4 events in itinerary
- ✓ Majority (60%+) of events are Tier 1-2
- ✓ Every event has sanctioning body identification
- ✓ Evidence of international participation for each event

### Trigger 3: Insufficient Event Quality Documentation
**Problem:** No proof that events have distinguished reputation
**Prevention:**
- ✓ Minimum 5 URLs per event in reference document
- ✓ At least one URL shows sanctioning body recognition
- ✓ At least one URL shows media coverage or historical prestige
- ✓ At least one URL shows participant field quality

### Trigger 4: Timeline Gaps
**Problem:** Large unexplained gaps between events
**Prevention:**
- ✓ No gaps exceeding 8 weeks without explanation
- ✓ Training periods or off-season explained in narrative
- ✓ Event distribution shows sustained activity plan
- ✓ If gaps exist, petitioner letter explains (off-season, injury recovery, etc.)

### Trigger 5: Mismatch Between Athlete Level & Events
**Problem:** Elite athlete competing in minor events, or vice versa
**Prevention:**
- ✓ Athlete's ranking/achievements aligned with event caliber
- ✓ Narrative explicitly addresses alignment
- ✓ If stepping up to higher level, explanation provided (e.g., "recent improvement in ranking qualifies for...")
- ✓ If stepping down temporarily, explanation provided (e.g., "returning from injury, building back to elite level")

### Trigger 6: Newly Created or Obscure Events
**Problem:** Events have no history, created specifically for applicant
**Prevention:**
- ✓ Prioritize events with 5+ year history
- ✓ If new event included, supplement with established events
- ✓ New events must show legitimate organization, sanctioning, and broader competitive purpose
- ✓ Never rely solely on events created by petitioning employer

### Trigger 7: Insufficient International Participation Evidence
**Problem:** Can't verify events attract international competitors
**Prevention:**
- ✓ URLs show participant lists from multiple countries
- ✓ Event descriptions mention international field
- ✓ Sanctioning body is international federation
- ✓ Past results show competitors from various nations
```

---

## PART 6: IMPLEMENTATION WORKFLOW

### Step-by-Step Generation Process
```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: INTAKE & CLASSIFICATION                             │
│ ├─ Receive athlete input parameters                         │
│ ├─ Validate input completeness                              │
│ ├─ Classify sport/activity                                  │
│ └─ Determine athlete caliber level                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: EVENT DATABASE QUERY                                │
│ ├─ Query internal event database for sport                  │
│ ├─ Filter by geographic scope (U.S. only)                   │
│ ├─ Filter by timeframe (requestedDuration)                  │
│ └─ Retrieve 20-30 candidate events                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: WEB AUGMENTATION (if database insufficient)         │
│ ├─ Execute web_search: "{sport} tournaments USA 2025"       │
│ ├─ Execute web_search: "{sanctioning body} events USA"      │
│ ├─ Execute web_fetch on promising event URLs                │
│ ├─ Parse event details (dates, location, sanctioning)       │
│ └─ Add to candidate event pool                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: EVENT EVALUATION & SCORING                          │
│ ├─ Run evaluateEventSignificance() on each candidate        │
│ ├─ Eliminate Tier 4 (insufficient) events                   │
│ ├─ Rank events by significance score                        │
│ └─ Tag events with tier classification                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: ATHLETE CALIBRATION                                 │
│ ├─ Match event tiers to athlete.level                       │
│ ├─ Select optimal event mix:                                │
│ │   Elite: 60% T1, 30% T2, 10% T3                           │
│ │   Professional: 30% T1, 50% T2, 20% T3                    │
│ │   Developing: 10% T1, 40% T2, 50% T3                      │
│ └─ Verify alignment with athlete's sport specialization     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: ITINERARY CONSTRUCTION                              │
│ ├─ Chronologically arrange events                           │
│ ├─ Ensure timeline coverage (no gaps > 8 weeks)             │
│ ├─ Balance event frequency (avoid clustering)               │
│ ├─ Include 5-12 events (depending on duration)              │
│ └─ Calculate total itinerary score (target 15+ points)      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: URL EVIDENCE COMPILATION                            │
│ ├─ For each selected event:                                 │
│ │   ├─ Gather official event URL                            │
│ │   ├─ Find sanctioning body recognition URL                │
│ │   ├─ Locate media coverage URLs (2-3 per event)           │
│ │   ├─ Find participant/results URLs                        │
│ │   └─ Locate historical significance URLs                  │
│ ├─ Verify all URLs are active                               │
│ └─ Organize by event in reference sheet structure           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 8: DOCUMENT GENERATION                                 │
│ ├─ Generate DOCUMENT A (Narrative Itinerary):               │
│ │   ├─ Apply template structure                             │
│ │   ├─ Write event descriptions with significance analysis  │
│ │   ├─ Include summary table                                │
│ │   └─ Add compliance analysis section                      │
│ ├─ Generate DOCUMENT B (URL Reference Sheet):               │
│ │   ├─ Apply template structure                             │
│ │   ├─ Organize URLs by event and category                  │
│ │   └─ Include verification log                             │
│ └─ Export both documents in specified format (.docx or .md) │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 9: QUALITY CONTROL VALIDATION                          │
│ ├─ Run validateItinerary() function                         │
│ ├─ Check for RFE triggers                                   │
│ ├─ Verify minimum scoring thresholds met                    │
│ ├─ Confirm all required fields present                      │
│ └─ Generate validation report                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 10: OUTPUT DELIVERY                                    │
│ ├─ Present DOCUMENT A to user                               │
│ ├─ Present DOCUMENT B to user                               │
│ ├─ Provide validation report                                │
│ └─ Offer recommendations for strengthening (if applicable)  │
└─────────────────────────────────────────────────────────────┘
```

---

## PART 7: SPORT-SPECIFIC GUIDANCE & EXAMPLES

### Example Outputs by Sport Category

#### TENNIS (Elite Athlete Example)
```
Input:
- Sport: Tennis
- Athlete Level: Elite (ATP Ranking #87)
- Duration: 9 months (February - October 2026)
- Specialization: Men's singles

Generated Itinerary (Abbreviated):
1. BNP Paribas Open - Indian Wells, CA - March 2026 [TIER 1]
2. Miami Open - Miami, FL - March-April 2026 [TIER 2]
3. US Men's Clay Court Championship - Houston, TX - April 2026 [TIER 2]
4. ATP 500 Washington - Washington DC - July-August 2026 [TIER 2]
5. Western & Southern Open - Cincinnati, OH - August 2026 [TIER 2]
6. US Open - New York, NY - August-September 2026 [TIER 1]
7. ATP 500 San Diego - San Diego, CA - September-October 2026 [TIER 2]

Itinerary Score: 18/25 (Likely Approval range)
- Event Distinguished Reputation: 9/10
- Completeness and Clarity: 5/5
- Alignment with Athlete Profile: 4/5
```

#### MMA (Professional Athlete Example)
```
Input:
- Sport: MMA (Mixed Martial Arts)
- Athlete Level: Professional (UFC contract)
- Duration: 12 months (January - December 2026)
- Specialization: Lightweight division

Generated Itinerary (Abbreviated):
1. UFC Fight Night - Las Vegas, NV - January 2026 [TIER 1]
2. UFC 300 - Las Vegas, NV - April 2026 [TIER 1]
3. UFC Fight Night - Denver, CO - July 2026 [TIER 1]
4. UFC 305 - New York, NY - October 2026 [TIER 1]

Itinerary Score: 20/25 (Strong Approval range)
- Event Distinguished Reputation: 10/10
- Completeness and Clarity: 5/5
- Alignment with Athlete Profile: 5/5

Note: MMA fighters typically have 2-4 bouts per year, so this itinerary appropriately reflects industry standards.
```

#### SOCCER (Professional Athlete Example - MLS)
```
Input:
- Sport: Soccer
- Athlete Level: Professional (MLS contract with Inter Miami CF)
- Duration: 10 months (February - November 2026)
- Specialization: Midfielder

Generated Itinerary (Abbreviated):
1. MLS Regular Season (30+ matches) - Various U.S. cities - February-October 2026 [TIER 1]
2. Leagues Cup 2026 - Various U.S. cities - July-August 2026 [TIER 2]
3. MLS Playoffs (if qualified) - Various U.S. cities - October-November 2026 [TIER 1]
4. International Friendly (Colombia vs. Mexico) - Miami, FL - June 2026 [TIER 2]

Itinerary Score: 21/25 (Strong Approval range)
- Event Distinguished Reputation: 10/10
- Completeness and Clarity: 5/5
- Alignment with Athlete Profile: 5/5
- Contract/Invitation Verification: 5/5 (MLS contract covers full season)

Note: For team sport athletes with league contracts, the itinerary centers on the league season schedule supplemented by cup competitions.
```

#### ESPORTS (Developing Athlete Example)
```
Input:
- Sport: Esports (League of Legends)
- Athlete Level: Developing (Challenger tier, no LCS contract yet)
- Duration: 6 months (March - August 2026)
- Specialization: Mid lane

Generated Itinerary (Abbreviated):
1. LCS Academy Spring Playoffs - Los Angeles, CA - April 2026 [TIER 2]
2. LCS Academy Summer Season - Los Angeles, CA - June-August 2026 [TIER 2]
3. Riot Games NA Scouting Grounds - Los Angeles, CA - August 2026 [TIER 2]

Itinerary Score: 14/25 (Borderline/Likely Approval)
- Event Distinguished Reputation: 7/10 (Academy level, not main LCS)
- Completeness and Clarity: 4/5
- Alignment with Athlete Profile: 3/5 (appropriate for developing player)

Recommendation: Strengthen with evidence of international recognition (past tournament placements, streaming presence, foreign team trials) to support Tier 2 event participation justification.
```

#### MARATHON (Elite Athlete Example)
```
Input:
- Sport: Marathon
- Athlete Level: Elite (Sub-2:10 personal best)
- Duration: 11 months (January - November 2026)
- Specialization: Road racing, marathons

Generated Itinerary (Abbreviated):
1. Houston Marathon - Houston, TX - January 2026 [TIER 2]
2. Boston Marathon - Boston, MA - April 2026 [TIER 1]
3. Grandma's Marathon - Duluth, MN - June 2026 [TIER 3]
4. Chicago Marathon - Chicago, IL - October 2026 [TIER 1]
5. New York City Marathon - New York, NY - November 2026 [TIER 1]

Itinerary Score: 19/25 (Likely Approval/Strong Approval border)
- Event Distinguished Reputation: 9/10 (3 World Marathon Majors)
- Completeness and Clarity: 5/5
- Alignment with Athlete Profile: 5/5 (elite marathoner, sub-2:10 time)

Note: Marathon schedule appropriately spaced (3-4 months between major races) reflecting sport's recovery requirements.
```

---

## PART 8: ERROR HANDLING & EDGE CASES

### Scenario 1: Insufficient Events in Database
```
Problem: Sport has limited U.S. competition calendar (e.g., niche sport)

Solution Protocol:
1. Expand search radius to related sport categories
2. Include qualifying events and developmental competitions (Tier 3)
3. Supplement with international events HELD IN U.S. (foreign teams visiting)
4. Lengthen time between events with training period explanations
5. If still insufficient, output WARNING that P-1A may not be appropriate visa category for this sport
```

### Scenario 2: Athlete Level Doesn't Match Available Events
```
Problem: Elite athlete in sport with only Tier 2-3 U.S. events

Solution Protocol:
1. Focus narrative on "best available U.S. competitions in this sport"
2. Emphasize athlete's international achievements justify P-1A despite event tier
3. Include statements like "While [Sport] has limited major championship events in the U.S., [Athlete] is competing at the highest level available domestically"
4. Compensate with exceptionally strong evidence of athlete's international recognition in other petition sections
```

### Scenario 3: Long Gaps in Competition Schedule
```
Problem: Sport has seasonal nature with 3+ month competition-free periods

Solution Protocol:
1. Explicitly address in narrative: "Off-season period (June-August) reflects standard [Sport] competitive calendar"
2. Include training camp or exhibition event descriptions if available
3. Note petitioner will maintain athlete's visa status during off-season
4. If possible, add international events in U.S. during gap period (foreign tours, training camps)
```

### Scenario 4: Newly Emerging Sport (e.g., new esport title)
```
Problem: Sport too new to have established event history or sanctioning bodies

Solution Protocol:
1. Focus on organizer credibility (e.g., "organized by [Company Name], developer of [Game Title] with X million monthly players")
2. Emphasize prize money and international participant field
3. Include ANY available media coverage URLs
4. Compare to established esports titles for context ("Similar format to League of Legends LCS")
5. Include WARNING in validation that lack of history increases RFE risk
```

### Scenario 5: Team Sport Athlete Without Current Team Contract
```
Problem: Athlete seeking P-1A for team sport but no signed contract yet

Solution Protocol:
1. Build itinerary around tryouts with specific teams
2. Include international friendly matches if athlete's national team involved
3. Focus on invitations to training camps with professional teams
4. Include showcase events or combine-style evaluations
5. Note in narrative: "Itinerary represents competitive opportunities; final team placement will be confirmed upon visa approval"
6. RECOMMEND to user that securing team contract before filing greatly strengthens petition
```

---

## PART 9: TECHNICAL SPECIFICATIONS

### Output File Formats

#### Document A (Narrative Itinerary)
```
- Primary Format: .docx (Microsoft Word)
- Alternative Format: .md (Markdown)
- Font: Times New Roman, 12pt
- Margins: 1 inch all sides
- Line Spacing: Double-spaced
- Page Numbers: Bottom center
- Headers: Include athlete name and petition type
- Length: Typically 15-30 pages depending on event count
```

#### Document B (URL Reference Sheet)
```
- Primary Format: .docx (Microsoft Word) with clickable hyperlinks
- Alternative Format: .md (Markdown) with HTML links
- Font: Arial, 11pt
- Margins: 0.75 inch all sides
- Line Spacing: Single-spaced with spacing between event sections
- Organized: Hierarchical structure with clear section breaks
- Length: Typically 10-20 pages depending on URL count
```

### API Integration Points (if applicable)
```python
# Example API structure for system integration

class P1AItineraryGenerator:
    def __init__(self, event_database, web_search_api, document_generator):
        self.event_db = event_database
        self.web_search = web_search_api
        self.doc_gen = document_generator
    
    def generate_itinerary(self, athlete_input):
        """
        Main entry point for itinerary generation
        
        Args:
            athlete_input (dict): Athlete parameters (sport, level, duration, etc.)
        
        Returns:
            dict: {
                'document_a': binary (DOCX file),
                'document_b': binary (DOCX file),
                'validation_report': dict,
                'metadata': dict
            }
        """
        # Validation
        validated_input = self.validate_input(athlete_input)
        
        # Event retrieval
        candidate_events = self.retrieve_events(validated_input)
        
        # Event scoring
        scored_events = self.score_events(candidate_events)
        
        # Itinerary construction
        final_itinerary = self.construct_itinerary(scored_events, validated_input)
        
        # URL compilation
        url_evidence = self.compile_url_evidence(final_itinerary)
        
        # Document generation
        doc_a = self.doc_gen.create_narrative(final_itinerary, validated_input)
        doc_b = self.doc_gen.create_url_sheet(url_evidence)
        
        # Quality control
        validation = self.validate_output(final_itinerary, doc_a, doc_b)
        
        return {
            'document_a': doc_a,
            'document_b': doc_b,
            'validation_report': validation,
            'metadata': {
                'event_count': len(final_itinerary.events),
                'itinerary_score': final_itinerary.score,
                'tier_distribution': final_itinerary.tier_breakdown,
                'generation_timestamp': datetime.now().isoformat()
            }
        }
```

---

## PART 10: USER INTERACTION & REFINEMENT

### Interactive Refinement Protocol
```
After initial generation, system should offer refinement options:

1. "Would you like to adjust the event tier distribution?"
   - Option to increase/decrease Tier 1 events
   - System recalculates itinerary score impact

2. "Would you like to modify geographic preferences?"
   - Option to concentrate events in specific regions
   - System filters events accordingly

3. "Would you like to extend/shorten the competition schedule?"
   - Option to add/remove events
   - System maintains timeline coverage

4. "Would you like to focus on specific event types?"
   - Option to prioritize tournaments vs. league vs. championships
   - System adjusts event mix

5. "Would you like to see alternative events for any listed competition?"
   - User can request swaps for specific events
   - System offers comparable alternatives from same tier
```

---

## FINAL OUTPUT SUMMARY

### What This System Delivers

**For Each P-1A Itinerary Request:**

1. **DOCUMENT A: Comprehensive Narrative Itinerary (15-30 pages)**
   - Professional formatting ready for USCIS submission
   - Detailed description of each event with significance analysis
   - Legal compliance analysis demonstrating 8 CFR 214.2(p) satisfaction
   - Summary tables and statistics
   - Clear explanation of distinguished reputation for each event

2. **DOCUMENT B: URL Evidence Reference Sheet (10-20 pages)**
   - 5-8 verified URLs per event
   - Organized by evidence category (official, sanctioning, media, historical)
   - Clickable hyperlinks for easy verification
   - Verification log showing all URLs active
   - Sanctioning body overview section

3. **Validation Report**
   - Itinerary score calculation (out of 25 points)
   - RFE risk assessment
   - Recommendations for strengthening (if applicable)
   - Confirmation of all quality control checks passed

4. **Metadata Package**
   - Event count and tier distribution
   - Geographic coverage statistics
   - Timeline coverage percentage
   - URL count statistics
   - Generation timestamp

### Success Metrics
- **Itinerary Score:** Target 15+ points (Likely Approval range)
- **Event Count:** 5-12 events (depending on sport and duration)
- **URL Evidence:** 30-80 total URLs across all events
- **Timeline Coverage:** 80%+ of requested visa period
- **Tier Distribution:** 60%+ Tier 1-2 events for elite athletes

---

## SYSTEM IMPLEMENTATION CHECKLIST

✅ **Knowledge Base Complete**
- Sport category taxonomy defined
- Event tier system established
- U.S. event database populated (core sports)
- Distinguished reputation evaluation criteria codified

✅ **RAG Architecture Defined**
- Input parameter structure specified
- Retrieval algorithm workflow documented
- Web search augmentation protocol established
- Event scoring mechanism created

✅ **Document Generation Ready**
- Template A (Narrative Itinerary) complete
- Template B (URL Reference Sheet) complete
- Formatting specifications defined
- Export functionality specified

✅ **Quality Control Implemented**
- Validation function created
- RFE prevention checklist established
- Error handling protocols defined
- Edge case solutions documented

✅ **User Experience Designed**
- Input collection process defined
- Refinement options specified
- Output delivery method established
- Metadata reporting included

---

## LEGAL DISCLAIMER

**This system generates itineraries for P-1A visa petitions based on publicly available information about U.S. sporting events and USCIS regulatory requirements. The output documents are tools to assist in petition preparation and do not constitute legal advice. Final petition strategy, event selection, and legal argumentation should be reviewed by a qualified immigration attorney familiar with the athlete's specific circumstances and current USCIS adjudication trends.**

**Event participation contracts, invitations, and venue confirmations must be independently secured by the petitioning employer or athlete. This system identifies appropriate events but does not create or guarantee athlete access to listed competitions.**

**URLs and event information are subject to change. All generated content should be verified before petition filing.**

---

# END OF MASTER PROMPT

This comprehensive system is now ready for implementation as a RAG-powered P-1A itinerary generation tool that will create legally compliant, USCIS-ready documentation for athletes seeking P-1A visas.