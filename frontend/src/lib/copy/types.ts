import type {
  BuyerType,
  CapexRange,
  DecisionNeeded,
  DemandCertainty,
  DevelopmentStage,
  EvaluationContext,
  LocationSpecificity,
  OpportunityType,
  ProjectContext,
  SiteControl,
} from "../../types/interview";

export type OptionText = {
  label: string;
  helper?: string;
  examples?: string;
};

export type WelcomeFeatureCopy = {
  title: string;
  description: string;
};

export type UiCopy = {
  welcome: {
    brand: string;
    kicker: string;
    headline: string;
    description: string;
    start: string;
    interviewTimeLabel: string;
    interviewTimeValue: string;
    reportTimeLabel: string;
    reportTimeValue: string;
    bootstrapIdea: string;
    features: WelcomeFeatureCopy[];
  };
  chrome: {
    next: string;
    previous: string;
    cancel: string;
    startInterview: string;
    questionOf: (current: number, total: number) => string;
    minutesLeft: (minutes: number) => string;
    newOpportunity: string;
    edit: string;
    selected: string;
    other: string;
    languageGroupLabel: string;
    englishShort: string;
    turkishShort: string;
  };
  framing: {
    title: string;
    message: string;
  };
  projectContext: {
    kicker: string;
    title: string;
    message: string;
  };
  q1: { title: string; message: string };
  q2: {
    title: string;
    message: string;
    allSectors: string;
    searchPlaceholder: string;
    describeSector: string;
    sectorOtherPlaceholder: string;
    sectorOtherHelper: string;
  };
  q3: {
    title: string;
    message: string;
    fieldLabel: string;
    placeholder: string;
    helper: string;
  };
  q4: {
    title: string;
    message: string;
    messageForType: (phrase: string) => string;
    helper: string;
    restrictedWarning: string;
    restrictedAck: string;
    allCountries: string;
    searchPlaceholder: string;
    emptyMessage: string;
    minQueryMessage: string;
  };
  q5: {
    title: string;
    message: (countryName: string) => string;
    countryFallback: string;
    cityLabel: string;
    regionLabel: string;
    cityPlaceholder: string;
    regionPlaceholder: string;
    helper: string;
  };
  q6: { title: string; message: string };
  q7: {
    title: string;
    message: string;
    currencyLabel: string;
    otherLabel: string;
    notSureConfirm: string;
  };
  q8: { title: string; message: string };
  q9: {
    title: string;
    message: string;
    unknownConfirm: string;
  };
  q10: {
    title: string;
    message: string;
    hypothesisConfirm: string;
    buyerUndefinedWarning: string;
  };
  q11: {
    title: string;
    message: string;
    assetLightMessage: string;
    searchingConfirm: string;
  };
  q12: {
    title: string;
    message: string;
    stallHelper: string;
  };
  review: {
    title: string;
    message: string;
    incompleteError: string;
    nextLabel: string;
    draftPersisted: string;
    groupOpportunity: string;
    groupPlace: string;
    groupScale: string;
    groupContext: string;
    rowProjectContext: string;
    rowOpportunityType: string;
    rowSector: string;
    rowProduct: string;
    rowCountry: string;
    rowLocation: string;
    rowStage: string;
    rowCurrency: string;
    rowCapital: string;
    rowEvaluator: string;
    rowDecisionNeeded: string;
    rowSite: string;
    scaleNotSet: string;
    confidencePreview: (band: string) => string;
    confidenceLowOpen: (open: string) => string;
    confidenceLowScale: string;
    confidenceHigh: string;
    confidenceMedium: (open: string) => string;
    restrictedGeo: string;
    openCapital: string;
    openBuyer: string;
    openDemand: string;
    openSite: string;
    openLocation: string;
    openSector: string;
  };
  decision: {
    editLabel: string;
    policyLabel: string;
    status: string;
    statusAccepted: string;
    statusAmended: string;
    statusRejected: string;
    publicationHeld: string;
    confidenceSuffix: string;
    bankDisclaimer: string;
    disclaimer: string;
    disclaimerRecorded: string;
    defect: string;
    snapshotNote: string;
    snapshotPersisted: string;
    clearSaved: string;
    sectionDecision: string;
    sectionConfidence: string;
    sectionConditions: string;
    sectionWhy: string;
    sectionNext: string;
    sectionOpportunity: string;
    bandHigh: string;
    bandMedium: string;
    bandLow: string;
    postureProceed: string;
    postureDefer: string;
    deferPostureSentence: string;
    of: string;
    evaluator: {
      sectionLabel: string;
      helper: string;
      statusChoice: string;
      accept: string;
      amend: string;
      reject: string;
      accepted: string;
      amended: string;
      rejected: string;
      nameLabel: string;
      nameHelper: string;
      namePlaceholder: string;
      nameRequiredError: string;
      reasonLabel: string;
      reasonHelper: string;
      recordedByPrefix: string;
      reasonPrefix: string;
      amendReasonError: string;
      rejectReasonError: string;
    };
  };
  validation: {
    selectOption: string;
    sectorOther: string;
    productLength: string;
    productContact: string;
    country: string;
    restrictedAck: string;
    locationText: string;
  };
  options: {
    projectContext: Record<ProjectContext, OptionText>;
    opportunityType: Record<OpportunityType, OptionText>;
    locationSpecificity: Record<LocationSpecificity, OptionText>;
    capexRange: Record<CapexRange, OptionText>;
    evaluationContext: Record<EvaluationContext, OptionText>;
    buyerTypePrivate: Record<BuyerType, OptionText>;
    buyerTypePublic: Record<BuyerType, OptionText>;
    buyerTypeDevfin: Record<BuyerType, OptionText>;
    demandCertaintyPrivate: Record<DemandCertainty, OptionText>;
    demandCertaintyPublic: Record<DemandCertainty, OptionText>;
    siteControl: Record<SiteControl, OptionText>;
    decisionNeeded: Record<DecisionNeeded, OptionText>;
    developmentStage: Record<DevelopmentStage, OptionText>;
  };
  opportunityTypeAck: Record<OpportunityType, string>;
  sectors: Record<string, string>;
  productChips: Record<string, { value: string; label: string }[]>;
  context: {
    q9: {
      publicTitle: string;
      publicMessage: string;
      devfinTitle: string;
      devfinMessage: string;
    };
    q10: {
      publicTitle: string;
      publicMessage: string;
      devfinTitle: string;
      devfinMessage: string;
    };
    reviewSiteGroup: {
      private: string;
      public: string;
      development_finance: string;
    };
    offtakePublic: string;
    grantDisclaimer: string;
    conditionsIntro: {
      defer: string;
      private: string;
      public: string;
      development_finance: string;
    };
    emptyFallback: {
      private: string;
      public: string;
      development_finance: string;
    };
    nextCommission: {
      private: string;
      public: string;
      development_finance: string;
    };
    proceedWhy: {
      private: string;
      public: string;
      development_finance: string;
    };
    proceedPosture: {
      private: string;
      public: string;
      development_finance: string;
    };
  };
  card: {
    offtakeUnknown: string;
    offtakeHypothesis: string;
    offtakeAdvanced: string;
    condSite: string;
    condScale: string;
    condGeo: string;
    whyBuyerMega: string;
    whyConceptMega: string;
    whyTripleThin: string;
    whyDemandMega: string;
    whyBankHyp: string;
    whyFinanceRead: string;
    whyConfThin: string;
    whyCompare: string;
    whyNotBankable: string;
    whyExportBlocked: string;
    whyMandate: string;
    nextIfConditions: string;
    nextNoUnconditional: string;
    nextDeferClose: string;
    nextDeferStaff: string;
    nextExport: string;
  };
  drivers: Record<string, string>;
};
