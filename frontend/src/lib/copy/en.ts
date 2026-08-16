import {
  BUYER_TYPE_OPTIONS,
  CAPEX_RANGE_BASE,
  DECISION_NEEDED_OPTIONS,
  DEMAND_CERTAINTY_OPTIONS,
  DEVELOPMENT_STAGE_OPTIONS,
  EVALUATION_CONTEXT_OPTIONS,
  LOCATION_SPECIFICITY_OPTIONS,
  OPPORTUNITY_TYPE_ACK,
  OPPORTUNITY_TYPE_OPTIONS,
  PRODUCT_CHIPS_BY_ROOT,
  PROJECT_CONTEXT_OPTIONS,
  SECTOR_TAXONOMY,
  SITE_CONTROL_OPTIONS,
  WIZARD_COPY,
} from "../../mocks/interview";
import type { OptionText, UiCopy } from "./types";
import type { SelectOption } from "../../types/interview";

function fromOptions<T extends string>(
  options: SelectOption<T>[]
): Record<T, OptionText> {
  return Object.fromEntries(
    options.map((option) => [
      option.value,
      {
        label: option.label,
        helper: option.helper,
        examples: option.examples,
      },
    ])
  ) as Record<T, OptionText>;
}

const PUBLIC_BUYER: UiCopy["options"]["buyerTypePublic"] = {
  b2b_contract: { label: "Named institutional users with an agreement" },
  b2b_spot: { label: "Users pay as they go — tariff, ticket, or fee" },
  b2c: { label: "Households / general public" },
  b2g: { label: "Government is the payer or user" },
  mixed: { label: "Mixed users" },
  unknown: { label: "Not defined yet" },
};

const DEVFIN_BUYER: UiCopy["options"]["buyerTypeDevfin"] = {
  b2b_contract: { label: "Named users or offtakers with an agreement" },
  b2b_spot: { label: "Users pay as they go — no long contract" },
  b2c: { label: "Households / individual users" },
  b2g: { label: "Government or public institution" },
  mixed: { label: "Mixed users" },
  unknown: { label: "Not defined yet" },
};

const PUBLIC_DEMAND: UiCopy["options"]["demandCertaintyPublic"] = {
  binding: {
    label:
      "Binding commitment — contract, tariff decision, budget line, or signed offtake",
  },
  loi: {
    label:
      "Written but non-binding — MOU, LoI, or council resolution not yet funded",
  },
  advanced: { label: "Named users or agencies, nothing on paper" },
  hypothesis: { label: "Need is assumed; no named user or payer" },
  not_applicable: { label: "No user-fee or offtake by design" },
};

export const EN: UiCopy = {
  welcome: {
    brand: "Invest Smarter",
    kicker: "Structured investment screening before the feasibility study.",
    headline: "",
    description:
      "Evaluate an investment idea, public project, or development-finance file through a guided 12-question interview and receive a rules-based first recommendation.",
    start: "Start assessment",
    prototypeNote:
      "This prototype does not generate a feasibility study, financial model, grant decision, or investment advice.",
    interviewTimeLabel: "Estimated interview time:",
    interviewTimeValue: "8 minutes",
    reportTimeLabel: "Recommendation:",
    reportTimeValue: "In this session",
    bootstrapIdea: "New investment opportunity",
    features: [
      {
        title: "Structured interview",
        description:
          "A guided 12-question screen for private, public, and development-finance opportunities.",
      },
      {
        title: "Review before recommendation",
        description:
          "Confirm the answers before any recommendation is produced.",
      },
      {
        title: "Rules-based decision card",
        description:
          "Receive a deterministic first recommendation with confidence and conditions.",
      },
      {
        title: "Evaluator record",
        description:
          "Record whether the evaluator accepts, amends, or rejects the recommendation.",
      },
    ],
  },
  chrome: {
    next: "Next",
    previous: "Previous",
    cancel: "Cancel",
    startInterview: "Start interview",
    questionOf: (current, total) => `Question ${current} of ${total}`,
    minutesLeft: (minutes) => `About ${minutes} minutes left`,
    newOpportunity: "New opportunity",
    edit: "Edit",
    selected: "Selected",
    other: "Other",
    languageGroupLabel: "Language",
    englishShort: "EN",
    turkishShort: "TR",
  },
  qaHarness: {
    title: "Decision QA Harness",
    helper:
      "Internal fixture runner for rules.v0.1. Not part of the customer workflow.",
    expectedPosture: "Expected posture",
    actualPosture: "Actual posture",
    expectedConfidence: "Expected confidence",
    actualConfidence: "Actual confidence",
    pass: "Pass",
    check: "Check",
    rulesQa: "Decision rules QA",
    rulesPassed: "Passed",
    rulesFailed: "Failed",
    selectPrompt: "Select a fixture to render the Decision Card.",
    notSet: "—",
  },
  framing: {
    title: WIZARD_COPY.framing.title,
    message: WIZARD_COPY.framing.message,
  },
  projectContext: {
    kicker: WIZARD_COPY.projectContext.kicker,
    title: WIZARD_COPY.projectContext.title,
    message: WIZARD_COPY.projectContext.message,
  },
  q1: { title: WIZARD_COPY.q1.title, message: WIZARD_COPY.q1.message },
  q2: {
    title: WIZARD_COPY.q2.title,
    message: WIZARD_COPY.q2.message,
    allSectors: "All sectors",
    searchPlaceholder: "Search by name or code",
    describeSector: "Describe the sector",
    sectorOtherPlaceholder: "e.g. Waste-to-energy",
    sectorOtherHelper:
      "3–40 characters. Letters, numbers, spaces, and hyphens only.",
  },
  q3: {
    title: WIZARD_COPY.q3.title,
    message: WIZARD_COPY.q3.message,
    fieldLabel: "Product or output",
    placeholder: "e.g. 50 MW solar PV plant",
    helper: "8–80 characters. Chips fill this field — you can edit them.",
  },
  q4: {
    title: WIZARD_COPY.q4.title,
    message: WIZARD_COPY.q4.message,
    messageForType: (phrase) =>
      `For this ${phrase}, where is the investment located? Country is required for market and regulatory analysis.`,
    helper: WIZARD_COPY.q4.helper,
    restrictedWarning: WIZARD_COPY.q4.restrictedWarning,
    restrictedAck: WIZARD_COPY.q4.restrictedAck,
    allCountries: "All countries",
    searchPlaceholder: "Search by name or ISO code",
    emptyMessage: "No matching countries",
    minQueryMessage: "Type at least 2 letters to search",
  },
  q5: {
    title: WIZARD_COPY.q5.title,
    message: (countryName) =>
      `How specific is the location in ${countryName}? City or region helps; ‘not decided’ is fine at this stage.`,
    countryFallback: "the selected country",
    cityLabel: WIZARD_COPY.q5.cityLabel,
    regionLabel: WIZARD_COPY.q5.regionLabel,
    cityPlaceholder: WIZARD_COPY.q5.cityPlaceholder,
    regionPlaceholder: WIZARD_COPY.q5.regionPlaceholder,
    helper: "2–60 characters.",
  },
  q6: { title: WIZARD_COPY.q6.title, message: WIZARD_COPY.q6.message },
  q7: {
    title: WIZARD_COPY.q7.title,
    message: WIZARD_COPY.q7.message,
    currencyLabel: WIZARD_COPY.q7.currencyLabel,
    otherLabel: WIZARD_COPY.q7.otherLabel,
    notSureConfirm: WIZARD_COPY.q7.notSureConfirm,
  },
  q8: { title: WIZARD_COPY.q8.title, message: WIZARD_COPY.q8.message },
  q9: {
    title: WIZARD_COPY.q9.title,
    message: WIZARD_COPY.q9.message,
    unknownConfirm: WIZARD_COPY.q9.unknownConfirm,
  },
  q10: {
    title: WIZARD_COPY.q10.title,
    message: WIZARD_COPY.q10.message,
    hypothesisConfirm: WIZARD_COPY.q10.hypothesisConfirm,
    buyerUndefinedWarning: WIZARD_COPY.q10.buyerUndefinedWarning,
  },
  q11: {
    title: WIZARD_COPY.q11.title,
    message: WIZARD_COPY.q11.message,
    assetLightMessage: WIZARD_COPY.q11.assetLightMessage,
    searchingConfirm: WIZARD_COPY.q11.searchingConfirm,
  },
  q12: {
    title: WIZARD_COPY.q12.title,
    message: WIZARD_COPY.q12.message,
    stallHelper: WIZARD_COPY.q12.stallHelper,
  },
  review: {
    title: WIZARD_COPY.review.title,
    message: WIZARD_COPY.review.message,
    incompleteError: WIZARD_COPY.review.incompleteError,
    nextLabel: WIZARD_COPY.review.nextLabel,
    draftPersisted: WIZARD_COPY.review.draftPersisted,
    groupOpportunity: "Opportunity",
    groupPlace: "Place",
    groupScale: "Scale and stage",
    groupContext: "Context",
    rowProjectContext: "Project context",
    rowOpportunityType: "Type of opportunity",
    rowSector: "Sector",
    rowProduct: "What it produces",
    rowCountry: "Country",
    rowLocation: "Location",
    rowStage: "Development stage",
    rowCurrency: "Currency",
    rowCapital: "Capital range",
    rowEvaluator: "Who is evaluating this",
    rowDecisionNeeded: "Decision needed",
    rowSite: "Site control",
    scaleNotSet: "Scale not set",
    confidencePreview: (band) => `Confidence preview · ${band}`,
    confidenceLowOpen: (open) => `Confidence will be low. Still open: ${open}.`,
    confidenceLowScale: "Confidence will be low. Capital scale is not set.",
    confidenceHigh:
      "Confidence will be high. Collected answers contain no soft unknowns.",
    confidenceMedium: (open) =>
      `Confidence will be medium. Still open: ${open}.`,
    restrictedGeo:
      "This geography requires review before any recommendation is published.",
    openCapital: "capital scale",
    openBuyer: "buyer type",
    openDemand: "demand certainty",
    openSite: "site control",
    openLocation: "location",
    openSector: "sector",
  },
  decision: {
    editLabel: WIZARD_COPY.decision.editLabel,
    policyLabel: WIZARD_COPY.decision.policyLabel,
    status: WIZARD_COPY.decision.status,
    statusAccepted: WIZARD_COPY.decision.statusAccepted,
    statusAmended: WIZARD_COPY.decision.statusAmended,
    statusRejected: WIZARD_COPY.decision.statusRejected,
    publicationHeld: WIZARD_COPY.decision.publicationHeld,
    confidenceSuffix: WIZARD_COPY.decision.confidenceSuffix,
    bankDisclaimer: WIZARD_COPY.decision.bankDisclaimer,
    disclaimer: WIZARD_COPY.decision.disclaimer,
    disclaimerRecorded: WIZARD_COPY.decision.disclaimerRecorded,
    defect: WIZARD_COPY.decision.defect,
    snapshotNote: WIZARD_COPY.decision.snapshotNote,
    snapshotPersisted: WIZARD_COPY.decision.snapshotPersisted,
    clearSaved: WIZARD_COPY.decision.clearSaved,
    sectionDecision: "Decision",
    sectionConfidence: "Confidence",
    sectionConditions: "Conditions",
    sectionWhy: "Why this decision",
    sectionNext: "What should happen next",
    sectionOpportunity: "Opportunity",
    bandHigh: "High",
    bandMedium: "Medium",
    bandLow: "Low",
    postureProceed: "Proceed with conditions",
    postureDefer: "Defer",
    deferPostureSentence:
      "This file is not decision-ready. Do not spend further time or budget on it as framed until the gaps below are closed.",
    of: "of",
    evaluator: { ...WIZARD_COPY.decision.evaluator },
  },
  validation: {
    selectOption: "Select an option to continue",
    sectorOther:
      "Enter a sector of 3–40 characters using letters, numbers, spaces, or hyphens",
    productLength: "Describe the output in 8–80 characters",
    productContact:
      "Remove any URL or email — this should be a product, not a link",
    country: "Choose a country from the list",
    restrictedAck: "Confirm you understand analysis may be held for review",
    locationText: "Enter a city or region of 2–60 characters",
  },
  options: {
    projectContext: fromOptions(PROJECT_CONTEXT_OPTIONS),
    opportunityType: fromOptions(OPPORTUNITY_TYPE_OPTIONS),
    locationSpecificity: fromOptions(LOCATION_SPECIFICITY_OPTIONS),
    capexRange: fromOptions(CAPEX_RANGE_BASE),
    evaluationContext: fromOptions(EVALUATION_CONTEXT_OPTIONS),
    buyerTypePrivate: fromOptions(BUYER_TYPE_OPTIONS),
    buyerTypePublic: PUBLIC_BUYER,
    buyerTypeDevfin: DEVFIN_BUYER,
    demandCertaintyPrivate: fromOptions(DEMAND_CERTAINTY_OPTIONS),
    demandCertaintyPublic: PUBLIC_DEMAND,
    siteControl: fromOptions(SITE_CONTROL_OPTIONS),
    decisionNeeded: fromOptions(DECISION_NEEDED_OPTIONS),
    developmentStage: fromOptions(DEVELOPMENT_STAGE_OPTIONS),
  },
  opportunityTypeAck: { ...OPPORTUNITY_TYPE_ACK },
  sectors: Object.fromEntries(
    SECTOR_TAXONOMY.map((sector) => [sector.code, sector.label])
  ),
  productChips: Object.fromEntries(
    Object.entries(PRODUCT_CHIPS_BY_ROOT).map(([root, chips]) => [
      root,
      chips.map((chip) => ({ value: chip, label: chip })),
    ])
  ),
  context: {
    q9: {
      publicTitle: "Who uses or pays",
      publicMessage:
        "Who is expected to use or pay for this? If that is undefined, say so. I will not invent a user.",
      devfinTitle: "Who is the user or offtaker",
      devfinMessage:
        "Who is expected to use or pay for the output of the supported activity? Undefined is allowed and will lower confidence.",
    },
    q10: {
      publicTitle: "How firm is use or payment",
      publicMessage:
        "How evidenced is demand or public use today? A public good with no named user is a hypothesis, not a skip.",
      devfinTitle: "Evidence of demand or use",
      devfinMessage:
        "How firm is demand or use today? Grant screening still needs this. I will not treat a concept note as evidence.",
    },
    reviewSiteGroup: {
      private: "Commercial and site",
      public: "Use, evidence, and site",
      development_finance: "Use, evidence, and support readiness",
    },
    offtakePublic:
      "Public use or payment is not evidenced. Name the user or payer, or accept that demand is still a hypothesis.",
    grantDisclaimer:
      "This is not an eligibility opinion, not a grant award, and not a commitment to disburse.",
    conditionsIntro: {
      defer: "Closing these is what would allow a new recommendation.",
      private: "Accept these before spending further resources.",
      public: "Accept these before committing further public time or budget.",
      development_finance:
        "Accept these before taking this file into appraisal or support preparation.",
    },
    emptyFallback: {
      private:
        "No additional evidence condition was triggered. This prototype still does not issue an unconditional proceed.",
      public:
        "No additional public-evidence condition was triggered. Treat this as a conditional screen, not authorization to commit public resources.",
      development_finance:
        "No additional appraisal condition was triggered. Treat this as a conditional screen, not an eligibility opinion or funding commitment.",
    },
    nextCommission: {
      private: WIZARD_COPY.decision.nextCommission,
      public:
        "Do not commission a study or commit public resources on this recommendation alone.",
      development_finance:
        "Do not treat this as an eligibility decision, award decision, or funding commitment.",
    },
    proceedWhy: {
      private:
        "The file has a usable shape for a screen, but only if the conditions are accepted.",
      public:
        "The project has a usable shape for an initial public-project screen, but only if the conditions are accepted.",
      development_finance:
        "The file has a usable shape for an initial support screen, but only if the conditions are accepted.",
    },
    proceedPosture: {
      private:
        "Advance only if the conditions below are accepted. This is not clearance to commission a full study.",
      public:
        "Advance only if the conditions below are accepted. This is not clearance to commit public resources or launch a study.",
      development_finance:
        "Advance only if the conditions below are accepted. This is not clearance to enter appraisal, approve support, or commit funding.",
    },
  },
  card: {
    offtakeUnknown: "Define who buys the output, then evidence that demand.",
    offtakeHypothesis:
      "Demand is still a hypothesis. Evidence a named buyer path before treating revenue as real.",
    offtakeAdvanced:
      "Demand is in discussion, not on paper. Convert that into a letter or contract before treating offtake as evidenced.",
    condSite:
      "The site is still being searched. Secure control before treating this as a build-ready file.",
    condScale:
      "Bound the capital requirement to a range. “Not sure” is not a scale.",
    condGeo:
      "This geography requires compliance review before any report is published.",
    whyBuyerMega:
      "Buyer type is undefined at 100 million or above. That is not a credit- or study-ready file.",
    whyConceptMega: "A concept at this scale is not ready for a study.",
    whyTripleThin:
      "Concept, unspecified location, and an open commercial or scale hole. The file is too thin to decide.",
    whyDemandMega:
      "Demand is a hypothesis at 100 million or above. That is not a study-ready file.",
    whyBankHyp:
      "A bank early screen cannot treat hypothesized demand as credit-ready.",
    whyFinanceRead:
      "A financing read needs demand on paper. This is not a bankable financial model.",
    whyConfThin: "Evidence quality is too low to recommend advancing.",
    whyCompare:
      "This is an absolute posture for this file. Ranking it against other options is out of scope of this screen.",
    whyNotBankable: "This is not a bankable financial model.",
    whyExportBlocked:
      "Geography does not change the posture. It blocks publication until review.",
    whyMandate: "This opportunity does not match the desk that is evaluating it.",
    nextIfConditions:
      "If the conditions are not acceptable, stop. Do not “proceed with caution.”",
    nextNoUnconditional: "This screen does not issue an unconditional proceed.",
    nextDeferClose:
      "Close the gaps named in Conditions. Re-run only after those answers exist.",
    nextDeferStaff:
      "Do not staff a file, open a credit workbench, or draft an IPA promotion response as if a decision had been taken.",
    nextExport:
      "Do not export or send this recommendation until compliance review is complete.",
  },
  drivers: {
    "Capital scale is unknown.": "Capital scale is unknown.",
    "Buyer type is undefined.": "Buyer type is undefined.",
    "Demand is a hypothesis.": "Demand is a hypothesis.",
    "Location is country-only.": "Location is country-only.",
    "Site is not selected.": "Site is not selected.",
    "Sector is unspecified (Other).": "Sector is unspecified (Other).",
    "Restricted geography caps confidence.":
      "Restricted geography caps confidence.",
    "Confidence is evidence quality, not attractiveness.":
      "Confidence is evidence quality, not attractiveness.",
    "Collected answers contain no soft unknowns.":
      "Collected answers contain no soft unknowns.",
  },
};
