/**
 * ClariMed UI Translation Dictionaries
 * Supports English, Hindi, and Telugu
 */

export type LanguageCode = "en" | "hi" | "te";

export interface TranslationSet {
  brandName: string;
  brandSubtitle: string;
  clinicalEngine: string;
  welcomeBack: string;
  freePlan: string;
  premiumSubscription: string;
  upgradeToPremium: string;
  cancelSubscription: string;
  analysisUsageLimit: string;
  usedOfTotal: string;
  unlimited: string;
  usageLimitAlert: string;
  multilingualPremiumFeature: string;
  uploadClinicalReport: string;
  narrativeLanguage: string;
  supportsFileTypes: string;
  dragDropOr: string;
  browseFiles: string;
  clarifyWithGemini: string;
  aiParsing: string;
  reportHistory: string;
  noScannedReports: string;
  reportName: string;
  date: string;
  language: string;
  actions: string;
  listen: string;
  viewExplanation: string;
  delete: string;
  clinicalAnalysisResult: string;
  listenToNarrative: string;
  voicePlaying: string;
  pauseVoice: string;
  closeAnalysis: string;
  extractedInsights: string;
  patientFriendlyExplanation: string;
  premiumPlanHeading: string;
  premiumPlanDesc: string;
  secureBilling: string;
  cardholderName: string;
  cardNumber: string;
  payUpgrade: string;
  pricingOffer: string;
  cancelAnytime: string;
  pricePerMonth: string;
  continueWithGoogle: string;
  emailAddress: string;
  password: string;
  fullName: string;
  signInBtn: string;
  createAccountBtn: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  validationError: string;
  speechUnavailable: string;
  or: string;
  logout: string;
  keepFreeTier: string;
  subscribeNow: string;
  welcomeToClariMed: string;
  askQuestionPlaceholder: string;
  askBtn: string;
  thinking: string;
  clariaAssistant: string;
  assistModeToggle: string;
  assistModeDesc: string;
  askClariaQuestion: string;
  precautionHeading: string;
  chatIntroduction: string;
  clearChat: string;
  elderlyModeOn: string;
  elderlyModeOff: string;
  accountStatusDesc: string;
  premiumSuccessAlert: string;
  scanWithCamera: string;
  captureScan: string;
  cancelBtn: string;
  clickToChange: string;
  analyzingReportTitle: string;
  analyzingReportDesc: string;
  analyzedOn: string;
  disclaimerText: string;
  clariaVoiceAssistant: string;
  naturalVoiceDesc: string;
  letClariaRead: string;
  speakExplanation: string;
  resumeBtn: string;
  pauseBtn: string;
  stopBtn: string;
  voiceCommandListener: string;
  listeningState: string;
  yourVoiceQuestion: string;
  speakNow: string;
  autoSubmitOnFinish: string;
  sendQuestion: string;
  askFollowUpByVoice: string;
  speechRecognitionUnsupported: string;
  accessingSecureServers: string;
  signInWithGoogle: string;
  toContinueToClariMed: string;
  googleEmail: string;
  yourName: string;
  authorizeBtn: string;
  registerWelcomeSub: string;
  settingUpAccount: string;
  goBackToLogin: string;
  passwordLengthError: string;
  accountCreatedSuccess: string;
  passwordMinChars: string;
  emailPlaceholder: string;
  confirmDeleteHistory: string;
  confirmCancelSub: string;
  subCanceledSuccess: string;
  paymentFillFieldsError: string;
  expiryDateLabel: string;
  cvvLabel: string;
  clinicalMessage0: string;
  clinicalMessage1: string;
  clinicalMessage2: string;
  clinicalMessage3: string;
  clinicalMessage4: string;
}

export const translations: Record<LanguageCode, TranslationSet> = {
  en: {
    brandName: "ClariMed",
    brandSubtitle: "Professional Patient Report Clarifier",
    clinicalEngine: "Clinical Engine",
    welcomeBack: "Welcome back,",
    freePlan: "Free Plan",
    premiumSubscription: "Premium Subscription",
    upgradeToPremium: "Upgrade to Premium",
    cancelSubscription: "Cancel Subscription",
    analysisUsageLimit: "Analysis Usage Limit",
    usedOfTotal: "Used",
    unlimited: "Unlimited (∞)",
    usageLimitAlert: "You have analyzed {used} out of {total} reports. Upgrade to Premium for infinite file analyses.",
    multilingualPremiumFeature: "Multilingual translation is completely free! Experience report analysis and audio narrative in English, Hindi, and Telugu.",
    uploadClinicalReport: "Upload Clinical Report",
    narrativeLanguage: "Narrative Language",
    supportsFileTypes: "Supports PDF, PNG, or JPEG scans up to 15MB",
    dragDropOr: "Drag & drop your medical document here, or",
    browseFiles: "Browse Files",
    clarifyWithGemini: "Clarify Report using Gemini AI",
    aiParsing: "AI Clinical Parsing...",
    reportHistory: "Report History",
    noScannedReports: "No scanned medical reports yet. Upload a PDF or image above to begin.",
    reportName: "Report Name",
    date: "Date",
    language: "Language",
    actions: "Actions",
    listen: "Listen",
    viewExplanation: "View Explanation",
    delete: "Delete",
    clinicalAnalysisResult: "Clinical Analysis Result",
    listenToNarrative: "Listen to Narrative",
    voicePlaying: "Playing audio explanation...",
    pauseVoice: "Pause Audio",
    closeAnalysis: "Close Analysis",
    extractedInsights: "Extracted Clinical Insights",
    patientFriendlyExplanation: "Patient-Friendly Explanation",
    premiumPlanHeading: "ClariMed Premium Plan",
    premiumPlanDesc: "Unlock the full potential with unlimited clinical scans, priority parsing, and comprehensive multilingual audio narratives.",
    secureBilling: "Secure Billing Details",
    cardholderName: "Cardholder Name",
    cardNumber: "Card Number",
    payUpgrade: "Pay & Upgrade",
    pricingOffer: "Pricing Offer",
    cancelAnytime: "Cancel immediately anytime",
    pricePerMonth: "$9 / month",
    continueWithGoogle: "Continue with Google",
    emailAddress: "Email Address",
    password: "Password",
    fullName: "Full Name",
    signInBtn: "Sign In to ClariMed",
    createAccountBtn: "Create Account",
    dontHaveAccount: "Don't have an account? Sign Up",
    alreadyHaveAccount: "Already have an account? Sign In",
    validationError: "Please fix the form errors first.",
    speechUnavailable: "Speech synthesis is not supported in this browser.",
    or: "or",
    logout: "Log Out",
    keepFreeTier: "Keep Free Plan",
    subscribeNow: "Subscribe Now",
    welcomeToClariMed: "Welcome to ClariMed",
    askQuestionPlaceholder: "Ask Claria a question about this report...",
    askBtn: "Ask",
    thinking: "Claria is thinking...",
    clariaAssistant: "Claria Interactive Voice & Chat Assistant",
    assistModeToggle: "Elderly Simple Assistive Mode",
    assistModeDesc: "Enables larger fonts, automated voice reading, and ultra-simplified layout for our elders.",
    askClariaQuestion: "Ask Claria a Question",
    precautionHeading: "Key Precautions & Daily Advice",
    chatIntroduction: "Hello! I am Claria, your personal guardian companion. Please feel free to ask me any questions about your report in very simple, easy-to-understand terms. I am here to comfort you!",
    clearChat: "Clear Conversation",
    elderlyModeOn: "Simple Mode On",
    elderlyModeOff: "Standard Mode",
    accountStatusDesc: "Account Status & Usage Limits",
    premiumSuccessAlert: "You have infinite Premium analysis capabilities. Thank you for subscribing!",
    scanWithCamera: "Scan with Device Camera",
    captureScan: "Capture Scan",
    cancelBtn: "Cancel",
    clickToChange: "Click to change",
    analyzingReportTitle: "Analyzing Medical Report",
    analyzingReportDesc: "Medical OCR is reading test values. Please wait while Gemini constructs simple language narratives.",
    analyzedOn: "Analysis Date",
    disclaimerText: "ClariMed uses Google Gemini AI to clarify medical terminology. Claria does not diagnose diseases or recommend medications. Always discuss your laboratory measurements, scans, or clinical notes with your personal physician or clinical doctor before making any medical decisions.",
    clariaVoiceAssistant: "Claria Voice Assistant",
    naturalVoiceDesc: "Natural language healthcare voice",
    letClariaRead: "Let Claria read the explanation out loud in a comforting, professional voice. Available in English, Hindi, and Telugu.",
    speakExplanation: "Speak Explanation",
    resumeBtn: "Resume",
    pauseBtn: "Pause",
    stopBtn: "Stop",
    voiceCommandListener: "Voice Command Listener",
    listeningState: "Listening...",
    yourVoiceQuestion: "Your Voice Question",
    speakNow: "Speak now...",
    autoSubmitOnFinish: "Auto-submit when finished",
    sendQuestion: "Send Question",
    askFollowUpByVoice: "Ask a follow-up question by voice",
    speechRecognitionUnsupported: "Speech recognition is not supported or permitted on this browser.",
    accessingSecureServers: "Accessing secure servers...",
    signInWithGoogle: "Sign in with Google",
    toContinueToClariMed: "to continue to ClariMed",
    googleEmail: "Google Email",
    yourName: "Your Name",
    authorizeBtn: "Authorize",
    registerWelcomeSub: "Create your secure health account and begin clarifying medical reports instantly.",
    settingUpAccount: "Setting up secure account...",
    goBackToLogin: "Go back to Login",
    passwordLengthError: "Password must be at least 6 characters.",
    accountCreatedSuccess: "Account created successfully!",
    passwordMinChars: "Minimum 6 characters",
    emailPlaceholder: "you@example.com",
    confirmDeleteHistory: "Are you sure you want to delete this historical analysis record?",
    confirmCancelSub: "Are you sure you want to cancel your Premium subscription? Your plan will return to the Free tier immediately.",
    subCanceledSuccess: "Subscription canceled successfully. You are now on the Free tier.",
    paymentFillFieldsError: "Please fill out all payment fields.",
    expiryDateLabel: "Expiry Date",
    cvvLabel: "CVV / CVC",
    clinicalMessage0: "Digitizing your report utilizing advanced multi-modal vision systems...",
    clinicalMessage1: "Claria is decoding clinical medical terms into standard vocabulary...",
    clinicalMessage2: "Formatting values and analyzing reference intervals safely...",
    clinicalMessage3: "DRAFTING warm, empathetic, simple-language paragraphs for you...",
    clinicalMessage4: "Almost ready! Preparing the spoken narrative with Claria's friendly voice...",
  },
  hi: {
    brandName: "क्लैरीमेड",
    brandSubtitle: "व्यावसायिक मरीज रिपोर्ट स्पष्टीकरण",
    clinicalEngine: "क्लिनिकल इंजन",
    welcomeBack: "वापसी पर स्वागत है,",
    freePlan: "फ्री प्लान",
    premiumSubscription: "प्रीमियम सदस्यता",
    upgradeToPremium: "प्रीमियम में अपग्रेड करें",
    cancelSubscription: "सदस्यता रद्द करें",
    analysisUsageLimit: "विश्लेषण उपयोग सीमा",
    usedOfTotal: "उपयोग किया गया",
    unlimited: "असीमित (∞)",
    usageLimitAlert: "आपने {total} में से {used} रिपोर्टों का विश्लेषण किया है। असीमित फाइल विश्लेषण के लिए प्रीमियम में अपग्रेड करें।",
    multilingualPremiumFeature: "बहुभाषी अनुवाद पूरी तरह से मुफ्त है! अंग्रेजी, हिंदी और तेलुगु में स्पष्टीकरण और ऑडियो विवरण का अनुभव करें।",
    uploadClinicalReport: "क्लिनिकल रिपोर्ट अपलोड करें",
    narrativeLanguage: "विवरण की भाषा",
    supportsFileTypes: "15MB तक के PDF, PNG, या JPEG स्कैन का समर्थन करता है",
    dragDropOr: "अपने मेडिकल दस्तावेज़ को यहाँ खींचें और छोड़ें, या",
    browseFiles: "फाइलें चुनें",
    clarifyWithGemini: "जेमिनी एआई का उपयोग करके रिपोर्ट स्पष्ट करें",
    aiParsing: "एआई क्लिनिकल पार्सिंग...",
    reportHistory: "रिपोर्ट इतिहास",
    noScannedReports: "अभी तक कोई स्कैन की गई मेडिकल रिपोर्ट नहीं है। शुरू करने के लिए ऊपर एक पीडीएफ या इमेज अपलोड करें।",
    reportName: "रिपोर्ट का नाम",
    date: "दिनांक",
    language: "भाषा",
    actions: "कार्रवाई",
    listen: "सुनें",
    viewExplanation: "स्पष्टीकरण देखें",
    delete: "हटाएं",
    clinicalAnalysisResult: "क्लिनिकल विश्लेषण परिणाम",
    listenToNarrative: "विवरण सुनें",
    voicePlaying: "ऑडियो विवरण चल रहा है...",
    pauseVoice: "ऑडियो रोकें",
    closeAnalysis: "विश्लेषण बंद करें",
    extractedInsights: "निकाले गए चिकित्सा निष्कर्ष",
    patientFriendlyExplanation: "मरीज के अनुकूल स्पष्टीकरण",
    premiumPlanHeading: "क्लैरीमेड प्रीमियम प्लान",
    premiumPlanDesc: "असीमित क्लिनिकल स्कैन, प्राथमिकता पार्सिंग और संपूर्ण बहुभाषी ऑडियो विवरण के साथ पूरी क्षमता का लाभ उठाएं।",
    secureBilling: "सुरक्षित बिलिंग विवरण",
    cardholderName: "कार्डधारक का नाम",
    cardNumber: "कार्ड संख्या",
    payUpgrade: "भुगतान करें और अपग्रेड करें",
    pricingOffer: "मूल्य निर्धारण प्रस्ताव",
    cancelAnytime: "किसी भी समय तुरंत रद्द करें",
    pricePerMonth: "$9 / महीना",
    continueWithGoogle: "गूगल के साथ जारी रखें",
    emailAddress: "ईमेल पता",
    password: "पासवर्ड",
    fullName: "पूरा नाम",
    signInBtn: "क्लैरीमेड में साइन इन करें",
    createAccountBtn: "खाता बनाएं",
    dontHaveAccount: "खाता नहीं है? साइन अप करें",
    alreadyHaveAccount: "पहले से ही खाता है? साइन इन करें",
    validationError: "कृपया पहले फॉर्म की समस्याओं को ठीक करें।",
    speechUnavailable: "इस ब्राउज़र में स्पीच सिंथेसिस समर्थित नहीं है।",
    or: "या",
    logout: "लॉगआउट",
    keepFreeTier: "फ्री प्लान रखें",
    subscribeNow: "अभी सब्सक्राइब करें",
    welcomeToClariMed: "क्लैरीमेड में आपका स्वागत है",
    askQuestionPlaceholder: "क्लैरिया से इस रिपोर्ट के बारे में एक सवाल पूछें...",
    askBtn: "पूछें",
    thinking: "क्लैरिया सोच रही है...",
    clariaAssistant: "क्लैरिया इंटरएक्टिव वॉयस और चैट असिस्टेंट",
    assistModeToggle: "बुजुर्गों के लिए आसान सहायक मोड",
    assistModeDesc: "हमारे बुजुर्गों के लिए बड़े फोंट, स्वचालित जोर से पढ़ना और बहुत ही सरल डिजाइन सक्षम करता है।",
    askClariaQuestion: "क्लैरिया से एक प्रश्न पूछें",
    precautionHeading: "महत्वपूर्ण सावधानियां और दैनिक सलाह",
    chatIntroduction: "नमस्ते! मैं क्लैरिया हूँ, आपकी व्यक्तिगत देखभाल करने वाली साथी। कृपया मुझसे अपनी रिपोर्ट के बारे में बहुत ही सरल, आसान शब्दों में कोई भी प्रश्न पूछने के लिए स्वतंत्र महसूस करें। मैं यहाँ आपको सांत्वना देने के लिए हूँ!",
    clearChat: "बातचीत साफ करें",
    elderlyModeOn: "आसान मोड चालू",
    elderlyModeOff: "मानक मोड",
    accountStatusDesc: "खाता स्थिति और उपयोग सीमाएं",
    premiumSuccessAlert: "आपके पास असीमित प्रीमियम विश्लेषण क्षमताएं हैं। सदस्यता लेने के लिए धन्यवाद!",
    scanWithCamera: "डिवाइस कैमरा से स्कैन करें",
    captureScan: "स्कैन कैप्चर करें",
    cancelBtn: "रद्द करें",
    clickToChange: "बदलने के लिए क्लिक करें",
    analyzingReportTitle: "मेडिकल रिपोर्ट का विश्लेषण किया जा रहा है",
    analyzingReportDesc: "मेडिकल ओसीआर परीक्षण मूल्यों को पढ़ रहा है। कृपया प्रतीक्षा करें जब तक जेमिनी सरल भाषा में विवरण तैयार करता है।",
    analyzedOn: "विश्लेषण तिथि",
    disclaimerText: "क्लैरीमेड चिकित्सा शब्दावली को स्पष्ट करने के लिए गूगल जेमिनी एआई का उपयोग करता है। क्लैरिया बीमारियों का निदान नहीं करती है या दवाओं की सिफारिश नहीं करती है। कोई भी चिकित्सा निर्णय लेने से पहले हमेशा अपने व्यक्तिगत डॉक्टर या नैदानिक चिकित्सक के साथ अपने प्रयोगशाला माप, स्कैन या नैदानिक नोटों पर चर्चा करें।",
    clariaVoiceAssistant: "क्लैरिया वॉयस असिस्टेंट",
    naturalVoiceDesc: "प्राकृतिक भाषा स्वास्थ्य सेवा आवाज",
    letClariaRead: "क्लैरिया को एक आरामदायक, पेशेवर आवाज में स्पष्टीकरण जोर से पढ़ने दें। अंग्रेजी, हिंदी और तेलुगु में समर्थित।",
    speakExplanation: "स्पष्टीकरण बोलें",
    resumeBtn: "फिर से शुरू करें",
    pauseBtn: "रोकें",
    stopBtn: "बंद करें",
    voiceCommandListener: "वॉयस कमांड श्रोता",
    listeningState: "सुन रहा हूँ...",
    yourVoiceQuestion: "आपका वॉयस प्रश्न",
    speakNow: "अब बोलें...",
    autoSubmitOnFinish: "समाप्त होने पर स्वतः सबमिट करें",
    sendQuestion: "प्रश्न भेजें",
    askFollowUpByVoice: "आवाज द्वारा अनुवर्ती प्रश्न पूछें",
    speechRecognitionUnsupported: "इस ब्राउज़र पर भाषण पहचान समर्थित या अनुमत नहीं है।",
    accessingSecureServers: "सुरक्षित सर्वर तक पहुँच रहा है...",
    signInWithGoogle: "गूगल के साथ साइन इन करें",
    toContinueToClariMed: "क्लैरीमेड में जारी रखने के लिए",
    googleEmail: "गूगल ईमेल",
    yourName: "आपका नाम",
    authorizeBtn: "अधिकृत करें",
    registerWelcomeSub: "अपना सुरक्षित स्वास्थ्य खाता बनाएं और तुरंत मेडिकल रिपोर्ट को स्पष्ट करना शुरू करें।",
    settingUpAccount: "सुरक्षित खाता सेट किया जा रहा है...",
    goBackToLogin: "लॉगिन पर वापस जाएं",
    passwordLengthError: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    accountCreatedSuccess: "खाता सफलतापूर्वक बन गया!",
    passwordMinChars: "कम से कम 6 अक्षर",
    emailPlaceholder: "aapka@example.com",
    confirmDeleteHistory: "क्या आप वाकई इस ऐतिहासिक विश्लेषण रिकॉर्ड को हटाना चाहते हैं?",
    confirmCancelSub: "क्या आप वाकई अपनी प्रीमियम सदस्यता रद्द करना चाहते हैं? आपका प्लान तुरंत फ्री टियर में वापस आ जाएगा।",
    subCanceledSuccess: "सदस्यता सफलतापूर्वक रद्द कर दी गई। अब आप फ्री टियर पर हैं।",
    paymentFillFieldsError: "कृपया सभी भुगतान फ़ील्ड भरें।",
    expiryDateLabel: "समाप्ति तिथि",
    cvvLabel: "सीवीवी / सीवीसी",
    clinicalMessage0: "उन्नत मल्टी-मॉडल विज़न सिस्टम का उपयोग करके आपकी रिपोर्ट को डिजिटल किया जा रहा है...",
    clinicalMessage1: "क्लैरिया नैदानिक चिकित्सा शब्दों को मानक शब्दावली में डिकोड कर रही है...",
    clinicalMessage2: "सुरक्षित रूप से मूल्यों को स्वरूपित किया जा रहा है और संदर्भ अंतरालों का विश्लेषण किया जा रहा है...",
    clinicalMessage3: "आपके लिए गर्मजोशी से भरे, सहानुभूतिपूर्ण, सरल भाषा के पैराग्राफ तैयार किए जा रहे हैं...",
    clinicalMessage4: "लगभग तैयार! क्लैरिया की अनुकूल आवाज के साथ बोले गए विवरण की तैयारी हो रही है...",
  },
  te: {
    brandName: "క్లారిమెడ్",
    brandSubtitle: "ప్రొఫెషనల్ రోగి నివేదిక వివరణకర్త",
    clinicalEngine: "క్లినికల్ ఇంజన్",
    welcomeBack: "స్వాగతం,",
    freePlan: "ఉచిత ప్లాన్",
    premiumSubscription: "ప్రీమియం సబ్‌స్క్రిప్షన్",
    upgradeToPremium: "ప్రీమియంకు అప్‌గ్రేడ్ చేయండి",
    cancelSubscription: "సబ్‌స్క్రిప్షన్ రద్దు చేయి",
    analysisUsageLimit: "విశ్లేషణ వినియోగ పరిమితి",
    usedOfTotal: "ఉపయోగించబడింది",
    unlimited: "అపరిమితం (∞)",
    usageLimitAlert: "మీరు {total} నివేదికలలో {used} విశ్లేషించారు. అపరిమిత ఫైల్ విశ్లేషణల కోసం ప్రీమియంకు అప్‌గ్రేడ్ చేయండి.",
    multilingualPremiumFeature: "బహుభాషా అనువాదం పూర్తిగా ఉచితం! ఇంగ్లీష్, హిందీ మరియు తెలుగు భాషలలో నివేదిక విశ్లేషణ మరియు ఆడియో వివరణను పొందండి.",
    uploadClinicalReport: "క్లినికల్ రిపోర్ట్ అప్‌లోడ్ చేయండి",
    narrativeLanguage: "వివరణ భాష",
    supportsFileTypes: "15MB వరకు PDF, PNG, లేదా JPEG స్కాన్‌లకు మద్దతు ఇస్తుంది",
    dragDropOr: "మీ వైద్య పత్రాన్ని ఇక్కడ లాగి వదలండి, లేదా",
    browseFiles: "ఫైళ్లను ఎంచుకోండి",
    clarifyWithGemini: "జెమినై AI ఉపయోగించి రిపోర్టును స్పష్టం చేయండి",
    aiParsing: "AI క్లినికల్ పార్సింగ్...",
    reportHistory: "రిపోర్ట్ హిస్టరీ",
    noScannedReports: "ఇంకా స్కాన్ చేసిన వైద్య నివేదికలు లేవు. ప్రారంభించడానికి పైన ఒక PDF లేదా చిత్రాన్ని అప్‌లోడ్ చేయండి.",
    reportName: "నివేదిక పేరు",
    date: "తేదీ",
    language: "భాష",
    actions: "చర్యలు",
    listen: "వినండి",
    viewExplanation: "వివరణను చూడండి",
    delete: "తొలగించు",
    clinicalAnalysisResult: "క్లినికల్ విశ్లేషణ ఫలితం",
    listenToNarrative: "వివరణ వినండి",
    voicePlaying: "ఆడియో వివరణ ప్లే అవుతోంది...",
    pauseVoice: "ఆడియోను ఆపండి",
    closeAnalysis: "విశ్లేషణ మూసివేయి",
    extractedInsights: "సేకరించిన వైద్య అంతర్దృష్తులు",
    patientFriendlyExplanation: "రోగికి అర్థమయ్యే వివరణ",
    premiumPlanHeading: "క్లారిమెడ్ ప్రీమియం ప్లాన్",
    premiumPlanDesc: "అపరిమిత క్లినికల్ స్కాన్లు, ప్రాధాన్యత పార్సింగ్ మరియు సంపూర్ణ బహుభాషా ఆడియో వివరణతో పూర్తి సామర్థ్యాన్ని అన్‌లాక్ చేయండి.",
    secureBilling: "సురక్షిత బిల్లింగ్ వివరాలు",
    cardholderName: "కార్డుదారుని పేరు",
    cardNumber: "కార్డు సంఖ్య",
    payUpgrade: "చెల్లించి అప్‌గ్రేడ్ చేయండి",
    pricingOffer: "ధర ఆఫర్",
    cancelAnytime: "ఎప్పుడైనా రద్దు చేసుకోండి",
    pricePerMonth: "$9 / నెల",
    continueWithGoogle: "గూగుల్‌తో కొనసాగండి",
    emailAddress: "ఈమెయిల్ చిరునామా",
    password: "పాస్‌వర్డ్",
    fullName: "పూర్తి పేరు",
    signInBtn: "క్లారిమెడ్‌కు సైన్ ఇన్ చేయండి",
    createAccountBtn: "ఖాతాను సృష్టించండి",
    dontHaveAccount: "ఖాతా లేదా? సైన్ అప్ చేయండి",
    alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి",
    validationError: "దయచేసి ముందుగా ఫారమ్ సమస్యలను పరిష్కరించండి.",
    speechUnavailable: "ఈ బ్రౌజర్‌లో స్పీచ్ సింథసిస్ సపోర్ట్ లేదు.",
    or: "లేదా",
    logout: "లాగ్ అవుట్",
    keepFreeTier: "ఉచిత ప్లాన్ ఉంచండి",
    subscribeNow: "ఇప్పుడే సబ్‌స్క్రైబ్ చేయండి",
    welcomeToClariMed: "క్లారిమెడ్‌కు స్వాగతం",
    askQuestionPlaceholder: "ఈ నివేదిక గురించి క్లారియాను ఒక ప్రశ్న అడగండి...",
    askBtn: "అడగండి",
    thinking: "క్లారియా ఆలోచిస్తోంది...",
    clariaAssistant: "క్లారియా ఇంటరాక్టివ్ వాయిస్ & చాట్ అసిస్టెంట్",
    assistModeToggle: "వృద్ధులకు సులభ సహాయక మోడ్",
    assistModeDesc: "మన పెద్దల కోసం పెద్ద అక్షరాలు, స్వయంచాలక వాయిస్ రీడింగ్ మరియు చాలా సరళమైన డిజైన్‌ను ప్రారంవీస్తుంది.",
    askClariaQuestion: "క్లారియాను ఒక ప్రశ్న అడగండి",
    precautionHeading: "ముఖ్యమైన జాగ్రత్తలు & రోజువారీ సలహా",
    chatIntroduction: "నమస్కారం! నేను క్లారియా, మీ వ్యక్తిగత సంరక్షక తోడు. దయచేసి మీ నివేదిక గురించి చాలా సరళమైన, సుభంగా అర్థమయ్యే పదాలలో నన్ను ఏవైనా ప్రశ్నలు అడగడానికి సంకోచించకండి. మీకు ఓదార్పునివ్వడానికి నేను ఇక్కడ ఉన్నాను!",
    clearChat: "సంభాషణను క్లియర్ చేయి",
    elderlyModeOn: "సుభ మోడ్ ఆన్",
    elderlyModeOff: "ప్రామాణిక మోడ్",
    accountStatusDesc: "ఖాతా స్థితి & వినియోగ పరిమితులు",
    premiumSuccessAlert: "మీకు అపరిమిత ప్రీమియం విశ్లేషణ సామర్థ్యాలు ఉన్నాయి. సభ్యత్వాన్ని పొందినందుకు ధన్యవాదాలు!",
    scanWithCamera: "పరికర కెమెరాతో స్కాన్ చేయండి",
    captureScan: "స్కాన్‌ని క్యాప్చర్ చేయండి",
    cancelBtn: "రద్దు చేయి",
    clickToChange: "మార్చడానికి క్లిక్ చేయండి",
    analyzingReportTitle: "వైద్య నివేదికను విశ్లేషిస్తోంది",
    analyzingReportDesc: "మెడికల్ OCR పరీక్ష విలువలని చదువుతోంది. జెమినై సులభమైన భాషలో నివేదికను తయారుచేసే వరకు దయచేసి వేచి ఉండండి.",
    analyzedOn: "విశ్లేషించబడిన తేదీ",
    disclaimerText: "వైద్య పరిభాషను స్పష్టం చేయడానికి క్లారిమెడ్ గూగుల్ జెమినై AIని ఉపయోగిస్తుంది. క్లారియా వ్యాధులను నిర్ధారించదు లేదా మందులను సిఫార్సు చేయదు. ఏదైనా వైద్యపరమైన నిర్ణయాలు తీసుకునే ముందు మీ ప్రయోగశాల కొలతలు, స్కాన్‌లు లేదా క్లినికల్ నోట్స్‌ను మీ వ్యక్తిగత వైద్యుడు లేదా ఫ్యామిలీ డాక్టర్‌తో ఎల్లప్పుడూ చర్చించండి.",
    clariaVoiceAssistant: "క్లారియా వాయిస్ అసిస్టెంట్",
    naturalVoiceDesc: "సహజ భాషా ఆరోగ్య సంరక్షణ వాయిస్",
    letClariaRead: "క్లారియాను నివేదిక వివరణను ప్రశాంతమైన, వృత్తిపరమైన స్వరంలో బిగ్గరగా చదవనివ్వండి. ఇంగ్లీష్, హిందీ మరియు తెలుగు భాషలలో లభిస్తుంది.",
    speakExplanation: "వివరణను వినిపించండి",
    resumeBtn: "తిరిగి ప్రారంభివ్వు",
    pauseBtn: "తాత్కాలికంగా ఆపు",
    stopBtn: "ఆపివేయి",
    voiceCommandListener: "కమాండ్ వినే పరికరం",
    listeningState: "వింటున్నాను...",
    yourVoiceQuestion: "మీ వాయిస్ ప్రశ్న",
    speakNow: "ఇప్పుడు మాట్లాడండి...",
    autoSubmitOnFinish: "పూర్తయిన తర్వాత ఆటోమేటిక్‌గా సమర్పించు",
    sendQuestion: "ప్రశ్న పంపండి",
    askFollowUpByVoice: "వాయిస్ ద్వారా తదుపరి ప్రశ్న అడగండి",
    speechRecognitionUnsupported: "ఈ బ్రౌజర్‌లో స్పీచ్ రికగ్నిషన్ సపోర్ట్ లేదు లేదా అనుమతించబడలేదు.",
    accessingSecureServers: "సురక్షిత సర్వర్‌లను సంప్రదిస్తోంది...",
    signInWithGoogle: "గూగుల్‌తో సైన్ ఇన్ చేయండి",
    toContinueToClariMed: "క్లారిమెడ్‌కు కొనసాగడానికి",
    googleEmail: "గూగుల్ ఈమెయిల్",
    yourName: "మీ పేరు",
    authorizeBtn: "అనుమతించు",
    registerWelcomeSub: "మీ సురక్షిత ఆరోగ్య ఖాతాను సృష్టించండి మరియు వైద్య నివేదికలను వెంటనే స్పష్టం చేయడం ప్రారంభించండి.",
    settingUpAccount: "సురక్షిత ఖాతాను సృష్టిస్తోంది...",
    goBackToLogin: "లాగిన్‌కి తిరిగి వెళ్లు",
    passwordLengthError: "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.",
    accountCreatedSuccess: "ఖాతా విజయవంతంగా సృష్టించబడింది!",
    passwordMinChars: "కనీసం 6 అక్షరాలు",
    emailPlaceholder: "mee_email@example.com",
    confirmDeleteHistory: "మీరు నిజంగానే ఈ విశ్లేషణ చరిత్ర రికార్డును తొలగించాలనుకుంటున్నారా?",
    confirmCancelSub: "మీరు నిజంగానే మీ ప్రీమియం సభ్యత్వాన్ని రద్దు చేయాలనుకుంటున్నారా? మీ ప్లాన్ వెంటనే ఉచిత ప్లాన్‌కి మార్చబడుతుంది.",
    subCanceledSuccess: "సభ్యత్వం విజయవంతంగా రద్దు చేయబడింది. మీరు ఇప్పుడు ఉచిత ప్లాన్‌లో ఉన్నారు.",
    paymentFillFieldsError: "దయచేసి అన్ని చెల్లింపు వివరాలను పూరించండి.",
    expiryDateLabel: "గడువు ముగిసే తేదీ",
    cvvLabel: "CVV / CVC",
    clinicalMessage0: "అధునాతన మల్టీ-మోడల్ విజన్ సిస్టమ్‌ల ద్వారా మీ నివేదికను డిజిటలైజ్ చేస్తోంది...",
    clinicalMessage1: "క్లారియా వైద్య పరిభాషను సాధారణ పదాలలోకి మారుస్తోంది...",
    clinicalMessage2: "విలువలని అమర్చుతోంది మరియు ప్రమాణాలని విశ్లేషిస్తోంది...",
    clinicalMessage3: "మీ కోసం ఓదార్పుకరమైన, సులభమైన భాషా వివరణను సిద్ధం చేస్తోంది...",
    clinicalMessage4: "దాదాపు సిద్ధమైంది! క్లారియా స్వరంతో మాట్లాడే వివరణను సిద్ధం చేస్తోంది...",
  },
};
