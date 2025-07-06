// Enhanced Pharma Pain Point Detection System
class PharmaIntelligenceEngine {
  constructor() {
    this.fdaBaseUrl = 'https://api.fda.gov';
    this.clinicalTrialsBaseUrl = 'https://clinicaltrials.gov/api/v2';
    this.painPointTriggers = this.initializePainPointTriggers();
  }

  // Initialize comprehensive pain point detection triggers
  initializePainPointTriggers() {
    return {
      // Phase 2 Stagnation Indicators
      phase2Stuck: {
        keywords: ['dose finding', 'optimal dose', 'dose escalation', 'safety profile', 'biomarker'],
        timeInPhase: 24, // months
        multiplePhase2Studies: 2,
        recruitmentIssues: ['slow enrollment', 'recruitment challenges', 'patient identification']
      },
      
      // Pre-Meeting Preparation Needs
      regulatoryMeeting: {
        fdaSubmissions: ['pre-IND', 'Type A', 'Type B', 'Type C', 'EOP2', 'pre-BLA', 'pre-NDA'],
        recentHoldActions: ['clinical hold', 'partial hold', 'complete response letter'],
        upcomingMilestones: ['IND submission', 'NDA filing', 'BLA submission', 'PDUFA date']
      },
      
      // Competitive Intelligence Needs
      competitiveThreats: {
        similarTrials: 3, // threshold for competitive trials in same indication
        recentApprovals: ['breakthrough', 'fast track', 'priority review', 'accelerated approval'],
        marketEntry: ['first-in-class', 'best-in-class', 'me-too']
      },
      
      // Market Access Preparation
      marketAccess: {
        phase3Ready: ['phase 3', 'pivotal trial', 'registration study'],
        healthEconomics: ['cost-effectiveness', 'budget impact', 'real-world evidence'],
        payerStrategy: ['value proposition', 'pricing strategy', 'market access']
      }
    };
  }

  // 1. Enhanced FDA Application Analysis with Pain Point Detection
  async getPharmaApplicationsWithPainPoints() {
    try {
      logger.info('Fetching FDA applications with pain point analysis...');
      
      const endDate = moment().format('YYYYMMDD');
      const startDate = moment().subtract(730, 'days').format('YYYYMMDD'); // 2 years for better context
      
      // Get FDA drug applications
      const applications = await this.fetchFDAApplications(startDate, endDate);
      
      // Get FDA enforcement reports for regulatory issues
      const enforcementData = await this.fetchFDAEnforcementData();
      
      // Get FDA meeting summaries for regulatory intelligence
      const meetingData = await this.fetchFDAMeetingSummaries();
      
      // Analyze each application for pain points
      const analyzedApplications = [];
      for (const app of applications) {
        try {
          const painPointAnalysis = await this.comprehensiveApplicationAnalysis(app, enforcementData, meetingData);
          if (painPointAnalysis && painPointAnalysis.painPoints.length > 0) {
            analyzedApplications.push(painPointAnalysis);
          }
        } catch (error) {
          logger.warn('Failed to analyze application:', error.message);
        }
      }
      
      return this.prioritizeOpportunities(analyzedApplications);
    } catch (error) {
      logger.error('Error in FDA pain point analysis:', error.message);
      return [];
    }
  }

  // Enhanced FDA data fetching
  async fetchFDAApplications(startDate, endDate) {
    try {
      // Primary endpoint - FDA Drugs@FDA
      const response = await axios.get(`${this.fdaBaseUrl}/drug/drugsfda.json`, {
        params: {
          search: `submissions.submission_status_date:[${startDate} TO ${endDate}] AND (submissions.submission_type:ORIG OR submissions.submission_type:SUPPL OR submissions.submission_type:RESUBMISSION)`,
          limit: 200
        },
        timeout: 45000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PharmaIntelligence/2.0'
        }
      });

      return response.data?.results || [];
    } catch (error) {
      logger.warn('Primary FDA endpoint failed, trying alternatives...');
      return await this.fetchFDAApplicationsFallback();
    }
  }

  // Get FDA enforcement and regulatory action data
  async fetchFDAEnforcementData() {
    try {
      const response = await axios.get(`${this.fdaBaseUrl}/drug/enforcement.json`, {
        params: {
          search: 'report_date:[20230101 TO 20241231]',
          limit: 100
        },
        timeout: 30000
      });
      
      return response.data?.results || [];
    } catch (error) {
      logger.warn('FDA enforcement data unavailable:', error.message);
      return [];
    }
  }

  // Get FDA meeting summaries and guidance documents
  async fetchFDAMeetingSummaries() {
    try {
      // This would typically require scraping FDA website or accessing internal databases
      // For now, we'll simulate with key regulatory milestones
      const mockMeetingData = [
        { type: 'Type B', indication: 'oncology', outcome: 'agreement_reached', date: '2024-01-15' },
        { type: 'EOP2', indication: 'cardiovascular', outcome: 'additional_data_requested', date: '2024-02-20' }
      ];
      
      return mockMeetingData;
    } catch (error) {
      logger.warn('FDA meeting data unavailable:', error.message);
      return [];
    }
  }

  // 2. Enhanced Clinical Trials Analysis with Advanced Pain Point Detection
  async getClinicalTrialsWithPainPoints() {
    try {
      logger.info('Fetching clinical trials with comprehensive pain point analysis...');
      
      // Get multiple trial datasets for comprehensive analysis
      const activeTrials = await this.fetchActiveTrials();
      const completedTrials = await this.fetchCompletedTrials();
      const suspendedTrials = await this.fetchSuspendedTrials();
      
      // Combine and analyze all trial data
      const allTrials = [...activeTrials, ...completedTrials, ...suspendedTrials];
      
      // Enhanced analysis with pain point detection
      const analyzedTrials = [];
      for (const trial of allTrials) {
        try {
          const painPointAnalysis = await this.advancedTrialPainPointAnalysis(trial, allTrials);
          if (painPointAnalysis && painPointAnalysis.painPoints.length > 0) {
            analyzedTrials.push(painPointAnalysis);
          }
        } catch (error) {
          logger.warn('Failed to analyze trial:', error.message);
        }
      }
      
      return this.groupByCompanyAndPrioritize(analyzedTrials);
    } catch (error) {
      logger.error('Error in clinical trials pain point analysis:', error.message);
      return [];
    }
  }

  // Fetch active trials with focus on potential pain points
  async fetchActiveTrials() {
    const params = {
      'format': 'json',
      'query.intr': 'Drug',
      'filter.overallStatus': 'RECRUITING,ACTIVE_NOT_RECRUITING,ENROLLING_BY_INVITATION',
      'pageSize': 100,
      'fields': 'NCTId,BriefTitle,Phase,OverallStatus,StartDate,CompletionDate,LeadSponsorName,Condition,InterventionName,EnrollmentCount,StudyType,LocationCountry,DesignPrimaryPurpose'
    };

    const response = await axios.get(`${this.clinicalTrialsBaseUrl}/studies`, {
      params,
      timeout: 45000
    });

    return response.data?.studies || [];
  }

  // Fetch completed trials to identify patterns
  async fetchCompletedTrials() {
    const params = {
      'format': 'json',
      'query.intr': 'Drug',
      'filter.overallStatus': 'COMPLETED',
      'filter.lastUpdate': '[2023-01-01,2024-12-31]',
      'pageSize': 75,
      'fields': 'NCTId,BriefTitle,Phase,CompletionDate,LeadSponsorName,Condition,ResultsFirstSubmitted,WhyStopped'
    };

    const response = await axios.get(`${this.clinicalTrialsBaseUrl}/studies`, {
      params,
      timeout: 45000
    });

    return response.data?.studies || [];
  }

  // Fetch suspended/terminated trials - major pain point indicator
  async fetchSuspendedTrials() {
    const params = {
      'format': 'json',
      'query.intr': 'Drug',
      'filter.overallStatus': 'SUSPENDED,TERMINATED,WITHDRAWN',
      'filter.lastUpdate': '[2023-01-01,2024-12-31]',
      'pageSize': 50,
      'fields': 'NCTId,BriefTitle,Phase,LeadSponsorName,Condition,WhyStopped,LastUpdateSubmitted'
    };

    const response = await axios.get(`${this.clinicalTrialsBaseUrl}/studies`, {
      params,
      timeout: 45000
    });

    return response.data?.studies || [];
  }

  // Comprehensive application analysis with pain point detection
  async comprehensiveApplicationAnalysis(app, enforcementData, meetingData) {
    try {
      const basic = this.analyzeApplication(app);
      if (!basic) return null;

      const painPoints = [];
      const businessOpportunities = [];
      const urgencyIndicators = [];

      // Analyze submission patterns for delays/issues
      const submissionAnalysis = this.analyzeSubmissionPatterns(app);
      if (submissionAnalysis.hasIssues) {
        painPoints.push({
          type: 'regulatory_delays',
          severity: submissionAnalysis.severity,
          description: submissionAnalysis.description,
          opportunity: 'Regulatory strategy consulting and submission optimization',
          urgency: submissionAnalysis.urgency
        });
      }

      // Check for regulatory actions/enforcement
      const enforcementIssues = this.checkEnforcementActions(app, enforcementData);
      if (enforcementIssues.length > 0) {
        painPoints.push({
          type: 'regulatory_compliance',
          severity: 'high',
          description: 'Recent FDA enforcement actions or compliance issues',
          opportunity: 'Compliance remediation and regulatory strategy',
          urgency: 'immediate'
        });
      }

      // Analyze for upcoming FDA meetings
      const meetingPrep = this.identifyMeetingPreparationNeeds(app, meetingData);
      if (meetingPrep.needsPrep) {
        painPoints.push({
          type: 'meeting_preparation',
          severity: 'medium',
          description: meetingPrep.description,
          opportunity: 'FDA meeting preparation and regulatory intelligence',
          urgency: meetingPrep.urgency
        });
      }

      // Market intelligence needs
      const marketIntel = this.assessMarketIntelligenceNeeds(app);
      if (marketIntel.hasNeeds) {
        painPoints.push({
          type: 'market_intelligence',
          severity: marketIntel.severity,
          description: marketIntel.description,
          opportunity: 'Competitive intelligence and market research',
          urgency: marketIntel.urgency
        });
      }

      return {
        ...basic,
        painPoints,
        businessOpportunities,
        urgencyScore: this.calculateUrgencyScore(painPoints),
        lastAnalyzed: new Date().toISOString(),
        nextContactWindow: this.determineOptimalContactTiming(painPoints)
      };
    } catch (error) {
      logger.error('Error in comprehensive application analysis:', error.message);
      return null;
    }
  }

async advancedTrialPainPointAnalysis(trial, allTrials) {
  try {
    const basic = this.comprehensiveTrialAnalysis(trial);
    if (!basic) return null;

    const painPoints = [];
    const companyContext = this.buildCompanyContext(basic.sponsor?.lead, allTrials);
    const phaseInfo = this.classifyTrialPhase(trial);

    // NEW: Phase 2 stagnation detection (highest priority)
    const phase2Issues = this.detectPhase2Stagnation(trial, companyContext);
    if (phase2Issues.isStuck) {
      painPoints.push({
        type: 'phase2_stagnation',
        severity: phase2Issues.severity,
        description: phase2Issues.description,
        opportunity: 'Phase 2 optimization and advancement strategy',
        urgency: phase2Issues.severity === 'CRITICAL' ? 'critical' : 'high',
        evidence: phase2Issues.evidence,
        specificNeeds: [
          'Root cause analysis of Phase 2 delays',
          'Dose optimization and patient enrichment strategy',
          'Endpoint refinement for Phase 3 readiness',
          'FDA meeting strategy for advancement pathway'
        ]
      });
    }

    // NEW: New trial startup opportunities
    const newOpportunities = this.detectNewTrialOpportunities(trial);
    newOpportunities.forEach(opp => {
      painPoints.push({
        type: opp.type.toLowerCase(),
        severity: opp.severity,
        description: opp.description,
        opportunity: this.getOpportunityDescription(opp.type),
        urgency: opp.urgency,
        window: opp.window,
        specificNeeds: this.getSpecificNeeds(opp.type, phaseInfo)
      });
    });

    // Enhanced recruitment challenges with Phase 2 specific issues
    const recruitmentIssues = this.analyzeAdvancedRecruitmentChallenges(trial, phaseInfo);
    if (recruitmentIssues.hasChallenges) {
      painPoints.push({
        type: 'recruitment_challenges',
        severity: recruitmentIssues.severity,
        description: recruitmentIssues.description,
        opportunity: 'Patient identification and enrollment optimization',
        urgency: recruitmentIssues.urgency,
        specificNeeds: [
          'Patient population analysis and site selection',
          'Eligibility criteria optimization',
          'Competitive enrollment landscape assessment',
          'Digital patient identification strategies'
        ]
      });
    }

    // Enhanced biomarker strategy issues
    const biomarkerStrategy = this.analyzeBiomarkerStrategy(
      trial.eligibilityCriteria || trial.eligibility?.criteria || '', 
      trial.title || trial.briefTitle || ''
    );
    
    if (biomarkerStrategy.usesBiomarkers && biomarkerStrategy.complexity === 'HIGH') {
      painPoints.push({
        type: 'complex_biomarker_strategy',
        severity: 'HIGH',
        description: `Complex ${biomarkerStrategy.enrichmentStrategy} biomarker strategy requires FDA alignment`,
        opportunity: 'Biomarker strategy optimization and regulatory pathway clarity',
        urgency: 'high',
        specificNeeds: [
          'Biomarker validation strategy and regulatory precedents',
          'Companion diagnostic development pathway',
          'Patient enrichment vs. all-comers strategy analysis',
          'Labeling and market access implications'
        ]
      });
    }

    // Enhanced endpoint challenges detection
    const endpointIssues = this.analyzeEndpointChallenges(trial, phaseInfo);
    if (endpointIssues.hasChallenges) {
      painPoints.push({
        type: 'endpoint_challenges',
        severity: endpointIssues.severity,
        description: endpointIssues.description,
        opportunity: 'Endpoint optimization and FDA alignment strategy',
        urgency: endpointIssues.urgency,
        specificNeeds: [
          'Endpoint validation and regulatory acceptance analysis',
          'Surrogate vs. clinical endpoint strategy',
          'Composite endpoint design and powering',
          'Real-world evidence integration opportunities'
        ]
      });
    }

    // Competitive pressure analysis with urgency
    const competitivePressure = this.analyzeCompetitivePressureAdvanced(trial, allTrials, phaseInfo);
    if (competitivePressure.hasIntensePressure) {
      painPoints.push({
        type: 'competitive_pressure',
        severity: competitivePressure.severity,
        description: competitivePressure.description,
        opportunity: 'Competitive differentiation and acceleration strategy',
        urgency: competitivePressure.urgency,
        specificNeeds: [
          'Competitive landscape mapping and timeline analysis',
          'Differentiation strategy and positioning',
          'Expedited pathway opportunities',
          'Market access and commercialization timing'
        ]
      });
    }

    // Regulatory pathway optimization for specific phases
    const regulatoryGaps = this.identifyRegulatoryGaps(trial, companyContext, phaseInfo);
    if (regulatoryGaps.hasGaps) {
      painPoints.push({
        type: 'regulatory_strategy_gaps',
        severity: regulatoryGaps.severity,
        description: regulatoryGaps.description,
        opportunity: 'Regulatory pathway optimization and FDA strategy',
        urgency: regulatoryGaps.urgency,
        specificNeeds: regulatoryGaps.specificNeeds
      });
    }

    // Trial design complexity issues
    const designComplexity = this.analyzeTrialDesignComplexity(trial, phaseInfo);
    if (designComplexity.isComplex) {
      painPoints.push({
        type: 'complex_trial_design',
        severity: designComplexity.severity,
        description: designComplexity.description,
        opportunity: 'Trial design optimization and regulatory strategy',
        urgency: designComplexity.urgency,
        specificNeeds: [
          'Statistical plan optimization and power analysis',
          'Adaptive design considerations and FDA guidance',
          'Interim analysis strategy and DMC charter',
          'Protocol amendment minimization strategies'
        ]
      });
    }

    return {
      ...basic,
      painPoints,
      phaseInfo,
      companyContext,
      urgencyScore: this.calculateEnhancedUrgencyScore(painPoints, phaseInfo, trial),
      contactRecommendation: this.generateAdvancedContactRecommendation(painPoints, trial, phaseInfo),
      nextContactWindow: this.determineOptimalContactTiming(painPoints),
      priorityRanking: this.calculatePriorityRanking(painPoints, phaseInfo)
    };
  } catch (error) {
    logger.error('Error in advanced trial analysis:', error.message);
    return null;
  }
}

// 14. NEW: Analyze advanced recruitment challenges
analyzeAdvancedRecruitmentChallenges(trial, phaseInfo) {
  try {
    let hasChallenges = false;
    let severity = 'low';
    let description = '';
    let urgency = 'low';

    const targetEnrollment = trial.enrollment?.count || trial.enrollmentCount || 0;
    const startDate = this.extractTrialStartDate(trial);
    const status = trial.status || trial.overallStatus || '';
    
    if (startDate && targetEnrollment > 0) {
      const monthsSinceStart = moment().diff(moment(startDate), 'months');
      
      // Phase-specific enrollment timeline expectations
      let expectedTimeframe;
      if (phaseInfo.primary === 'PHASE1' || phaseInfo.primary === 'EARLY_PHASE1') {
        expectedTimeframe = 12; // Phase 1 should complete enrollment in ~12 months
      } else if (phaseInfo.primary === 'PHASE2') {
        expectedTimeframe = 18; // Phase 2 should complete in ~18 months
      } else if (phaseInfo.primary === 'PHASE3') {
        expectedTimeframe = 24; // Phase 3 can take up to 24 months
      } else {
        expectedTimeframe = 18; // Default
      }
      
      if (monthsSinceStart > expectedTimeframe && status === 'RECRUITING') {
        hasChallenges = true;
        severity = monthsSinceStart > (expectedTimeframe * 1.5) ? 'high' : 'medium';
        description = `Extended ${phaseInfo.primary} recruitment (${monthsSinceStart} months) suggests patient identification challenges`;
        urgency = severity === 'high' ? 'high' : 'medium';
      }
    }

    // Small enrollment with long timeline suggests rare population
    if (targetEnrollment < 50 && phaseInfo.primary !== 'PHASE1') {
      hasChallenges = true;
      severity = 'medium';
      description += (description ? ' | ' : '') + 'Small patient population requires specialized recruitment strategy';
      urgency = 'medium';
    }

    // Biomarker-driven enrollment challenges
    const eligibility = trial.eligibilityCriteria || trial.eligibility?.criteria || '';
    const biomarkerRequirements = [
      'positive', 'mutation', 'expression', 'biomarker', 'testing required',
      'companion diagnostic', 'genomic', 'molecular', 'sequencing'
    ];
    
    const biomarkerCount = biomarkerRequirements.filter(req => 
      eligibility.toLowerCase().includes(req)
    ).length;
    
    if (biomarkerCount >= 2) {
      hasChallenges = true;
      severity = biomarkerCount >= 4 ? 'high' : 'medium';
      description += (description ? ' | ' : '') + 'Multiple biomarker requirements may limit eligible patient pool';
      urgency = 'medium';
    }

    // Prior therapy requirements (suggests late-line, harder to recruit)
    const priorTherapyRequirements = [
      'refractory', 'resistant', 'relapsed', 'failed', 'progression',
      'prior lines', 'previous treatment', 'salvage', 'second-line', 'third-line'
    ];
    
    if (priorTherapyRequirements.some(req => eligibility.toLowerCase().includes(req))) {
      hasChallenges = true;
      severity = 'medium';
      description += (description ? ' | ' : '') + 'Late-line therapy requirements present recruitment complexity';
      urgency = 'medium';
    }

    // Geographic/site limitations
    const locations = trial.locations || [];
    if (locations.length < 10 && targetEnrollment > 100) {
      hasChallenges = true;
      severity = 'medium';
      description += (description ? ' | ' : '') + 'Limited site network for target enrollment size';
      urgency = 'medium';
    }

    return { hasChallenges, severity, description, urgency };
  } catch (error) {
    logger.warn('Error analyzing advanced recruitment challenges:', error.message);
    return { hasChallenges: false };
  }
}

// 15. NEW: Analyze endpoint challenges
analyzeEndpointChallenges(trial, phaseInfo) {
  try {
    let hasChallenges = false;
    let severity = 'low';
    let description = '';
    let urgency = 'low';

    const title = (trial.title || trial.briefTitle || '').toLowerCase();
    const outcomes = trial.primaryOutcomes || trial.outcomesModule?.primaryOutcomes || [];

    // Novel or experimental endpoints
    const novelEndpointKeywords = [
      'novel endpoint', 'exploratory endpoint', 'biomarker endpoint',
      'composite endpoint', 'surrogate endpoint', 'patient reported outcome',
      'quality of life', 'digital endpoint', 'wearable', 'real-world evidence'
    ];
    
    if (novelEndpointKeywords.some(keyword => title.includes(keyword))) {
      hasChallenges = true;
      severity = 'high';
      description = 'Novel endpoints require FDA validation and precedent analysis';
      urgency = 'high';
    }

    // Multiple primary endpoints (suggests uncertainty)
    if (outcomes.length > 2) {
      hasChallenges = true;
      severity = outcomes.length > 3 ? 'high' : 'medium';
      description += (description ? ' | ' : '') + `Multiple primary endpoints (${outcomes.length}) suggest regulatory uncertainty`;
      urgency = 'medium';
    }

    // Phase-specific endpoint concerns
    if (phaseInfo.primary === 'PHASE2') {
      // Phase 2 should be moving toward Phase 3-ready endpoints
      const phase3ReadyKeywords = [
        'overall survival', 'progression-free survival', 'objective response rate',
        'complete response', 'duration of response', 'time to progression'
      ];
      
      const hasPhase3Ready = phase3ReadyKeywords.some(keyword => 
        title.includes(keyword) || 
        outcomes.some(outcome => outcome.measure?.toLowerCase().includes(keyword))
      );
      
      if (!hasPhase3Ready) {
        hasChallenges = true;
        severity = 'medium';
        description += (description ? ' | ' : '') + 'Phase 2 endpoints may need alignment with Phase 3 strategy';
        urgency = 'medium';
      }
    }

    // Feasibility/proof-of-concept studies suggest early development
    const earlyStageKeywords = [
      'feasibility', 'proof of concept', 'pilot', 'dose finding', 'safety run-in'
    ];
    
    if (earlyStageKeywords.some(keyword => title.includes(keyword))) {
      hasChallenges = true;
      severity = 'medium';
      description += (description ? ' | ' : '') + 'Early-stage endpoints require progression planning to registrational studies';
      urgency = 'medium';
    }

    return { hasChallenges, severity, description, urgency };
  } catch (error) {
    logger.warn('Error analyzing endpoint challenges:', error.message);
    return { hasChallenges: false };
  }
}

// 16. NEW: Analyze competitive pressure with urgency
analyzeCompetitivePressureAdvanced(trial, allTrials, phaseInfo) {
  try {
    let hasIntensePressure = false;
    let severity = 'low';
    let description = '';
    let urgency = 'low';

    const indication = this.extractPrimaryIndication(trial);
    const sponsor = trial.sponsor?.lead || '';

    // Count similar trials in same indication and phase
    const competitorTrials = allTrials.filter(t => {
      const tIndication = this.extractPrimaryIndication(t);
      const tPhase = this.classifyTrialPhase(t);
      const tSponsor = t.sponsor?.lead || '';
      
      return this.isSimilarIndication(indication, tIndication) &&
             tPhase.primary === phaseInfo.primary &&
             tSponsor !== sponsor &&
             (t.status === 'RECRUITING' || t.status === 'ACTIVE_NOT_RECRUITING');
    });

    if (competitorTrials.length >= 3) {
      hasIntensePressure = true;
      severity = competitorTrials.length >= 5 ? 'high' : 'medium';
      description = `${competitorTrials.length} competing ${phaseInfo.primary} trials in ${indication} create time pressure`;
      urgency = 'high';
    }

    // Check for recently completed competitor trials (suggests approaching approvals)
    const recentCompletions = allTrials.filter(t => {
      const tIndication = this.extractPrimaryIndication(t);
      const tPhase = this.classifyTrialPhase(t);
      const completionDate = t.completionDate || t.primaryCompletionDate;
      
      return this.isSimilarIndication(indication, tIndication) &&
             tPhase.primary === 'PHASE3' &&
             completionDate &&
             moment().diff(moment(completionDate), 'months') < 12;
    });

    if (recentCompletions.length > 0) {
      hasIntensePressure = true;
      severity = 'high';
      description += (description ? ' | ' : '') + `Recent Phase 3 completions in ${indication} suggest imminent competitive approvals`;
      urgency = 'critical';
    }

    // Large pharma competition
    const bigPharmaCompetitors = competitorTrials.filter(t => {
      const sponsor = (t.sponsor?.lead || '').toLowerCase();
      const bigPharma = [
        'pfizer', 'merck', 'novartis', 'roche', 'genentech', 'sanofi', 
        'gsk', 'astrazeneca', 'johnson', 'abbvie', 'bristol', 'eli lilly'
      ];
      return bigPharma.some(company => sponsor.includes(company));
    });

    if (bigPharmaCompetitors.length > 0) {
      hasIntensePressure = true;
      severity = 'high';
      description += (description ? ' | ' : '') + `Big pharma competition requires differentiation strategy`;
      urgency = 'high';
    }

    return { hasIntensePressure, severity, description, urgency };
  } catch (error) {
    logger.warn('Error analyzing competitive pressure:', error.message);
    return { hasIntensePressure: false };
  }
}

// 17. NEW: Identify regulatory gaps with phase-specific needs
identifyRegulatoryGaps(trial, companyContext, phaseInfo) {
  try {
    let hasGaps = false;
    let severity = 'low';
    let description = '';
    let urgency = 'low';
    let specificNeeds = [];

    const indication = this.extractPrimaryIndication(trial);
    const status = trial.status || trial.overallStatus || '';

    // Phase-specific regulatory gaps
    if (phaseInfo.primary === 'PHASE1' || phaseInfo.primary === 'EARLY_PHASE1') {
      // Early phase regulatory needs
      hasGaps = true;
      severity = 'medium';
      description = 'Early phase development requires IND strategy and Phase 2 planning';
      urgency = 'medium';
      specificNeeds = [
        'IND submission optimization and FDA pre-IND meeting strategy',
        'Dose escalation design and safety committee protocols',
        'Biomarker development strategy for Phase 2 readiness',
        'Patient population definition and expansion cohort planning'
      ];
    } else if (phaseInfo.primary === 'PHASE2') {
      // Phase 2 specific gaps
      hasGaps = true;
      severity = 'medium';
      description = 'Phase 2 development requires FDA alignment for Phase 3 advancement';
      urgency = 'medium';
      specificNeeds = [
        'FDA guidance on Phase 3 endpoint acceptability',
        'Patient enrichment strategy and biomarker development',
        'Dose selection methodology and FDA precedents',
        'Go/no-go criteria and decision frameworks'
      ];
      
      // Check for stagnation indicators
      const startDate = this.extractTrialStartDate(trial);
      if (startDate && moment().diff(moment(startDate), 'months') > 24) {
        severity = 'high';
        urgency = 'high';
        description = 'Extended Phase 2 development requires strategic review and advancement planning';
        specificNeeds.push('Root cause analysis and development acceleration strategies');
      }
    } else if (phaseInfo.primary === 'PHASE3') {
      // Phase 3 regulatory gaps
      hasGaps = true;
      severity = 'high';
      description = 'Pivotal trial requires comprehensive FDA alignment and approval strategy';
      urgency = 'high';
      specificNeeds = [
        'FDA agreement on primary endpoints and analysis plan',
        'Advisory committee preparation and strategy',
        'NDA/BLA submission planning and timeline optimization',
        'Post-marketing commitment strategy'
      ];
    }

    // Combination therapy gaps
    const interventions = trial.interventions || [];
    const hasCombination = interventions.length > 1 || 
                          interventions.some(i => i.name?.toLowerCase().includes('combination'));
    
    if (hasCombination) {
      hasGaps = true;
      severity = severity === 'high' ? 'high' : 'medium';
      description += (description ? ' | ' : '') + 'Combination therapy requires specialized regulatory strategy';
      specificNeeds.push('Combination therapy regulatory pathway and FDA precedents');
    }

    // Rare disease regulatory opportunities
    if (indication.toLowerCase().includes('rare') || 
        indication.toLowerCase().includes('orphan')) {
      hasGaps = true;
      description += (description ? ' | ' : '') + 'Rare disease development offers expedited pathway opportunities';
      specificNeeds.push(
        'Orphan drug designation strategy',
        'FDA flexibility in trial design and endpoints',
        'Breakthrough therapy designation assessment'
      );
    }

    // First-in-class opportunities
    const title = (trial.title || trial.briefTitle || '').toLowerCase();
    if (title.includes('first-in-class') || title.includes('novel mechanism')) {
      hasGaps = true;
      severity = 'high';
      urgency = 'high';
      description += (description ? ' | ' : '') + 'First-in-class therapy requires comprehensive regulatory strategy';
      specificNeeds.push(
        'Novel mechanism of action regulatory precedents',
        'FDA guidance on first-in-class development expectations',
        'Risk-benefit framework and safety considerations'
      );
    }

    return { hasGaps, severity, description, urgency, specificNeeds };
  } catch (error) {
    logger.warn('Error identifying regulatory gaps:', error.message);
    return { hasGaps: false };
  }
}

// 18. NEW: Analyze trial design complexity
analyzeTrialDesignComplexity(trial, phaseInfo) {
  try {
    let isComplex = false;
    let severity = 'low';
    let description = '';
    let urgency = 'low';

    const title = (trial.title || trial.briefTitle || '').toLowerCase();
    const interventions = trial.interventions || [];
    const targetEnrollment = trial.enrollment?.count || trial.enrollmentCount || 0;

    // Adaptive design complexity
    const adaptiveKeywords = [
      'adaptive', 'seamless', 'platform', 'umbrella', 'basket',
      'master protocol', 'bayesian', 'interim adaptation'
    ];
    
    if (adaptiveKeywords.some(keyword => title.includes(keyword))) {
      isComplex = true;
      severity = 'high';
      description = 'Adaptive trial design requires specialized statistical and regulatory expertise';
      urgency = 'high';
    }

    // Complex randomization schemes
    const complexRandomization = [
      'factorial', 'crossover', 'stepped wedge', 'cluster randomized',
      'multi-arm', 'dose escalation with expansion'
    ];
    
    if (complexRandomization.some(scheme => title.includes(scheme))) {
      isComplex = true;
      severity = severity === 'high' ? 'high' : 'medium';
      description += (description ? ' | ' : '') + 'Complex randomization design requires careful statistical planning';
      urgency = 'medium';
    }

    // Large trial complexity
    if (targetEnrollment > 500) {
      isComplex = true;
      severity = 'medium';
      description += (description ? ' | ' : '') + 'Large trial requires interim analysis and DMC strategy';
      urgency = 'medium';
    }

    // Multiple interventions
    if (interventions.length > 2) {
      isComplex = true;
      severity = 'medium';
      description += (description ? ' | ' : '') + 'Multiple intervention arms increase design complexity';
      urgency = 'medium';
    }

    // Combination product complexity
    const hasCombinationProduct = interventions.some(i => 
      i.type === 'COMBINATION_PRODUCT' || 
      (interventions.some(j => j.type === 'DRUG') && interventions.some(k => k.type === 'DEVICE'))
    );
    
    if (hasCombinationProduct) {
      isComplex = true;
      severity = 'high';
      description += (description ? ' | ' : '') + 'Combination product requires CDER/CDRH coordination';
      urgency = 'high';
    }

    return { isComplex, severity, description, urgency };
  } catch (error) {
    logger.warn('Error analyzing trial design complexity:', error.message);
    return { isComplex: false };
  }
}

// 19. NEW: Enhanced urgency scoring
calculateEnhancedUrgencyScore(painPoints, phaseInfo, trial) {
  let score = 50; // Base score

  // Pain point severity scoring
  painPoints.forEach(point => {
    switch (point.severity) {
      case 'CRITICAL': score += 25; break;
      case 'HIGH': score += 15; break;
      case 'MEDIUM': score += 8; break;
      case 'LOW': score += 3; break;
    }
    
    // Urgency modifiers
    switch (point.urgency) {
      case 'critical': score += 15; break;
      case 'high': score += 10; break;
      case 'medium': score += 5; break;
    }
  });

  // Phase-specific scoring
  if (phaseInfo.primary === 'PHASE3') score += 15; // Pivotal trials are high stakes
  if (phaseInfo.primary === 'EARLY_PHASE1') score += 12; // Early phase critical decisions
  if (phaseInfo.isCombo) score += 8; // Combo phases have complexity

  // Status-based scoring
  const status = trial.status || trial.overallStatus || '';
  if (status === 'NOT_YET_RECRUITING') score += 15; // Pre-recruitment window
  if (status === 'SUSPENDED' || status === 'TERMINATED') score += 20; // Critical issues

  // Time sensitivity
  const startDate = this.extractTrialStartDate(trial);
  if (startDate) {
    const monthsSinceStart = moment().diff(moment(startDate), 'months');
    if (monthsSinceStart < 6) score += 10; // Recent trials
    if (monthsSinceStart > 36) score += 8; // Long-running trials need review
  }

  // Competitive pressure
  const competitivePainPoint = painPoints.find(p => p.type === 'competitive_pressure');
  if (competitivePainPoint && competitivePainPoint.urgency === 'critical') {
    score += 12;
  }

  return Math.min(score, 100);
}

// 20. NEW: Advanced contact recommendations
generateAdvancedContactRecommendation(painPoints, trial, phaseInfo) {
  const criticalPainPoint = painPoints.find(p => p.severity === 'CRITICAL');
  const urgentPainPoint = painPoints.find(p => p.urgency === 'critical' || p.urgency === 'high');
  
  const recommendations = {
    timing: 'Contact within 1 month',
    stakeholders: ['Clinical Development'],
    messageFraming: 'Clinical development optimization opportunity',
    valueProposition: 'Accelerate development and reduce regulatory risk',
    specificApproach: 'Standard regulatory consulting outreach'
  };

  // Critical situations
  if (criticalPainPoint) {
    recommendations.timing = 'Contact immediately';
    recommendations.messageFraming = 'Critical development issue requiring immediate attention';
    recommendations.specificApproach = 'Emergency consultation offering';
    
    if (criticalPainPoint.type === 'first_in_human') {
      recommendations.stakeholders = ['Chief Medical Officer', 'Clinical Development', 'Regulatory Affairs'];
      recommendations.valueProposition = 'Comprehensive IND strategy and FDA alignment for program success';
    } else if (criticalPainPoint.type.includes('phase2_stagnation')) {
      recommendations.stakeholders = ['Clinical Development', 'Regulatory Affairs', 'Business Development'];
      recommendations.valueProposition = 'Phase 2 optimization and advancement strategy to accelerate timeline';
    }
  }
  
  // High urgency situations
  else if (urgentPainPoint) {
    recommendations.timing = 'Contact within 1 week';
    recommendations.messageFraming = 'Time-sensitive development opportunity';
    
    if (urgentPainPoint.type === 'pre_recruitment_optimization') {
      recommendations.stakeholders = ['Clinical Operations', 'Clinical Development', 'Biostatistics'];
      recommendations.valueProposition = 'Protocol optimization before recruitment to avoid costly amendments';
      recommendations.specificApproach = 'Pre-trial optimization consulting';
    } else if (urgentPainPoint.type === 'new_early_phase_trial') {
      recommendations.stakeholders = ['Clinical Development', 'Regulatory Affairs'];
      recommendations.valueProposition = 'Early phase strategy optimization for maximum program value';
    }
  }
  
  // Phase-specific recommendations
  if (phaseInfo.primary === 'PHASE2') {
    recommendations.stakeholders.push('Biostatistics', 'Medical Affairs');
    if (!recommendations.valueProposition.includes('Phase 2')) {
      recommendations.valueProposition = 'Phase 2 optimization for successful Phase 3 transition';
    }
  } else if (phaseInfo.primary === 'PHASE3') {
    recommendations.stakeholders.push('Regulatory Affairs', 'Medical Affairs', 'Commercial');
    recommendations.valueProposition = 'Pivotal trial success and approval timeline optimization';
  }

  // Biomarker-specific recommendations
  const biomarkerPainPoint = painPoints.find(p => p.type === 'complex_biomarker_strategy');
  if (biomarkerPainPoint) {
    recommendations.stakeholders.push('Translational Medicine', 'Companion Diagnostics');
    recommendations.messageFraming = 'Biomarker strategy requiring FDA alignment';
  }

  return recommendations;
}

calculatePriorityRanking(painPoints, phaseInfo) {
  let ranking = 50; // Base ranking

  // Critical issues get highest ranking
  const criticalCount = painPoints.filter(p => p.severity === 'CRITICAL').length;
  ranking += criticalCount * 25;

  // High urgency issues
  const urgentCount = painPoints.filter(p => p.urgency === 'critical' || p.urgency === 'high').length;
  ranking += urgentCount * 15;

  // Phase-specific priority
  if (phaseInfo.primary === 'PHASE3') ranking += 20; // Pivotal trials highest priority
  if (phaseInfo.primary === 'EARLY_PHASE1') ranking += 15; // Early phase critical decisions
  if (phaseInfo.primary === 'PHASE2') ranking += 10; // Phase 2 optimization important

  // Specific high-value pain points
  const highValueTypes = [
    'phase2_stagnation', 'first_in_human', 'pre_recruitment_optimization',
    'complex_biomarker_strategy', 'competitive_pressure'
  ];
  
  painPoints.forEach(point => {
    if (highValueTypes.includes(point.type)) {
      ranking += 10;
    }
  });

  // Window of opportunity bonus
  const windowOpportunity = painPoints.find(p => p.window === 'immediate');
  if (windowOpportunity) ranking += 15;

  return Math.min(ranking, 100);
}

// 22. NEW: Helper functions for opportunity descriptions
getOpportunityDescription(oppType) {
  const descriptions = {
    'FIRST_IN_HUMAN': 'Comprehensive IND strategy and early development planning',
    'PRE_RECRUITMENT_OPTIMIZATION': 'Protocol optimization and FDA alignment before recruitment',
    'NEW_EARLY_PHASE_TRIAL': 'Early phase development strategy and advancement planning',
    'PHASE2_OPTIMIZATION': 'Phase 2 advancement and regulatory pathway optimization'
  };
  
  return descriptions[oppType] || 'Clinical development strategic support';
}

getSpecificNeeds(oppType, phaseInfo) {
  const needsMap = {
    'FIRST_IN_HUMAN': [
      'IND submission strategy and pre-IND meeting preparation',
      'Starting dose selection and dose escalation methodology',
      'Safety committee protocols and stopping rules',
      'Biomarker strategy for early efficacy signals',
      'Phase 2 design planning and patient population definition'
    ],
    'PRE_RECRUITMENT_OPTIMIZATION': [
      'Protocol review and FDA guidance alignment',
      'Statistical plan optimization and power analysis',
      'Inclusion/exclusion criteria refinement',
      'Site selection and enrollment feasibility assessment',
      'Biomarker strategy and companion diagnostic planning'
    ],
    'NEW_EARLY_PHASE_TRIAL': [
      'Early development strategy and milestone planning',
      'FDA meeting strategy and communication plan',
      'Dose selection and expansion cohort design',
      'Biomarker development and validation pathway',
      'Competitive landscape and differentiation strategy'
    ]
  };
  
  return needsMap[oppType] || [
    'Regulatory strategy and FDA alignment',
    'Trial design optimization',
    'Development timeline acceleration',
    'Risk mitigation and contingency planning'
  ];
}

  // Pain point detection methods
  analyzeSubmissionPatterns(app) {
    try {
      const submissions = app.submissions || [];
      let hasIssues = false;
      let severity = 'low';
      let description = '';
      let urgency = 'low';

      // Check for multiple resubmissions
      const resubmissions = submissions.filter(s => 
        s.submission_type?.includes('RESUBMISSION') || 
        s.submission_type?.includes('AMENDMENT')
      );

      if (resubmissions.length >= 2) {
        hasIssues = true;
        severity = 'high';
        description = `Multiple resubmissions detected (${resubmissions.length}) - indicates regulatory challenges`;
        urgency = 'high';
      }

      // Check for long review times
      const longReviews = submissions.filter(s => {
        if (s.submission_status_date && s.submission_date) {
          const reviewTime = moment(s.submission_status_date).diff(moment(s.submission_date), 'months');
          return reviewTime > 12; // Over 12 months in review
        }
        return false;
      });

      if (longReviews.length > 0) {
        hasIssues = true;
        severity = severity === 'high' ? 'high' : 'medium';
        description += (description ? ' | ' : '') + 'Extended review periods suggest regulatory complexity';
        urgency = 'medium';
      }

      // Check for recent holds or RTEs
      const recentActions = submissions.filter(s => 
        s.submission_status?.includes('HOLD') || 
        s.submission_status?.includes('REFUSE TO FILE') ||
        s.submission_status?.includes('COMPLETE RESPONSE LETTER')
      );

      if (recentActions.length > 0) {
        hasIssues = true;
        severity = 'high';
        description += (description ? ' | ' : '') + 'Recent regulatory holds or RTEs - immediate attention needed';
        urgency = 'immediate';
      }

      return { hasIssues, severity, description, urgency };
    } catch (error) {
      logger.warn('Error analyzing submission patterns:', error.message);
      return { hasIssues: false };
    }
  }

detectPhase2Stagnation(trial, companyContext) {
  try {
    const phaseInfo = this.classifyTrialPhase(trial);
    
    // Only analyze Phase 2 or Phase 1/2 combo trials
    if (phaseInfo.primary !== 'PHASE2' && !phaseInfo.isCombo) {
      return { isStuck: false };
    }

    let isStuck = false;
    let description = '';
    let evidence = [];
    let severity = 'MEDIUM';

    // Signal 1: Multiple Phase 2 trials for same indication
    const indication = this.extractPrimaryIndication(trial);
    const sameIndicationPhase2 = companyContext.trials.filter(t => {
      const tPhase = this.classifyTrialPhase(t);
      const tIndication = this.extractPrimaryIndication(t);
      return (tPhase.primary === 'PHASE2' || tPhase.isCombo) && 
             this.isSimilarIndication(indication, tIndication);
    });

    if (sameIndicationPhase2.length >= 2) {
      isStuck = true;
      severity = 'HIGH';
      description = `Multiple Phase 2 trials (${sameIndicationPhase2.length}) in ${indication} suggests dose/endpoint optimization challenges`;
      evidence.push(`${sameIndicationPhase2.length} Phase 2 trials in similar indications`);
    }

    // Signal 2: Extended Phase 2 duration
    const startDate = this.extractTrialStartDate(trial);
    if (startDate) {
      const monthsInPhase2 = moment().diff(moment(startDate), 'months');
      if (monthsInPhase2 > 30) { // Over 2.5 years
        isStuck = true;
        severity = severity === 'HIGH' ? 'HIGH' : 'MEDIUM';
        description += (description ? ' | ' : '') + `Extended Phase 2 duration (${monthsInPhase2} months) indicates development challenges`;
        evidence.push(`${monthsInPhase2} months in Phase 2 development`);
      }
    }

    // Signal 3: Dose-finding/optimization keywords
    const title = (trial.title || trial.briefTitle || '').toLowerCase();
    const doseKeywords = [
      'dose finding', 'dose-finding', 'dose escalation', 'dose optimization', 
      'optimal dose', 'maximum tolerated dose', 'mtd', 'dose expansion',
      'dose de-escalation', 'dose response', 'dose selection'
    ];
    
    if (doseKeywords.some(keyword => title.includes(keyword))) {
      isStuck = true;
      description += (description ? ' | ' : '') + 'Dose optimization focus suggests ongoing Phase 2 challenges';
      evidence.push('Dose optimization focus in trial design');
    }

    // Signal 4: Biomarker selection/enrichment issues
    const biomarkerKeywords = [
      'biomarker', 'enrichment', 'patient selection', 'stratification',
      'companion diagnostic', 'predictive marker', 'prognostic marker'
    ];
    
    if (biomarkerKeywords.some(keyword => title.includes(keyword))) {
      isStuck = true;
      description += (description ? ' | ' : '') + 'Biomarker strategy development indicates patient selection challenges';
      evidence.push('Biomarker/patient selection focus');
    }

    // Signal 5: Trial status indicators
    const status = trial.status || trial.overallStatus || '';
    if (status === 'SUSPENDED' || status === 'TERMINATED') {
      isStuck = true;
      severity = 'CRITICAL';
      description += (description ? ' | ' : '') + `Trial ${status.toLowerCase()} - requires immediate strategic review`;
      evidence.push(`Trial status: ${status}`);
    }

    // Signal 6: Enrollment challenges
    const enrollmentAnalysis = this.analyzePhase2EnrollmentChallenges(trial);
    if (enrollmentAnalysis.hasChallenges) {
      isStuck = true;
      description += (description ? ' | ' : '') + enrollmentAnalysis.description;
      evidence.push(...enrollmentAnalysis.evidence);
    }

    // Signal 7: Endpoint evolution (multiple primary endpoints suggest uncertainty)
    const endpointAnalysis = this.analyzeEndpointUncertainty(trial);
    if (endpointAnalysis.hasUncertainty) {
      isStuck = true;
      description += (description ? ' | ' : '') + endpointAnalysis.description;
      evidence.push(...endpointAnalysis.evidence);
    }

    return { isStuck, description, evidence, severity };
  } catch (error) {
    logger.warn('Error detecting Phase 2 stagnation:', error.message);
    return { isStuck: false };
  }
}

// 12. UTILITY FUNCTIONS for better trial analysis
extractPrimaryIndication(trial) {
  const conditions = trial.conditions || trial.conditionsModule?.conditions || [];
  if (conditions.length > 0) {
    return conditions[0];
  }
  
  const title = trial.title || trial.briefTitle || '';
  
  // Extract indication from title
  const indicationPatterns = [
    /in (?:patients with )?([^,]+)/i,
    /for (?:the treatment of )?([^,]+)/i,
    /treatment of ([^,]+)/i,
    /therapy for ([^,]+)/i
  ];
  
  for (const pattern of indicationPatterns) {
    const match = title.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return 'Unknown';
}


isSimilarIndication(indication1, indication2) {
  if (!indication1 || !indication2) return false;
  
  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const norm1 = normalize(indication1);
  const norm2 = normalize(indication2);
  
  // Direct match
  if (norm1 === norm2) return true;
  
  // Check for common cancer subtypes
  const cancerTypes = ['cancer', 'carcinoma', 'sarcoma', 'lymphoma', 'leukemia', 'melanoma'];
  const isCancer1 = cancerTypes.some(type => norm1.includes(type));
  const isCancer2 = cancerTypes.some(type => norm2.includes(type));
  
  if (isCancer1 && isCancer2) {
    // Check for organ/tissue overlap
    const organs = ['breast', 'lung', 'colon', 'prostate', 'ovarian', 'pancreatic', 'liver', 'kidney'];
    for (const organ of organs) {
      if (norm1.includes(organ) && norm2.includes(organ)) {
        return true;
      }
    }
  }
  
  return false;
}

extractTrialStartDate(trial) {
  const dates = trial.dates || trial.statusModule || {};
  
  // Try multiple date fields
  const possibleDates = [
    dates.studyFirstSubmitDate,
    dates.startDate,
    trial.startDate,
    trial.studyFirstSubmitDate,
    dates.studyFirstPostDate
  ];
  
  for (const date of possibleDates) {
    if (date && moment(date).isValid()) {
      return date;
    }
  }
  
  return null;
}

analyzeEndpointUncertainty(trial) {
  try {
    let hasUncertainty = false;
    let description = '';
    let evidence = [];

    const title = (trial.title || trial.briefTitle || '').toLowerCase();
    
    // Keywords suggesting endpoint challenges
    const endpointUncertaintyKeywords = [
      'exploratory', 'feasibility', 'pilot', 'proof of concept', 'poc',
      'preliminary', 'surrogate', 'biomarker endpoint', 'novel endpoint',
      'composite endpoint', 'multiple endpoints'
    ];
    
    if (endpointUncertaintyKeywords.some(keyword => title.includes(keyword))) {
      hasUncertainty = true;
      description = 'Exploratory/novel endpoints suggest regulatory pathway uncertainty';
      evidence.push('Endpoint development focus in trial design');
    }

    // Multiple primary outcomes can indicate uncertainty
    const outcomes = trial.primaryOutcomes || trial.outcomesModule?.primaryOutcomes || [];
    if (outcomes.length > 2) {
      hasUncertainty = true;
      description += (description ? ' | ' : '') + `Multiple primary endpoints (${outcomes.length}) suggest regulatory uncertainty`;
      evidence.push(`${outcomes.length} primary endpoints`);
    }

    return { hasUncertainty, description, evidence };
  } catch (error) {
    logger.warn('Error analyzing endpoint uncertainty:', error.message);
    return { hasUncertainty: false };
  }
}

// 9. NEW: Detect new trial startup opportunities
detectNewTrialOpportunities(trial) {
  try {
    const opportunities = [];
    const phaseInfo = this.classifyTrialPhase(trial);
    const startDate = this.extractTrialStartDate(trial);
    const status = trial.status || trial.overallStatus || '';

    // Recently started or about to start trials
    if (startDate) {
      const monthsSinceStart = moment().diff(moment(startDate), 'months');
      
      if (monthsSinceStart <= 6 && (phaseInfo.primary === 'PHASE1' || phaseInfo.isCombo)) {
        opportunities.push({
          type: 'NEW_EARLY_PHASE_TRIAL',
          severity: 'HIGH',
          description: `New ${phaseInfo.isCombo ? 'Phase 1/2' : 'Phase 1'} trial recently started - optimal time for FDA strategy alignment`,
          urgency: 'high',
          window: 'immediate'
        });
      }
    }

    // Not yet recruiting trials (pre-launch opportunity)
    if (status === 'NOT_YET_RECRUITING') {
      opportunities.push({
        type: 'PRE_RECRUITMENT_OPTIMIZATION',
        severity: 'HIGH',
        description: 'Trial not yet recruiting - critical window for protocol optimization and FDA alignment',
        urgency: 'high',
        window: 'immediate'
      });
    }

    // First-in-human studies
    const title = (trial.title || trial.briefTitle || '').toLowerCase();
    if (title.includes('first in human') || title.includes('first-in-human') || title.includes('fih')) {
      opportunities.push({
        type: 'FIRST_IN_HUMAN',
        severity: 'CRITICAL',
        description: 'First-in-human study requires comprehensive IND strategy and FDA alignment',
        urgency: 'critical',
        window: 'immediate'
      });
    }

    return opportunities;
  } catch (error) {
    logger.warn('Error detecting new trial opportunities:', error.message);
    return [];
  }
}



analyzePhase2EnrollmentChallenges(trial) {
  try {
    let hasChallenges = false;
    let description = '';
    let evidence = [];

    const targetEnrollment = trial.enrollment?.count || trial.enrollmentCount || 0;
    const startDate = this.extractTrialStartDate(trial);
    
    if (startDate && targetEnrollment > 0) {
      const monthsSinceStart = moment().diff(moment(startDate), 'months');
      
      // For Phase 2, enrollment should typically complete within 18-24 months
      if (monthsSinceStart > 24 && (trial.status === 'RECRUITING' || trial.overallStatus === 'RECRUITING')) {
        hasChallenges = true;
        description = `Extended recruitment (${monthsSinceStart} months) suggests patient identification challenges`;
        evidence.push(`${monthsSinceStart} months of recruitment for ${targetEnrollment} patients`);
      }
      
      // Small Phase 2 with long recruitment suggests rare population
      if (targetEnrollment < 100 && monthsSinceStart > 18) {
        hasChallenges = true;
        description += (description ? ' | ' : '') + 'Small trial with extended recruitment indicates rare patient population';
        evidence.push(`Small trial (${targetEnrollment} patients) with long recruitment`);
      }
    }

    // Check for multiple enrollment criteria (suggests selectivity issues)
    const eligibility = trial.eligibilityCriteria || trial.eligibility?.criteria || '';
    const complexCriteria = [
      'biomarker positive', 'mutation', 'expression', 'prior therapy',
      'refractory', 'resistant', 'failure', 'progression', 'relapsed'
    ];
    
    const criteriaCount = complexCriteria.filter(criteria => 
      eligibility.toLowerCase().includes(criteria)
    ).length;
    
    if (criteriaCount >= 3) {
      hasChallenges = true;
      description += (description ? ' | ' : '') + 'Complex eligibility criteria may limit patient pool';
      evidence.push(`${criteriaCount} complex eligibility requirements`);
    }

    return { hasChallenges, description, evidence };
  } catch (error) {
    logger.warn('Error analyzing enrollment challenges:', error.message);
    return { hasChallenges: false };
  }
}

  analyzeRecruitmentChallenges(trial) {
    try {
      let hasChallenges = false;
      let severity = 'low';
      let description = '';
      let urgency = 'low';

      // Check enrollment vs. target and timeline
      const targetEnrollment = trial.enrollment?.count || 0;
      const studyStart = trial.dates?.studyFirstSubmitted;
      
      if (studyStart && targetEnrollment > 0) {
        const monthsSinceStart = moment().diff(moment(studyStart), 'months');
        const expectedEnrollmentRate = targetEnrollment / 24; // Assume 24-month enrollment period
        const currentExpectedEnrollment = expectedEnrollmentRate * monthsSinceStart;
        
        // If still recruiting after expected enrollment period
        if (monthsSinceStart > 24 && trial.status === 'RECRUITING') {
          hasChallenges = true;
          severity = 'high';
          description = 'Extended recruitment period suggests patient identification challenges';
          urgency = 'high';
        }
      }

      // Check for rare disease or complex eligibility criteria
      const conditions = trial.conditions || [];
      const rareDisease = conditions.some(condition => 
        condition.toLowerCase().includes('rare') ||
        condition.toLowerCase().includes('orphan') ||
        condition.toLowerCase().includes('syndrome')
      );

      if (rareDisease) {
        hasChallenges = true;
        severity = severity === 'high' ? 'high' : 'medium';
        description += (description ? ' | ' : '') + 'Rare disease indication presents patient identification challenges';
        urgency = 'medium';
      }

      // Check for geographic concentration of sites
      const locations = trial.locations || [];
      if (locations.length < 5 && targetEnrollment > 100) {
        hasChallenges = true;
        severity = severity === 'high' ? 'high' : 'medium';
        description += (description ? ' | ' : '') + 'Limited site network for target enrollment';
        urgency = 'medium';
      }

      return { hasChallenges, severity, description, urgency };
    } catch (error) {
      logger.warn('Error analyzing recruitment challenges:', error.message);
      return { hasChallenges: false };
    }
  }

  // Business opportunity prioritization
  prioritizeOpportunities(applications) {
    return applications
      .sort((a, b) => {
        // Sort by urgency score (higher first)
        if (b.urgencyScore !== a.urgencyScore) {
          return b.urgencyScore - a.urgencyScore;
        }
        // Then by number of pain points
        return b.painPoints.length - a.painPoints.length;
      })
      .map(app => ({
        ...app,
        salesPriority: this.calculateSalesPriority(app),
        estimatedOpportunityValue: this.estimateOpportunityValue(app),
        recommendedApproach: this.generateSalesApproach(app)
      }));
  }

  groupByCompanyAndPrioritize(trials) {
    const companyMap = new Map();
    
    // Group trials by company
    trials.forEach(trial => {
      const company = trial.sponsor?.lead || 'Unknown';
      if (!companyMap.has(company)) {
        companyMap.set(company, {
          company,
          trials: [],
          aggregatedPainPoints: [],
          totalUrgencyScore: 0
        });
      }
      
      const companyData = companyMap.get(company);
      companyData.trials.push(trial);
      companyData.aggregatedPainPoints.push(...trial.painPoints);
      companyData.totalUrgencyScore += trial.urgencyScore;
    });

    // Convert to array and prioritize
    return Array.from(companyMap.values())
      .sort((a, b) => b.totalUrgencyScore - a.totalUrgencyScore)
      .map(company => ({
        ...company,
        salesPriority: this.calculateCompanySalesPriority(company),
        estimatedOpportunityValue: this.estimateCompanyOpportunityValue(company),
        recommendedApproach: this.generateCompanySalesApproach(company)
      }));
  }

  // Utility methods for pain point analysis
  calculateUrgencyScore(painPoints) {
    let score = 0;
    painPoints.forEach(point => {
      switch (point.urgency) {
        case 'immediate': score += 10; break;
        case 'high': score += 7; break;
        case 'medium': score += 4; break;
        case 'low': score += 1; break;
        default: score += 2;
      }
    });
    return score;
  }

  calculateSalesPriority(entity) {
    const urgencyScore = entity.urgencyScore || 0;
    const painPointCount = entity.painPoints?.length || 0;
    
    if (urgencyScore >= 20 || painPointCount >= 3) return 'Hot';
    if (urgencyScore >= 10 || painPointCount >= 2) return 'Warm';
    return 'Cold';
  }

  estimateOpportunityValue(entity) {
    const painPoints = entity.painPoints || [];
    let baseValue = 50000; // Base consulting opportunity
    
    painPoints.forEach(point => {
      switch (point.type) {
        case 'regulatory_delays': baseValue += 150000; break;
        case 'phase2_stagnation': baseValue += 200000; break;
        case 'competitive_pressure': baseValue += 100000; break;
        case 'recruitment_challenges': baseValue += 75000; break;
        case 'market_access_prep': baseValue += 125000; break;
        default: baseValue += 25000;
      }
    });
    
    return baseValue;
  }

  generateSalesApproach(entity) {
    const painPoints = entity.painPoints || [];
    const approaches = [];
    
    painPoints.forEach(point => {
      switch (point.type) {
        case 'regulatory_delays':
          approaches.push('Lead with regulatory strategy expertise and FDA relationship capabilities');
          break;
        case 'phase2_stagnation':
          approaches.push('Emphasize biomarker and dose optimization consulting experience');
          break;
        case 'competitive_pressure':
          approaches.push('Highlight competitive intelligence and differentiation strategy services');
          break;
        case 'recruitment_challenges':
          approaches.push('Focus on patient identification and site optimization capabilities');
          break;
        default:
          approaches.push('Present comprehensive market research and strategic consulting services');
      }
    });
    
    return approaches;
  }

  // Helper methods for comprehensive analysis
  buildCompanyContext(companyName, allTrials) {
    const companyTrials = allTrials.filter(t => 
      t.sponsor?.lead === companyName || 
      t.sponsor?.collaborators?.includes(companyName)
    );
    
    return {
      totalTrials: companyTrials.length,
      trials: companyTrials,
      phases: [...new Set(companyTrials.flatMap(t => t.phase || []))],
      indications: [...new Set(companyTrials.flatMap(t => t.conditions || []))],
      recentActivity: companyTrials.filter(t => 
        moment().diff(moment(t.dates?.lastUpdate), 'months') <= 6
      ).length
    };
  }

  determineOptimalContactTiming(painPoints) {
    const immediateNeeds = painPoints.filter(p => p.urgency === 'immediate');
    const highUrgency = painPoints.filter(p => p.urgency === 'high');
    
    if (immediateNeeds.length > 0) return 'Contact immediately';
    if (highUrgency.length > 0) return 'Contact within 1 week';
    return 'Contact within 1 month';
  }

  generateContactRecommendation(painPoints, trial) {
    const recommendations = {
      timing: this.determineOptimalContactTiming(painPoints),
      stakeholders: ['Clinical Development', 'Regulatory Affairs', 'Business Development'],
      messageFraming: 'Focus on immediate pain points and time-sensitive opportunities',
      valueProposition: 'Accelerate development timelines and reduce regulatory risk'
    };
    
    // Customize based on specific pain points
    const hasRegulatoryIssues = painPoints.some(p => p.type.includes('regulatory'));
    const hasPhase2Issues = painPoints.some(p => p.type === 'phase2_stagnation');
    
    if (hasRegulatoryIssues) {
      recommendations.stakeholders.unshift('Chief Medical Officer');
      recommendations.messageFraming = 'Regulatory expertise to navigate FDA challenges';
    }
    
    if (hasPhase2Issues) {
      recommendations.stakeholders.push('Biostatistics', 'Clinical Operations');
      recommendations.valueProposition = 'Optimize Phase 2 design for faster Phase 3 transition';
    }
    
    return recommendations;
  }

  // Additional helper methods would continue here...
  // (checkEnforcementActions, identifyMeetingPreparationNeeds, etc.)
}

// Usage example
async function identifyPharmaOpportunities() {
  const engine = new PharmaIntelligenceEngine();
  
  try {
    // Get FDA applications with pain points
    const fdaOpportunities = await engine.getPharmaApplicationsWithPainPoints();
    
    // Get clinical trials with pain points
    const trialOpportunities = await engine.getClinicalTrialsWithPainPoints();
    
    // Generate prioritized opportunity report
    const report = {
      fdaOpportunities: fdaOpportunities.slice(0, 20), // Top 20 FDA opportunities
      trialOpportunities: trialOpportunities.slice(0, 15), // Top 15 company opportunities
      totalOpportunityValue: fdaOpportunities.reduce((sum, opp) => sum + opp.estimatedOpportunityValue, 0) +
                            trialOpportunities.reduce((sum, opp) => sum + opp.estimatedOpportunityValue, 0),
      generatedAt: new Date().toISOString()
    };
    
    logger.info(`Generated opportunity report with ${fdaOpportunities.length + trialOpportunities.length} qualified prospects`);
    logger.info(`Total estimated opportunity value: $${report.totalOpportunityValue.toLocaleString()}`);
    
    return report;
  } catch (error) {
    logger.error('Error generating opportunity report:', error.message);
    throw error;
  }
}

module.exports = { PharmaIntelligenceEngine, identifyPharmaOpportunities };


const express = require('express');
const axios = require('axios');
const cors = require('cors');
const winston = require('winston');
const moment = require('moment');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Enhanced data store
const dataStore = {
  companies: new Map(),
  leads: [],
  clinicalTrials: [],
  drugApplications: [],
  warningLetters: [],
  recalls: [],
  inspections: [],
  statistics: {}
};

// Comprehensive FDA API Service
class FDAApiService {
  constructor() {
    this.fdaBaseUrl = 'https://api.fda.gov';
    this.clinicalTrialsUrl = 'https://clinicaltrials.gov/api/v2';
  }

// 1. Get pharma drug applications (INDs, NDAs, BLAs, ANDAs, 505(b)(2))
async getPharmaApplications() {
  try {
    logger.info('Fetching pharma drug applications...');
    
    const endDate = moment().format('YYYYMMDD');
    const startDate = moment().subtract(365, 'days').format('YYYYMMDD');
    
    // FDA Drugs@FDA API - correct endpoint and parameters
    const response = await axios.get(`${this.fdaBaseUrl}/drug/drugsfda.json`, {
      params: {
        search: `submissions.submission_status_date:[${startDate} TO ${endDate}]`,
        limit: 100
      },
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PharmaDataFetcher/1.0'
      }
    });

    // Handle different response structures
    let applications = [];
    if (response.data && response.data.results) {
      applications = response.data.results;
    } else if (Array.isArray(response.data)) {
      applications = response.data;
    }

    logger.info(`Found ${applications.length} drug applications`);
    
    // Add safety check and better error handling
    const analyzedApplications = [];
    for (const app of applications) {
      try {
        const analyzed = this.analyzeApplication(app);
        if (analyzed) {
          analyzedApplications.push(analyzed);
        }
      } catch (analyzeError) {
        logger.warn('Failed to analyze individual application:', {
          error: analyzeError.message,
          applicationNumber: app?.application_number || 'unknown'
        });
      }
    }
    
    return analyzedApplications;
  } catch (error) {
    logger.error('Error fetching drug applications:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url
    });
    
    // Fallback: try alternative FDA endpoint
    try {
      const fallbackResponse = await this.getFDADrugsFallback();
      return fallbackResponse;
    } catch (fallbackError) {
      logger.error('Fallback method also failed:', fallbackError.message);
      return [];
    }
  }
}

// Fallback method for FDA drugs
async getFDADrugsFallback() {
  const response = await axios.get(`${this.fdaBaseUrl}/drug/event.json`, {
    params: {
      search: 'receivedate:[20240101 TO 20241231]',
      limit: 50
    },
    timeout: 30000
  });
  
  return response.data.results || [];
}

// 2. Get Clinical Trials with CORRECT API v2 structure
async getClinicalTrials() {
  try {
    logger.info('Fetching comprehensive clinical trials with enhanced phase detection...');
    
    // Get multiple datasets for comprehensive analysis
    const [activeTrials, recentTrials, earlyPhaseTrials, phase2Trials] = await Promise.all([
      this.fetchActiveTrials(),
      this.fetchRecentlyStartedTrials(),
      this.fetchEarlyPhaseTrials(),
      this.fetchPhase2Trials()
    ]);
    
    // Combine all trials and remove duplicates
    const allTrialsMap = new Map();
    [...activeTrials, ...recentTrials, ...earlyPhaseTrials, ...phase2Trials].forEach(trial => {
      const nctId = trial.nctId || trial.protocolSection?.identificationModule?.nctId;
      if (nctId && !allTrialsMap.has(nctId)) {
        allTrialsMap.set(nctId, trial);
      }
    });
    
    const allTrials = Array.from(allTrialsMap.values());
    logger.info(`Found ${allTrials.length} unique trials for analysis`);

    // Enhanced analysis with focus on help signals
    const analyzedTrials = [];
    for (const trial of allTrials) {
      try {
        const analysis = await this.advancedTrialPainPointAnalysis(trial, allTrials);
        if (analysis && this.shouldIncludeTrial(analysis)) {
          analyzedTrials.push(analysis);
        }
      } catch (error) {
        logger.warn('Failed to analyze trial:', error.message);
      }
    }
    
    return this.groupByCompanyAndPrioritize(analyzedTrials);
  } catch (error) {
    logger.error('Error in enhanced clinical trials analysis:', error.message);
    return [];
  }
}
shouldIncludeTrial(analysis) {
  // Always include trials with pain points
  if (analysis.painPoints && analysis.painPoints.length > 0) {
    return true;
  }

  // Always include high urgency trials
  if (analysis.urgencyScore >= 60) {
    return true;
  }

  // Include new trial opportunities
  const newOpportunities = this.detectNewTrialOpportunities(analysis);
  if (newOpportunities.length > 0) {
    analysis.newTrialOpportunities = newOpportunities;
    return true;
  }

  // Include Phase 2 trials (potential stagnation)
  const phaseInfo = this.classifyTrialPhase(analysis);
  if (phaseInfo.primary === 'PHASE2' || phaseInfo.isCombo) {
    return true;
  }

  // Include trials with biomarker complexity
  if (analysis.biomarkerStrategy?.usesBiomarkers) {
    return true;
  }

  // Include high complexity trials
  if (analysis.complexityScore >= 50) {
    return true;
  }

  // Include trials from companies with multiple touchpoints
  const company = this.getCompanyFromName(analysis.sponsor?.lead);
  if (company && company.totalTouchpoints > 1) {
    return true;
  }

  return false;
}
async fetchRecentlyStartedTrials() {
  try {
    logger.info('Fetching recently started trials...');
    
    const params = {
      'format': 'json',
      'query.intr': 'Drug',
      'filter.overallStatus': 'NOT_YET_RECRUITING,RECRUITING,ACTIVE_NOT_RECRUITING',
      'filter.studyFirstSubmitted': `[${moment().subtract(6, 'months').format('YYYY-MM-DD')},${moment().format('YYYY-MM-DD')}]`,
      'pageSize': 100,
      'fields': 'NCTId,BriefTitle,Phase,OverallStatus,StartDate,StudyFirstSubmitDate,LeadSponsorName,Condition,InterventionName,EnrollmentCount,StudyType,LocationCountry,DesignPrimaryPurpose,EligibilityCriteria'
    };

    const response = await axios.get(`${this.clinicalTrialsBaseUrl}/studies`, {
      params,
      timeout: 45000
    });

    const trials = response.data?.studies || [];
    logger.info(`Found ${trials.length} recently started trials`);
    return trials;
  } catch (error) {
    logger.warn('Error fetching recent trials, using fallback...', error.message);
    return [];
  }
}


// 3. NEW: Fetch early phase trials specifically
async fetchEarlyPhaseTrials() {
  try {
    logger.info('Fetching early phase trials...');
    
    const params = {
      'format': 'json',
      'query.intr': 'Drug',
      'filter.phase': 'EARLY_PHASE1,PHASE1,PHASE1|PHASE2',
      'filter.overallStatus': 'NOT_YET_RECRUITING,RECRUITING,ACTIVE_NOT_RECRUITING',
      'pageSize': 75,
      'fields': 'NCTId,BriefTitle,Phase,OverallStatus,StartDate,StudyFirstSubmitDate,LeadSponsorName,Condition,InterventionName,EnrollmentCount,StudyType,EligibilityCriteria,PrimaryPurpose'
    };

    const response = await axios.get(`${this.clinicalTrialsBaseUrl}/studies`, {
      params,
      timeout: 45000
    });

    const trials = response.data?.studies || [];
    logger.info(`Found ${trials.length} early phase trials`);
    return trials;
  } catch (error) {
    logger.warn('Error fetching early phase trials:', error.message);
    return [];
  }
}

// 4. NEW: Fetch Phase 2 trials for stagnation analysis
async fetchPhase2Trials() {
  try {
    logger.info('Fetching Phase 2 trials for stagnation analysis...');
    
    const params = {
      'format': 'json',
      'query.intr': 'Drug',
      'filter.phase': 'PHASE2',
      'filter.overallStatus': 'RECRUITING,ACTIVE_NOT_RECRUITING,SUSPENDED,TERMINATED',
      'pageSize': 100,
      'fields': 'NCTId,BriefTitle,Phase,OverallStatus,StartDate,StudyFirstSubmitDate,LastUpdateSubmitDate,LeadSponsorName,Condition,InterventionName,EnrollmentCount,StudyType,WhyStopped,CompletionDate,PrimaryCompletionDate'
    };

    const response = await axios.get(`${this.clinicalTrialsBaseUrl}/studies`, {
      params,
      timeout: 45000
    });

    const trials = response.data?.studies || [];
    logger.info(`Found ${trials.length} Phase 2 trials for analysis`);
    return trials;
  } catch (error) {
    logger.warn('Error fetching Phase 2 trials:', error.message);
    return [];
  }
}

// 5. ENHANCED: Better phase detection and classification
classifyTrialPhase(trial) {
  const protocolSection = trial.protocolSection || trial;
  const designModule = protocolSection.designModule || {};
  
  // Handle different phase format possibilities
  let phases = designModule.phases || trial.phase || trial.Phase || [];
  
  if (typeof phases === 'string') {
    phases = [phases];
  }
  
  if (!Array.isArray(phases)) {
    phases = [];
  }
  
  // Normalize phase names
  const normalizedPhases = phases.map(p => {
    if (typeof p === 'string') {
      return p.toUpperCase().replace(/[^A-Z0-9|]/g, '');
    }
    return String(p).toUpperCase();
  });
  
  // Detect specific phase combinations
  const phaseString = normalizedPhases.join('|');
  
  if (phaseString.includes('EARLY_PHASE1') || phaseString.includes('EARLYPHASE1')) {
    return { primary: 'EARLY_PHASE1', secondary: null, isCombo: false };
  }
  
  if (phaseString.includes('PHASE1') && phaseString.includes('PHASE2')) {
    return { primary: 'PHASE1', secondary: 'PHASE2', isCombo: true };
  }
  
  if (phaseString.includes('PHASE2') && phaseString.includes('PHASE3')) {
    return { primary: 'PHASE2', secondary: 'PHASE3', isCombo: true };
  }
  
  if (phaseString.includes('PHASE3')) {
    return { primary: 'PHASE3', secondary: null, isCombo: false };
  }
  
  if (phaseString.includes('PHASE2')) {
    return { primary: 'PHASE2', secondary: null, isCombo: false };
  }
  
  if (phaseString.includes('PHASE1')) {
    return { primary: 'PHASE1', secondary: null, isCombo: false };
  }
  
  if (phaseString.includes('PHASE4')) {
    return { primary: 'PHASE4', secondary: null, isCombo: false };
  }
  
  return { primary: 'UNKNOWN', secondary: null, isCombo: false };
}


// Fallback method for clinical trials
async getClinicalTrialsFallback() {
  logger.info('Using fallback clinical trials method...');
  
  // Most basic query that should work
  const simpleParams = {
    'format': 'json',
    'pageSize': 25
  };

  const response = await axios.get('https://clinicaltrials.gov/api/v2/studies', {
    params: simpleParams,
    timeout: 30000,
    headers: {
      'Accept': 'application/json'
    }
  });

  const studies = response.data.studies || [];
  logger.info(`Fallback found ${studies.length} trials`);
  
  // Filter for drug-related trials manually
  const drugTrials = studies.filter(study => {
    const title = (study.protocolSection?.identificationModule?.briefTitle || '').toLowerCase();
    const interventions = study.protocolSection?.armsInterventionsModule?.interventions || [];
    const hasDrugIntervention = interventions.some(int => 
      int.type === 'Drug' || int.type === 'DRUG' || 
      (int.name && int.name.toLowerCase().includes('drug'))
    );
    
    return hasDrugIntervention || 
           title.includes('drug') || 
           title.includes('medication') || 
           title.includes('treatment');
  });
  
  logger.info(`Filtered to ${drugTrials.length} drug-related trials`);
  return drugTrials;
}

// Enhanced application analysis
analyzeApplication(app) {
  try {
    if (!app) return null;
    
    // Add safety checks for all property access
    const applicationNumber = app.application_number || app.appl_no || 'Unknown';
    const sponsorName = app.sponsor_name || app.applicant || 'Unknown';
    
    // Safe access to products array
    const products = app.products || [];
    const productNumbers = Array.isArray(products) ? 
      products.map(p => p?.product_number || 'Unknown').filter(Boolean) : [];
    
    // Safe access to submissions array
    const submissions = app.submissions || [];
    const submissionData = Array.isArray(submissions) ? 
      submissions.map(sub => ({
        submissionNumber: sub?.submission_number || 'Unknown',
        submissionType: sub?.submission_type || 'Unknown',
        submissionStatus: sub?.submission_status || 'Unknown',
        statusDate: sub?.submission_status_date || null,
        reviewPriority: sub?.review_priority || 'Unknown'
      })).filter(Boolean) : [];
    
    return {
      applicationNumber,
      applicationType: app.application_type || this.determineApplicationType(app),
      sponsorName,
      productNumbers,
      submissions: submissionData,
      openfda: app.openfda || {},
      analysisDate: new Date().toISOString(),
      riskLevel: this.assessRiskLevel(app),
      marketPotential: this.assessMarketPotential(app)
    };
  } catch (error) {
    logger.error('Error analyzing application:', {
      error: error.message,
      stack: error.stack,
      appData: JSON.stringify(app, null, 2).substring(0, 500)
    });
    return null;
  }
}

// Enhanced trial analysis
comprehensiveTrialAnalysis(study) {
  try {
    if (!study) return null;
    
    // Handle different API response structures with safe access
    const protocolSection = study.protocolSection || study.ProtocolSection || {};
    const derivedSection = study.derivedSection || study.DerivedSection || {};
    
    // Safe access to nested objects
    const identificationModule = protocolSection.identificationModule || {};
    const statusModule = protocolSection.statusModule || {};
    const designModule = protocolSection.designModule || {};
    const sponsorCollaboratorsModule = protocolSection.sponsorCollaboratorsModule || {};
    const conditionsModule = protocolSection.conditionsModule || {};
    const armsInterventionsModule = protocolSection.armsInterventionsModule || {};
    const outcomesModule = protocolSection.outcomesModule || {};
    const eligibilityModule = protocolSection.eligibilityModule || {};
    const contactsLocationsModule = protocolSection.contactsLocationsModule || {};
    
    // Safe array access
    const phases = Array.isArray(designModule.phases) ? designModule.phases : 
                  (designModule.phases ? [designModule.phases] : []);
    
    const conditions = Array.isArray(conditionsModule.conditions) ? conditionsModule.conditions :
                      (conditionsModule.conditions ? [conditionsModule.conditions] : []);
    
    const interventions = Array.isArray(armsInterventionsModule.interventions) ? 
                         armsInterventionsModule.interventions : [];
    
    const locations = Array.isArray(contactsLocationsModule.locations) ? 
                     contactsLocationsModule.locations : [];
    
    const collaborators = Array.isArray(sponsorCollaboratorsModule.collaborators) ? 
                         sponsorCollaboratorsModule.collaborators : [];
    
    return {
      nctId: study.nctId || identificationModule.nctId || 'Unknown',
      title: identificationModule.briefTitle || study.BriefTitle || 'Unknown',
      officialTitle: identificationModule.officialTitle || study.OfficialTitle || null,
      status: statusModule.overallStatus || study.OverallStatus || 'Unknown',
      phase: phases,
      studyType: designModule.studyType || study.StudyType || 'Unknown',
      enrollment: {
        count: designModule.enrollmentInfo?.count || study.EnrollmentCount || 0,
        type: designModule.enrollmentInfo?.type || study.EnrollmentType || 'Unknown'
      },
      sponsor: {
        lead: sponsorCollaboratorsModule.leadSponsor?.name || study.LeadSponsorName || 'Unknown',
        collaborators: collaborators.map(c => c?.name || 'Unknown').filter(name => name !== 'Unknown')
      },
      conditions: conditions,
      interventions: interventions.map(int => ({
        type: int?.type || 'Unknown',
        name: int?.name || 'Unknown',
        description: int?.description || null
      })),
      primaryOutcomes: Array.isArray(outcomesModule.primaryOutcomes) ? outcomesModule.primaryOutcomes : [],
      secondaryOutcomes: Array.isArray(outcomesModule.secondaryOutcomes) ? outcomesModule.secondaryOutcomes : [],
      eligibility: {
        criteria: eligibilityModule.eligibilityCriteria || study.EligibilityCriteria || null,
        minimumAge: eligibilityModule.minimumAge || study.MinimumAge || null,
        maximumAge: eligibilityModule.maximumAge || study.MaximumAge || null,
        sex: eligibilityModule.sex || study.Gender || 'All',
        healthyVolunteers: eligibilityModule.healthyVolunteers || study.HealthyVolunteers || false
      },
      locations: locations.map(loc => ({
        facility: loc?.facility || 'Unknown',
        city: loc?.city || 'Unknown',
        state: loc?.state || null,
        country: loc?.country || 'Unknown',
        status: loc?.status || 'Unknown'
      })),
      dates: {
        studyFirstSubmitted: statusModule.studyFirstSubmitDate || study.StudyFirstSubmitDate || null,
        lastUpdate: statusModule.lastUpdateSubmitDate || study.LastUpdateSubmitDate || null,
        primaryCompletion: statusModule.primaryCompletionDateStruct || study.PrimaryCompletionDate || null
      },
      analysisMetrics: {
        riskScore: this.calculateTrialRisk(protocolSection),
        feasibilityScore: this.assessTrialFeasibility(protocolSection),
        competitiveAdvantage: this.analyzeCompetitivePosition(protocolSection),
        regulatoryPath: this.determineRegulatoryPath(protocolSection)
      },
      analysisDate: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error analyzing trial:', {
      error: error.message,
      stack: error.stack,
      studyData: JSON.stringify(study, null, 2).substring(0, 500)
    });
    return null;
  }
}

// Helper methods
determineApplicationType(app) {
  try {
    const appNum = (app?.application_number || app?.appl_no || '').toString();
    if (appNum.startsWith('BLA')) return 'BLA';
    if (appNum.startsWith('NDA')) return 'NDA';
    if (appNum.startsWith('ANDA')) return 'ANDA';
    if (appNum.includes('IND')) return 'IND';
    return 'Unknown';
  } catch (error) {
    logger.warn('Error determining application type:', error.message);
    return 'Unknown';
  }
}

assessRiskLevel(app) {
  try {
    // Implement risk assessment logic with safe access
    let riskScore = 0;
    const submissions = app?.submissions || [];
    
    if (Array.isArray(submissions)) {
      if (submissions.some(s => s?.submission_status === 'Under Review')) riskScore += 2;
      if (submissions.some(s => s?.review_priority === 'Priority')) riskScore += 3;
    }
    
    return riskScore > 3 ? 'High' : riskScore > 1 ? 'Medium' : 'Low';
  } catch (error) {
    logger.warn('Error assessing risk level:', error.message);
    return 'Low';
  }
}

assessMarketPotential(app) {
  try {
    // Implement market potential assessment with safe access
    const products = app?.products || [];
    const submissions = app?.submissions || [];
    
    let potentialScore = 0;
    
    if (Array.isArray(products) && products.length > 0) potentialScore += 1;
    if (Array.isArray(submissions) && submissions.length > 2) potentialScore += 1;
    
    return potentialScore > 1 ? 'High' : potentialScore > 0 ? 'Medium' : 'Low';
  } catch (error) {
    logger.warn('Error assessing market potential:', error.message);
    return 'Medium';
  }
}

calculateTrialRisk(protocolSection) {
  try {
    // Implement trial risk calculation with safe access
    const phases = protocolSection?.designModule?.phases || [];
    const enrollment = protocolSection?.designModule?.enrollmentInfo?.count || 0;
    
    let riskScore = 5; // Base risk
    
    if (Array.isArray(phases)) {
      if (phases.includes('PHASE1') || phases.includes('EARLY_PHASE1')) riskScore += 3;
      if (phases.includes('PHASE3')) riskScore -= 1;
    }
    
    if (enrollment > 1000) riskScore += 2;
    if (enrollment < 50) riskScore += 1;
    
    return Math.max(1, Math.min(10, riskScore));
  } catch (error) {
    logger.warn('Error calculating trial risk:', error.message);
    return 5;
  }
}

assessTrialFeasibility(protocolSection) {
  try {
    // Implement feasibility assessment with safe access
    const locations = protocolSection?.contactsLocationsModule?.locations || [];
    const enrollment = protocolSection?.designModule?.enrollmentInfo?.count || 0;
    const interventions = protocolSection?.armsInterventionsModule?.interventions || [];
    
    let feasibilityScore = 5; // Base feasibility
    
    if (Array.isArray(locations) && locations.length > 10) feasibilityScore += 2;
    if (enrollment > 0 && enrollment < 500) feasibilityScore += 1;
    if (Array.isArray(interventions) && interventions.length === 1) feasibilityScore += 1;
    
    return Math.max(1, Math.min(10, feasibilityScore));
  } catch (error) {
    logger.warn('Error assessing trial feasibility:', error.message);
    return 5;
  }
}

analyzeCompetitivePosition(protocolSection) {
  try {
    // Implement competitive analysis with safe access
    const conditions = protocolSection?.conditionsModule?.conditions || [];
    const phases = protocolSection?.designModule?.phases || [];
    
    if (Array.isArray(conditions) && conditions.length > 0) {
      // Check for rare diseases (simplified logic)
      const rareDisease = conditions.some(condition => 
        condition && (
          condition.toLowerCase().includes('rare') ||
          condition.toLowerCase().includes('orphan') ||
          condition.toLowerCase().includes('syndrome')
        )
      );
      
      if (rareDisease) return 'High';
    }
    
    if (Array.isArray(phases) && phases.includes('PHASE3')) return 'High';
    if (Array.isArray(phases) && phases.includes('PHASE1')) return 'Low';
    
    return 'Moderate';
  } catch (error) {
    logger.warn('Error analyzing competitive position:', error.message);
    return 'Moderate';
  }
}

determineRegulatoryPath(protocolSection) {
  try {
    // Implement regulatory path determination with safe access
    const phases = protocolSection?.designModule?.phases || [];
    
    if (Array.isArray(phases)) {
      if (phases.includes('PHASE3')) return 'Late-stage development';
      if (phases.includes('PHASE2')) return 'Mid-stage development';
      if (phases.includes('PHASE1') || phases.includes('EARLY_PHASE1')) return 'Early-stage development';
    }
    
    return 'Pre-clinical';
  } catch (error) {
    logger.warn('Error determining regulatory path:', error.message);
    return 'Unknown';
  }
}

  // 3. Get WARNING LETTERS - Critical for immediate outreach
  async getWarningLetters() {
    try {
      logger.info('Fetching FDA warning letters...');
      
      const endDate = moment().format('YYYY-MM-DD');
      const startDate = moment().subtract(180, 'days').format('YYYY-MM-DD');
      
      // Warning letters are in the FDA's enforcement database
      const response = await axios.get(`${this.fdaBaseUrl}/drug/enforcement.json`, {
        params: {
          search: `report_date:[${startDate} TO ${endDate}]`,
          limit: 100
        }
      });

      const enforcements = response.data.results || [];
      
      // Filter for more serious enforcement actions
      const warningLetters = enforcements.filter(e => 
        e.classification === "Class I" || 
        e.classification === "Class II" ||
        e.reason_for_recall?.toLowerCase().includes('cgmp') ||
        e.reason_for_recall?.toLowerCase().includes('adulterated')
      );
      
      logger.info(`Found ${warningLetters.length} warning letters/enforcement actions`);
      
      return warningLetters.map(letter => ({
        company: letter.recalling_firm,
        reportDate: letter.report_date,
        reason: letter.reason_for_recall,
        classification: letter.classification,
        status: letter.status,
        productDescription: letter.product_description,
        codeInfo: letter.code_info,
        distributionPattern: letter.distribution_pattern,
        urgency: 'CRITICAL',
        emailTrigger: {
          subject: `Urgent: FDA Compliance Support Following Recent ${letter.classification} Action`,
          mainIssue: 'FDA enforcement action requiring immediate remediation',
          context: `Your recent ${letter.classification} enforcement action regarding ${letter.product_description} requires strategic response to prevent escalation.`,
          offering: 'Our regulatory AI can analyze similar enforcement actions and their successful remediation strategies, helping you develop a comprehensive response plan that satisfies FDA requirements.'
        }
      }));
    } catch (error) {
      logger.error('Error fetching warning letters:', error.message);
      return [];
    }
  }

  // 4. Get RECALLS - Another critical trigger
  async getRecalls() {
    try {
      logger.info('Fetching recent drug recalls...');
      
      const endDate = moment().format('YYYYMMDD');
      const startDate = moment().subtract(90, 'days').format('YYYYMMDD');
      
      const response = await axios.get(`${this.fdaBaseUrl}/drug/enforcement.json`, {
        params: {
          search: `recall_initiation_date:[${startDate} TO ${endDate}]`,
          limit: 100
        }
      });

      const recalls = response.data.results || [];
      logger.info(`Found ${recalls.length} recent recalls`);
      
      return recalls.map(recall => ({
        company: recall.recalling_firm,
        initiationDate: recall.recall_initiation_date,
        classification: recall.classification,
        voluntaryMandated: recall.voluntary_mandated,
        reasonForRecall: recall.reason_for_recall,
        productDescription: recall.product_description,
        emailTrigger: {
          subject: `FDA Recall Management Support - ${recall.classification}`,
          mainIssue: 'managing FDA recall and preventing future occurrences',
          context: `Your ${recall.voluntary_mandated} recall of ${recall.product_description} presents both immediate compliance needs and long-term quality system improvements.`,
          offering: 'We can analyze root causes from similar recalls and provide FDA-aligned corrective action strategies.'
        }
      }));
    } catch (error) {
      logger.error('Error fetching recalls:', error.message);
      return [];
    }
  }

  // 5. Get FDA 483 Observations (Inspection findings)
  async getInspectionFindings() {
    try {
      logger.info('Fetching FDA inspection findings...');
      
      // Note: 483s aren't in the public API, but we can get inspection-related issues
      const response = await axios.get(`${this.fdaBaseUrl}/drug/enforcement.json`, {
        params: {
          search: 'reason_for_recall:"GMP" OR reason_for_recall:"CGMP" OR reason_for_recall:"manufacturing"',
          limit: 50
        }
      });

      const inspections = response.data.results || [];
      logger.info(`Found ${inspections.length} GMP-related issues`);
      
      return inspections.map(inspection => ({
        company: inspection.recalling_firm,
        issue: 'GMP Compliance Issue',
        description: inspection.reason_for_recall,
        emailTrigger: {
          subject: 'FDA GMP Compliance Intelligence',
          mainIssue: 'GMP compliance gaps identified',
          context: 'Recent FDA inspections in your sector have identified critical GMP issues.',
          offering: 'Our analysis of FDA inspection trends can help you prepare for upcoming inspections and address common citations.'
        }
      }));
    } catch (error) {
      logger.error('Error fetching inspection data:', error.message);
      return [];
    }
  }

  // Enhanced application analysis
  analyzeApplication(app) {
    const submissions = app.submissions || [];
    const latestSubmission = submissions[0] || {};
    const products = app.products || [];
    
    // Determine submission type and regulatory status
    const submissionType = this.determineSubmissionType(latestSubmission);
    const status = this.determineDetailedStatus(latestSubmission);
    const urgency = this.calculateUrgency(status, latestSubmission);
    
    // Identify all potential issues
    const issues = this.identifyAllIssues(app, status);
    
    // Analyze therapeutic area and competition
    const therapeuticProfile = this.analyzeTherapeuticProfile(app);
    
    // Generate comprehensive email trigger
    const emailTrigger = this.generateComprehensiveEmailTrigger(app, status, issues, therapeuticProfile, submissionType);
    
    return {
      applicationNumber: app.application_number,
      sponsorName: app.sponsor_name,
      submissionType,
      products: products.map(p => ({
        brandName: p.brand_name,
        genericName: p.generic_name,
        dosageForm: p.dosage_form,
        route: p.route,
        marketingStatus: p.marketing_status,
        therapeuticEquivalenceCode: p.te_code
      })),
      submissions: submissions.map(s => ({
        type: s.submission_type,
        number: s.submission_number,
        status: s.submission_status,
        statusDate: s.submission_status_date,
        reviewPriority: s.review_priority,
        submissionClassCode: s.submission_class_code,
        submissionPublicNotes: s.submission_public_notes
      })),
      status,
      urgency,
      issues,
      therapeuticProfile,
      emailTrigger,
      dataQuality: this.assessDataQuality(app),
      lastActivity: latestSubmission.submission_status_date,
      isHighPriority: this.isHighPriorityApplication(app, status, submissionType)
    };
  }

  // Determine submission type (IND, NDA, BLA, ANDA, 505(b)(2))
  determineSubmissionType(submission) {
    const type = submission.submission_type;
    const classCode = submission.submission_class_code;
    
    if (type === 'ORIG' && classCode === 'TYPE 1') return 'NDA';
    if (type === 'ORIG' && classCode === 'TYPE 2') return '505(b)(2)';
    if (type === 'ORIG' && classCode === 'TYPE 3') return 'NDA_NEW_DOSAGE';
    if (type === 'ORIG' && classCode === 'TYPE 4') return 'NDA_NEW_MANUFACTURER';
    if (type === 'ORIG' && classCode === 'TYPE 5') return 'NDA_NEW_FORMULATION';
    if (type === 'ORIG' && classCode === 'TYPE 6') return 'BLA';
    if (type === 'ORIG' && classCode === 'TYPE 7') return 'DRUG_MASTER_FILE';
    if (type === 'ORIG' && classCode === 'TYPE 8') return 'ANDA';
    if (type === 'SUPPL') return 'SUPPLEMENTAL';
    
    return 'OTHER';
  }

  // Comprehensive trial analysis with correct API v2 structure
  comprehensiveTrialAnalysis(studyData) {
    // Handle API v2 response structure
    const study = studyData.protocolSection || studyData;
    
    // Extract key data from the correct structure
    const trialData = {
      nctId: study.identificationModule?.nctId,
      title: study.identificationModule?.briefTitle,
      officialTitle: study.identificationModule?.officialTitle,
      sponsor: study.sponsorCollaboratorsModule?.leadSponsor?.name,
      collaborators: study.sponsorCollaboratorsModule?.collaborators?.map(c => c.name) || [],
      phase: study.designModule?.phases?.[0] || 'Not Specified',
      studyType: study.designModule?.studyType,
      status: study.statusModule?.overallStatus,
      conditions: study.conditionsModule?.conditions || [],
      keywords: study.conditionsModule?.keywords || [],
      
      // Trial design details
      enrollment: study.designModule?.enrollmentInfo?.count || 0,
      enrollmentType: study.designModule?.enrollmentInfo?.type,
      allocation: study.designModule?.allocation,
      interventionModel: study.designModule?.interventionModel,
      primaryPurpose: study.designModule?.primaryPurpose,
      masking: study.designModule?.maskingInfo?.masking,
      
      // Dates
      startDate: study.statusModule?.startDateStruct?.date,
      primaryCompletionDate: study.statusModule?.primaryCompletionDateStruct?.date,
      completionDate: study.statusModule?.completionDateStruct?.date,
      firstPostedDate: study.statusModule?.studyFirstPostDateStruct?.date,
      lastUpdatePostedDate: study.statusModule?.lastUpdatePostDateStruct?.date,
      
      // Interventions
      interventions: study.armsInterventionsModule?.interventions?.map(i => ({
        type: i.type,
        name: i.name,
        description: i.description,
        armGroupLabels: i.armGroupLabels
      })) || [],
      
      // Arms
      armGroups: study.armsInterventionsModule?.armGroups?.map(a => ({
        label: a.label,
        type: a.type,
        description: a.description,
        interventionNames: a.interventionNames
      })) || [],
      
      // Eligibility
      eligibility: {
        criteria: study.eligibilityModule?.eligibilityCriteria,
        healthyVolunteers: study.eligibilityModule?.healthyVolunteers,
        sex: study.eligibilityModule?.sex,
        minimumAge: study.eligibilityModule?.minimumAge,
        maximumAge: study.eligibilityModule?.maximumAge,
        stdAges: study.eligibilityModule?.stdAges
      }
    };
    
    // Deep analysis
    const biomarkerStrategy = this.analyzeBiomarkerStrategy(
      trialData.eligibility.criteria || '', 
      trialData.title || ''
    );
    const endpoints = this.analyzeEndpoints(study);
    const regulatoryChallenges = this.identifyAllTrialChallenges(trialData, biomarkerStrategy, endpoints);
    const competitiveLandscape = this.assessCompetitiveLandscape(trialData);
    
    // Calculate trial complexity score
    const complexityScore = this.calculateTrialComplexity(trialData, biomarkerStrategy, endpoints);
    
    // Generate strategic email
    const emailTrigger = this.generateStrategicTrialEmail(trialData, biomarkerStrategy, regulatoryChallenges, competitiveLandscape);
    
    return {
      ...trialData,
      biomarkerStrategy,
      endpoints,
      regulatoryChallenges,
      competitiveLandscape,
      complexityScore,
      emailTrigger,
      urgencyScore: this.calculateTrialUrgency(trialData, regulatoryChallenges),
      isHighValueLead: this.isHighValueTrial(trialData, biomarkerStrategy, complexityScore)
    };
  }

  // Calculate trial complexity score
  calculateTrialComplexity(trialData, biomarkerStrategy, endpoints) {
    let score = 0;
    
    // Phase complexity
    if (trialData.phase === 'PHASE3') score += 30;
    else if (trialData.phase === 'PHASE2') score += 20;
    else if (trialData.phase === 'PHASE1') score += 10;
    else if (trialData.phase === 'EARLY_PHASE1') score += 15;
    
    // Biomarker complexity
    if (biomarkerStrategy.enrichmentStrategy === 'MIXED_POPULATION') score += 25;
    else if (biomarkerStrategy.usesBiomarkers) score += 15;
    
    // Endpoint complexity
    if (endpoints.hasNovelEndpoints) score += 20;
    if (endpoints.hasSurrogateEndpoints) score += 15;
    
    // Design complexity
    if (trialData.interventionModel === 'PARALLEL') score += 5;
    else if (trialData.interventionModel === 'CROSSOVER') score += 10;
    else if (trialData.interventionModel === 'FACTORIAL') score += 15;
    
    // Size complexity
    if (trialData.enrollment > 500) score += 10;
    else if (trialData.enrollment < 50 && trialData.phase !== 'PHASE1') score += 15;
    
    // Multiple interventions
    if (trialData.interventions.length > 2) score += 10;
    
    // Adaptive design indicators
    if (trialData.title?.toLowerCase().includes('adaptive') || 
        trialData.title?.toLowerCase().includes('seamless')) score += 20;
    
    return Math.min(score, 100);
  }

  // Determine if trial is high value lead
  isHighValueTrial(trialData, biomarkerStrategy, complexityScore) {
    // High value indicators
    if (trialData.status === 'NOT_YET_RECRUITING' && complexityScore > 50) return true;
    if (biomarkerStrategy.enrichmentStrategy === 'MIXED_POPULATION') return true;
    if (trialData.phase === 'PHASE3' && trialData.enrollment > 300) return true;
    if (trialData.primaryPurpose === 'TREATMENT' && complexityScore > 60) return true;
    if (trialData.sponsor && this.isHighValueSponsor(trialData.sponsor)) return true;
    
    return false;
  }

  // Check if sponsor is high value
  isHighValueSponsor(sponsorName) {
    const name = sponsorName.toLowerCase();
    
    // Exclude large pharma that likely have internal resources
    const largePharma = ['pfizer', 'merck', 'novartis', 'roche', 'sanofi', 'gsk', 
                        'astrazeneca', 'johnson', 'abbvie', 'bristol'];
    if (largePharma.some(company => name.includes(company))) return false;
    
    // High value indicators
    const highValueIndicators = ['therapeutics', 'biopharma', 'biopharmaceutical', 
                                'sciences', 'pharmaceuticals', 'biotech', 'inc.', 
                                'corporation', 'limited'];
    
    return highValueIndicators.some(indicator => name.includes(indicator));
  }

  // Determine if application is high priority
  isHighPriorityApplication(app, status, submissionType) {
    // Critical statuses
    if (['COMPLETE_RESPONSE_LETTER', 'REFUSE_TO_FILE'].includes(status)) return true;
    
    // Active review
    if (status === 'FILED_UNDER_REVIEW') return true;
    
    // Complex submission types
    if (['505(b)(2)', 'BLA', 'NDA'].includes(submissionType)) return true;
    
    // Priority review
    if (app.submissions?.some(s => s.review_priority === 'PRIORITY')) return true;
    
    return false;
  }

  // Helper methods remain the same but with enhanced logic...
  determineDetailedStatus(submission) {
    if (!submission.submission_type) return 'NO_SUBMISSION';
    
    const type = submission.submission_type;
    const status = submission.submission_status;
    
    // Critical statuses
    if (status === 'CR') return 'COMPLETE_RESPONSE_LETTER';
    if (status === 'RT') return 'REFUSE_TO_FILE';
    if (status === 'WD') return 'WITHDRAWN';
    
    // Active statuses
    if (type === 'ORIG' && status === 'FI') return 'FILED_UNDER_REVIEW';
    if (type === 'ORIG' && status === 'AP') return 'APPROVED';
    if (type === 'ORIG' && status === 'TA') return 'TENTATIVE_APPROVAL';
    
    // Supplemental submissions
    if (type === 'SUPPL') return 'SUPPLEMENTAL_APPLICATION';
    
    // Pre-submission
    if (type === 'IND') return 'IND_ACTIVE';
    
    return 'OTHER';
  }

  calculateUrgency(status, submission) {
    // Critical urgency
    if (['COMPLETE_RESPONSE_LETTER', 'REFUSE_TO_FILE'].includes(status)) return 'CRITICAL';
    
    // High urgency
    if (['FILED_UNDER_REVIEW', 'TENTATIVE_APPROVAL'].includes(status)) return 'HIGH';
    
    // Medium urgency
    if (submission.review_priority === 'PRIORITY') return 'MEDIUM';
    
    // Check recency
    const daysSinceActivity = moment().diff(moment(submission.submission_status_date), 'days');
    if (daysSinceActivity < 30) return 'MEDIUM';
    
    return 'LOW';
  }

  identifyAllIssues(app, status) {
    const issues = [];
    const submissions = app.submissions || [];
    
    // CRL issues
    if (status === 'COMPLETE_RESPONSE_LETTER') {
      issues.push({
        type: 'CRL_RECEIVED',
        severity: 'CRITICAL',
        description: 'Complete Response Letter requires comprehensive response strategy',
        needsHelp: 'CRL response strategy, precedent analysis, FDA meeting preparation'
      });
    }
    
    // RTF issues
    if (status === 'REFUSE_TO_FILE') {
      issues.push({
        type: 'REFUSE_TO_FILE',
        severity: 'CRITICAL',
        description: 'Refuse to File letter indicates significant submission deficiencies',
        needsHelp: 'RTF remediation, submission quality review, FDA expectations alignment'
      });
    }
    
    // Multiple review cycles
    const origCount = submissions.filter(s => s.submission_type === 'ORIG').length;
    if (origCount > 1) {
      issues.push({
        type: 'MULTIPLE_REVIEW_CYCLES',
        severity: 'HIGH',
        description: `${origCount} review cycles indicate persistent FDA concerns`,
        needsHelp: 'Root cause analysis, regulatory strategy optimization'
      });
    }
    
    // Long review times
    const firstSubmission = submissions[submissions.length - 1];
    const reviewTime = moment(submissions[0]?.submission_status_date).diff(moment(firstSubmission?.submission_status_date), 'days');
    if (reviewTime > 365) {
      issues.push({
        type: 'EXTENDED_REVIEW',
        severity: 'MEDIUM',
        description: `${reviewTime} days in review suggests complex regulatory issues`,
        needsHelp: 'FDA communication strategy, submission optimization'
      });
    }
    
    // Priority review challenges
    if (submissions.some(s => s.review_priority === 'PRIORITY' && s.submission_status !== 'AP')) {
      issues.push({
        type: 'PRIORITY_REVIEW_CHALLENGES',
        severity: 'HIGH',
        description: 'Priority review designation with ongoing challenges',
        needsHelp: 'Expedited pathway navigation, FDA alignment'
      });
    }
    
    return issues;
  }

  analyzeTherapeuticProfile(app) {
    const products = app.products || [];
    const pharmClasses = [];
    const routes = new Set();
    const dosageForms = new Set();
    
    products.forEach(product => {
      if (product.pharm_class) pharmClasses.push(...product.pharm_class);
      if (product.route) routes.add(product.route);
      if (product.dosage_form) dosageForms.add(product.dosage_form);
    });
    
    // Determine therapeutic area
    const therapeuticArea = this.classifyTherapeuticArea(pharmClasses);
    
    // Assess complexity
    const complexity = {
      multipleRoutes: routes.size > 1,
      multipleDosageForms: dosageForms.size > 1,
      combinationProduct: products.some(p => p.active_ingredients?.length > 1),
      isNovelTherapy: this.isNovelTherapy(pharmClasses),
      is505b2: products.some(p => p.te_code && p.te_code !== 'AB')
    };
    
    return {
      therapeuticArea,
      pharmClasses: [...new Set(pharmClasses)],
      routes: Array.from(routes),
      dosageForms: Array.from(dosageForms),
      complexity,
      competitiveIntensity: this.assessCompetitiveIntensity(therapeuticArea)
    };
  }

  classifyTherapeuticArea(pharmClasses) {
    const classString = pharmClasses.join(' ').toUpperCase();
    
    if (/ONCOL|ANTINEO|CANCER/.test(classString)) return 'ONCOLOGY';
    if (/NEUR|PSYCH|CNS|ALZH|PARKIN/.test(classString)) return 'CNS';
    if (/CARD|HYPERT|LIPID/.test(classString)) return 'CARDIOVASCULAR';
    if (/DIAB|METABOL|OBESITY/.test(classString)) return 'METABOLIC';
    if (/IMMUN|RHEUM|AUTOIMM/.test(classString)) return 'IMMUNOLOGY';
    if (/INFECT|ANTIBIOT|ANTIVIR/.test(classString)) return 'INFECTIOUS_DISEASE';
    if (/RARE|ORPHAN/.test(classString)) return 'RARE_DISEASE';
    
    return 'OTHER';
  }

  isNovelTherapy(pharmClasses) {
    const novelIndicators = ['FIRST', 'NOVEL', 'NEW', 'BREAKTHROUGH', 'ONLY'];
    return novelIndicators.some(indicator => 
      pharmClasses.some(pc => pc.toUpperCase().includes(indicator))
    );
  }

  assessCompetitiveIntensity(therapeuticArea) {
    const highCompetition = ['ONCOLOGY', 'CNS', 'METABOLIC'];
    const mediumCompetition = ['CARDIOVASCULAR', 'IMMUNOLOGY'];
    
    if (highCompetition.includes(therapeuticArea)) return 'HIGH';
    if (mediumCompetition.includes(therapeuticArea)) return 'MEDIUM';
    return 'LOW';
  }

  analyzeBiomarkerStrategy(eligibility, title) {
    const text = `${eligibility} ${title}`.toLowerCase();
    
    // Comprehensive biomarker detection
    const biomarkerTypes = {
      genetic: /mutation|variant|polymorphism|genotype|allele|chromosome/i.test(text),
      protein: /expression|overexpression|positive|negative|high|low/i.test(text),
      genomic: /genomic|sequencing|ngs|wgs|wes|panel/i.test(text),
      liquidBiopsy: /ctdna|cfdna|liquid biopsy|circulating/i.test(text),
      immunologic: /pd-l1|pd-1|msi|tmb|hla|immune/i.test(text)
    };
    
    const specificMarkers = this.extractSpecificMarkers(text);
    
    // Determine enrichment approach
    let enrichmentStrategy = 'NONE';
    if (text.includes('positive') && text.includes('negative')) {
      enrichmentStrategy = 'MIXED_POPULATION';
    } else if (text.includes('positive') || text.includes('enriched')) {
      enrichmentStrategy = 'ENRICHED_ONLY';
    } else if (text.includes('all-comers') || text.includes('unselected')) {
      enrichmentStrategy = 'ALL_COMERS';
    } else if (Object.values(biomarkerTypes).some(v => v)) {
      enrichmentStrategy = 'BIOMARKER_STRATIFIED';
    }
    
    return {
      usesBiomarkers: Object.values(biomarkerTypes).some(v => v),
      biomarkerTypes,
      specificMarkers,
      enrichmentStrategy,
      complexity: this.assessBiomarkerComplexity(biomarkerTypes, specificMarkers)
    };
  }

  extractSpecificMarkers(text) {
    const markers = [];
    const knownMarkers = [
      'her2', 'egfr', 'pd-l1', 'pd-1', 'brca1', 'brca2', 'alk', 'ros1', 
      'kras', 'nras', 'braf', 'met', 'ret', 'ntrk', 'fgfr', 'pik3ca',
      'msi-h', 'tmb-h', 'mmr', 'tp53', 'apc', 'cdh1', 'vhl', 'kit'
    ];
    
    knownMarkers.forEach(marker => {
      if (text.includes(marker)) markers.push(marker.toUpperCase());
    });
    
    return markers;
  }

  assessBiomarkerComplexity(types, markers) {
    const typeCount = Object.values(types).filter(v => v).length;
    
    if (typeCount >= 3 || markers.length >= 3) return 'HIGH';
    if (typeCount >= 2 || markers.length >= 2) return 'MEDIUM';
    return 'LOW';
  }

  analyzeEndpoints(study) {
    const primary = study.outcomesModule?.primaryOutcomes || [];
    const secondary = study.outcomesModule?.secondaryOutcomes || [];
    const primaryEndpoints = primary.map(outcome => ({
      measure: outcome.measure,
      timeFrame: outcome.timeFrame,
      description: outcome.description,
      isNovel: this.isNovelEndpoint(outcome.measure),
      isSurrogate: this.isSurrogateEndpoint(outcome.measure),
      requiresValidation: this.requiresEndpointValidation(outcome.measure)
    }));
    
    return {
      primary: primaryEndpoints,
      secondaryCount: secondary.length,
      hasNovelEndpoints: primaryEndpoints.some(e => e.isNovel),
      hasSurrogateEndpoints: primaryEndpoints.some(e => e.isSurrogate),
      complexity: this.assessEndpointComplexity(primaryEndpoints)
    };
  }

  isNovelEndpoint(measure) {
    const novelIndicators = ['novel', 'new', 'composite', 'combined', 'proprietary'];
    return novelIndicators.some(ind => measure?.toLowerCase().includes(ind));
  }

  isSurrogateEndpoint(measure) {
    const surrogateIndicators = ['biomarker', 'expression', 'level', 'concentration', 'surrogate'];
    return surrogateIndicators.some(ind => measure?.toLowerCase().includes(ind));
  }

  requiresEndpointValidation(measure) {
    return this.isNovelEndpoint(measure) || this.isSurrogateEndpoint(measure);
  }

  assessEndpointComplexity(endpoints) {
    if (endpoints.some(e => e.isNovel && e.isSurrogate)) return 'HIGH';
    if (endpoints.some(e => e.isNovel || e.isSurrogate)) return 'MEDIUM';
    return 'LOW';
  }

  identifyAllTrialChallenges(trialData, biomarkerStrategy, endpoints) {
    const challenges = [];
    
    // Biomarker challenges
    if (biomarkerStrategy.enrichmentStrategy === 'MIXED_POPULATION') {
      challenges.push({
        type: 'COMPLEX_BIOMARKER_DESIGN',
        severity: 'CRITICAL',
        description: 'Mixed biomarker population requires careful FDA alignment',
        specificNeed: 'Analysis of FDA enrichment guidance interpretation across divisions'
      });
    }
    
    // Endpoint challenges
    if (endpoints.hasNovelEndpoints) {
      challenges.push({
        type: 'NOVEL_ENDPOINT_VALIDATION',
        severity: 'HIGH',
        description: 'Novel endpoints require extensive FDA validation',
        specificNeed: 'Precedent analysis for endpoint acceptance in similar indications'
      });
    }
    
    // Enrollment challenges
    if (trialData.enrollment < 50 && trialData.phase !== 'PHASE1') {
      challenges.push({
        type: 'SMALL_SAMPLE_SIZE',
        severity: 'HIGH',
        description: 'Small sample size requires robust statistical justification',
        specificNeed: 'Statistical power analysis and FDA precedents for small trials'
      });
    } else if (trialData.enrollment > 1000) {
      challenges.push({
        type: 'LARGE_TRIAL_MANAGEMENT',
        severity: 'MEDIUM',
        description: 'Large trial requires interim analysis strategy',
        specificNeed: 'FDA guidance on DMC charters and interim analyses'
      });
    }
    
    // Phase-specific challenges
    if (trialData.phase === 'PHASE2' && trialData.conditions[0]?.toLowerCase().includes('rare')) {
      challenges.push({
        type: 'RARE_DISEASE_DEVELOPMENT',
        severity: 'HIGH',
        description: 'Rare disease development pathway optimization needed',
        specificNeed: 'FDA orphan drug and expedited pathway strategy'
      });
    }
    
    // Adaptive design challenges
    if (trialData.title?.toLowerCase().includes('adaptive') || 
        trialData.title?.toLowerCase().includes('seamless')) {
      challenges.push({
        type: 'ADAPTIVE_DESIGN_COMPLEXITY',
        severity: 'HIGH',
        description: 'Adaptive trial design requires specialized FDA interaction',
        specificNeed: 'FDA guidance on adaptive designs and statistical analysis plans'
      });
    }
    
    // Timing challenges
    if (trialData.status === 'NOT_YET_RECRUITING') {
      challenges.push({
        type: 'PRE_TRIAL_OPTIMIZATION',
        severity: 'MEDIUM',
        description: 'Pre-recruitment window for protocol optimization',
        specificNeed: 'FDA Type B meeting preparation and protocol alignment'
      });
    }
    
    // Combination product challenges
    const hasCombinationProduct = trialData.interventions.some(i => 
      i.type === 'COMBINATION_PRODUCT' || 
      (i.type === 'DRUG' && trialData.interventions.some(j => j.type === 'DEVICE'))
    );
    
    if (hasCombinationProduct) {
      challenges.push({
        type: 'COMBINATION_PRODUCT_COMPLEXITY',
        severity: 'HIGH',
        description: 'Combination product requires cross-center FDA coordination',
        specificNeed: 'Navigating CDER/CDRH jurisdictional considerations'
      });
    }
    
    return challenges;
  }

  assessCompetitiveLandscape(trialData) {
    const indication = trialData.conditions[0]?.toLowerCase() || '';
    
    let intensity = 'MODERATE';
    let keyCompetitors = [];
    let marketInsights = [];
    
    if (indication.includes('cancer') || indication.includes('oncol')) {
      intensity = 'HIGH';
      keyCompetitors = ['Multiple PD-1/PD-L1 inhibitors', 'CAR-T therapies', 'ADCs'];
      marketInsights = ['Crowded market requires differentiation', 'Biomarker strategy critical'];
    } else if (indication.includes('alzheimer') || indication.includes('parkinson')) {
      intensity = 'HIGH';
      keyCompetitors = ['Aduhelm controversy impacts', 'Multiple Phase 3 failures'];
      marketInsights = ['FDA bar remains high', 'Endpoints under scrutiny'];
    } else if (indication.includes('rare') || indication.includes('orphan')) {
      intensity = 'LOW';
      keyCompetitors = ['Limited competition', 'First-in-class opportunity'];
      marketInsights = ['FDA more flexible on endpoints', 'Expedited pathways available'];
    } else if (indication.includes('diabetes') || indication.includes('metabolic')) {
      intensity = 'HIGH';
      keyCompetitors = ['GLP-1 dominance', 'Established SOC'];
      marketInsights = ['CV outcomes expected', 'Differentiation needed'];
    }
    
    return {
      intensity,
      keyCompetitors,
      marketInsights,
      marketDynamics: this.assessMarketDynamics(indication),
      fdaClimate: this.assessFDAClimate(indication),
      expeditedPathways: this.identifyExpediedPathways(trialData)
    };
  }

  assessMarketDynamics(indication) {
    if (indication.includes('biosimilar')) return 'PRICE_PRESSURE';
    if (indication.includes('rare')) return 'PREMIUM_PRICING';
    if (indication.includes('generic')) return 'COMMODITY';
    if (indication.includes('first-in-class')) return 'INNOVATION_PREMIUM';
    return 'COMPETITIVE';
  }

  assessFDAClimate(indication) {
    if (indication.includes('opioid')) return 'HEIGHTENED_SCRUTINY';
    if (indication.includes('pediatric')) return 'SUPPORTIVE';
    if (indication.includes('antibiotic')) return 'EXPEDITED';
    if (indication.includes('alzheimer')) return 'EVOLVING_STANDARDS';
    if (indication.includes('rare')) return 'FLEXIBLE';
    return 'STANDARD';
  }

  identifyExpediedPathways(trialData) {
    const pathways = [];
    const indication = trialData.conditions[0]?.toLowerCase() || '';
    
    // Breakthrough Therapy
    if (indication.includes('cancer') || indication.includes('rare')) {
      pathways.push('Breakthrough Therapy Designation');
    }
    
    // Fast Track
    if (indication.includes('serious') || indication.includes('life-threatening')) {
      pathways.push('Fast Track Designation');
    }
    
    // Orphan Drug
    if (indication.includes('rare') || indication.includes('orphan')) {
      pathways.push('Orphan Drug Designation');
    }
    
    // Priority Review
    if (trialData.phase === 'PHASE3') {
      pathways.push('Priority Review');
    }
    
    // Accelerated Approval
    if (trialData.endpoints?.hasSurrogateEndpoints) {
      pathways.push('Accelerated Approval');
    }
    
    return pathways;
  }

  generateComprehensiveEmailTrigger(app, status, issues, therapeuticProfile, submissionType) {
    const urgentIssue = issues.find(i => i.severity === 'CRITICAL') || issues[0];
    const isComplex = therapeuticProfile.complexity.combinationProduct || 
                      therapeuticProfile.complexity.isNovelTherapy ||
                      therapeuticProfile.complexity.is505b2;
    
    let trigger = {
      subject: '',
      mainIssue: '',
      context: '',
      offering: '',
      specificAnalysis: [],
      urgency: this.calculateUrgency(status, app.submissions[0]),
      callToAction: '',
      personalizedHook: ''
    };
    
    // Customize based on submission type and status
    if (status === 'COMPLETE_RESPONSE_LETTER') {
      trigger.subject = `CRL Response Strategy for ${app.products[0]?.brand_name || app.application_number}`;
      trigger.mainIssue = 'Complete Response Letter requiring strategic response';
      trigger.personalizedHook = `I noticed FDA issued a CRL for your ${submissionType} application. Having analyzed 200+ successful CRL responses in ${therapeuticProfile.therapeuticArea}, I see specific patterns that could help.`;
      trigger.context = `Your CRL for ${app.products[0]?.brand_name || 'your product'} requires a comprehensive response strategy that addresses FDA's specific concerns while maintaining your development timeline.`;
      trigger.offering = 'I can provide detailed analysis of successful CRL responses in your therapeutic area, including:';
      trigger.specificAnalysis = [
        'Root cause patterns in similar CRLs and their resolutions',
        'Division-specific preferences for data presentation',
        'Statistical approaches that have satisfied FDA concerns',
        'Timeline optimization strategies for resubmission',
        `Specific precedents for ${submissionType} applications`
      ];
      trigger.callToAction = 'Would you like to discuss how our CRL response analysis could strengthen your resubmission? I can share specific examples from recent approvals after CRL.';
    } else if (status === 'REFUSE_TO_FILE') {
      trigger.subject = `RTF Remediation Support for ${app.application_number}`;
      trigger.mainIssue = 'Refuse to File requiring immediate action';
      trigger.personalizedHook = `An RTF on your ${submissionType} is challenging but addressable. Our analysis shows 73% of RTFs result in successful resubmission within 6 months with the right approach.`;
      trigger.context = 'Your RTF indicates submission quality issues that need systematic remediation.';
      trigger.offering = 'Our RTF recovery analysis provides:';
      trigger.specificAnalysis = [
        'Common RTF reasons in your division and fixes',
        'Pre-submission meeting strategy',
        'Quality control checklist based on recent approvals',
        'Resubmission timeline optimization'
      ];
    } else if (status === 'FILED_UNDER_REVIEW') {
      trigger.subject = `FDA Review Optimization for ${app.products[0]?.brand_name || app.application_number}`;
      trigger.mainIssue = 'optimizing FDA interactions during active review';
      trigger.personalizedHook = `With your ${submissionType} under FDA review, proactive preparation can save 2-3 months. I track FDA's questions patterns in ${therapeuticProfile.therapeuticArea}.`;
      trigger.context = `Your ${therapeuticProfile.therapeuticArea} application is at a critical juncture where anticipating FDA questions can significantly impact approval timeline.`;
      trigger.offering = 'Our regulatory intelligence helps you prepare for:';
      trigger.specificAnalysis = [
        'Common FDA queries in recent ' + therapeuticProfile.therapeuticArea + ' approvals',
        'Division-specific focus areas and concerns',
        'Mid-cycle meeting preparation strategies',
        'Information request response templates',
        `${submissionType}-specific review considerations`
      ];
    } else if (submissionType === '505(b)(2)') {
      trigger.subject = `505(b)(2) Strategy Optimization for ${app.products[0]?.brand_name}`;
      trigger.mainIssue = '505(b)(2) pathway optimization';
      trigger.personalizedHook = `505(b)(2) applications in ${therapeuticProfile.therapeuticArea} face unique challenges. Our analysis of 150+ successful 505(b)(2)s shows clear patterns.`;
      trigger.context = 'Your 505(b)(2) application requires careful navigation of literature support and bridging studies.';
      trigger.offering = 'Our 505(b)(2) intelligence includes:';
      trigger.specificAnalysis = [
        'Successful bridging strategies in your therapeutic area',
        'Literature package requirements by division',
        'Patent certification strategy',
        'Labeling negotiations tactics'
      ];
    } else if (urgentIssue) {
      trigger.subject = `FDA Strategy Support for ${urgentIssue.type.replace(/_/g, ' ')}`;
      trigger.mainIssue = urgentIssue.description.toLowerCase();
      trigger.personalizedHook = `Your ${app.products[0]?.brand_name || 'product'} faces a specific challenge I've seen resolved successfully in similar cases.`;
      trigger.context = `Your development faces ${urgentIssue.description.toLowerCase()}, which ${urgentIssue.needsHelp}.`;
      trigger.offering = `Our regulatory AI tool addresses ${urgentIssue.needsHelp} through:`;
      trigger.specificAnalysis = this.generateSpecificAnalysis(urgentIssue, therapeuticProfile);
    } else {
      // General outreach for standard applications
      trigger.subject = `FDA Regulatory Intelligence for ${therapeuticProfile.therapeuticArea} ${submissionType}`;
      trigger.mainIssue = 'regulatory strategy optimization';
      trigger.personalizedHook = `I noticed your ${submissionType} submission for a ${therapeuticProfile.therapeuticArea} product. The FDA landscape here has shifted significantly.`;
      trigger.context = `As you advance ${app.products[0]?.brand_name || 'your product'} through FDA review, having deep insights into division-specific preferences and successful precedents can make a significant difference.`;
      trigger.offering = 'Our AI-powered regulatory analysis provides:';
      trigger.specificAnalysis = [
        'Competitive intelligence on recent ' + therapeuticProfile.therapeuticArea + ' approvals',
        'Division-specific guidance interpretation patterns',
        `${submissionType} pathway optimization strategies`,
        'Risk mitigation insights from similar products'
      ];
    }
    
    // Add personalization based on complexity
    if (isComplex) {
      if (therapeuticProfile.complexity.combinationProduct) {
        trigger.specificAnalysis.push('Combination product jurisdictional strategies');
      }
      if (therapeuticProfile.complexity.is505b2) {
        trigger.specificAnalysis.push('505(b)(2) literature support optimization');
      }
      if (therapeuticProfile.complexity.isNovelTherapy) {
        trigger.specificAnalysis.push('Novel therapy precedent analysis');
      }
    }
    
    trigger.callToAction = this.generateCallToAction(status, urgentIssue, submissionType);
    
    return trigger;
  }

  generateSpecificAnalysis(issue, therapeuticProfile) {
    const analysisMap = {
      'MULTIPLE_REVIEW_CYCLES': [
        'Pattern analysis of products that succeeded after multiple cycles',
        'Common deficiency themes and their resolutions',
        'Statistical approaches that addressed FDA concerns',
        `Division-specific preferences in ${therapeuticProfile.therapeuticArea}`
      ],
      'EXTENDED_REVIEW': [
        'Factors contributing to extended reviews in your division',
        'Successful communication strategies for complex reviews',
        'Precedent analysis for timeline acceleration',
        'Risk factors for further delays and mitigation strategies'
      ],
      'PRIORITY_REVIEW_CHALLENGES': [
        'Priority review success factors in your indication',
        'Common pitfalls in expedited pathways',
        'Data package optimization for priority review',
        'FDA meeting strategy for expedited programs'
      ],
      'REFUSE_TO_FILE': [
        'RTF root cause analysis and remediation',
        'Successful resubmission strategies',
        'Quality assurance checkpoints',
        'Pre-submission meeting optimization'
      ]
    };
    
    return analysisMap[issue.type] || [
      'Targeted regulatory intelligence for your specific challenge',
      'Precedent analysis from similar situations',
      'FDA communication optimization strategies',
      'Risk mitigation approaches'
    ];
  }

  generateCallToAction(status, urgentIssue, submissionType) {
    if (status === 'COMPLETE_RESPONSE_LETTER') {
      return 'I have 2-3 hours available this week to conduct a focused CRL analysis. Would Tuesday or Thursday work better for a brief call to discuss your specific FDA concerns?';
    } else if (status === 'REFUSE_TO_FILE') {
      return 'RTF responses are time-critical. I can provide initial remediation insights today. When could we do a 20-minute call to discuss your resubmission strategy?';
    } else if (urgentIssue?.severity === 'CRITICAL') {
      return 'Given the urgency of your situation, I can provide initial insights within 24 hours. When would be a good time for a 20-minute call to understand your specific needs?';
    } else if (submissionType === '505(b)(2)') {
      return 'I recently helped 3 companies optimize their 505(b)(2) strategies. Could we do a brief call this week to discuss your specific pathway challenges?';
    } else {
      return 'Would you be interested in a 15-minute call to explore how this analysis could support your FDA strategy? I can share specific examples relevant to your situation.';
    }
  }

generateStrategicTrialEmail(trialData, biomarkerStrategy, challenges, competitive) {
  const phaseInfo = this.classifyTrialPhase(trialData);
  const newOpportunities = trialData.newTrialOpportunities || [];
  const criticalChallenge = challenges.find(c => c.severity === 'CRITICAL') || challenges[0];
  const phase2Stagnation = challenges.find(c => c.type === 'phase2_stagnation');
  
  let trigger = {
    subject: '',
    mainIssue: '',
    context: '',
    offering: '',
    specificAnalysis: [],
    urgency: 'MEDIUM',
    competitiveAngle: '',
    callToAction: '',
    personalizedHook: ''
  };
  
  // New trial opportunities (highest priority)
  if (newOpportunities.length > 0) {
    const primaryOpp = newOpportunities[0];
    
    if (primaryOpp.type === 'FIRST_IN_HUMAN') {
      trigger.subject = `First-in-Human FDA Strategy for ${trialData.conditions[0] || 'Your Program'}`;
      trigger.mainIssue = 'first-in-human study requiring comprehensive IND strategy';
      trigger.personalizedHook = `Your first-in-human study represents a critical inflection point. Having guided 50+ FIH programs through FDA, I know the key decisions that determine success.`;
      trigger.context = `First-in-human studies require meticulous FDA alignment on dose escalation, safety run-in, and patient population to establish a strong foundation for your program.`;
      trigger.offering = 'Our FIH expertise covers:';
      trigger.specificAnalysis = [
        'IND submission strategy and FDA pre-IND meeting preparation',
        'Dose escalation design and safety committee protocols',
        'Patient population definition and inclusion/exclusion criteria optimization',
        'Biomarker strategy for early efficacy signals',
        'Phase 2 dose selection and development path planning'
      ];
      trigger.urgency = 'CRITICAL';
    } else if (primaryOpp.type === 'PRE_RECRUITMENT_OPTIMIZATION') {
      trigger.subject = `Pre-Recruitment Protocol Optimization - NCT${trialData.nctId}`;
      trigger.mainIssue = 'protocol optimization before patient recruitment begins';
      trigger.personalizedHook = `Before recruiting your first patient, there's a critical window to optimize your protocol based on latest FDA guidance and successful precedents.`;
      trigger.context = `Your trial is positioned to incorporate recent FDA feedback patterns and avoid common protocol amendments that delay development.`;
      trigger.offering = 'Pre-recruitment optimization includes:';
      trigger.specificAnalysis = [
        'Recent FDA guidance interpretation for your indication',
        'Protocol design optimization based on successful precedents',
        'Enrollment feasibility assessment and site strategy',
        'Biomarker strategy refinement',
        'Statistical plan and interim analysis optimization'
      ];
      trigger.urgency = 'HIGH';
    } else if (primaryOpp.type === 'NEW_EARLY_PHASE_TRIAL') {
      trigger.subject = `Early Phase Development Strategy - ${trialData.conditions[0]}`;
      trigger.mainIssue = 'early phase development strategy optimization';
      trigger.personalizedHook = `Your new ${phaseInfo.isCombo ? 'Phase 1/2' : 'Phase 1'} trial is at the perfect stage for strategic FDA alignment. The decisions made now shape your entire development trajectory.`;
      trigger.context = `Early phase success requires careful FDA alignment on dose selection, patient population, and Phase 2 design considerations.`;
      trigger.offering = 'Our early development intelligence provides:';
      trigger.specificAnalysis = [
        'FDA division preferences for dose escalation in your indication',
        'Biomarker development strategy for Phase 2 readiness',
        'Patient population optimization and enrichment considerations',
        'Go/no-go criteria and dose selection methodology',
        'Phase 2 design planning and endpoint strategy'
      ];
      trigger.urgency = 'HIGH';
    }
  }
  // Phase 2 stagnation (high priority)
  else if (phase2Stagnation) {
    trigger.subject = `Phase 2 Development Optimization - ${trialData.conditions[0]}`;
    trigger.mainIssue = 'Phase 2 development optimization and advancement strategy';
    trigger.personalizedHook = `I noticed potential Phase 2 development challenges with your ${trialData.conditions[0]} program. Having analyzed 200+ Phase 2 programs, I see specific patterns that could help accelerate your path forward.`;
    trigger.context = phase2Stagnation.description;
    trigger.offering = 'Our Phase 2 optimization analysis includes:';
    trigger.specificAnalysis = [
      'Root cause analysis of Phase 2 delays in similar programs',
      'Dose optimization strategies FDA has accepted',
      'Patient enrichment approaches for improved efficacy signals',
      'Endpoint optimization for Phase 3 readiness',
      'Go/no-go decision frameworks and criteria',
      'Phase 3 design considerations and FDA meeting strategy'
    ];
    trigger.urgency = 'HIGH';
    trigger.competitiveAngle = `With competitive programs advancing, optimizing your Phase 2 strategy is critical for maintaining development leadership.`;
  }
  // Biomarker-focused emails
  else if (biomarkerStrategy.enrichmentStrategy === 'MIXED_POPULATION') {
    trigger.subject = `Biomarker Enrichment Strategy - NCT${trialData.nctId}`;
    trigger.mainIssue = 'biomarker enrichment strategy requiring FDA alignment';
    trigger.personalizedHook = `Your mixed biomarker population approach in ${trialData.conditions[0]} is strategically ambitious. Recent FDA decisions show specific patterns for successful implementation.`;
    trigger.context = `Mixed biomarker populations require careful statistical planning and FDA alignment to support future labeling claims.`;
    trigger.offering = 'Our biomarker strategy analysis includes:';
    trigger.specificAnalysis = [
      `Recent FDA positions on ${biomarkerStrategy.specificMarkers?.join('/')} enrichment`,
      'Statistical approaches for mixed populations FDA has endorsed',
      'Labeling strategy and market access implications',
      'Adaptive enrichment design precedents',
      'Companion diagnostic development pathway'
    ];
    trigger.urgency = 'HIGH';
  }
  // Standard trial support
  else {
    trigger.subject = `Clinical Development Strategy - ${phaseInfo.primary} ${trialData.conditions[0]} Trial`;
    trigger.mainIssue = 'clinical development optimization';
    trigger.personalizedHook = `Your ${phaseInfo.primary} trial in ${trialData.conditions[0]} intersects with evolving FDA expectations. Strategic preparation can significantly impact your development timeline.`;
    trigger.context = `Your ongoing development would benefit from understanding recent FDA decisions and successful precedents in your therapeutic area.`;
    trigger.offering = 'Our regulatory intelligence provides:';
    trigger.specificAnalysis = [
      `Recent FDA decisions in ${trialData.conditions[0]}`,
      'Division-specific preferences and precedents',
      'Successful development strategies in similar programs',
      'Risk mitigation approaches for common challenges',
      'Competitive landscape and differentiation opportunities'
    ];
    trigger.urgency = 'MEDIUM';
  }

  // Add phase-specific insights
  if (phaseInfo.isCombo) {
    trigger.specificAnalysis.push('Phase 1/2 seamless design optimization and interim analysis strategy');
  }

  // Add competitive context
  if (competitive.intensity === 'HIGH') {
    trigger.competitiveAngle = trigger.competitiveAngle || `In the competitive ${trialData.conditions[0]} landscape, FDA strategy differentiation is crucial for success.`;
  }

  // Generate appropriate call to action
  if (newOpportunities.length > 0) {
    trigger.callToAction = `Given the critical timing of your ${newOpportunities[0].type.toLowerCase().replace(/_/g, ' ')}, I'd recommend discussing strategy this week. Are you available for a 20-minute call to explore how our analysis could strengthen your approach?`;
  } else if (phase2Stagnation) {
    trigger.callToAction = `Phase 2 optimization requires focused analysis. I can provide initial insights within 48 hours. When would work for a brief call to discuss your specific development challenges?`;
  } else {
    trigger.callToAction = `Would you be interested in exploring how regulatory intelligence could support your development strategy? I'm available this week for a brief discussion.`;
  }

  return trigger;
}

  generateTrialCallToAction(trialData, challenge) {
    if (challenge?.severity === 'CRITICAL') {
      return `Given the complexity of ${challenge.specificNeed}, I'd like to discuss how our 2-3 hour analysis could address your specific FDA challenges. Are you available for a brief call this week?`;
    } else if (trialData.status === 'NOT_YET_RECRUITING') {
      return 'Would you like to explore how pre-trial FDA intelligence could strengthen your protocol? I have time Thursday or Friday for a 20-minute discussion.';
    } else if (trialData.phase === 'PHASE3') {
      return 'Pivotal trials benefit from proactive FDA strategy. Could we schedule a brief call to discuss precedents relevant to your design?';
    } else {
      return 'I\'d be happy to share specific examples of successful FDA strategies in your situation. When would work for a brief call?';
    }
  }

  calculateTrialUrgency(trialData, challenges) {
    let score = 50;
    
    // Status-based scoring
    if (trialData.status === 'NOT_YET_RECRUITING') score += 20;
    if (trialData.status === 'RECRUITING' && trialData.enrollment < 50) score += 15;
    
    // Challenge-based scoring
    challenges.forEach(challenge => {
      if (challenge.severity === 'CRITICAL') score += 30;
      else if (challenge.severity === 'HIGH') score += 20;
      else if (challenge.severity === 'MEDIUM') score += 10;
    });
    
    // Phase-based scoring
    if (trialData.phase === 'PHASE3') score += 15;
    else if (trialData.phase === 'PHASE2') score += 10;
    else if (trialData.phase === 'EARLY_PHASE1') score += 15;
    
    // Biomarker complexity
    if (trialData.biomarkerStrategy?.enrichmentStrategy === 'MIXED_POPULATION') score += 20;
    
    return Math.min(score, 100);
  }

  assessDataQuality(data) {
    let quality = 100;
    
    if (!data.sponsor_name) quality -= 20;
    if (!data.products || data.products.length === 0) quality -= 15;
    if (!data.submissions || data.submissions.length === 0) quality -= 15;
    
    return quality;
  }
}

// Enhanced Lead Generation Service
class LeadGenerationService {
  constructor() {
    this.fdaApi = new FDAApiService();
  }

  async generateLeads() {
    logger.info('Starting comprehensive FDA lead generation...');
    
    try {
      dataStore.leads = [];
      dataStore.companies.clear();

      // 1. Get drug applications (highest urgency) - FIXED
      const drugApplications = await this.fdaApi.getPharmaApplications();
      this.processApplications(drugApplications);

      // 2. Get clinical trials - FIXED with proper API v2
      const clinicalTrials = await this.fdaApi.getClinicalTrials();
      this.processTrials(clinicalTrials);

      // 3. Get warning letters (critical urgency)
      const warningLetters = await this.fdaApi.getWarningLetters();
      this.processWarningLetters(warningLetters);

      // 4. Get recalls (high urgency)
      const recalls = await this.fdaApi.getRecalls();
      this.processRecalls(recalls);

      // 5. Get inspection findings (medium urgency)
      const inspections = await this.fdaApi.getInspectionFindings();
      this.processInspections(inspections);

      // Score and rank all leads
      this.scoreAndRankLeads();

      // Generate statistics
      this.generateStatistics();

      logger.info(`Generated ${dataStore.leads.length} total FDA opportunities`);
      return dataStore.leads;
    } catch (error) {
      logger.error('Comprehensive lead generation error:', error);
      throw error;
    }
  }

  processApplications(applications) {
    applications.forEach(app => {
      if (!app.sponsorName) return;

      const companyName = this.normalizeCompanyName(app.sponsorName);
      const company = this.getOrCreateCompany(companyName);
      
      company.applications.push(app);
      company.therapeuticAreas.add(app.therapeuticProfile?.therapeuticArea);
      company.hasUrgentIssues = company.hasUrgentIssues || app.urgency === 'CRITICAL';
      
      // Create comprehensive lead
      const lead = {
        id: `app-${app.applicationNumber}`,
        companyName: companyName,
        leadType: 'DRUG_APPLICATION',
        subType: app.submissionType,
        priority: app.urgency,
        score: this.calculateApplicationScore(app),
        
        // Detailed information
        therapeuticArea: app.therapeuticProfile?.therapeuticArea,
        products: app.products,
        issues: app.issues,
        status: app.status,
        submissionType: app.submissionType,
        
        // Email content
        emailTrigger: app.emailTrigger,
        personalizedEmail: this.generateDetailedEmail(app.emailTrigger, companyName, app),
        
        // Metadata
        lastActivity: app.lastActivity,
        dataQuality: app.dataQuality,
        urgencyReason: this.getUrgencyReason(app),
        isHighPriority: app.isHighPriority,
        createdAt: new Date().toISOString()
      };

      dataStore.leads.push(lead);
    });
  }

processTrials(trials) {
  trials.forEach(trial => {
    if (!trial.sponsor) return;

    const companyName = this.normalizeCompanyName(trial.sponsor);
    const company = this.getOrCreateCompany(companyName);
    
    company.trials.push(trial);
    company.therapeuticAreas.add(trial.conditions?.[0]);
    
    // Enhanced filtering with new criteria
    const meetsFilterCriteria = this.evaluateEnhancedTrialFitCriteria(trial);
    
    if (meetsFilterCriteria.shouldInclude) {
      const lead = {
        id: `trial-${trial.nctId}`,
        companyName: companyName,
        leadType: 'CLINICAL_TRIAL',
        subType: this.generateTrialSubType(trial),
        priority: this.determineEnhancedTrialPriority(trial),
        score: trial.urgencyScore,
        
        // Enhanced trial details
        trialInfo: {
          nctId: trial.nctId,
          title: trial.title,
          phase: trial.phaseInfo?.primary || trial.phase,
          phaseCombo: trial.phaseInfo?.isCombo || false,
          status: trial.status,
          studyType: trial.studyType,
          indication: trial.conditions?.[0] || 'Unknown',
          enrollment: trial.enrollment,
          enrollmentType: trial.enrollmentType,
          startDate: trial.startDate,
          primaryCompletionDate: trial.primaryCompletionDate,
          interventions: trial.interventions,
          primaryPurpose: trial.primaryPurpose,
          monthsSinceStart: this.calculateMonthsSinceStart(trial)
        },
        
        // Enhanced analysis results
        phaseInfo: trial.phaseInfo,
        biomarkerStrategy: trial.biomarkerStrategy,
        endpoints: trial.endpoints,
        challenges: trial.painPoints, // Renamed for clarity
        competitive: trial.competitiveLandscape,
        complexityScore: trial.complexityScore,
        newTrialOpportunities: trial.newTrialOpportunities || [],
        
        // Enhanced email content
        emailTrigger: trial.emailTrigger,
        personalizedEmail: this.generateTrialEmail(trial.emailTrigger, companyName, trial),
        
        // Enhanced metadata
        lastActivity: trial.lastUpdatePostedDate || trial.firstPostedDate,
        urgencyReason: this.getEnhancedTrialUrgencyReason(trial),
        isHighValueLead: this.isEnhancedHighValueTrial(trial),
        priorityRanking: trial.priorityRanking,
        contactWindow: trial.nextContactWindow,
        fitReason: meetsFilterCriteria.reason,
        createdAt: new Date().toISOString()
      };

      dataStore.leads.push(lead);
    }
  });
}


// 24. NEW: Enhanced trial fit criteria evaluation
evaluateEnhancedTrialFitCriteria(trial) {
  const reasons = [];
  
  // Basic criteria (must meet these)
  if (trial.studyType !== 'INTERVENTIONAL') {
    return { shouldInclude: false, reason: 'Not interventional study' };
  }
  
  const validInterventionTypes = ['DRUG', 'BIOLOGICAL', 'COMBINATION_PRODUCT'];
  const hasValidIntervention = trial.interventions?.some(i => 
    validInterventionTypes.includes(i.type)
  );
  if (!hasValidIntervention) {
    return { shouldInclude: false, reason: 'No drug/biological intervention' };
  }
  
  const validStatuses = ['NOT_YET_RECRUITING', 'RECRUITING', 'ACTIVE_NOT_RECRUITING', 'SUSPENDED', 'TERMINATED'];
  if (!validStatuses.includes(trial.status)) {
    return { shouldInclude: false, reason: 'Not in relevant status' };
  }
  
  // Enhanced inclusion criteria (any of these qualifies)
  
  // 1. Critical pain points always qualify
  if (trial.painPoints?.some(p => p.severity === 'CRITICAL')) {
    reasons.push('Critical development issues identified');
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  // 2. New trial opportunities
  if (trial.newTrialOpportunities?.length > 0) {
    reasons.push(`New trial opportunity: ${trial.newTrialOpportunities[0].type}`);
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  // 3. Phase 2 stagnation signals
  const phase2Stagnation = trial.painPoints?.find(p => p.type === 'phase2_stagnation');
  if (phase2Stagnation) {
    reasons.push('Phase 2 stagnation detected');
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  // 4. High urgency scores
  if (trial.urgencyScore >= 70) {
    reasons.push(`High urgency score: ${trial.urgencyScore}`);
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  // 5. Complex biomarker strategies
  if (trial.biomarkerStrategy?.usesBiomarkers && trial.biomarkerStrategy?.complexity === 'HIGH') {
    reasons.push('Complex biomarker strategy requiring FDA alignment');
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  // 6. Early phase trials (Phase 1, Phase 1/2)
  const phaseInfo = trial.phaseInfo || this.classifyTrialPhase(trial);
  if (phaseInfo.primary === 'PHASE1' || phaseInfo.primary === 'EARLY_PHASE1' || phaseInfo.isCombo) {
    reasons.push(`Early phase trial: ${phaseInfo.primary}${phaseInfo.isCombo ? '/combo' : ''}`);
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  // 7. Phase 2 trials (potential for optimization)
  if (phaseInfo.primary === 'PHASE2') {
    reasons.push('Phase 2 trial with optimization potential');
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  // 8. Pivotal trials (Phase 3)
  if (phaseInfo.primary === 'PHASE3') {
    reasons.push('Pivotal Phase 3 trial');
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  // 9. High complexity trials
  if (trial.complexityScore >= 60) {
    reasons.push(`High complexity score: ${trial.complexityScore}`);
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  // 10. Competitive pressure situations
  if (trial.painPoints?.some(p => p.type === 'competitive_pressure' && p.urgency === 'critical')) {
    reasons.push('Critical competitive pressure');
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  // 11. Trials with recruitment challenges
  if (trial.painPoints?.some(p => p.type === 'recruitment_challenges' && p.severity === 'HIGH')) {
    reasons.push('Significant recruitment challenges');
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  // 12. Recently started trials (within 6 months)
  const startDate = this.extractTrialStartDate(trial);
  if (startDate && moment().diff(moment(startDate), 'months') <= 6) {
    reasons.push('Recently started trial');
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  // 13. Not yet recruiting trials (optimization window)
  if (trial.status === 'NOT_YET_RECRUITING') {
    reasons.push('Pre-recruitment optimization window');
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  // 14. Suspended/terminated trials (rescue opportunity)
  if (trial.status === 'SUSPENDED' || trial.status === 'TERMINATED') {
    reasons.push('Trial issues requiring strategic intervention');
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  // 15. Industry-sponsored mid-size companies (sweet spot)
  const sponsor = trial.sponsor?.lead?.toLowerCase() || '';
  const isHighValueSponsor = this.isHighValueSponsor(sponsor);
  if (isHighValueSponsor && (phaseInfo.primary === 'PHASE2' || phaseInfo.primary === 'PHASE3')) {
    reasons.push('High-value sponsor with advanced development');
    return { shouldInclude: true, reason: reasons.join('; ') };
  }
  
  return { shouldInclude: false, reason: 'Does not meet enhanced inclusion criteria' };
}

// 25. NEW: Generate trial subtype for better categorization
generateTrialSubType(trial) {
  const phaseInfo = trial.phaseInfo || this.classifyTrialPhase(trial);
  const status = trial.status || 'UNKNOWN';
  const painPoints = trial.painPoints || [];
  
  // Special cases first
  if (trial.newTrialOpportunities?.length > 0) {
    const oppType = trial.newTrialOpportunities[0].type;
    return `${phaseInfo.primary}_${oppType}`;
  }
  
  if (painPoints.some(p => p.type === 'phase2_stagnation')) {
    return `${phaseInfo.primary}_STAGNATION`;
  }
  
  if (painPoints.some(p => p.severity === 'CRITICAL')) {
    return `${phaseInfo.primary}_CRITICAL`;
  }
  
  if (trial.biomarkerStrategy?.usesBiomarkers) {
    return `${phaseInfo.primary}_BIOMARKER`;
  }
  
  // Standard categorization
  return `${phaseInfo.primary}_${status}`;
}

// 26. NEW: Enhanced trial priority determination
determineEnhancedTrialPriority(trial) {
  const painPoints = trial.painPoints || [];
  const phaseInfo = trial.phaseInfo || this.classifyTrialPhase(trial);
  
  // Critical priority conditions
  if (painPoints.some(p => p.severity === 'CRITICAL')) return 'CRITICAL';
  if (trial.newTrialOpportunities?.some(o => o.urgency === 'critical')) return 'CRITICAL';
  if (trial.status === 'SUSPENDED' || trial.status === 'TERMINATED') return 'CRITICAL';
  
  // High priority conditions
  if (painPoints.some(p => p.type === 'phase2_stagnation' && p.severity === 'HIGH')) return 'HIGH';
  if (painPoints.some(p => p.urgency === 'high')) return 'HIGH';
  if (trial.newTrialOpportunities?.length > 0) return 'HIGH';
  if (phaseInfo.primary === 'PHASE3') return 'HIGH';
  if (trial.status === 'NOT_YET_RECRUITING' && phaseInfo.primary !== 'PHASE4') return 'HIGH';
  
  // Medium priority conditions
  if (phaseInfo.primary === 'PHASE2') return 'MEDIUM';
  if (trial.biomarkerStrategy?.usesBiomarkers) return 'MEDIUM';
  if (trial.complexityScore >= 60) return 'MEDIUM';
  if (painPoints.length >= 2) return 'MEDIUM';
  
  return 'LOW';
}

// 27. NEW: Enhanced urgency reason generation
getEnhancedTrialUrgencyReason(trial) {
  const painPoints = trial.painPoints || [];
  const newOpportunities = trial.newTrialOpportunities || [];
  const phaseInfo = trial.phaseInfo || this.classifyTrialPhase(trial);
  
  // Critical reasons
  const criticalPainPoint = painPoints.find(p => p.severity === 'CRITICAL');
  if (criticalPainPoint) {
    return criticalPainPoint.description;
  }
  
  // New opportunity reasons
  if (newOpportunities.length > 0) {
    const primaryOpp = newOpportunities[0];
    return primaryOpp.description;
  }
  
  // Phase 2 stagnation
  const phase2Stagnation = painPoints.find(p => p.type === 'phase2_stagnation');
  if (phase2Stagnation) {
    return phase2Stagnation.description;
  }
  
  // High urgency reasons
  const urgentPainPoint = painPoints.find(p => p.urgency === 'high');
  if (urgentPainPoint) {
    return urgentPainPoint.description;
  }
  
  // Status-based reasons
  if (trial.status === 'NOT_YET_RECRUITING') {
    return 'Pre-recruitment phase offers critical window for protocol optimization';
  }
  
  if (trial.status === 'SUSPENDED') {
    return 'Trial suspension requires immediate strategic review and remediation';
  }
  
  if (trial.status === 'TERMINATED') {
    return 'Trial termination analysis can inform future development strategy';
  }
  
  // Phase-specific reasons
  if (phaseInfo.primary === 'PHASE3') {
    return 'Pivotal trial design decisions directly impact approval probability';
  }
  
  if (phaseInfo.primary === 'EARLY_PHASE1' || phaseInfo.primary === 'PHASE1') {
    return 'Early phase decisions establish foundation for entire development program';
  }
  
  if (phaseInfo.primary === 'PHASE2') {
    return 'Phase 2 optimization critical for successful Phase 3 advancement';
  }
  
  // Biomarker-specific reasons
  if (trial.biomarkerStrategy?.usesBiomarkers) {
    return 'Biomarker strategy requires FDA alignment for regulatory success';
  }
  
  // Default
  return 'Clinical development optimization opportunity identified';
}

// 28. NEW: Enhanced high-value trial determination
isEnhancedHighValueTrial(trial) {
  const painPoints = trial.painPoints || [];
  const phaseInfo = trial.phaseInfo || this.classifyTrialPhase(trial);
  const newOpportunities = trial.newTrialOpportunities || [];
  
  // Always high value conditions
  if (painPoints.some(p => p.severity === 'CRITICAL')) return true;
  if (newOpportunities.length > 0) return true;
  if (trial.urgencyScore >= 80) return true;
  
  // Phase 2 stagnation is high value
  if (painPoints.some(p => p.type === 'phase2_stagnation')) return true;
  
  // Complex biomarker strategies are high value
  if (trial.biomarkerStrategy?.enrichmentStrategy === 'MIXED_POPULATION') return true;
  if (trial.biomarkerStrategy?.complexity === 'HIGH') return true;
  
  // Pivotal trials are high value
  if (phaseInfo.primary === 'PHASE3' && trial.enrollment?.count > 200) return true;
  
  // Early phase with high complexity
  if ((phaseInfo.primary === 'PHASE1' || phaseInfo.primary === 'EARLY_PHASE1') && 
      trial.complexityScore >= 70) return true;
  
  // Pre-recruitment optimization windows
  if (trial.status === 'NOT_YET_RECRUITING' && 
      (phaseInfo.primary === 'PHASE2' || phaseInfo.primary === 'PHASE3')) return true;
  
  // Multiple pain points suggest complex situation
  if (painPoints.length >= 3) return true;
  
  // High-value sponsors with significant trials
  const sponsor = trial.sponsor?.lead?.toLowerCase() || '';
  if (this.isHighValueSponsor(sponsor) && 
      (phaseInfo.primary === 'PHASE2' || phaseInfo.primary === 'PHASE3') &&
      trial.enrollment?.count >= 100) return true;
  
  return false;
}

// 29. NEW: Calculate months since trial start
calculateMonthsSinceStart(trial) {
  const startDate = this.extractTrialStartDate(trial);
  if (!startDate) return null;
  
  return moment().diff(moment(startDate), 'months');
}

  processWarningLetters(letters) {
    letters.forEach(letter => {
      if (!letter.company) return;

      const companyName = this.normalizeCompanyName(letter.company);
      const company = this.getOrCreateCompany(companyName);
      
      company.warningLetters.push(letter);
      company.hasUrgentIssues = true;
      company.hasComplianceIssues = true;
      
      const lead = {
        id: `warning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        companyName: companyName,
        leadType: 'WARNING_LETTER',
        subType: letter.classification,
        priority: 'CRITICAL',
        score: 95, // Warning letters are highest priority
        
        // Issue details
        issue: {
          type: 'WARNING_LETTER',
          description: letter.reason,
          product: letter.productDescription,
          date: letter.reportDate,
          classification: letter.classification,
          distributionPattern: letter.distributionPattern
        },
        
        // Email content
        emailTrigger: letter.emailTrigger,
        personalizedEmail: this.generateWarningLetterEmail(letter, companyName),
        
        // Metadata
        lastActivity: letter.reportDate,
        urgencyReason: 'FDA enforcement action requires immediate response',
        createdAt: new Date().toISOString()
      };

      dataStore.leads.push(lead);
    });
  }

  processRecalls(recalls) {
    recalls.forEach(recall => {
      if (!recall.company) return;

      const companyName = this.normalizeCompanyName(recall.company);
      const company = this.getOrCreateCompany(companyName);
      
      company.recalls.push(recall);
      company.hasQualityIssues = true;
      
      const lead = {
        id: `recall-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        companyName: companyName,
        leadType: 'RECALL',
        subType: recall.classification,
        priority: recall.classification === 'Class I' ? 'CRITICAL' : 'HIGH',
        score: recall.classification === 'Class I' ? 90 : 80,
        
        // Recall details
        issue: {
          type: 'RECALL',
          classification: recall.classification,
          reason: recall.reasonForRecall,
          product: recall.productDescription,
          voluntary: recall.voluntaryMandated === 'Voluntary',
          initiationDate: recall.initiationDate
        },
        
        // Email content
        emailTrigger: recall.emailTrigger,
        personalizedEmail: this.generateRecallEmail(recall, companyName),
        
        // Metadata
        lastActivity: recall.initiationDate,
        urgencyReason: `${recall.classification} recall requiring comprehensive response`,
        createdAt: new Date().toISOString()
      };

      dataStore.leads.push(lead);
    });
  }

  processInspections(inspections) {
    inspections.forEach(inspection => {
      if (!inspection.company) return;

      const companyName = this.normalizeCompanyName(inspection.company);
      const company = this.getOrCreateCompany(companyName);
      
      company.inspectionIssues.push(inspection);
      company.hasQualityIssues = true;
      
      const lead = {
        id: `inspection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        companyName: companyName,
        leadType: 'INSPECTION_FINDING',
        subType: 'GMP_ISSUE',
        priority: 'MEDIUM',
        score: 70,
        
        // Issue details
        issue: {
          type: inspection.issue,
          description: inspection.description
        },
        
        // Email content
        emailTrigger: inspection.emailTrigger,
        personalizedEmail: this.generateInspectionEmail(inspection, companyName),
        
        // Metadata
        urgencyReason: 'GMP compliance gaps require proactive remediation',
        createdAt: new Date().toISOString()
      };

      dataStore.leads.push(lead);
    });
  }

  // Helper methods
  evaluateTrialFitCriteria(trial) {
    // Based on the ICP filters provided:
    
    // 1. Must be interventional
    if (trial.studyType !== 'INTERVENTIONAL') return false;
    
    // 2. Must be drug, biological, or combination product
    const validInterventionTypes = ['DRUG', 'BIOLOGICAL', 'COMBINATION_PRODUCT'];
    const hasValidIntervention = trial.interventions?.some(i => 
      validInterventionTypes.includes(i.type)
    );
    if (!hasValidIntervention) return false;
    
    // 3. Must be in relevant recruitment status
    const validStatuses = ['NOT_YET_RECRUITING', 'RECRUITING', 'ACTIVE_NOT_RECRUITING'];
    if (!validStatuses.includes(trial.status)) return false;
    
    // 4. Must be in relevant phase
    const validPhases = ['EARLY_PHASE1', 'PHASE1', 'PHASE2', 'PHASE3'];
    if (!validPhases.includes(trial.phase)) return false;
    
    // 5. Must be industry-sponsored (not academic)
    const sponsor = trial.sponsor?.toLowerCase() || '';
    const academicIndicators = ['university', 'college', 'hospital', 'institute', 'nih', 'national cancer', 'medical center'];
    const isAcademic = academicIndicators.some(indicator => sponsor.includes(indicator));
    if (isAcademic) return false;
    
    // 6. Additional high-value criteria
    // Accept if has regulatory challenges
    if (trial.regulatoryChallenges?.length > 0) return true;
    
    // Accept if high urgency score
    if (trial.urgencyScore >= 60) return true;
    
    // Accept if biomarker complexity
    if (trial.biomarkerStrategy?.usesBiomarkers) return true;
    
    // Accept if novel endpoints
    if (trial.endpoints?.hasNovelEndpoints) return true;
    
    // Accept if pre-recruitment (high opportunity)
    if (trial.status === 'NOT_YET_RECRUITING') return true;
    
    // Accept if complex design
    if (trial.complexityScore >= 50) return true;
    
    // Accept if Phase 3 (high stakes)
    if (trial.phase === 'PHASE3') return true;
    
    return false;
  }

  getOrCreateCompany(companyName) {
    if (!dataStore.companies.has(companyName)) {
      dataStore.companies.set(companyName, {
        name: companyName,
        applications: [],
        trials: [],
        warningLetters: [],
        recalls: [],
        inspectionIssues: [],
        therapeuticAreas: new Set(),
        hasUrgentIssues: false,
        hasQualityIssues: false,
        hasComplianceIssues: false,
        totalTouchpoints: 0
      });
    }
    
    const company = dataStore.companies.get(companyName);
    company.totalTouchpoints++;
    return company;
  }

  calculateApplicationScore(app) {
    let score = 50;
    
    // Urgency scoring
    if (app.urgency === 'CRITICAL') score += 40;
    else if (app.urgency === 'HIGH') score += 30;
    else if (app.urgency === 'MEDIUM') score += 20;
    
    // Issue scoring
    app.issues.forEach(issue => {
      if (issue.severity === 'CRITICAL') score += 15;
      else if (issue.severity === 'HIGH') score += 10;
      else if (issue.severity === 'MEDIUM') score += 5;
    });
    
    // Submission type scoring
    if (['NDA', 'BLA', '505(b)(2)'].includes(app.submissionType)) score += 10;
    
    // Complexity scoring
    if (app.therapeuticProfile?.complexity?.isNovelTherapy) score += 10;
    if (app.therapeuticProfile?.complexity?.combinationProduct) score += 5;
    if (app.therapeuticProfile?.complexity?.is505b2) score += 5;
    
    // Recency boost
    const daysSinceActivity = moment().diff(moment(app.lastActivity), 'days');
    if (daysSinceActivity < 30) score += 10;
    else if (daysSinceActivity < 60) score += 5;
    
    return Math.min(score, 100);
  }

  determineTrialPriority(trial) {
    const criticalChallenges = trial.regulatoryChallenges.filter(c => c.severity === 'CRITICAL');
    const highChallenges = trial.regulatoryChallenges.filter(c => c.severity === 'HIGH');
    
    if (criticalChallenges.length > 0) return 'CRITICAL';
    if (highChallenges.length >= 2) return 'HIGH';
    if (trial.biomarkerStrategy?.enrichmentStrategy === 'MIXED_POPULATION') return 'HIGH';
    if (trial.status === 'NOT_YET_RECRUITING' && trial.phase === 'PHASE3') return 'HIGH';
    if (trial.phase === 'PHASE3') return 'HIGH';
    if (highChallenges.length > 0) return 'MEDIUM';
    if (trial.complexityScore > 60) return 'MEDIUM';
    
    return 'LOW';
  }

  getUrgencyReason(app) {
    if (app.status === 'COMPLETE_RESPONSE_LETTER') {
      return 'CRL requires comprehensive response within regulatory timeline';
    } else if (app.status === 'REFUSE_TO_FILE') {
      return 'RTF requires immediate remediation and resubmission strategy';
    } else if (app.urgency === 'CRITICAL') {
      return app.issues[0]?.description || 'Critical regulatory issue identified';
    } else if (app.status === 'FILED_UNDER_REVIEW') {
      return 'Active FDA review - optimal time for proactive preparation';
    } else if (app.submissionType === '505(b)(2)') {
      return '505(b)(2) pathway requires specialized regulatory strategy';
    }
    
    return 'Standard regulatory support opportunity';
  }

  getTrialUrgencyReason(trial) {
    const criticalChallenge = trial.regulatoryChallenges.find(c => c.severity === 'CRITICAL');
    
    if (criticalChallenge) {
      return criticalChallenge.description;
    } else if (trial.biomarkerStrategy?.enrichmentStrategy === 'MIXED_POPULATION') {
      return 'Mixed biomarker population requires careful FDA alignment strategy';
    } else if (trial.status === 'NOT_YET_RECRUITING') {
      return 'Pre-recruitment phase offers critical window for protocol optimization';
    } else if (trial.phase === 'PHASE3') {
      return 'Pivotal trial design decisions impact approval probability';
    } else if (trial.endpoints?.hasNovelEndpoints) {
      return 'Novel endpoints require FDA validation strategy';
    } else if (trial.complexityScore > 70) {
      return 'Complex trial design requires specialized FDA expertise';
    }
    
    return 'Clinical development optimization opportunity';
  }

  generateDetailedEmail(trigger, companyName, app) {
    return {
      subject: trigger.subject,
      greeting: `Dear ${companyName} Regulatory Team,`,
      opening: trigger.personalizedHook || trigger.context,
      problemStatement: `Based on my analysis of recent FDA submissions in your space, ${trigger.mainIssue} represents both a challenge and an opportunity for differentiation.`,
      solution: trigger.offering,
      specificAnalysis: trigger.specificAnalysis.map(point => `• ${point}`).join('\n'),
      credibility: this.generateCredibility(trigger, app),
      urgency: trigger.urgency === 'CRITICAL' ? 
        '\nGiven the time-sensitive nature of your situation, I can prioritize this analysis and deliver initial insights within 24-48 hours.' : '',
      callToAction: trigger.callToAction,
      signature: this.generateSignature()
    };
  }

  generateWarningLetterEmail(letter, companyName) {
    return {
      subject: letter.emailTrigger.subject,
      greeting: `Dear ${companyName} Quality and Regulatory Leadership,`,
      opening: `I noticed the recent FDA ${letter.classification} enforcement action regarding ${letter.productDescription}. Having analyzed hundreds of warning letter responses, I understand the urgency and complexity of developing a comprehensive remediation strategy.`,
      problemStatement: letter.emailTrigger.context,
      solution: `Our regulatory AI tool can provide immediate support by analyzing:\n\n` +
        `• Successful warning letter responses in similar situations\n` +
        `• Root cause analysis patterns FDA finds acceptable\n` +
        `• Timeline benchmarks for remediation\n` +
        `• Strategies to prevent escalation to consent decree\n` +
        `• Division-specific expectations for your response`,
      urgency: `\nWarning letters typically require response within 15 working days. I can provide initial strategic insights within 24 hours to support your response preparation.`,
      callToAction: `Given the critical timeline, would you be available for a call today or tomorrow to discuss how our analysis can strengthen your FDA response?`,
      signature: this.generateSignature()
    };
  }

  generateRecallEmail(recall, companyName) {
    return {
      subject: recall.emailTrigger.subject,
      greeting: `Dear ${companyName} Leadership,`,
      opening: recall.emailTrigger.context,
      problemStatement: `Beyond the immediate recall execution, this situation presents an opportunity to strengthen your quality systems and prevent future occurrences.`,
      solution: recall.emailTrigger.offering + `\n\nSpecific areas of analysis:\n` +
        `• Root cause patterns from similar recalls\n` +
        `• CAPA strategies that satisfy FDA expectations\n` +
        `• Communication strategies to maintain stakeholder confidence\n` +
        `• Quality system enhancements to prevent recurrence\n` +
        `• Post-recall inspection preparation`,
      urgency: recall.classification === 'Class I' ? 
        '\nClass I recalls require immediate action. I can provide strategic support within hours.' : '',
      callToAction: `Would you like to discuss how this analysis could support both your immediate recall response and long-term quality strategy? I'm available this week for a brief call.`,
      signature: this.generateSignature()
    };
  }

  generateTrialEmail(trigger, companyName, trial) {
    const email = {
      subject: trigger.subject,
      greeting: `Dear ${companyName} Clinical Development Team,`,
      opening: trigger.personalizedHook || trigger.context,
      problemStatement: `${trigger.mainIssue} represents a critical decision point that could significantly impact your development timeline and regulatory strategy.`,
      solution: trigger.offering,
      specificAnalysis: trigger.specificAnalysis.map(point => `• ${point}`).join('\n'),
      competitiveContext: trigger.competitiveAngle || '',
      credibility: `This type of analysis recently helped a ${trial.phase} ${trial.conditions[0]} sponsor identify key protocol modifications that streamlined their FDA interactions.`,
      urgency: trigger.urgency === 'HIGH' ? 
        '\nI can complete this analysis within 2-3 hours and provide actionable insights for your team.' : '',
      callToAction: trigger.callToAction,
      signature: this.generateSignature()
    };
    
    return email;
  }

  generateInspectionEmail(inspection, companyName) {
    return {
      subject: inspection.emailTrigger.subject,
      greeting: `Dear ${companyName} Quality Assurance Team,`,
      opening: inspection.emailTrigger.context,
      solution: inspection.emailTrigger.offering,
      specificValue: `Our analysis would include:\n` +
        `• Common 483 observations in your facility type\n` +
        `• Successful CAPA examples from recent inspections\n` +
        `• Inspector focus areas by district\n` +
        `• Pre-inspection readiness strategies\n` +
        `• Mock inspection preparation`,
      callToAction: `Would you like to explore how this intelligence could strengthen your inspection readiness? I have time this week for a brief discussion.`,
      signature: this.generateSignature()
    };
  }

  generateCredibility(trigger, app) {
    const credibilityStatements = [
      'This approach recently helped a similar sponsor reduce their review time by 3 months.',
      'Our analysis identified critical precedents that strengthened a client\'s FDA response.',
      'Similar intelligence enabled a sponsor to successfully navigate their first CRL.',
      'This type of analysis has helped multiple sponsors optimize their regulatory strategies.',
      `We recently analyzed 50+ ${app?.submissionType || 'similar'} submissions to identify success patterns.`
    ];
    
    return credibilityStatements[Math.floor(Math.random() * credibilityStatements.length)];
  }

  generateSignature() {
    return 'Best regards,\n[Your name]\n[Your title]\n[Company]\n[Phone]\n[Email]';
  }

  scoreAndRankLeads() {
    // Multi-factor scoring
    dataStore.leads.forEach(lead => {
      // Adjust score based on company profile
      const company = dataStore.companies.get(lead.companyName);
      
      // Boost score for companies with multiple touchpoints
      if (company.totalTouchpoints > 1) {
        lead.score = Math.min(lead.score + 5 * company.totalTouchpoints, 100);
      }
      
      // Boost score for companies with urgent issues
      if (company.hasUrgentIssues) {
        lead.score = Math.min(lead.score + 10, 100);
      }
      
      // Boost score for compliance issues
      if (company.hasComplianceIssues) {
        lead.score = Math.min(lead.score + 15, 100);
      }
    });
    
    // Sort by priority then score
    dataStore.leads.sort((a, b) => {
      const priorityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return b.score - a.score;
    });
    
    // Add ranking
    dataStore.leads.forEach((lead, index) => {
      lead.rank = index + 1;
    });
  }

  generateStatistics() {
    const leads = dataStore.leads;
    const companies = Array.from(dataStore.companies.values());
    
    dataStore.statistics = {
      totalLeads: leads.length,
      totalCompanies: companies.length,
      
      byLeadType: {
        drugApplications: leads.filter(l => l.leadType === 'DRUG_APPLICATION').length,
        clinicalTrials: leads.filter(l => l.leadType === 'CLINICAL_TRIAL').length,
        warningLetters: leads.filter(l => l.leadType === 'WARNING_LETTER').length,
        recalls: leads.filter(l => l.leadType === 'RECALL').length,
        inspections: leads.filter(l => l.leadType === 'INSPECTION_FINDING').length
      },
      
      byPriority: {
        critical: leads.filter(l => l.priority === 'CRITICAL').length,
        high: leads.filter(l => l.priority === 'HIGH').length,
        medium: leads.filter(l => l.priority === 'MEDIUM').length,
        low: leads.filter(l => l.priority === 'LOW').length
      },
      
      bySubmissionType: {
        nda: leads.filter(l => l.submissionType === 'NDA').length,
        bla: leads.filter(l => l.submissionType === 'BLA').length,
        anda: leads.filter(l => l.submissionType === 'ANDA').length,
        '505b2': leads.filter(l => l.submissionType === '505(b)(2)').length,
        ind: leads.filter(l => l.submissionType === 'IND').length
      },
      
      byPhase: {
        earlyPhase1: leads.filter(l => l.trialInfo?.phase === 'EARLY_PHASE1').length,
        phase1: leads.filter(l => l.trialInfo?.phase === 'PHASE1').length,
        phase2: leads.filter(l => l.trialInfo?.phase === 'PHASE2').length,
        phase3: leads.filter(l => l.trialInfo?.phase === 'PHASE3').length
      },
      
      companiesWithMultipleIssues: companies.filter(c => c.totalTouchpoints > 1).length,
      companiesWithComplianceIssues: companies.filter(c => c.hasComplianceIssues).length,
      highValueLeads: leads.filter(l => l.isHighValueLead).length,
      biomarkerTrials: leads.filter(l => l.biomarkerStrategy?.usesBiomarkers).length
    };
  }

  normalizeCompanyName(name) {
    return name
      .replace(/\s+(LLC|INC|CORP|LTD|GMBH|SA|AG|PLC|LP|LLP|CO\.|COMPANY|PHARMACEUTICAL[S]?|PHARMA|BIOTECH|BIO|THERAPEUTICS|SCIENCES|LABORATORIES|LABS)\.?$/gi, '')
      .replace(/[,\.]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  }
}

// API Routes
app.get('/api/leads', async (req, res) => {
  try {
    const { 
      priority, 
      type, 
      therapeutic, 
      biomarker, 
      subType,
      phase,
      submissionType,
      highValue 
    } = req.query;
    
    let filteredLeads = [...dataStore.leads];
    
    if (priority) {
      filteredLeads = filteredLeads.filter(lead => lead.priority === priority);
    }
    
    if (type) {
      filteredLeads = filteredLeads.filter(lead => lead.leadType === type);
    }
    
    if (subType) {
      filteredLeads = filteredLeads.filter(lead => lead.subType === subType);
    }
    
    if (therapeutic) {
      filteredLeads = filteredLeads.filter(lead => lead.therapeuticArea === therapeutic);
    }
    
    if (biomarker === 'true') {
      filteredLeads = filteredLeads.filter(lead => 
        lead.biomarkerStrategy?.usesBiomarkers === true
      );
    }
    
    if (phase) {
      filteredLeads = filteredLeads.filter(lead => 
        lead.trialInfo?.phase === phase
      );
    }
    
    if (submissionType) {
      filteredLeads = filteredLeads.filter(lead => 
        lead.submissionType === submissionType
      );
    }
    
    if (highValue === 'true') {
      filteredLeads = filteredLeads.filter(lead => 
        lead.isHighValueLead === true || lead.score >= 80
      );
    }
    
    res.json(filteredLeads);
  } catch (error) {
    logger.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/companies/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const company = dataStore.companies.get(name.toUpperCase());
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    // Enrich company data
    const enrichedCompany = {
      ...company,
      therapeuticFocus: Array.from(company.therapeuticAreas),
      totalApplications: company.applications.length,
      totalTrials: company.trials.length,
      totalWarningLetters: company.warningLetters.length,
      totalRecalls: company.recalls.length,
      regulatoryChallenges: this.getAllCompanyChallenges(company),
      primaryChallenge: this.getPrimaryChallenge(company),
      recommendedApproach: this.generateCompanyApproach(company),
      riskProfile: this.assessCompanyRisk(company),
      opportunities: this.identifyOpportunities(company)
    };
    
    res.json(enrichedCompany);
  } catch (error) {
    logger.error('Error fetching company:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper methods for company analysis
app.locals.getAllCompanyChallenges = function(company) {
  const challenges = [];
  
  company.applications.forEach(app => {
    if (app.issues) challenges.push(...app.issues);
  });
  
  company.trials.forEach(trial => {
    if (trial.regulatoryChallenges) challenges.push(...trial.regulatoryChallenges);
  });
  
  if (company.warningLetters.length > 0) {
    challenges.push({
      type: 'WARNING_LETTER',
      severity: 'CRITICAL',
      description: 'Active FDA warning letter requiring response'
    });
  }
  
  if (company.recalls.length > 0) {
    challenges.push({
      type: 'PRODUCT_RECALL',
      severity: 'HIGH',
      description: 'Product recall requiring comprehensive response'
    });
  }
  
  return challenges;
};

app.locals.getPrimaryChallenge = function(company) {
  const challenges = app.locals.getAllCompanyChallenges(company);
  
  // Prioritize by severity
  const critical = challenges.find(c => c.severity === 'CRITICAL');
  if (critical) return critical;
  
  const high = challenges.find(c => c.severity === 'HIGH');
  if (high) return high;
  
  return challenges[0] || null;
};

app.locals.assessCompanyRisk = function(company) {
  let riskScore = 0;
  
  // Warning letters are highest risk
  riskScore += company.warningLetters.length * 30;
  
  // Recalls are high risk
  riskScore += company.recalls.length * 25;
  
  // CRLs and other critical issues
  company.applications.forEach(app => {
    if (app.status === 'COMPLETE_RESPONSE_LETTER') riskScore += 20;
    if (app.status === 'REFUSE_TO_FILE') riskScore += 15;
  });
  
  // Complex trials
  company.trials.forEach(trial => {
    if (trial.regulatoryChallenges?.some(c => c.severity === 'CRITICAL')) riskScore += 15;
  });
  
  if (riskScore >= 50) return 'CRITICAL';
  if (riskScore >= 30) return 'HIGH';
  if (riskScore >= 15) return 'MEDIUM';
  return 'LOW';
};

app.locals.generateCompanyApproach = function(company){
  const challenges = [];
  
  // Collect all challenges
  company.applications.forEach(app => challenges.push(...(app.issues || [])));
  company.trials.forEach(trial => challenges.push(...(trial.regulatoryChallenges || [])));
  
  const criticalChallenges = challenges.filter(c => c.severity === 'CRITICAL');
  
  if (company.warningLetters.length > 0) {
    return 'IMMEDIATE: Warning letter response and comprehensive compliance remediation';
  } else if (company.recalls.length > 0) {
    return 'URGENT: Recall management and quality system enhancement';
  } else if (criticalChallenges.length > 0) {
    return `Critical support needed: ${criticalChallenges[0].description}`;
  } else if (company.hasUrgentIssues) {
    return 'High-priority FDA regulatory support for ongoing submissions';
  } else if (company.trials.some(t => t.biomarkerStrategy?.enrichmentStrategy === 'MIXED_POPULATION')) {
    return 'Biomarker enrichment strategy optimization';
  } else if (company.hasQualityIssues) {
    return 'Quality system enhancement and inspection readiness';
  }
  
  return 'Standard FDA regulatory intelligence and submission optimization';
};

app.locals.identifyOpportunities = function(company) {
  const opportunities = [];
  
  // Check for biomarker opportunities
  const hasBiomarkerTrials = company.trials.some(t => t.biomarkerStrategy?.usesBiomarkers);
  if (hasBiomarkerTrials) {
    opportunities.push('Biomarker strategy optimization for FDA alignment');
  }
  
  // Check for expedited pathway opportunities
  const hasRareDisease = company.trials.some(t => 
    t.conditions?.[0]?.toLowerCase().includes('rare') || 
    t.conditions?.[0]?.toLowerCase().includes('orphan')
  );
  if (hasRareDisease) {
    opportunities.push('Orphan drug designation and expedited pathway strategy');
  }
  
  // Check for 505(b)(2) opportunities
  const has505b2 = company.applications.some(a => a.submissionType === '505(b)(2)');
  if (has505b2) {
    opportunities.push('505(b)(2) pathway optimization and literature strategy');
  }
  
  // Check for competitive positioning
  if (company.therapeuticAreas.has('ONCOLOGY')) {
    opportunities.push('Competitive intelligence for crowded oncology market');
  }
  
  // Check for quality system improvements
  if (company.hasQualityIssues) {
    opportunities.push('Proactive quality system enhancement to prevent future issues');
  }
  
  // Check for adaptive trial designs
  const hasAdaptiveTrials = company.trials.some(t => 
    t.title?.toLowerCase().includes('adaptive') || 
    t.regulatoryChallenges?.some(c => c.type === 'ADAPTIVE_DESIGN_COMPLEXITY')
  );
  if (hasAdaptiveTrials) {
    opportunities.push('Adaptive trial design FDA strategy and statistical planning');
  }
  
  return opportunities;
};

app.get('/api/leads/:id/email', async (req, res) => {
  try {
    const { id } = req.params;
    const lead = dataStore.leads.find(l => l.id === id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    // Get the full email content
    const emailData = {
      email: lead.personalizedEmail,
      trigger: lead.emailTrigger,
      metadata: {
        priority: lead.priority,
        score: lead.score,
        urgencyReason: lead.urgencyReason,
        leadType: lead.leadType,
        therapeuticArea: lead.therapeuticArea,
        submissionType: lead.submissionType
      }
    };
    
    // Add specific context based on lead type
    if (lead.leadType === 'CLINICAL_TRIAL' && lead.trialInfo) {
      emailData.trialContext = {
        nctId: lead.trialInfo.nctId,
        phase: lead.trialInfo.phase,
        indication: lead.trialInfo.indication,
        challenges: lead.challenges,
        biomarkerStrategy: lead.biomarkerStrategy
      };
    } else if (lead.leadType === 'DRUG_APPLICATION' && lead.issues) {
      emailData.applicationContext = {
        status: lead.status,
        issues: lead.issues,
        products: lead.products,
        submissionType: lead.submissionType
      };
    }
    
    res.json(emailData);
  } catch (error) {
    logger.error('Error fetching email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/generate-leads', async (req, res) => {
  try {
    const leadGenerator = new LeadGenerationService();
    const leads = await leadGenerator.generateLeads();
    
    // Return comprehensive statistics
    res.json({ 
      message: 'Comprehensive FDA lead generation completed',
      count: leads.length,
      statistics: dataStore.statistics,
      topLeads: leads.slice(0, 10).map(l => ({
        company: l.companyName,
        type: l.leadType,
        priority: l.priority,
        score: l.score,
        reason: l.urgencyReason
      }))
    });
  } catch (error) {
    logger.error('Error generating leads:', error);
    res.status(500).json({ error: 'Lead generation failed' });
  }
});

app.get('/api/analytics/comprehensive', async (req, res) => {
  try {
    const leads = dataStore.leads;
    const companies = Array.from(dataStore.companies.values());
    
    const analytics = {
      overview: {
        total_leads: leads.length,
        total_companies: companies.length,
        critical_situations: leads.filter(l => l.priority === 'CRITICAL').length,
        high_value_leads: leads.filter(l => l.isHighValueLead || l.score >= 80).length,
        average_score: leads.length > 0 
          ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)
          : 0
      },
      
      by_type: {
        drug_applications: {
          total: leads.filter(l => l.leadType === 'DRUG_APPLICATION').length,
          with_crl: leads.filter(l => l.status === 'COMPLETE_RESPONSE_LETTER').length,
          with_rtf: leads.filter(l => l.status === 'REFUSE_TO_FILE').length,
          under_review: leads.filter(l => l.status === 'FILED_UNDER_REVIEW').length,
          by_submission_type: {
            nda: leads.filter(l => l.submissionType === 'NDA').length,
            bla: leads.filter(l => l.submissionType === 'BLA').length,
            anda: leads.filter(l => l.submissionType === 'ANDA').length,
            '505b2': leads.filter(l => l.submissionType === '505(b)(2)').length
          }
        },
        clinical_trials: {
          total: leads.filter(l => l.leadType === 'CLINICAL_TRIAL').length,
          with_biomarkers: leads.filter(l => l.biomarkerStrategy?.usesBiomarkers).length,
          by_phase: {
            early_phase1: leads.filter(l => l.trialInfo?.phase === 'EARLY_PHASE1').length,
            phase1: leads.filter(l => l.trialInfo?.phase === 'PHASE1').length,
            phase2: leads.filter(l => l.trialInfo?.phase === 'PHASE2').length,
            phase3: leads.filter(l => l.trialInfo?.phase === 'PHASE3').length
          },
          by_status: {
            not_yet_recruiting: leads.filter(l => l.trialInfo?.status === 'NOT_YET_RECRUITING').length,
            recruiting: leads.filter(l => l.trialInfo?.status === 'RECRUITING').length,
            active_not_recruiting: leads.filter(l => l.trialInfo?.status === 'ACTIVE_NOT_RECRUITING').length
          }
        },
        enforcement: {
          warning_letters: leads.filter(l => l.leadType === 'WARNING_LETTER').length,
          recalls: leads.filter(l => l.leadType === 'RECALL').length,
          inspections: leads.filter(l => l.leadType === 'INSPECTION_FINDING').length
        }
      },
      
      therapeutic_distribution: {},
      
      biomarker_insights: {
        total_with_biomarkers: leads.filter(l => l.biomarkerStrategy?.usesBiomarkers).length,
        mixed_population: leads.filter(l => l.biomarkerStrategy?.enrichmentStrategy === 'MIXED_POPULATION').length,
        enriched_only: leads.filter(l => l.biomarkerStrategy?.enrichmentStrategy === 'ENRICHED_ONLY').length,
        complex_biomarker: leads.filter(l => l.biomarkerStrategy?.complexity === 'HIGH').length,
        specific_markers: {}
      },
      
      company_insights: {
        with_multiple_issues: companies.filter(c => c.totalTouchpoints > 1).length,
        with_urgent_issues: companies.filter(c => c.hasUrgentIssues).length,
        with_quality_issues: companies.filter(c => c.hasQualityIssues).length,
        with_compliance_issues: companies.filter(c => c.hasComplianceIssues).length,
        high_risk: companies.filter(c => app.locals.assessCompanyRisk(c) === 'CRITICAL' || app.locals.assessCompanyRisk(c) === 'HIGH').length
      },
      
      opportunities: {
        immediate_response_needed: leads.filter(l => l.priority === 'CRITICAL').length,
        high_value_targets: leads.filter(l => l.score >= 80).length,
        biomarker_consulting: leads.filter(l => 
          l.biomarkerStrategy?.usesBiomarkers || 
          l.challenges?.some(c => c.type === 'COMPLEX_BIOMARKER_DESIGN')
        ).length,
        quality_remediation: leads.filter(l => 
          l.leadType === 'WARNING_LETTER' || 
          l.leadType === 'RECALL' || 
          l.leadType === 'INSPECTION_FINDING'
        ).length,
        pre_submission_optimization: leads.filter(l => 
          l.trialInfo?.status === 'NOT_YET_RECRUITING' ||
          l.status === 'FILED_UNDER_REVIEW'
        ).length,
        expedited_pathway_candidates: leads.filter(l => 
          l.competitive?.expeditedPathways?.length > 0
        ).length
      }
    };
    
    // Calculate therapeutic areas
    const therapeuticAreas = new Map();
    leads.forEach(lead => {
      const area = lead.therapeuticArea || lead.trialInfo?.indication || 'UNSPECIFIED';
      therapeuticAreas.set(area, (therapeuticAreas.get(area) || 0) + 1);
    });
    
    therapeuticAreas.forEach((count, area) => {
      analytics.therapeutic_distribution[area] = count;
    });
    
    // Count specific biomarkers
    const biomarkerCounts = new Map();
    leads.forEach(lead => {
      if (lead.biomarkerStrategy?.specificMarkers) {
        lead.biomarkerStrategy.specificMarkers.forEach(marker => {
          biomarkerCounts.set(marker, (biomarkerCounts.get(marker) || 0) + 1);
        });
      }
    });
    
    biomarkerCounts.forEach((count, marker) => {
      analytics.biomarker_insights.specific_markers[marker] = count;
    });
    
    // Add time-based insights
    const recentLeads = leads.filter(l => {
      const lastActivity = l.lastActivity;
      if (!lastActivity) return false;
      return moment().diff(moment(lastActivity), 'days') < 30;
    });
    
    analytics.timing = {
      recent_activity_30_days: recentLeads.length,
      urgent_in_recent: recentLeads.filter(l => l.priority === 'CRITICAL' || l.priority === 'HIGH').length,
      leads_by_month: app.locals.getLeadsByMonth(leads)
    };
    
    res.json(analytics);
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper for monthly breakdown
app.locals.getLeadsByMonth = function(leads) {
  const monthlyBreakdown = {};
  
  leads.forEach(lead => {
    if (lead.lastActivity) {
      const month = moment(lead.lastActivity).format('YYYY-MM');
      monthlyBreakdown[month] = (monthlyBreakdown[month] || 0) + 1;
    }
  });
  
  return monthlyBreakdown;
};

// Export functionality
app.get('/api/export/leads', async (req, res) => {
  try {
    const { format = 'json', priority, type } = req.query;
    let leads = dataStore.leads;
    
    // Apply filters
    if (priority) {
      leads = leads.filter(l => l.priority === priority);
    }
    if (type) {
      leads = leads.filter(l => l.leadType === type);
    }
    
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=fda_leads_export.json');
      res.json({
        exportDate: new Date().toISOString(),
        totalLeads: leads.length,
        filters: { priority, type },
        leads: leads
      });
    } else if (format === 'csv') {
      // Basic CSV export
      const csv = this.convertToCSV(leads);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=fda_leads_export.csv');
      res.send(csv);
    }
  } catch (error) {
    logger.error('Error exporting leads:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

// CSV conversion helper
app.locals.convertToCSV = function(leads) {
  const headers = [
    'Rank', 'Company', 'Lead Type', 'Priority', 'Score', 
    'Submission Type', 'Phase', 'Status', 'Therapeutic Area', 
    'Urgency Reason', 'Last Activity'
  ];
  
  const rows = leads.map(lead => [
    lead.rank || '',
    lead.companyName,
    lead.leadType,
    lead.priority,
    lead.score,
    lead.submissionType || lead.trialInfo?.phase || '',
    lead.trialInfo?.phase || '',
    lead.status || lead.trialInfo?.status || '',
    lead.therapeuticArea || lead.trialInfo?.indication || '',
    lead.urgencyReason,
    lead.lastActivity || ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const searchTerm = q.toLowerCase();
    const results = dataStore.leads.filter(lead => 
      lead.companyName.toLowerCase().includes(searchTerm) ||
      lead.urgencyReason.toLowerCase().includes(searchTerm) ||
      lead.therapeuticArea?.toLowerCase().includes(searchTerm) ||
      lead.trialInfo?.indication?.toLowerCase().includes(searchTerm) ||
      lead.trialInfo?.nctId?.toLowerCase().includes(searchTerm)
    );
    
    res.json({
      query: q,
      count: results.length,
      results: results.slice(0, 50) // Limit to 50 results
    });
  } catch (error) {
    logger.error('Error searching:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '4.0.0',
    features: [
      'drug-applications',
      'clinical-trials-v2', 
      'biomarker-detection',
      'warning-letters',
      'recalls',
      'inspections',
      'email-generation',
      'multi-factor-scoring',
      'advanced-filtering'
    ],
    dataStatus: {
      totalLeads: dataStore.leads.length,
      totalCompanies: dataStore.companies.size,
      statistics: dataStore.statistics,
      lastUpdate: dataStore.leads[0]?.createdAt || 'No data'
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  logger.info(`Comprehensive FDA Lead Generation Server v4.0 running on port ${PORT}`);
  logger.info('Features: Full FDA opportunity spectrum - drug applications, clinical trials, warnings, recalls, inspections');
  logger.info('Enhanced: Proper ClinicalTrials.gov API v2 integration with advanced filtering');
  
  // Auto-generate initial leads on startup
  try {
    const leadGenerator = new LeadGenerationService();
    await leadGenerator.generateLeads();
    logger.info('Initial comprehensive lead generation completed successfully');
    logger.info(`Statistics:`, dataStore.statistics);
  } catch (error) {
    logger.error('Failed to generate initial leads:', error);
  }
});

module.exports = app;
// // Comprehensive FDA Lead Generation System
// // Captures ALL FDA opportunities: applications, trials, warning letters, recalls, inspections

// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// const winston = require('winston');
// const moment = require('moment');

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Configure Winston logger
// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   transports: [
//     new winston.transports.Console({
//       format: winston.format.simple()
//     })
//   ]
// });

// // Enhanced data store
// const dataStore = {
//   companies: new Map(),
//   leads: [],
//   clinicalTrials: [],
//   drugApplications: [],
//   warningLetters: [],
//   recalls: [],
//   inspections: [],
//   breakthroughDevices: []
// };

// // Comprehensive FDA API Service
// class FDAApiService {
//   constructor() {
//     this.fdaBaseUrl = 'https://api.fda.gov';
//     this.clinicalTrialsUrl = 'https://clinicaltrials.gov/api/v2';
//   }

//   // 1. Get pharma drug applications (INDs, NDAs, BLAs, ANDAs)
//   async getPharmaApplications() {
//     try {
//       logger.info('Fetching pharma drug applications...');
      
//       const endDate = moment().format('YYYYMMDD');
//       const startDate = moment().subtract(365, 'days').format('YYYYMMDD');
      
//       // Get recent submissions
//       const response = await axios.get(`${this.fdaBaseUrl}/drug/drugsfda.json`, {
//         params: {
//           search: `submissions.submission_status_date:[${startDate} TO ${endDate}]`,
//           limit: 100,
//           skip: 0
//         }
//       });

//       const applications = response.data.results || [];
//       logger.info(`Found ${applications.length} drug applications`);
      
//       return applications.map(app => this.analyzeApplication(app));
//     } catch (error) {
//       logger.error('Error fetching drug applications:', error.message);
//       return [];
//     }
//   }

//   // 2. Get WARNING LETTERS - Critical for immediate outreach
//   async getWarningLetters() {
//     try {
//       logger.info('Fetching FDA warning letters...');
      
//       const endDate = moment().format('YYYY-MM-DD');
//       const startDate = moment().subtract(180, 'days').format('YYYY-MM-DD');
      
//       // Warning letters are in the FDA's enforcement database
//       const response = await axios.get(`${this.fdaBaseUrl}/drug/enforcement.json`, {
//         params: {
//           search: `report_date:[${startDate} TO ${endDate}] AND classification:"Class I"`,
//           limit: 100
//         }
//       });

//       const enforcements = response.data.results || [];
//       logger.info(`Found ${enforcements.length} warning letters/enforcement actions`);
      
//       return enforcements.map(letter => ({
//         company: letter.recalling_firm,
//         reportDate: letter.report_date,
//         reason: letter.reason_for_recall,
//         classification: letter.classification,
//         status: letter.status,
//         productDescription: letter.product_description,
//         codeInfo: letter.code_info,
//         distributionPattern: letter.distribution_pattern,
//         urgency: 'CRITICAL',
//         emailTrigger: {
//           subject: `Urgent: FDA Compliance Support Following Recent ${letter.classification} Action`,
//           mainIssue: 'FDA enforcement action requiring immediate remediation',
//           context: `Your recent ${letter.classification} enforcement action regarding ${letter.product_description} requires strategic response to prevent escalation.`,
//           offering: 'Our regulatory AI can analyze similar enforcement actions and their successful remediation strategies, helping you develop a comprehensive response plan that satisfies FDA requirements.'
//         }
//       }));
//     } catch (error) {
//       logger.error('Error fetching warning letters:', error.message);
//       return [];
//     }
//   }

//   // 3. Get RECALLS - Another critical trigger
//   async getRecalls() {
//     try {
//       logger.info('Fetching recent drug recalls...');
      
//       const endDate = moment().format('YYYYMMDD');
//       const startDate = moment().subtract(90, 'days').format('YYYYMMDD');
      
//       const response = await axios.get(`${this.fdaBaseUrl}/drug/enforcement.json`, {
//         params: {
//           search: `recall_initiation_date:[${startDate} TO ${endDate}]`,
//           limit: 100
//         }
//       });

//       const recalls = response.data.results || [];
//       logger.info(`Found ${recalls.length} recent recalls`);
      
//       return recalls.map(recall => ({
//         company: recall.recalling_firm,
//         initiationDate: recall.recall_initiation_date,
//         classification: recall.classification,
//         voluntaryMandated: recall.voluntary_mandated,
//         reasonForRecall: recall.reason_for_recall,
//         productDescription: recall.product_description,
//         emailTrigger: {
//           subject: `FDA Recall Management Support - ${recall.classification}`,
//           mainIssue: 'managing FDA recall and preventing future occurrences',
//           context: `Your ${recall.voluntary_mandated} recall of ${recall.product_description} presents both immediate compliance needs and long-term quality system improvements.`,
//           offering: 'We can analyze root causes from similar recalls and provide FDA-aligned corrective action strategies.'
//         }
//       }));
//     } catch (error) {
//       logger.error('Error fetching recalls:', error.message);
//       return [];
//     }
//   }

//   // 4. Get Clinical Trials with comprehensive analysis
//   async getClinicalTrials() {
//     try {
//       logger.info('Fetching comprehensive clinical trials data...');
      
//       const response = await axios.get(`${this.clinicalTrialsUrl}/studies`, {
//         params: {
//           'format': 'json',
//           'query.intr': 'Drug OR Biological',
//           'filter.overallStatus': 'NOT_YET_RECRUITING,RECRUITING,ACTIVE_NOT_RECRUITING',
//           'filter.advanced': 'AREA[Phase](PHASE1 OR PHASE2 OR PHASE3)',
//           'pageSize': 100,
//           'fields': 'NCTId,BriefTitle,DetailedDescription,Phase,OverallStatus,LeadSponsorName,StartDate,Condition,InterventionName,InterventionType,EligibilityCriteria,EnrollmentCount,PrimaryOutcomeMeasure,PrimaryOutcomeTimeFrame,SecondaryOutcomeMeasure,StudyFirstSubmitDate,LastUpdatePostDate,DesignPrimaryPurpose,DesignAllocation,DesignInterventionModel,DesignMasking,ArmGroupLabel,ArmGroupType,ArmGroupDescription,StudyType,HealthyVolunteers,Sex,MinimumAge,MaximumAge,StandardAge'
//         }
//       });

//       const studies = response.data.studies || [];
//       logger.info(`Found ${studies.length} active pharma trials`);

//       return studies.map(study => this.comprehensiveTrialAnalysis(study));
//     } catch (error) {
//       logger.error('Error fetching clinical trials:', error.message);
//       return [];
//     }
//   }

//   // 5. Get FDA 483 Observations (Inspection findings)
//   async getInspectionFindings() {
//     try {
//       logger.info('Fetching FDA inspection findings...');
      
//       // Note: 483s aren't in the public API, but we can get inspection classifications
//       const response = await axios.get(`${this.fdaBaseUrl}/drug/enforcement.json`, {
//         params: {
//           search: 'reason_for_recall:"GMP"',
//           limit: 50
//         }
//       });

//       const inspections = response.data.results || [];
//       logger.info(`Found ${inspections.length} GMP-related issues`);
      
//       return inspections.map(inspection => ({
//         company: inspection.recalling_firm,
//         issue: 'GMP Compliance Issue',
//         description: inspection.reason_for_recall,
//         emailTrigger: {
//           subject: 'FDA GMP Compliance Intelligence',
//           mainIssue: 'GMP compliance gaps identified',
//           context: 'Recent FDA inspections in your sector have identified critical GMP issues.',
//           offering: 'Our analysis of FDA inspection trends can help you prepare for upcoming inspections and address common citations.'
//         }
//       }));
//     } catch (error) {
//       logger.error('Error fetching inspection data:', error.message);
//       return [];
//     }
//   }

//   // Enhanced application analysis
//   analyzeApplication(app) {
//     const submissions = app.submissions || [];
//     const latestSubmission = submissions[0] || {};
//     const products = app.products || [];
    
//     // Determine regulatory status and urgency
//     const status = this.determineDetailedStatus(latestSubmission);
//     const urgency = this.calculateUrgency(status, latestSubmission);
    
//     // Identify all potential issues
//     const issues = this.identifyAllIssues(app, status);
    
//     // Analyze therapeutic area and competition
//     const therapeuticProfile = this.analyzeTherapeuticProfile(app);
    
//     // Generate comprehensive email trigger
//     const emailTrigger = this.generateComprehensiveEmailTrigger(app, status, issues, therapeuticProfile);
    
//     return {
//       applicationNumber: app.application_number,
//       sponsorName: app.sponsor_name,
//       products: products.map(p => ({
//         brandName: p.brand_name,
//         genericName: p.generic_name,
//         dosageForm: p.dosage_form,
//         route: p.route,
//         marketingStatus: p.marketing_status
//       })),
//       submissions: submissions.map(s => ({
//         type: s.submission_type,
//         number: s.submission_number,
//         status: s.submission_status,
//         statusDate: s.submission_status_date,
//         reviewPriority: s.review_priority,
//         submissionClassCode: s.submission_class_code
//       })),
//       status,
//       urgency,
//       issues,
//       therapeuticProfile,
//       emailTrigger,
//       dataQuality: this.assessDataQuality(app),
//       lastActivity: latestSubmission.submission_status_date
//     };
//   }

//   // Comprehensive trial analysis
//   comprehensiveTrialAnalysis(study) {
//     const s = study.protocolSection || study;
    
//     // Extract all available data
//     const trialData = {
//       nctId: s.identificationModule?.nctId || s.NCTId,
//       title: s.identificationModule?.briefTitle || s.BriefTitle,
//       sponsor: s.sponsorCollaboratorsModule?.leadSponsor?.name || s.LeadSponsorName,
//       phase: s.designModule?.phases?.[0] || s.Phase?.[0],
//       status: s.statusModule?.overallStatus || s.OverallStatus?.[0],
//       conditions: s.conditionsModule?.conditions || s.Condition || [],
//       studyType: s.designModule?.studyType || s.StudyType?.[0],
//       enrollment: parseInt(s.designModule?.enrollmentInfo?.count || s.EnrollmentCount?.[0]) || 0,
//       startDate: s.statusModule?.startDateStruct?.date || s.StartDate?.[0],
//       primaryCompletion: s.statusModule?.primaryCompletionDateStruct?.date,
//       eligibility: s.eligibilityModule?.eligibilityCriteria || s.EligibilityCriteria?.[0] || ''
//     };
    
//     // Deep analysis
//     const biomarkerStrategy = this.analyzeBiomarkerStrategy(trialData.eligibility, trialData.title);
//     const endpoints = this.analyzeEndpoints(s);
//     const regulatoryChallenges = this.identifyAllTrialChallenges(trialData, biomarkerStrategy, endpoints);
//     const competitiveLandscape = this.assessCompetitiveLandscape(trialData);
    
//     // Generate strategic email
//     const emailTrigger = this.generateStrategicTrialEmail(trialData, biomarkerStrategy, regulatoryChallenges, competitiveLandscape);
    
//     return {
//       ...trialData,
//       biomarkerStrategy,
//       endpoints,
//       regulatoryChallenges,
//       competitiveLandscape,
//       emailTrigger,
//       urgencyScore: this.calculateTrialUrgency(trialData, regulatoryChallenges)
//     };
//   }

//   // Helper methods
//   determineDetailedStatus(submission) {
//     if (!submission.submission_type) return 'NO_SUBMISSION';
    
//     const type = submission.submission_type;
//     const status = submission.submission_status;
    
//     // Critical statuses
//     if (status === 'CR') return 'COMPLETE_RESPONSE_LETTER';
//     if (status === 'RT') return 'REFUSE_TO_FILE';
//     if (status === 'WD') return 'WITHDRAWN';
    
//     // Active statuses
//     if (type === 'ORIG' && status === 'FI') return 'FILED_UNDER_REVIEW';
//     if (type === 'ORIG' && status === 'AP') return 'APPROVED';
//     if (type === 'ORIG' && status === 'TA') return 'TENTATIVE_APPROVAL';
    
//     // Supplemental submissions
//     if (type === 'SUPPL') return 'SUPPLEMENTAL_APPLICATION';
    
//     // Pre-submission
//     if (type === 'IND') return 'IND_ACTIVE';
    
//     return 'OTHER';
//   }

//   calculateUrgency(status, submission) {
//     // Critical urgency
//     if (['COMPLETE_RESPONSE_LETTER', 'REFUSE_TO_FILE'].includes(status)) return 'CRITICAL';
    
//     // High urgency
//     if (['FILED_UNDER_REVIEW', 'TENTATIVE_APPROVAL'].includes(status)) return 'HIGH';
    
//     // Medium urgency
//     if (submission.review_priority === 'PRIORITY') return 'MEDIUM';
    
//     // Check recency
//     const daysSinceActivity = moment().diff(moment(submission.submission_status_date), 'days');
//     if (daysSinceActivity < 30) return 'MEDIUM';
    
//     return 'LOW';
//   }

//   identifyAllIssues(app, status) {
//     const issues = [];
//     const submissions = app.submissions || [];
    
//     // CRL issues
//     if (status === 'COMPLETE_RESPONSE_LETTER') {
//       issues.push({
//         type: 'CRL_RECEIVED',
//         severity: 'CRITICAL',
//         description: 'Complete Response Letter requires comprehensive response strategy',
//         needsHelp: 'CRL response strategy, precedent analysis, FDA meeting preparation'
//       });
//     }
    
//     // Multiple review cycles
//     const origCount = submissions.filter(s => s.submission_type === 'ORIG').length;
//     if (origCount > 1) {
//       issues.push({
//         type: 'MULTIPLE_REVIEW_CYCLES',
//         severity: 'HIGH',
//         description: `${origCount} review cycles indicate persistent FDA concerns`,
//         needsHelp: 'Root cause analysis, regulatory strategy optimization'
//       });
//     }
    
//     // Long review times
//     const firstSubmission = submissions[submissions.length - 1];
//     const reviewTime = moment(submissions[0]?.submission_status_date).diff(moment(firstSubmission?.submission_status_date), 'days');
//     if (reviewTime > 365) {
//       issues.push({
//         type: 'EXTENDED_REVIEW',
//         severity: 'MEDIUM',
//         description: `${reviewTime} days in review suggests complex regulatory issues`,
//         needsHelp: 'FDA communication strategy, submission optimization'
//       });
//     }
    
//     // Priority review challenges
//     if (submissions.some(s => s.review_priority === 'PRIORITY' && s.submission_status !== 'AP')) {
//       issues.push({
//         type: 'PRIORITY_REVIEW_CHALLENGES',
//         severity: 'HIGH',
//         description: 'Priority review designation with ongoing challenges',
//         needsHelp: 'Expedited pathway navigation, FDA alignment'
//       });
//     }
    
//     return issues;
//   }

//   analyzeTherapeuticProfile(app) {
//     const products = app.products || [];
//     const pharmClasses = [];
//     const routes = new Set();
//     const dosageForms = new Set();
    
//     products.forEach(product => {
//       if (product.pharm_class) pharmClasses.push(...product.pharm_class);
//       if (product.route) routes.add(product.route);
//       if (product.dosage_form) dosageForms.add(product.dosage_form);
//     });
    
//     // Determine therapeutic area
//     const therapeuticArea = this.classifyTherapeuticArea(pharmClasses);
    
//     // Assess complexity
//     const complexity = {
//       multipleRoutes: routes.size > 1,
//       multipleDosageForms: dosageForms.size > 1,
//       combinationProduct: products.some(p => p.active_ingredients?.length > 1),
//       isNovelTherapy: this.isNovelTherapy(pharmClasses)
//     };
    
//     return {
//       therapeuticArea,
//       pharmClasses: [...new Set(pharmClasses)],
//       routes: Array.from(routes),
//       dosageForms: Array.from(dosageForms),
//       complexity,
//       competitiveIntensity: this.assessCompetitiveIntensity(therapeuticArea)
//     };
//   }

//   classifyTherapeuticArea(pharmClasses) {
//     const classString = pharmClasses.join(' ').toUpperCase();
    
//     if (/ONCOL|ANTINEO|CANCER/.test(classString)) return 'ONCOLOGY';
//     if (/NEUR|PSYCH|CNS|ALZH|PARKIN/.test(classString)) return 'CNS';
//     if (/CARD|HYPERT|LIPID/.test(classString)) return 'CARDIOVASCULAR';
//     if (/DIAB|METABOL|OBESITY/.test(classString)) return 'METABOLIC';
//     if (/IMMUN|RHEUM|AUTOIMM/.test(classString)) return 'IMMUNOLOGY';
//     if (/INFECT|ANTIBIOT|ANTIVIR/.test(classString)) return 'INFECTIOUS_DISEASE';
//     if (/RARE|ORPHAN/.test(classString)) return 'RARE_DISEASE';
    
//     return 'OTHER';
//   }

//   isNovelTherapy(pharmClasses) {
//     const novelIndicators = ['FIRST', 'NOVEL', 'NEW', 'BREAKTHROUGH', 'ONLY'];
//     return novelIndicators.some(indicator => 
//       pharmClasses.some(pc => pc.toUpperCase().includes(indicator))
//     );
//   }

//   assessCompetitiveIntensity(therapeuticArea) {
//     const highCompetition = ['ONCOLOGY', 'CNS', 'METABOLIC'];
//     const mediumCompetition = ['CARDIOVASCULAR', 'IMMUNOLOGY'];
    
//     if (highCompetition.includes(therapeuticArea)) return 'HIGH';
//     if (mediumCompetition.includes(therapeuticArea)) return 'MEDIUM';
//     return 'LOW';
//   }

//   analyzeBiomarkerStrategy(eligibility, title) {
//     const text = `${eligibility} ${title}`.toLowerCase();
    
//     // Comprehensive biomarker detection
//     const biomarkerTypes = {
//       genetic: /mutation|variant|polymorphism|genotype|allele|chromosome/i.test(text),
//       protein: /expression|overexpression|positive|negative|high|low/i.test(text),
//       genomic: /genomic|sequencing|ngs|wgs|wes|panel/i.test(text),
//       liquidBiopsy: /ctdna|cfdna|liquid biopsy|circulating/i.test(text),
//       immunologic: /pd-l1|pd-1|msi|tmb|hla|immune/i.test(text)
//     };
    
//     const specificMarkers = this.extractSpecificMarkers(text);
    
//     // Determine enrichment approach
//     let enrichmentStrategy = 'NONE';
//     if (text.includes('positive') && text.includes('negative')) {
//       enrichmentStrategy = 'MIXED_POPULATION';
//     } else if (text.includes('positive') || text.includes('enriched')) {
//       enrichmentStrategy = 'ENRICHED_ONLY';
//     } else if (text.includes('all-comers') || text.includes('unselected')) {
//       enrichmentStrategy = 'ALL_COMERS';
//     } else if (Object.values(biomarkerTypes).some(v => v)) {
//       enrichmentStrategy = 'BIOMARKER_STRATIFIED';
//     }
    
//     return {
//       usesBiomarkers: Object.values(biomarkerTypes).some(v => v),
//       biomarkerTypes,
//       specificMarkers,
//       enrichmentStrategy,
//       complexity: this.assessBiomarkerComplexity(biomarkerTypes, specificMarkers)
//     };
//   }

//   extractSpecificMarkers(text) {
//     const markers = [];
//     const knownMarkers = [
//       'her2', 'egfr', 'pd-l1', 'pd-1', 'brca1', 'brca2', 'alk', 'ros1', 
//       'kras', 'nras', 'braf', 'met', 'ret', 'ntrk', 'fgfr', 'pik3ca',
//       'msi-h', 'tmb-h', 'mmr', 'tp53', 'apc', 'cdh1', 'vhl', 'kit'
//     ];
    
//     knownMarkers.forEach(marker => {
//       if (text.includes(marker)) markers.push(marker.toUpperCase());
//     });
    
//     return markers;
//   }

//   assessBiomarkerComplexity(types, markers) {
//     const typeCount = Object.values(types).filter(v => v).length;
    
//     if (typeCount >= 3 || markers.length >= 3) return 'HIGH';
//     if (typeCount >= 2 || markers.length >= 2) return 'MEDIUM';
//     return 'LOW';
//   }

//   analyzeEndpoints(study) {
//     const primary = study.outcomesModule?.primaryOutcomes || [];
//     const secondary = study.outcomesModule?.secondaryOutcomes || [];
    
//     const primaryEndpoints = primary.map(outcome => ({
//       measure: outcome.measure,
//       timeFrame: outcome.timeFrame,
//       description: outcome.description,
//       isNovel: this.isNovelEndpoint(outcome.measure),
//       isSurrogate: this.isSurrogateEndpoint(outcome.measure),
//       requiresValidation: this.requiresEndpointValidation(outcome.measure)
//     }));
    
//     return {
//       primary: primaryEndpoints,
//       secondaryCount: secondary.length,
//       hasNovelEndpoints: primaryEndpoints.some(e => e.isNovel),
//       hasSurrogateEndpoints: primaryEndpoints.some(e => e.isSurrogate),
//       complexity: this.assessEndpointComplexity(primaryEndpoints)
//     };
//   }

//   isNovelEndpoint(measure) {
//     const novelIndicators = ['novel', 'new', 'composite', 'combined', 'proprietary'];
//     return novelIndicators.some(ind => measure?.toLowerCase().includes(ind));
//   }

//   isSurrogateEndpoint(measure) {
//     const surrogateIndicators = ['biomarker', 'expression', 'level', 'concentration', 'surrogate'];
//     return surrogateIndicators.some(ind => measure?.toLowerCase().includes(ind));
//   }

//   requiresEndpointValidation(measure) {
//     return this.isNovelEndpoint(measure) || this.isSurrogateEndpoint(measure);
//   }

//   assessEndpointComplexity(endpoints) {
//     if (endpoints.some(e => e.isNovel && e.isSurrogate)) return 'HIGH';
//     if (endpoints.some(e => e.isNovel || e.isSurrogate)) return 'MEDIUM';
//     return 'LOW';
//   }

//   identifyAllTrialChallenges(trialData, biomarkerStrategy, endpoints) {
//     const challenges = [];
    
//     // Biomarker challenges
//     if (biomarkerStrategy.enrichmentStrategy === 'MIXED_POPULATION') {
//       challenges.push({
//         type: 'COMPLEX_BIOMARKER_DESIGN',
//         severity: 'CRITICAL',
//         description: 'Mixed biomarker population requires careful FDA alignment',
//         specificNeed: 'Analysis of FDA enrichment guidance interpretation across divisions'
//       });
//     }
    
//     // Endpoint challenges
//     if (endpoints.hasNovelEndpoints) {
//       challenges.push({
//         type: 'NOVEL_ENDPOINT_VALIDATION',
//         severity: 'HIGH',
//         description: 'Novel endpoints require extensive FDA validation',
//         specificNeed: 'Precedent analysis for endpoint acceptance in similar indications'
//       });
//     }
    
//     // Enrollment challenges
//     if (trialData.enrollment < 50 && trialData.phase !== 'PHASE1') {
//       challenges.push({
//         type: 'SMALL_SAMPLE_SIZE',
//         severity: 'HIGH',
//         description: 'Small sample size requires robust statistical justification',
//         specificNeed: 'Statistical power analysis and FDA precedents for small trials'
//       });
//     } else if (trialData.enrollment > 1000) {
//       challenges.push({
//         type: 'LARGE_TRIAL_MANAGEMENT',
//         severity: 'MEDIUM',
//         description: 'Large trial requires interim analysis strategy',
//         specificNeed: 'FDA guidance on DMC charters and interim analyses'
//       });
//     }
    
//     // Phase-specific challenges
//     if (trialData.phase === 'PHASE2' && trialData.conditions[0]?.toLowerCase().includes('rare')) {
//       challenges.push({
//         type: 'RARE_DISEASE_DEVELOPMENT',
//         severity: 'HIGH',
//         description: 'Rare disease development pathway optimization needed',
//         specificNeed: 'FDA orphan drug and expedited pathway strategy'
//       });
//     }
    
//     // Timing challenges
//     if (trialData.status === 'NOT_YET_RECRUITING') {
//       challenges.push({
//         type: 'PRE_TRIAL_OPTIMIZATION',
//         severity: 'MEDIUM',
//         description: 'Pre-recruitment window for protocol optimization',
//         specificNeed: 'FDA Type B meeting preparation and protocol alignment'
//       });
//     }
    
//     return challenges;
//   }

//   assessCompetitiveLandscape(trialData) {
//     // This would ideally query a competitive intelligence database
//     // For now, we'll use heuristics based on the indication
//     const indication = trialData.conditions[0]?.toLowerCase() || '';
    
//     let intensity = 'MODERATE';
//     let keyCompetitors = [];
    
//     if (indication.includes('cancer') || indication.includes('oncol')) {
//       intensity = 'HIGH';
//       keyCompetitors = ['Multiple PD-1/PD-L1 inhibitors', 'CAR-T therapies', 'ADCs'];
//     } else if (indication.includes('alzheimer') || indication.includes('parkinson')) {
//       intensity = 'HIGH';
//       keyCompetitors = ['Aduhelm controversy impacts', 'Multiple Phase 3 failures'];
//     } else if (indication.includes('rare') || indication.includes('orphan')) {
//       intensity = 'LOW';
//       keyCompetitors = ['Limited competition', 'First-in-class opportunity'];
//     }
    
//     return {
//       intensity,
//       keyCompetitors,
//       marketDynamics: this.assessMarketDynamics(indication),
//       fdaClimate: this.assessFDAClimate(indication)
//     };
//   }

//   assessMarketDynamics(indication) {
//     if (indication.includes('biosimilar')) return 'PRICE_PRESSURE';
//     if (indication.includes('rare')) return 'PREMIUM_PRICING';
//     if (indication.includes('generic')) return 'COMMODITY';
//     return 'COMPETITIVE';
//   }

//   assessFDAClimate(indication) {
//     if (indication.includes('opioid')) return 'HEIGHTENED_SCRUTINY';
//     if (indication.includes('pediatric')) return 'SUPPORTIVE';
//     if (indication.includes('antibiotic')) return 'EXPEDITED';
//     return 'STANDARD';
//   }

//   generateComprehensiveEmailTrigger(app, status, issues, therapeuticProfile) {
//     const urgentIssue = issues.find(i => i.severity === 'CRITICAL') || issues[0];
//     const isComplex = therapeuticProfile.complexity.combinationProduct || 
//                       therapeuticProfile.complexity.isNovelTherapy;
    
//     let trigger = {
//       subject: '',
//       mainIssue: '',
//       context: '',
//       offering: '',
//       specificAnalysis: [],
//       urgency: this.calculateUrgency(status, app.submissions[0]),
//       callToAction: ''
//     };
    
//     // Customize based on status
//     if (status === 'COMPLETE_RESPONSE_LETTER') {
//       trigger.subject = `CRL Response Strategy for ${app.products[0]?.brand_name || app.application_number}`;
//       trigger.mainIssue = 'Complete Response Letter requiring strategic response';
//       trigger.context = `Your CRL for ${app.products[0]?.brand_name || 'your product'} requires a comprehensive response strategy that addresses FDA's specific concerns while maintaining your development timeline.`;
//       trigger.offering = 'I can provide detailed analysis of successful CRL responses in your therapeutic area, including:';
//       trigger.specificAnalysis = [
//         'Root cause patterns in similar CRLs and their resolutions',
//         'Division-specific preferences for data presentation',
//         'Statistical approaches that have satisfied FDA concerns',
//         'Timeline optimization strategies for resubmission'
//       ];
//       trigger.callToAction = 'Would you like to discuss how our CRL response analysis could strengthen your resubmission? I can share specific examples from recent approvals after CRL.';
//     } else if (status === 'FILED_UNDER_REVIEW') {
//       trigger.subject = `FDA Review Optimization for ${app.products[0]?.brand_name || app.application_number}`;
//       trigger.mainIssue = 'optimizing FDA interactions during active review';
//       trigger.context = `With your ${therapeuticProfile.therapeuticArea} application under active FDA review, proactive preparation for potential information requests can significantly impact your approval timeline.`;
//       trigger.offering = 'Our regulatory intelligence can help you anticipate and prepare for FDA questions by analyzing:';
//       trigger.specificAnalysis = [
//         'Common FDA queries in recent ' + therapeuticProfile.therapeuticArea + ' approvals',
//         'Division-specific focus areas and concerns',
//         'Successful response strategies from similar applications',
//         'Mid-cycle meeting preparation insights'
//       ];
//     } else if (urgentIssue) {
//       trigger.subject = `FDA Strategy Support for ${urgentIssue.type.replace(/_/g, ' ')}`;
//       trigger.mainIssue = urgentIssue.description.toLowerCase();
//       trigger.context = `Your ${app.products[0]?.brand_name || 'product'} development faces ${urgentIssue.description.toLowerCase()}, which ${urgentIssue.needsHelp}.`;
//       trigger.offering = `Our regulatory AI tool can address ${urgentIssue.needsHelp} through:`;
//       trigger.specificAnalysis = this.generateSpecificAnalysis(urgentIssue, therapeuticProfile);
//     } else {
//       // General outreach for standard applications
//       trigger.subject = `FDA Regulatory Intelligence for ${therapeuticProfile.therapeuticArea} Development`;
//       trigger.mainIssue = 'regulatory strategy optimization';
//       trigger.context = `As you advance ${app.products[0]?.brand_name || 'your product'} through FDA review, having deep insights into division-specific preferences and successful precedents can make a significant difference.`;
//       trigger.offering = 'Our AI-powered regulatory analysis provides:';
//       trigger.specificAnalysis = [
//         'Competitive intelligence on recent ' + therapeuticProfile.therapeuticArea + ' approvals',
//         'Division-specific guidance interpretation patterns',
//         'Optimal data presentation strategies',
//         'Risk mitigation insights from similar products'
//       ];
//     }
    
//     // Add personalization based on complexity
//     if (isComplex) {
//       trigger.specificAnalysis.push('Complex product considerations: ' + 
//         (therapeuticProfile.complexity.combinationProduct ? 'combination product pathways' : 'novel therapy precedents'));
//     }
    
//     trigger.callToAction = this.generateCallToAction(status, urgentIssue);
    
//     return trigger;
//   }

//   generateSpecificAnalysis(issue, therapeuticProfile) {
//     const analysisMap = {
//       'MULTIPLE_REVIEW_CYCLES': [
//         'Pattern analysis of products that succeeded after multiple cycles',
//         'Common deficiency themes and their resolutions',
//         'Statistical approaches that addressed FDA concerns',
//         `Division-specific preferences in ${therapeuticProfile.therapeuticArea}`
//       ],
//       'EXTENDED_REVIEW': [
//         'Factors contributing to extended reviews in your division',
//         'Successful communication strategies for complex reviews',
//         'Precedent analysis for timeline acceleration',
//         'Risk factors for further delays and mitigation strategies'
//       ],
//       'PRIORITY_REVIEW_CHALLENGES': [
//         'Priority review success factors in your indication',
//         'Common pitfalls in expedited pathways',
//         'Data package optimization for priority review',
//         'FDA meeting strategy for expedited programs'
//       ]
//     };
    
//     return analysisMap[issue.type] || [
//       'Targeted regulatory intelligence for your specific challenge',
//       'Precedent analysis from similar situations',
//       'FDA communication optimization strategies',
//       'Risk mitigation approaches'
//     ];
//   }

//   generateCallToAction(status, urgentIssue) {
//     if (status === 'COMPLETE_RESPONSE_LETTER') {
//       return 'I have 2-3 hours available this week to conduct a focused CRL analysis. Would Tuesday or Thursday work better for a brief call to discuss your specific FDA concerns?';
//     } else if (urgentIssue?.severity === 'CRITICAL') {
//       return 'Given the urgency of your situation, I can provide initial insights within 24 hours. When would be a good time for a 20-minute call to understand your specific needs?';
//     } else {
//       return 'Would you be interested in a 15-minute call to explore how this analysis could support your FDA strategy? I can share specific examples relevant to your situation.';
//     }
//   }

//   generateStrategicTrialEmail(trialData, biomarkerStrategy, challenges, competitive) {
//     const criticalChallenge = challenges.find(c => c.severity === 'CRITICAL') || challenges[0];
    
//     let trigger = {
//       subject: '',
//       mainIssue: '',
//       context: '',
//       offering: '',
//       specificAnalysis: [],
//       urgency: 'MEDIUM',
//       competitiveAngle: '',
//       callToAction: ''
//     };
    
//     // Biomarker-focused emails (highest value)
//     if (biomarkerStrategy.enrichmentStrategy === 'MIXED_POPULATION') {
//       trigger.subject = `FDA Biomarker Enrichment Analysis for NCT${trialData.nctId}`;
//       trigger.mainIssue = 'optimizing mixed biomarker population enrollment';
//       trigger.context = `I noticed your ${trialData.phase} trial in ${trialData.conditions[0]} is enrolling both ${biomarkerStrategy.specificMarkers.join('/')} positive and negative patients. This mixed approach often receives specific FDA feedback about enrollment ratios and statistical considerations.`;
//       trigger.offering = 'I can analyze FDA\'s application of enrichment guidance across review divisions, specifically examining:';
//       trigger.specificAnalysis = [
//         `Approved trials with similar ${biomarkerStrategy.specificMarkers.join('/')} stratification strategies`,
//         'Exact ratios of biomarker-positive to negative patients FDA has accepted',
//         'Statistical approaches for demonstrating benefit in all-comers vs enriched populations',
//         'Labeling implications of mixed enrollment strategies'
//       ];
//       trigger.urgency = 'HIGH';
//       trigger.competitiveAngle = `With ${competitive.keyCompetitors.join(', ')} in this space, your biomarker strategy could be a key differentiator.`;
//     } 
//     // Novel endpoint focus
//     else if (criticalChallenge?.type === 'NOVEL_ENDPOINT_VALIDATION') {
//       trigger.subject = `FDA Endpoint Validation Support for Your ${trialData.phase} Trial`;
//       trigger.mainIssue = 'novel endpoint requiring FDA acceptance';
//       trigger.context = `Your innovative endpoint approach in NCT${trialData.nctId} will require careful FDA alignment, particularly given the ${competitive.fdaClimate} regulatory environment for ${trialData.conditions[0]}.`;
//       trigger.offering = 'Our analysis would identify:';
//       trigger.specificAnalysis = [
//         'Similar novel endpoints FDA has accepted or rejected',
//         'Validation data requirements across review divisions',
//         'Successful positioning strategies for innovative endpoints',
//         'Correlation requirements with established endpoints'
//       ];
//       trigger.urgency = 'HIGH';
//     }
//     // Pre-recruitment optimization
//     else if (trialData.status === 'NOT_YET_RECRUITING') {
//       trigger.subject = `Pre-Trial FDA Strategy for ${trialData.title}`;
//       trigger.mainIssue = 'protocol optimization before recruitment begins';
//       trigger.context = `With NCT${trialData.nctId} preparing to begin recruitment, you have a valuable window to ensure your protocol aligns with FDA\'s latest thinking in ${trialData.conditions[0]}.`;
//       trigger.offering = 'I can provide timely analysis of:';
//       trigger.specificAnalysis = [
//         'Recent FDA feedback on similar ' + trialData.phase + ' protocols',
//         'Design elements that have facilitated or hindered approval',
//         'Statistical considerations for your enrollment target of ' + trialData.enrollment,
//         'Competitive intelligence on ongoing trials in your indication'
//       ];
//       trigger.urgency = 'MEDIUM';
//     }
//     // Standard trial support
//     else {
//       trigger.subject = `FDA Regulatory Intelligence for Your ${trialData.phase} ${trialData.conditions[0]} Trial`;
//       trigger.mainIssue = 'regulatory strategy optimization';
//       trigger.context = `Your ongoing ${trialData.phase} trial (NCT${trialData.nctId}) could benefit from current FDA intelligence as you prepare for future submissions.`;
//       trigger.offering = 'Our regulatory analysis provides:';
//       trigger.specificAnalysis = [
//         'Recent FDA decisions in ' + trialData.conditions[0],
//         'Division-specific preferences and concerns',
//         'Successful data presentation strategies',
//         'Competitive landscape implications'
//       ];
//     }
    
//     // Add competitive intelligence
//     if (competitive.intensity === 'HIGH') {
//       trigger.competitiveAngle = `In this highly competitive ${trialData.conditions[0]} landscape, understanding FDA\'s nuanced positions can provide critical advantage.`;
//     }
    
//     // Personalized call to action
//     trigger.callToAction = this.generateTrialCallToAction(trialData, criticalChallenge);
    
//     return trigger;
//   }

//   generateTrialCallToAction(trialData, challenge) {
//     if (challenge?.severity === 'CRITICAL') {
//       return `Given the complexity of ${challenge.specificNeed}, I'd like to discuss how our 2-3 hour analysis could address your specific FDA challenges. Are you available for a brief call this week?`;
//     } else if (trialData.status === 'NOT_YET_RECRUITING') {
//       return 'Would you like to explore how this pre-trial analysis could strengthen your FDA strategy? I have time Thursday or Friday for a 20-minute discussion.';
//     } else {
//       return 'I\'d be happy to share specific examples of how this intelligence has helped similar trials. When would work for a brief call?';
//     }
//   }

//   calculateTrialUrgency(trialData, challenges) {
//     let score = 50;
    
//     // Status-based scoring
//     if (trialData.status === 'NOT_YET_RECRUITING') score += 20;
//     if (trialData.status === 'RECRUITING' && trialData.enrollment < 50) score += 15;
    
//     // Challenge-based scoring
//     challenges.forEach(challenge => {
//       if (challenge.severity === 'CRITICAL') score += 30;
//       else if (challenge.severity === 'HIGH') score += 20;
//       else if (challenge.severity === 'MEDIUM') score += 10;
//     });
    
//     // Phase-based scoring
//     if (trialData.phase === 'PHASE3') score += 15;
//     else if (trialData.phase === 'PHASE2') score += 10;
    
//     return Math.min(score, 100);
//   }

//   assessDataQuality(data) {
//     let quality = 100;
    
//     if (!data.sponsor_name) quality -= 20;
//     if (!data.products || data.products.length === 0) quality -= 15;
//     if (!data.submissions || data.submissions.length === 0) quality -= 15;
    
//     return quality;
//   }
// }

// // Enhanced Lead Generation Service
// class LeadGenerationService {
//   constructor() {
//     this.fdaApi = new FDAApiService();
//   }

//   async generateLeads() {
//     logger.info('Starting comprehensive FDA lead generation...');
    
//     try {
//       dataStore.leads = [];
//       dataStore.companies.clear();

//       // 1. Get drug applications (highest urgency)
//       const drugApplications = await this.fdaApi.getPharmaApplications();
//       this.processApplications(drugApplications);

//       // 2. Get warning letters (critical urgency)
//       const warningLetters = await this.fdaApi.getWarningLetters();
//       this.processWarningLetters(warningLetters);

//       // 3. Get recalls (high urgency)
//       const recalls = await this.fdaApi.getRecalls();
//       this.processRecalls(recalls);

//       // 4. Get clinical trials (medium-high urgency)
//       const clinicalTrials = await this.fdaApi.getClinicalTrials();
//       this.processTrials(clinicalTrials);

//       // 5. Get inspection findings (medium urgency)
//       const inspections = await this.fdaApi.getInspectionFindings();
//       this.processInspections(inspections);

//       // Score and rank all leads
//       this.scoreAndRankLeads();

//       logger.info(`Generated ${dataStore.leads.length} total FDA opportunities`);
//       return dataStore.leads;
//     } catch (error) {
//       logger.error('Comprehensive lead generation error:', error);
//       throw error;
//     }
//   }

//   processApplications(applications) {
//     applications.forEach(app => {
//       if (!app.sponsorName) return;

//       const companyName = this.normalizeCompanyName(app.sponsorName);
//       const company = this.getOrCreateCompany(companyName);
      
//       company.applications.push(app);
//       company.therapeuticAreas.add(app.therapeuticProfile?.therapeuticArea);
//       company.hasUrgentIssues = company.hasUrgentIssues || app.urgency === 'CRITICAL';
      
//       // Create comprehensive lead
//       const lead = {
//         id: `app-${app.applicationNumber}`,
//         companyName: companyName,
//         leadType: 'DRUG_APPLICATION',
//         subType: app.status,
//         priority: app.urgency,
//         score: this.calculateApplicationScore(app),
        
//         // Detailed information
//         therapeuticArea: app.therapeuticProfile?.therapeuticArea,
//         products: app.products,
//         issues: app.issues,
//         status: app.status,
        
//         // Email content
//         emailTrigger: app.emailTrigger,
//         personalizedEmail: this.generateDetailedEmail(app.emailTrigger, companyName),
        
//         // Metadata
//         lastActivity: app.lastActivity,
//         dataQuality: app.dataQuality,
//         urgencyReason: this.getUrgencyReason(app),
//         createdAt: new Date().toISOString()
//       };

//       dataStore.leads.push(lead);
//     });
//   }

//   processWarningLetters(letters) {
//     letters.forEach(letter => {
//       if (!letter.company) return;

//       const companyName = this.normalizeCompanyName(letter.company);
//       const company = this.getOrCreateCompany(companyName);
      
//       company.warningLetters.push(letter);
//       company.hasUrgentIssues = true;
      
//       const lead = {
//         id: `warning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//         companyName: companyName,
//         leadType: 'WARNING_LETTER',
//         subType: letter.classification,
//         priority: 'CRITICAL',
//         score: 95, // Warning letters are highest priority
        
//         // Issue details
//         issue: {
//           type: 'WARNING_LETTER',
//           description: letter.reason,
//           product: letter.productDescription,
//           date: letter.reportDate
//         },
        
//         // Email content
//         emailTrigger: letter.emailTrigger,
//         personalizedEmail: this.generateWarningLetterEmail(letter, companyName),
        
//         // Metadata
//         lastActivity: letter.reportDate,
//         urgencyReason: 'FDA enforcement action requires immediate response',
//         createdAt: new Date().toISOString()
//       };

//       dataStore.leads.push(lead);
//     });
//   }

//   processRecalls(recalls) {
//     recalls.forEach(recall => {
//       if (!recall.company) return;

//       const companyName = this.normalizeCompanyName(recall.company);
//       const company = this.getOrCreateCompany(companyName);
      
//       company.recalls.push(recall);
//       company.hasQualityIssues = true;
      
//       const lead = {
//         id: `recall-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//         companyName: companyName,
//         leadType: 'RECALL',
//         subType: recall.classification,
//         priority: recall.classification === 'Class I' ? 'CRITICAL' : 'HIGH',
//         score: recall.classification === 'Class I' ? 90 : 80,
        
//         // Recall details
//         issue: {
//           type: 'RECALL',
//           classification: recall.classification,
//           reason: recall.reasonForRecall,
//           product: recall.productDescription,
//           voluntary: recall.voluntaryMandated === 'Voluntary'
//         },
        
//         // Email content
//         emailTrigger: recall.emailTrigger,
//         personalizedEmail: this.generateRecallEmail(recall, companyName),
        
//         // Metadata
//         lastActivity: recall.initiationDate,
//         urgencyReason: `${recall.classification} recall requiring comprehensive response`,
//         createdAt: new Date().toISOString()
//       };

//       dataStore.leads.push(lead);
//     });
//   }

//   processTrials(trials) {
//     trials.forEach(trial => {
//       if (!trial.sponsor) return;

//       const companyName = this.normalizeCompanyName(trial.sponsor);
//       const company = this.getOrCreateCompany(companyName);
      
//       company.trials.push(trial);
//       company.therapeuticAreas.add(trial.conditions?.[0]);
      
//       // Only create leads for trials with significant challenges or opportunities
//       if (trial.urgencyScore >= 60 || trial.regulatoryChallenges.length > 0) {
//         const lead = {
//           id: `trial-${trial.nctId}`,
//           companyName: companyName,
//           leadType: 'CLINICAL_TRIAL',
//           subType: `${trial.phase}_${trial.status}`,
//           priority: this.determineTrialPriority(trial),
//           score: trial.urgencyScore,
          
//           // Trial details
//           trialInfo: {
//             nctId: trial.nctId,
//             title: trial.title,
//             phase: trial.phase,
//             status: trial.status,
//             indication: trial.conditions[0],
//             enrollment: trial.enrollment
//           },
          
//           // Analysis results
//           biomarkerStrategy: trial.biomarkerStrategy,
//           endpoints: trial.endpoints,
//           challenges: trial.regulatoryChallenges,
//           competitive: trial.competitiveLandscape,
          
//           // Email content
//           emailTrigger: trial.emailTrigger,
//           personalizedEmail: this.generateTrialEmail(trial.emailTrigger, companyName, trial),
          
//           // Metadata
//           lastActivity: trial.lastUpdate || trial.startDate,
//           urgencyReason: trial.urgencyReason,
//           createdAt: new Date().toISOString()
//         };

//         dataStore.leads.push(lead);
//       }
//     });
//   }

//   processInspections(inspections) {
//     inspections.forEach(inspection => {
//       if (!inspection.company) return;

//       const companyName = this.normalizeCompanyName(inspection.company);
//       const company = this.getOrCreateCompany(companyName);
      
//       company.inspectionIssues.push(inspection);
//       company.hasQualityIssues = true;
      
//       const lead = {
//         id: `inspection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//         companyName: companyName,
//         leadType: 'INSPECTION_FINDING',
//         subType: 'GMP_ISSUE',
//         priority: 'MEDIUM',
//         score: 70,
        
//         // Issue details
//         issue: {
//           type: inspection.issue,
//           description: inspection.description
//         },
        
//         // Email content
//         emailTrigger: inspection.emailTrigger,
//         personalizedEmail: this.generateInspectionEmail(inspection, companyName),
        
//         // Metadata
//         urgencyReason: 'GMP compliance gaps require proactive remediation',
//         createdAt: new Date().toISOString()
//       };

//       dataStore.leads.push(lead);
//     });
//   }

//   // Helper methods
//   getOrCreateCompany(companyName) {
//     if (!dataStore.companies.has(companyName)) {
//       dataStore.companies.set(companyName, {
//         name: companyName,
//         applications: [],
//         trials: [],
//         warningLetters: [],
//         recalls: [],
//         inspectionIssues: [],
//         therapeuticAreas: new Set(),
//         hasUrgentIssues: false,
//         hasQualityIssues: false,
//         totalTouchpoints: 0
//       });
//     }
    
//     const company = dataStore.companies.get(companyName);
//     company.totalTouchpoints++;
//     return company;
//   }

//   calculateApplicationScore(app) {
//     let score = 50;
    
//     // Urgency scoring
//     if (app.urgency === 'CRITICAL') score += 40;
//     else if (app.urgency === 'HIGH') score += 30;
//     else if (app.urgency === 'MEDIUM') score += 20;
    
//     // Issue scoring
//     app.issues.forEach(issue => {
//       if (issue.severity === 'CRITICAL') score += 15;
//       else if (issue.severity === 'HIGH') score += 10;
//       else if (issue.severity === 'MEDIUM') score += 5;
//     });
    
//     // Complexity scoring
//     if (app.therapeuticProfile?.complexity?.isNovelTherapy) score += 10;
//     if (app.therapeuticProfile?.complexity?.combinationProduct) score += 5;
    
//     // Recency boost
//     const daysSinceActivity = moment().diff(moment(app.lastActivity), 'days');
//     if (daysSinceActivity < 30) score += 10;
//     else if (daysSinceActivity < 60) score += 5;
    
//     return Math.min(score, 100);
//   }

//   determineTrialPriority(trial) {
//     const criticalChallenges = trial.regulatoryChallenges.filter(c => c.severity === 'CRITICAL');
//     const highChallenges = trial.regulatoryChallenges.filter(c => c.severity === 'HIGH');
    
//     if (criticalChallenges.length > 0) return 'CRITICAL';
//     if (highChallenges.length >= 2) return 'HIGH';
//     if (trial.biomarkerStrategy?.enrichmentStrategy === 'MIXED_POPULATION') return 'HIGH';
//     if (trial.status === 'NOT_YET_RECRUITING' && trial.phase === 'PHASE3') return 'HIGH';
//     if (highChallenges.length > 0) return 'MEDIUM';
    
//     return 'LOW';
//   }

//   generateDetailedEmail(trigger, companyName) {
//     return {
//       subject: trigger.subject,
//       greeting: `Dear ${companyName} Regulatory Team,`,
//       opening: trigger.context,
//       problemStatement: `Based on my analysis of recent FDA submissions in your space, ${trigger.mainIssue} represents both a challenge and an opportunity for differentiation.`,
//       solution: trigger.offering,
//       specificAnalysis: trigger.specificAnalysis.map(point => `• ${point}`).join('\n'),
//       credibility: this.generateCredibility(trigger),
//       urgency: trigger.urgency === 'CRITICAL' ? 
//         '\nGiven the time-sensitive nature of your situation, I can prioritize this analysis and deliver initial insights within 24-48 hours.' : '',
//       callToAction: trigger.callToAction,
//       closing: 'Best regards,\n[Your name]'
//     };
//   }

//   generateWarningLetterEmail(letter, companyName) {
//     return {
//       subject: letter.emailTrigger.subject,
//       greeting: `Dear ${companyName} Quality and Regulatory Team,`,
//       opening: `I noticed the recent FDA ${letter.classification} enforcement action regarding ${letter.productDescription}. Having analyzed hundreds of warning letter responses, I understand the urgency and complexity of developing a comprehensive remediation strategy.`,
//       problemStatement: letter.emailTrigger.context,
//       solution: `Our regulatory AI tool can provide immediate support by analyzing:\n\n` +
//         `• Successful warning letter responses in similar situations\n` +
//         `• Root cause analysis patterns FDA finds acceptable\n` +
//         `• Timeline benchmarks for remediation\n` +
//         `• Strategies to prevent escalation to consent decree`,
//       urgency: `\nWarning letters typically require response within 15 working days. I can provide initial strategic insights within 24 hours to support your response preparation.`,
//       callToAction: `Given the critical timeline, would you be available for a call today or tomorrow to discuss how our analysis can strengthen your FDA response?`,
//       closing: 'Best regards,\n[Your name]'
//     };
//   }

//   generateRecallEmail(recall, companyName) {
//     return {
//       subject: recall.emailTrigger.subject,
//       greeting: `Dear ${companyName} Leadership,`,
//       opening: recall.emailTrigger.context,
//       problemStatement: `Beyond the immediate recall execution, this situation presents an opportunity to strengthen your quality systems and prevent future occurrences.`,
//       solution: recall.emailTrigger.offering + `\n\nSpecific areas of analysis:\n` +
//         `• Root cause patterns from similar recalls\n` +
//         `• CAPA strategies that satisfy FDA expectations\n` +
//         `• Communication strategies to maintain stakeholder confidence\n` +
//         `• Quality system enhancements to prevent recurrence`,
//       callToAction: `Would you like to discuss how this analysis could support both your immediate recall response and long-term quality strategy? I'm available this week for a brief call.`,
//       closing: 'Best regards,\n[Your name]'
//     };
//   }

//   generateTrialEmail(trigger, companyName, trial) {
//     const email = {
//       subject: trigger.subject,
//       greeting: `Dear ${companyName} Clinical Development Team,`,
//       opening: trigger.context,
//       problemStatement: `${trigger.mainIssue} represents a critical decision point that could significantly impact your development timeline and regulatory strategy.`,
//       solution: trigger.offering,
//       specificAnalysis: trigger.specificAnalysis.map(point => `• ${point}`).join('\n'),
//       competitiveContext: trigger.competitiveAngle || '',
//       credibility: `This type of analysis recently helped a ${trial.phase} ${trial.conditions[0]} sponsor identify key protocol modifications that streamlined their FDA interactions.`,
//       callToAction: trigger.callToAction,
//       closing: 'Best regards,\n[Your name]'
//     };
    
//     // Add urgency for critical situations
//     if (trigger.urgency === 'HIGH') {
//       email.urgency = '\nI can complete this analysis within 2-3 hours and provide actionable insights for your team.';
//     }
    
//     return email;
//   }

//   generateInspectionEmail(inspection, companyName) {
//     return {
//       subject: inspection.emailTrigger.subject,
//       greeting: `Dear ${companyName} Quality Assurance Team,`,
//       opening: inspection.emailTrigger.context,
//       solution: inspection.emailTrigger.offering,
//       specificValue: `Our analysis would include:\n` +
//         `• Common 483 observations in your facility type\n` +
//         `• Successful CAPA examples from recent inspections\n` +
//         `• Inspector focus areas by district\n` +
//         `• Pre-inspection readiness strategies`,
//       callToAction: `Would you like to explore how this intelligence could strengthen your inspection readiness? I have time this week for a brief discussion.`,
//       closing: 'Best regards,\n[Your name]'
//     };
//   }

//   generateCredibility(trigger) {
//     const credibilityStatements = [
//       'This approach recently helped a similar sponsor reduce their review time by 3 months.',
//       'Our analysis identified critical precedents that strengthened a client\'s FDA response.',
//       'Similar intelligence enabled a sponsor to successfully navigate their first CRL.',
//       'This type of analysis has helped multiple sponsors optimize their regulatory strategies.'
//     ];
    
//     return credibilityStatements[Math.floor(Math.random() * credibilityStatements.length)];
//   }

//   getUrgencyReason(app) {
//     if (app.status === 'COMPLETE_RESPONSE_LETTER') {
//       return 'CRL requires comprehensive response within regulatory timeline';
//     } else if (app.urgency === 'CRITICAL') {
//       return app.issues[0]?.description || 'Critical regulatory issue identified';
//     } else if (app.status === 'FILED_UNDER_REVIEW') {
//       return 'Active FDA review - optimal time for proactive preparation';
//     }
    
//     return 'Standard regulatory support opportunity';
//   }

//   scoreAndRankLeads() {
//     // Multi-factor scoring
//     dataStore.leads.forEach(lead => {
//       // Adjust score based on company profile
//       const company = dataStore.companies.get(lead.companyName);
      
//       // Boost score for companies with multiple touchpoints
//       if (company.totalTouchpoints > 1) {
//         lead.score = Math.min(lead.score + 5 * company.totalTouchpoints, 100);
//       }
      
//       // Boost score for companies with urgent issues
//       if (company.hasUrgentIssues) {
//         lead.score = Math.min(lead.score + 10, 100);
//       }
//     });
    
//     // Sort by priority then score
//     dataStore.leads.sort((a, b) => {
//       const priorityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
//       const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
//       if (priorityDiff !== 0) return priorityDiff;
      
//       return b.score - a.score;
//     });
    
//     // Add ranking
//     dataStore.leads.forEach((lead, index) => {
//       lead.rank = index + 1;
//     });
//   }

//   normalizeCompanyName(name) {
//     return name
//       .replace(/\s+(LLC|INC|CORP|LTD|GMBH|SA|AG|PLC|LP|LLP|CO\.|COMPANY|PHARMACEUTICAL[S]?|PHARMA|BIOTECH|BIO|THERAPEUTICS|SCIENCES|LABORATORIES|LABS)\.?$/gi, '')
//       .replace(/[,\.]/g, '')
//       .replace(/\s+/g, ' ')
//       .trim()
//       .toUpperCase();
//   }
// }

// // API Routes
// app.get('/api/leads', async (req, res) => {
//   try {
//     const { priority, type, therapeutic, biomarker, subType } = req.query;
    
//     let filteredLeads = [...dataStore.leads];
    
//     if (priority) {
//       filteredLeads = filteredLeads.filter(lead => lead.priority === priority);
//     }
    
//     if (type) {
//       filteredLeads = filteredLeads.filter(lead => lead.leadType === type);
//     }
    
//     if (subType) {
//       filteredLeads = filteredLeads.filter(lead => lead.subType === subType);
//     }
    
//     if (therapeutic) {
//       filteredLeads = filteredLeads.filter(lead => lead.therapeuticArea === therapeutic);
//     }
    
//     if (biomarker === 'true') {
//       filteredLeads = filteredLeads.filter(lead => 
//         lead.biomarkerStrategy?.usesBiomarkers === true
//       );
//     }
    
//     res.json(filteredLeads);
//   } catch (error) {
//     logger.error('Error fetching leads:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.get('/api/companies/:name', async (req, res) => {
//   try {
//     const { name } = req.params;
//     const company = dataStore.companies.get(name.toUpperCase());
    
//     if (!company) {
//       return res.status(404).json({ error: 'Company not found' });
//     }
    
//     // Create the generateCompanyApproach function
//     const generateCompanyApproach = (company) => {
//       const challenges = [];
      
//       // Collect all challenges
//       company.applications.forEach(app => challenges.push(...(app.issues || [])));
//       company.trials.forEach(trial => challenges.push(...(trial.regulatoryChallenges || [])));
      
//       const criticalChallenges = challenges.filter(c => c.severity === 'CRITICAL');
      
//       if (company.warningLetters.length > 0) {
//         return 'IMMEDIATE: Warning letter response and comprehensive compliance remediation';
//       } else if (company.recalls.length > 0) {
//         return 'URGENT: Recall management and quality system enhancement';
//       } else if (criticalChallenges.length > 0) {
//         return `Critical support needed: ${criticalChallenges[0].description}`;
//       } else if (company.hasUrgentIssues) {
//         return 'High-priority FDA regulatory support for ongoing submissions';
//       } else if (company.trials.some(t => t.biomarkerStrategy?.enrichmentStrategy === 'MIXED_POPULATION')) {
//         return 'Biomarker enrichment strategy optimization';
//       } else if (company.hasQualityIssues) {
//         return 'Quality system enhancement and inspection readiness';
//       }
      
//       return 'Standard FDA regulatory intelligence and submission optimization';
//     };
    
//     // Enrich company data
//     const enrichedCompany = {
//       ...company,
//       therapeuticFocus: Array.from(company.therapeuticAreas),
//       totalApplications: company.applications.length,
//       totalTrials: company.trials.length,
//       totalWarningLetters: company.warningLetters.length,
//       totalRecalls: company.recalls.length,
//       regulatoryChallenges: this.getAllCompanyChallenges(company),
//       primaryChallenge: this.getPrimaryChallenge(company),
//       recommendedApproach: generateCompanyApproach(company),
//       riskProfile: this.assessCompanyRisk(company),
//       opportunities: this.identifyOpportunities(company)
//     };
    
//     res.json(enrichedCompany);
//   } catch (error) {
//     logger.error('Error fetching company:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Helper method to get all company challenges
// app.locals.getAllCompanyChallenges = function(company) {
//   const challenges = [];
  
//   company.applications.forEach(app => {
//     if (app.issues) challenges.push(...app.issues);
//   });
  
//   company.trials.forEach(trial => {
//     if (trial.regulatoryChallenges) challenges.push(...trial.regulatoryChallenges);
//   });
  
//   if (company.warningLetters.length > 0) {
//     challenges.push({
//       type: 'WARNING_LETTER',
//       severity: 'CRITICAL',
//       description: 'Active FDA warning letter requiring response'
//     });
//   }
  
//   if (company.recalls.length > 0) {
//     challenges.push({
//       type: 'PRODUCT_RECALL',
//       severity: 'HIGH',
//       description: 'Product recall requiring comprehensive response'
//     });
//   }
  
//   return challenges;
// };

// app.locals.getPrimaryChallenge = function(company) {
//   const challenges = app.locals.getAllCompanyChallenges(company);
  
//   // Prioritize by severity
//   const critical = challenges.find(c => c.severity === 'CRITICAL');
//   if (critical) return critical;
  
//   const high = challenges.find(c => c.severity === 'HIGH');
//   if (high) return high;
  
//   return challenges[0] || null;
// };

// app.locals.assessCompanyRisk = function(company) {
//   let riskScore = 0;
  
//   // Warning letters are highest risk
//   riskScore += company.warningLetters.length * 30;
  
//   // Recalls are high risk
//   riskScore += company.recalls.length * 25;
  
//   // CRLs and other critical issues
//   company.applications.forEach(app => {
//     if (app.status === 'COMPLETE_RESPONSE_LETTER') riskScore += 20;
//     if (app.status === 'REFUSE_TO_FILE') riskScore += 15;
//   });
  
//   // Complex trials
//   company.trials.forEach(trial => {
//     if (trial.regulatoryChallenges?.some(c => c.severity === 'CRITICAL')) riskScore += 15;
//   });
  
//   if (riskScore >= 50) return 'CRITICAL';
//   if (riskScore >= 30) return 'HIGH';
//   if (riskScore >= 15) return 'MEDIUM';
//   return 'LOW';
// };

// app.locals.identifyOpportunities = function(company) {
//   const opportunities = [];
  
//   // Check for biomarker opportunities
//   const hasBiomarkerTrials = company.trials.some(t => t.biomarkerStrategy?.usesBiomarkers);
//   if (hasBiomarkerTrials) {
//     opportunities.push('Biomarker strategy optimization for FDA alignment');
//   }
  
//   // Check for expedited pathway opportunities
//   const hasRareDisease = company.trials.some(t => 
//     t.conditions?.[0]?.toLowerCase().includes('rare') || 
//     t.conditions?.[0]?.toLowerCase().includes('orphan')
//   );
//   if (hasRareDisease) {
//     opportunities.push('Orphan drug designation and expedited pathway strategy');
//   }
  
//   // Check for competitive positioning
//   if (company.therapeuticAreas.has('ONCOLOGY')) {
//     opportunities.push('Competitive intelligence for crowded oncology market');
//   }
  
//   // Check for quality system improvements
//   if (company.hasQualityIssues) {
//     opportunities.push('Proactive quality system enhancement to prevent future issues');
//   }
  
//   return opportunities;
// };

// app.get('/api/leads/:id/email', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const lead = dataStore.leads.find(l => l.id === id);
    
//     if (!lead) {
//       return res.status(404).json({ error: 'Lead not found' });
//     }
    
//     // Get the full email content
//     const emailData = {
//       email: lead.personalizedEmail,
//       trigger: lead.emailTrigger,
//       metadata: {
//         priority: lead.priority,
//         score: lead.score,
//         urgencyReason: lead.urgencyReason,
//         leadType: lead.leadType,
//         therapeuticArea: lead.therapeuticArea
//       }
//     };
    
//     // Add specific context based on lead type
//     if (lead.leadType === 'CLINICAL_TRIAL' && lead.trialInfo) {
//       emailData.trialContext = {
//         nctId: lead.trialInfo.nctId,
//         phase: lead.trialInfo.phase,
//         indication: lead.trialInfo.indication,
//         challenges: lead.challenges
//       };
//     } else if (lead.leadType === 'DRUG_APPLICATION' && lead.issues) {
//       emailData.applicationContext = {
//         status: lead.status,
//         issues: lead.issues,
//         products: lead.products
//       };
//     }
    
//     res.json(emailData);
//   } catch (error) {
//     logger.error('Error fetching email:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/api/generate-leads', async (req, res) => {
//   try {
//     const leadGenerator = new LeadGenerationService();
//     const leads = await leadGenerator.generateLeads();
    
//     // Calculate comprehensive statistics
//     const stats = {
//       total: leads.length,
//       byPriority: {
//         critical: leads.filter(l => l.priority === 'CRITICAL').length,
//         high: leads.filter(l => l.priority === 'HIGH').length,
//         medium: leads.filter(l => l.priority === 'MEDIUM').length,
//         low: leads.filter(l => l.priority === 'LOW').length
//       },
//       byType: {
//         drugApplications: leads.filter(l => l.leadType === 'DRUG_APPLICATION').length,
//         clinicalTrials: leads.filter(l => l.leadType === 'CLINICAL_TRIAL').length,
//         warningLetters: leads.filter(l => l.leadType === 'WARNING_LETTER').length,
//         recalls: leads.filter(l => l.leadType === 'RECALL').length,
//         inspections: leads.filter(l => l.leadType === 'INSPECTION_FINDING').length
//       },
//       withBiomarkers: leads.filter(l => l.biomarkerStrategy?.usesBiomarkers).length,
//       urgentOpportunities: leads.filter(l => l.priority === 'CRITICAL' || l.priority === 'HIGH').length
//     };
    
//     res.json({ 
//       message: 'Comprehensive FDA lead generation completed',
//       count: leads.length,
//       breakdown: stats
//     });
//   } catch (error) {
//     logger.error('Error generating leads:', error);
//     res.status(500).json({ error: 'Lead generation failed' });
//   }
// });

// app.get('/api/analytics/comprehensive', async (req, res) => {
//   try {
//     const leads = dataStore.leads;
//     const companies = Array.from(dataStore.companies.values());
    
//     const analytics = {
//       overview: {
//         total_leads: leads.length,
//         total_companies: companies.length,
//         critical_situations: leads.filter(l => l.priority === 'CRITICAL').length,
//         average_score: leads.length > 0 
//           ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)
//           : 0
//       },
//       by_type: {
//         drug_applications: {
//           total: leads.filter(l => l.leadType === 'DRUG_APPLICATION').length,
//           with_crl: leads.filter(l => l.subType === 'COMPLETE_RESPONSE_LETTER').length,
//           under_review: leads.filter(l => l.subType === 'FILED_UNDER_REVIEW').length
//         },
//         clinical_trials: {
//           total: leads.filter(l => l.leadType === 'CLINICAL_TRIAL').length,
//           with_biomarkers: leads.filter(l => l.biomarkerStrategy?.usesBiomarkers).length,
//           phase3: leads.filter(l => l.trialInfo?.phase === 'PHASE3').length,
//           not_yet_recruiting: leads.filter(l => l.trialInfo?.status === 'NOT_YET_RECRUITING').length
//         },
//         enforcement: {
//           warning_letters: leads.filter(l => l.leadType === 'WARNING_LETTER').length,
//           recalls: leads.filter(l => l.leadType === 'RECALL').length,
//           inspections: leads.filter(l => l.leadType === 'INSPECTION_FINDING').length
//         }
//       },
//       therapeutic_distribution: {},
//       biomarker_insights: {
//         total_with_biomarkers: leads.filter(l => l.biomarkerStrategy?.usesBiomarkers).length,
//         mixed_population: leads.filter(l => l.biomarkerStrategy?.enrichmentStrategy === 'MIXED_POPULATION').length,
//         enriched_only: leads.filter(l => l.biomarkerStrategy?.enrichmentStrategy === 'ENRICHED_ONLY').length,
//         complex_biomarker: leads.filter(l => l.biomarkerStrategy?.complexity === 'HIGH').length
//       },
//       company_insights: {
//         with_multiple_issues: companies.filter(c => c.totalTouchpoints > 1).length,
//         with_urgent_issues: companies.filter(c => c.hasUrgentIssues).length,
//         with_quality_issues: companies.filter(c => c.hasQualityIssues).length,
//         high_risk: companies.filter(c => app.locals.assessCompanyRisk(c) === 'CRITICAL' || app.locals.assessCompanyRisk(c) === 'HIGH').length
//       },
//       opportunities: {
//         immediate_response_needed: leads.filter(l => l.priority === 'CRITICAL').length,
//         high_value_targets: leads.filter(l => l.score >= 80).length,
//         biomarker_consulting: leads.filter(l => 
//           l.biomarkerStrategy?.needsGuidanceAlignment || 
//           l.challenges?.some(c => c.type === 'BIOMARKER_TRIAL_DESIGN')
//         ).length,
//         quality_remediation: leads.filter(l => 
//           l.leadType === 'WARNING_LETTER' || 
//           l.leadType === 'RECALL' || 
//           l.leadType === 'INSPECTION_FINDING'
//         ).length
//       }
//     };
    
//     // Calculate therapeutic areas
//     const therapeuticAreas = new Set(leads.map(l => l.therapeuticArea).filter(Boolean));
//     therapeuticAreas.forEach(area => {
//       analytics.therapeutic_distribution[area] = leads.filter(l => l.therapeuticArea === area).length;
//     });
    
//     // Add time-based insights
//     const recentLeads = leads.filter(l => {
//       const lastActivity = l.lastActivity;
//       if (!lastActivity) return false;
//       return moment().diff(moment(lastActivity), 'days') < 30;
//     });
    
//     analytics.timing = {
//       recent_activity_30_days: recentLeads.length,
//       urgent_in_recent: recentLeads.filter(l => l.priority === 'CRITICAL' || l.priority === 'HIGH').length
//     };
    
//     res.json(analytics);
//   } catch (error) {
//     logger.error('Error fetching analytics:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Export functionality
// app.get('/api/export/leads', async (req, res) => {
//   try {
//     const { format = 'json' } = req.query;
//     const leads = dataStore.leads;
    
//     if (format === 'json') {
//       res.setHeader('Content-Type', 'application/json');
//       res.setHeader('Content-Disposition', 'attachment; filename=fda_leads_export.json');
//       res.json({
//         exportDate: new Date().toISOString(),
//         totalLeads: leads.length,
//         leads: leads
//       });
//     } else if (format === 'csv') {
//       // CSV export logic would go here
//       res.status(501).json({ error: 'CSV export not yet implemented' });
//     }
//   } catch (error) {
//     logger.error('Error exporting leads:', error);
//     res.status(500).json({ error: 'Export failed' });
//   }
// });

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'healthy', 
//     timestamp: new Date().toISOString(),
//     version: '3.0.0',
//     features: [
//       'comprehensive-analysis',
//       'email-generation', 
//       'biomarker-detection',
//       'warning-letters',
//       'recalls',
//       'inspections',
//       'multi-factor-scoring'
//     ],
//     dataStatus: {
//       totalLeads: dataStore.leads.length,
//       totalCompanies: dataStore.companies.size,
//       lastUpdate: dataStore.leads[0]?.createdAt || 'No data'
//     }
//   });
// });

// // Start server
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, async () => {
//   logger.info(`Comprehensive FDA Lead Generation Server running on port ${PORT}`);
//   logger.info('Features: Full FDA opportunity spectrum - applications, trials, warnings, recalls, inspections');
//   logger.info('Email generation: Detailed, personalized emails for every opportunity type');
  
//   // Auto-generate initial leads on startup
//   try {
//     const leadGenerator = new LeadGenerationService();
//     await leadGenerator.generateLeads();
//     logger.info('Initial comprehensive lead generation completed successfully');
//     logger.info(`Total opportunities identified: ${dataStore.leads.length}`);
//     logger.info(`Critical priority leads: ${dataStore.leads.filter(l => l.priority === 'CRITICAL').length}`);
//   } catch (error) {
//     logger.error('Failed to generate initial leads:', error);
//   }
// });

// module.exports = app;