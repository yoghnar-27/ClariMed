/**
 * Care Saathi UI Translation Dictionaries
 * Supports English, Hindi, and Telugu
 */

export type LanguageCode = "en" | "hi" | "te";

export interface TranslationSet {
  brandName: string;
  brandSubtitle: string;
  brandTagline: string;
  missionStatement: string;
  
  // 3 Primary Navigation Pillars
  navUnderstand: string;
  navFindHealthcare: string;
  navRecords: string;
  
  // Header & Status
  welcomeBack: string;
  abhaIdLabel: string;
  statusOnline: string;
  statusOffline: string;
  syncSynced: string;
  syncOfflineQueue: string;
  logout: string;
  emergencyHelpline: string;
  emergency108: string;
  
  // Understand Report Tab
  uploadTitle: string;
  uploadSubtitle: string;
  dragDropOr: string;
  supportsFileTypes: string;
  browseFiles: string;
  orTrySample: string;
  sampleCbc: string;
  sampleSugar: string;
  sampleThyroid: string;
  sampleLipid: string;
  scanWithCamera: string;
  captureScan: string;
  cancelBtn: string;
  analyzingReportTitle: string;
  analyzingReportDesc: string;
  clarifyWithAi: string;
  aiParsing: string;
  narrativeLanguage: string;
  
  // Report Result Sections
  sectionSummary: string; // What does this report contain?
  sectionImportantValues: string; // Important values
  sectionAbnormalValues: string; // Values outside the provided reference range
  sectionTermMeanings: string; // What these terms generally mean
  sectionDoctorQuestions: string; // Questions you may want to ask your doctor
  sectionSeekHelp: string; // When to seek professional medical help
  sectionEducational: string; // Educational Context
  safetyNotice: string;
  
  // Voice Controls
  voiceAssistant: string;
  listenToReport: string;
  listeningState: string;
  resumeBtn: string;
  pauseBtn: string;
  stopBtn: string;
  askSaathiByVoice: string;
  voiceInputPlaceholder: string;
  sendQuestion: string;
  speechUnavailable: string;
  
  // Find Healthcare Tab
  findHealthcareTitle: string;
  findHealthcareSubtitle: string;
  searchFacilityPlaceholder: string;
  filterByNeed: string;
  allFacilities: string;
  distanceKm: string;
  openHours: string;
  emergency24x7: string;
  ayushmanEmpaneled: string;
  freeMedicines: string;
  availableStaff: string;
  referralGuidance: string;
  callFacility: string;
  servicesOffered: string;
  
  // My Health Records Tab
  recordsTitle: string;
  recordsSubtitle: string;
  noRecordsYet: string;
  recordDate: string;
  viewReport: string;
  deleteReport: string;
  exportDoctorSummary: string;
  doctorSummaryTitle: string;
  doctorSummaryNotice: string;
  printSummary: string;
  closeBtn: string;
  addNote: string;
  saveNote: string;
  notePlaceholder: string;
  
  // Auth & General
  signInTitle: string;
  createAccountTitle: string;
  emailAddress: string;
  password: string;
  fullName: string;
  signInBtn: string;
  createAccountBtn: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  validationError: string;
  confirmDelete: string;
}

export const translations: Record<LanguageCode, TranslationSet> = {
  en: {
    brandName: "CARE SAATHI",
    brandSubtitle: "AI-Powered Healthcare Access & Continuity Platform",
    brandTagline: "Understand Reports • Find Public Clinics • Maintain Health Continuity",
    missionStatement: "Empowering rural and underserved families with clear health explanations and direct access to public healthcare facilities.",
    
    // 3 Primary Navigation Pillars
    navUnderstand: "1. UNDERSTAND MY REPORT",
    navFindHealthcare: "2. FIND HEALTHCARE",
    navRecords: "3. MY HEALTH RECORDS",
    
    // Header & Status
    welcomeBack: "Namaste,",
    abhaIdLabel: "Patient ID",
    statusOnline: "Online • Cloud AI Ready",
    statusOffline: "Offline • Local Mode Active",
    syncSynced: "Records Synced",
    syncOfflineQueue: "Offline Cache",
    logout: "Log Out",
    emergencyHelpline: "Emergency Medical Help: Call 108 (Free 24x7 Ambulance)",
    emergency108: "Dial 108 Ambulance",
    
    // Understand Report Tab
    uploadTitle: "Understand Your Medical Report",
    uploadSubtitle: "Upload your test report (PDF or photo) to receive a simple, comforting explanation and identify key values.",
    dragDropOr: "Drag and drop your report file here, or",
    supportsFileTypes: "Supports PDF, JPG, JPEG, and PNG files up to 15MB",
    browseFiles: "Browse Report File",
    orTrySample: "Or test with a sample clinical report in one click:",
    sampleCbc: "Sample Blood Test (CBC)",
    sampleSugar: "Sample Diabetes (Sugar)",
    sampleThyroid: "Sample Thyroid (TSH)",
    sampleLipid: "Sample Cholesterol (Lipid)",
    scanWithCamera: "Take Photo with Camera",
    captureScan: "Capture Document",
    cancelBtn: "Cancel",
    analyzingReportTitle: "Care Saathi is Reading Your Report...",
    analyzingReportDesc: "Extracting test values, checking reference intervals, and preparing simple-language explanations.",
    clarifyWithAi: "Explain My Report with Care Saathi",
    aiParsing: "Processing Report...",
    narrativeLanguage: "Select Language / भाषा चुनें / భాషను ఎంచుకోండి",
    
    // Report Result Sections
    sectionSummary: "What does this report contain?",
    sectionImportantValues: "Important Values & Measurements",
    sectionAbnormalValues: "Values Outside Normal Reference Range",
    sectionTermMeanings: "What These Medical Terms Generally Mean",
    sectionDoctorQuestions: "Questions You May Want to Ask Your Doctor",
    sectionSeekHelp: "When to Seek Professional Medical Help",
    sectionEducational: "General Educational Context",
    safetyNotice: "Important Safety Notice: This information is for understanding your report and does not replace professional medical advice. Care Saathi does NOT diagnose diseases, prescribe medicines, or recommend drug dosages. Always consult a qualified doctor or your nearest Primary Health Centre (PHC) for clinical decisions.",
    
    // Voice Controls
    voiceAssistant: "Saathi Voice Assistant",
    listenToReport: "Listen to Explanation Out Loud",
    listeningState: "Listening to your voice... Speak now",
    resumeBtn: "Resume Reading",
    pauseBtn: "Pause Reading",
    stopBtn: "Stop Reading",
    askSaathiByVoice: "Ask a Question by Voice or Text",
    voiceInputPlaceholder: "Speak or type your question about this report...",
    sendQuestion: "Ask Saathi",
    speechUnavailable: "Voice recognition is not supported in this browser. You can type your questions.",
    
    // Find Healthcare Tab
    findHealthcareTitle: "Find Public Healthcare Facilities",
    findHealthcareSubtitle: "Discover government Primary Health Centres (PHC), Community Health Centres (CHC), and District Hospitals near your village.",
    searchFacilityPlaceholder: "Search by facility name, village or service (e.g. Rampur, CBC, Ultrasound)...",
    filterByNeed: "Filter by Healthcare Need:",
    allFacilities: "All Facilities",
    distanceKm: "km away",
    openHours: "Timings",
    emergency24x7: "24x7 Emergency / Labor Room",
    ayushmanEmpaneled: "Ayushman Bharat / PM-JAY Empaneled",
    freeMedicines: "Free Generic Medicines Available",
    availableStaff: "Duty Staff & Doctors",
    referralGuidance: "Referral Pathway Guidance",
    callFacility: "Call Facility",
    servicesOffered: "Key Available Services",
    
    // My Health Records Tab
    recordsTitle: "My Health Records & Follow-up Timeline",
    recordsSubtitle: "Your stored medical reports are kept safe here for ongoing continuity of care and future doctor follow-ups.",
    noRecordsYet: "No reports saved yet. Understand your first report to build your continuity record.",
    recordDate: "Test Date",
    viewReport: "View Full Explanation",
    deleteReport: "Delete",
    exportDoctorSummary: "Doctor-Ready Visit Summary",
    doctorSummaryTitle: "Doctor-Ready Clinical Summary",
    doctorSummaryNotice: "Show this clean summary to your doctor at the PHC/CHC. It highlights out-of-range values and questions for consultation.",
    printSummary: "Print / Save as PDF",
    closeBtn: "Close",
    addNote: "Add Follow-up Note",
    saveNote: "Save Note",
    notePlaceholder: "e.g., Doctor advised 15-day review, follow low-salt diet...",
    
    // Auth & General
    signInTitle: "Sign In to Care Saathi",
    createAccountTitle: "Create Care Saathi Patient Profile",
    emailAddress: "Email Address or Phone",
    password: "Password",
    fullName: "Patient / Caregiver Full Name",
    signInBtn: "Sign In to Care Saathi",
    createAccountBtn: "Create Free Account",
    dontHaveAccount: "New user? Create a profile",
    alreadyHaveAccount: "Already registered? Sign in",
    validationError: "Please fill out all required fields.",
    confirmDelete: "Are you sure you want to remove this report from your health records?"
  },
  
  hi: {
    brandName: "केयर साथी (CARE SAATHI)",
    brandSubtitle: "एआई-संचालित स्वास्थ्य पहुंच एवं निरंतरता मंच",
    brandTagline: "रिपोर्ट समझें • सरकारी अस्पताल खोजें • स्वास्थ्य रिकॉर्ड सुरक्षित रखें",
    missionStatement: "ग्रामीण और वंचित परिवारों को सरल भाषा में स्वास्थ्य समझ और निकटतम सार्वजनिक स्वास्थ्य सेवाओं तक सीधी पहुंच प्रदान करना।",
    
    // 3 Primary Navigation Pillars
    navUnderstand: "1. रिपोर्ट समझें (UNDERSTAND)",
    navFindHealthcare: "2. स्वास्थ्य केंद्र खोजें (FIND)",
    navRecords: "3. मेरे स्वास्थ्य रिकॉर्ड (CONTINUE)",
    
    // Header & Status
    welcomeBack: "नमस्ते,",
    abhaIdLabel: "मरीज आईडी (Patient ID)",
    statusOnline: "ऑनलाइन • क्लाउड एआई सक्रिय",
    statusOffline: "ऑफलाइन • स्थानीय रिकॉर्ड मोड",
    syncSynced: "रिकॉर्ड सिंक हैं",
    syncOfflineQueue: "ऑफलाइन सुरक्षित",
    logout: "लॉग आउट",
    emergencyHelpline: "आपातकालीन चिकित्सा सहायता: 108 पर कॉल करें (मुफ्त 24x7 एम्बुलेंस)",
    emergency108: "108 एम्बुलेंस डायल करें",
    
    // Understand Report Tab
    uploadTitle: "अपनी मेडिकल रिपोर्ट समझें",
    uploadSubtitle: "अपनी जांच रिपोर्ट (पीडीएफ या फोटो) अपलोड करें और सरल, स्थानीय भाषा में आसान व्याख्या प्राप्त करें।",
    dragDropOr: "अपनी रिपोर्ट फ़ाइल यहाँ खींचें, या",
    supportsFileTypes: "पीडीएफ, जेपीजी, जेपीईजी या पीएनजी (15 एमबी तक)",
    browseFiles: "फ़ाइल चुनें",
    orTrySample: "या एक क्लिक में नमूना जांच रिपोर्ट से परखें:",
    sampleCbc: "रक्त जांच नमूना (CBC)",
    sampleSugar: "शुगर जांच नमूना (Diabetes)",
    sampleThyroid: "थायराइड नमूना (TSH)",
    sampleLipid: "कोलेस्ट्रॉल नमूना (Lipid)",
    scanWithCamera: "कैमरे से फोटो खींचें",
    captureScan: "दस्तावेज़ स्कैन करें",
    cancelBtn: "रद्द करें",
    analyzingReportTitle: "केयर साथी आपकी रिपोर्ट पढ़ रहा है...",
    analyzingReportDesc: "जांच मूल्यों को निकाला जा रहा है और सरल भाषा में व्याख्या तैयार की जा रही है।",
    clarifyWithAi: "केयर साथी से रिपोर्ट समझें",
    aiParsing: "रिपोर्ट प्रोसेस हो रही है...",
    narrativeLanguage: "भाषा चुनें / Select Language",
    
    // Report Result Sections
    sectionSummary: "इस रिपोर्ट में क्या शामिल है?",
    sectionImportantValues: "महत्वपूर्ण जांच मूल्य एवं आंकड़े",
    sectionAbnormalValues: "सामान्य सीमा से बाहर के मूल्य (सावधानियां)",
    sectionTermMeanings: "इन मेडिकल शब्दों का सरल अर्थ क्या है?",
    sectionDoctorQuestions: "डॉक्टर साहब से पूछने योग्य जरूरी सवाल",
    sectionSeekHelp: "तुरंत डॉक्टर के पास कब जाना चाहिए?",
    sectionEducational: "सामान्य शैक्षिक जानकारी",
    safetyNotice: "महत्वपूर्ण सुरक्षा सूचना: यह जानकारी केवल आपकी रिपोर्ट को समझने के लिए है और यह डॉक्टर की सलाह का विकल्प नहीं है। केयर साथी किसी बीमारी का निदान (Diagnosis) नहीं करता, न ही कोई दवा या खुराक लिखता है। किसी भी इलाज के लिए हमेशा अपने नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) या योग्य डॉक्टर से मिलें।",
    
    // Voice Controls
    voiceAssistant: "साथी वॉयस सहायक",
    listenToReport: "रिपोर्ट की व्याख्या बोलकर सुनें",
    listeningState: "आपकी आवाज़ सुन रहे हैं... कृपया बोलें",
    resumeBtn: "फिर से सुनें",
    pauseBtn: "रोकें",
    stopBtn: "बंद करें",
    askSaathiByVoice: "बोलकर या लिखकर सवाल पूछें",
    voiceInputPlaceholder: "इस रिपोर्ट के बारे में अपना सवाल पूछें या बोलें...",
    sendQuestion: "साथी से पूछें",
    speechUnavailable: "इस ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। आप लिखकर सवाल पूछ सकते हैं।",
    
    // Find Healthcare Tab
    findHealthcareTitle: "निकटतम सरकारी स्वास्थ्य केंद्र खोजें",
    findHealthcareSubtitle: "अपने गांव या ब्लॉक के पास प्राथमिक स्वास्थ्य केंद्र (PHC), सामुदायिक स्वास्थ्य केंद्र (CHC) और जिला अस्पताल देखें।",
    searchFacilityPlaceholder: "अस्पताल का नाम, गांव या सेवा खोजें (जैसे रामपुर, खून जांच, डिलीवरी)...",
    filterByNeed: "अपनी स्वास्थ्य आवश्यकता अनुसार चुनें:",
    allFacilities: "सभी स्वास्थ्य केंद्र",
    distanceKm: "किमी दूर",
    openHours: "खुलने का समय",
    emergency24x7: "24x7 आपातकालीन / प्रसव कक्ष",
    ayushmanEmpaneled: "आयुष्मान भारत / पीएम-जय योजना से जुड़ा",
    freeMedicines: "मुफ्त जेनेरिक दवाएं उपलब्ध",
    availableStaff: "उपलब्ध डॉक्टर एवं स्टाफ",
    referralGuidance: "रेफरल एवं अस्पताल चयन सलाह",
    callFacility: "फोन करें",
    servicesOffered: "उपलब्ध प्रमुख सेवाएं",
    
    // My Health Records Tab
    recordsTitle: "मेरे स्वास्थ्य रिकॉर्ड एवं फॉलो-अप इतिहास",
    recordsSubtitle: "आपकी सभी पुरानी जांच रिपोर्टें यहाँ सुरक्षित हैं ताकि अगली बार डॉक्टर से मिलने पर आपको पूरी जानकारी मिल सके।",
    noRecordsYet: "अभी तक कोई रिपोर्ट सुरक्षित नहीं है। अपनी पहली रिपोर्ट समझें और रिकॉर्ड बनाएं।",
    recordDate: "जांच तिथि",
    viewReport: "पूरी व्याख्या देखें",
    deleteReport: "हटाएं",
    exportDoctorSummary: "डॉक्टर के लिए संक्षिप्त पर्ची",
    doctorSummaryTitle: "डॉक्टर परामर्श संक्षिप्त विवरण",
    doctorSummaryNotice: "सरकारी अस्पताल या क्लिनिक में डॉक्टर साहब को यह पर्ची दिखाएं। इसमें असामान्य जांच मूल्य और जरूरी सवाल दर्ज हैं।",
    printSummary: "प्रिंट करें / पीडीएफ सेव करें",
    closeBtn: "बंद करें",
    addNote: "फॉलो-अप नोट जोड़ें",
    saveNote: "नोट सुरक्षित करें",
    notePlaceholder: "उदा. डॉक्टर ने 15 दिन बाद दोबारा खून जांच कराने को कहा है...",
    
    // Auth & General
    signInTitle: "केयर साथी में प्रवेश करें",
    createAccountTitle: "मरीज / परिवार का नया खाता बनाएं",
    emailAddress: "ईमेल या मोबाइल नंबर",
    password: "पासवर्ड",
    fullName: "मरीज का पूरा नाम",
    signInBtn: "लॉग इन करें",
    createAccountBtn: "मुफ्त खाता बनाएं",
    dontHaveAccount: "नया खाता बनाएं",
    alreadyHaveAccount: "पहले से खाता है? लॉग इन करें",
    validationError: "कृपया सभी आवश्यक जानकारी भरें।",
    confirmDelete: "क्या आप वाकई इस रिपोर्ट को अपने स्वास्थ्य रिकॉर्ड से हटाना चाहते हैं?"
  },

  te: {
    brandName: "కేర్ సాథి (CARE SAATHI)",
    brandSubtitle: "ఏఐ-ఆధారిత ఆరోగ్య సంరక్షణ & సమగ్ర కొనసాగింపు వేదిక",
    brandTagline: "నివేదిక అర్థం చేసుకోండి • ప్రభుత్వ క్లినిక్ కనుగొనండి • ఆరోగ్య రికార్డులను భద్రపరచండి",
    missionStatement: "గ్రామీణ మరియు వెనుకబడిన కుటుంబాలకు సులభమైన భాషలో ఆరోగ్య అవగాహన మరియు ప్రభుత్వ ఆరోగ్య సేవలకు ప్రత్యక్ష ప్రాప్యతను అందించడం.",
    
    // 3 Primary Navigation Pillars
    navUnderstand: "1. నివేదిక అర్థం చేసుకోండి (UNDERSTAND)",
    navFindHealthcare: "2. ఆరోగ్య కేంద్రాన్ని కనుగొనండి (FIND)",
    navRecords: "3. నా ఆరోగ్య రికార్డులు (CONTINUE)",
    
    // Header & Status
    welcomeBack: "నమస్కారం,",
    abhaIdLabel: "రోగి ఐడీ (Patient ID)",
    statusOnline: "ఆన్‌లైన్ • క్లౌడ్ ఏఐ సిద్ధంగా ఉంది",
    statusOffline: "ఆఫ్‌లైన్ • స్థానిక రికార్డు మోడ్",
    syncSynced: "రికార్డులు సింక్ అయ్యాయి",
    syncOfflineQueue: "ఆఫ్‌లైన్ భద్రత",
    logout: "లాగ్ అవుట్",
    emergencyHelpline: "అత్యవసర వైద్య సహాయం: 108 కి కాల్ చేయండి (ఉచిత 24x7 అంబులెన్స్)",
    emergency108: "108 అంబులెన్స్‌కు కాల్ చేయండి",
    
    // Understand Report Tab
    uploadTitle: "మీ వైద్య పరీక్ష నివేదికను అర్థం చేసుకోండి",
    uploadSubtitle: "మీ పరీక్ష నివేదికను (పిడిఎఫ్ లేదా ఫోటో) అప్‌లోడ్ చేయండి మరియు సాధారణ, స్పష్టమైన వివరణను పొందండి.",
    dragDropOr: "మీ ఫైల్‌ను ఇక్కడ లాగండి లేదా",
    supportsFileTypes: "PDF, JPG, JPEG లేదా PNG (గరిష్టంగా 15MB)",
    browseFiles: "ఫైల్‌ను ఎంచుకోండి",
    orTrySample: "లేదా ఒకే క్లిక్‌తో నమూనా నివేదికను పరీక్షించండి:",
    sampleCbc: "రక్త పరీక్ష నమూనా (CBC)",
    sampleSugar: "షుగర్ పరీక్ష నమూనా (Diabetes)",
    sampleThyroid: "థైరాయిడ్ నమూనా (TSH)",
    sampleLipid: "కొలెస్ట్రాల్ నమూనా (Lipid)",
    scanWithCamera: "కెమెరాతో ఫోటో తీయండి",
    captureScan: "పత్రాన్ని స్కాన్ చేయండి",
    cancelBtn: "రద్దు చేయండి",
    analyzingReportTitle: "కేర్ సాథి మీ నివేదికను చదువుతోంది...",
    analyzingReportDesc: "పరీక్ష విలువలను పరిశీలించి, సాధారణ తెలుగులో స్పష్టమైన వివరణను తయారు చేస్తున్నాము.",
    clarifyWithAi: "కేర్ సాథితో నివేదికను అర్థం చేసుకోండి",
    aiParsing: "ప్రాసెస్ చేయబడుతోంది...",
    narrativeLanguage: "భాషను ఎంచుకోండి / Select Language",
    
    // Report Result Sections
    sectionSummary: "ఈ నివేదికలో ఏముంది?",
    sectionImportantValues: "ముఖ్యమైన పరీక్ష విలువలు మరియు కొలతలు",
    sectionAbnormalValues: "సాధారణ పరిధికి భిన్నంగా ఉన్న విలువలు",
    sectionTermMeanings: "ఈ వైద్య పదాల సాధారణ అర్థం ఏమిటి?",
    sectionDoctorQuestions: "మీ డాక్టర్ గారిని అడగవలసిన ముఖ్యమైన ప్రశ్నలు",
    sectionSeekHelp: "వెంటనే డాక్టర్ సంప్రదించాల్సిన అత్యవసర సంకేతాలు",
    sectionEducational: "సాధారణ అవగాహన సమాచారం",
    safetyNotice: "ముఖ్యమైన భద్రతా గమనిక: ఈ సమాచారం మీ నివేదికను అర్థం చేసుకోవడానికి మాత్రమే మరియు డాక్టర్ సలహాకు ప్రత్యామ్నాయం కాదు. కేర్ సాథి వ్యాధులను నిర్ధారించదు లేదా మందులను సూచించదు. ఏదైనా చికిత్స నిర్ణయాల కోసం ఎల్లప్పుడూ మీ సమీప ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) లేదా అర్హత కలిగిన వైద్యుడిని సంప్రదించండి.",
    
    // Voice Controls
    voiceAssistant: "సాథి వాయిస్ అసిస్టెంట్",
    listenToReport: "వివరణను బిగ్గరగా వినండి",
    listeningState: "మీ మాటలను వింటున్నాము... మాట్లాడండి",
    resumeBtn: "మళ్లీ వినండి",
    pauseBtn: "ఆపండి",
    stopBtn: "ముగించండి",
    askSaathiByVoice: "మాట్లాడి లేదా టైప్ చేసి ప్రశ్న అడగండి",
    voiceInputPlaceholder: "ఈ నివేదిక గురించి మీ ప్రశ్నను అడగండి...",
    sendQuestion: "సాథిని అడగండి",
    speechUnavailable: "ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు. మీరు టైప్ చేసి ప్రశ్న అడగవచ్చు.",
    
    // Find Healthcare Tab
    findHealthcareTitle: "ప్రభుత్వ ఆరోగ్య కేంద్రాలను కనుగొనండి",
    findHealthcareSubtitle: "మీ సమీప ప్రాథమిక ఆరోగ్య కేంద్రం (PHC), కమ్యూనిటీ ఆరోగ్య కేంద్రం (CHC) మరియు జిల్లా ఆసుపత్రులను తెలుసుకోండి.",
    searchFacilityPlaceholder: "ఆసుపత్రి పేరు, గ్రామం లేదా సేవ కోసం వెతకండి (ఉదా: రాంపూర్, రక్త పరీక్ష, ప్రసవం)...",
    filterByNeed: "ఆరోగ్య అవసరాన్ని బట్టి ఫిల్టర్ చేయండి:",
    allFacilities: "అన్ని కేంద్రాలు",
    distanceKm: "కి.మీ దూరంలో",
    openHours: "పని వేళలు",
    emergency24x7: "24x7 అత్యవసర / డెలివరీ గది",
    ayushmanEmpaneled: "ఆయుష్మాన్ భారత్ / PM-JAY అనుసంధాన ఆసుపత్రి",
    freeMedicines: "ఉచిత జెనెరిక్ మందులు లభిస్తాయి",
    availableStaff: "అందుబాటులో ఉన్న వైద్యులు & సిబ్బంది",
    referralGuidance: "రెఫరల్ మరియు ఆసుపత్రి మార్గదర్శకం",
    callFacility: "కాల్ చేయండి",
    servicesOffered: "అందుబాటులో ఉన్న ప్రధాన సేవలు",
    
    // My Health Records Tab
    recordsTitle: "నా ఆరోగ్య రికార్డులు & తదుపరి సంరక్షణ కాలక్రమం",
    recordsSubtitle: "తదుపరి డాక్టర్ సంప్రదింపుల కోసం మీ మునుపటి నివేదికలు ఇక్కడ సురక్షితంగా భద్రపరచబడ్డాయి.",
    noRecordsYet: "ఇంకా నివేదికలు భద్రపరచబడలేదు. మొదటి నివేదికను పరిశీలించి రికార్డును ప్రారంభించండి.",
    recordDate: "పరీక్ష తేదీ",
    viewReport: "పూర్తి వివరణను చూడండి",
    deleteReport: "తొలగించండి",
    exportDoctorSummary: "డాక్టర్ సంప్రదింపు పత్రం",
    doctorSummaryTitle: "డాక్టర్ క్లినికల్ సారాంశం",
    doctorSummaryNotice: "ఆసుపత్రిలో డాక్టర్ గారికి ఈ సారాంశాన్ని చూపించండి. ఇందులో అసహజ పరీక్ష ఫలితాలు మరియు ప్రశ్నలు ఉంటాయి.",
    printSummary: "ప్రింట్ / పిడిఎఫ్ సేవ్ చేయండి",
    closeBtn: "మూసివేయండి",
    addNote: "ఫాలో-అప్ నోట్ రాయండి",
    saveNote: "సేవ్ చేయండి",
    notePlaceholder: "ఉదా: డాక్టర్ 15 రోజుల తర్వాత మళ్లీ బీపీ తనిఖీ చేయాలని చెప్పారు...",
    
    // Auth & General
    signInTitle: "కేర్ సాథి లోకి ప్రవేశించండి",
    createAccountTitle: "కొత్త రోగి ఖాతాను సృష్టించండి",
    emailAddress: "ఇమెయిల్ లేదా ఫోన్ నంబర్",
    password: "పాస్‌వర్డ్",
    fullName: "రోగి పూర్తి పేరు",
    signInBtn: "లాగిన్ చేయండి",
    createAccountBtn: "ఉచిత ఖాతాను సృష్టించండి",
    dontHaveAccount: "కొత్త ఖాతా కావాలా? ఇక్కడ నమోదు చేసుకోండి",
    alreadyHaveAccount: "ఖాతా ఉందా? లాగిన్ చేయండి",
    validationError: "దయచేసి అన్ని వివరాలను నమోదు చేయండి.",
    confirmDelete: "మీరు ఖచ్చితంగా ఈ నివేదికను మీ రికార్డుల నుండి తొలగించాలనుకుంటున్నారా?"
  }
};
