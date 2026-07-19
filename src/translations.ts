/**
 * ClariMed UI Translation Dictionaries
 * Supports English, Hindi, Telugu, and Tamil
 */

export type LanguageCode = "en" | "hi" | "te" | "ta";

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
    multilingualPremiumFeature: "Multilingual translation is included! Enjoy your 1 free translation use. Subscribe to Premium for unlimited translations.",
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
    voicePlaying: "Voice Narration Playing...",
    pauseVoice: "Pause Voice",
    closeAnalysis: "Close Analysis",
    extractedInsights: "Extracted Medical Insights",
    patientFriendlyExplanation: "Patient-Friendly Explanation",
    premiumPlanHeading: "ClariMed Premium Plan",
    premiumPlanDesc: "Unlock full potential with unlimited clinical scans, priority parsing, and complete multi-language audio narration.",
    secureBilling: "Secure Billing details",
    cardholderName: "Cardholder Name",
    cardNumber: "Card Number",
    payUpgrade: "Pay & Upgrade",
    pricingOffer: "Pricing Offer",
    cancelAnytime: "Cancel anytime instantly",
    pricePerMonth: "$9 / month",
    continueWithGoogle: "Continue with Google",
    emailAddress: "Email Address",
    password: "Password",
    fullName: "Full Name",
    signInBtn: "Sign In to ClariMed",
    createAccountBtn: "Create Account",
    dontHaveAccount: "Don't have an account? Sign up",
    alreadyHaveAccount: "Already have an account? Sign in",
    validationError: "Please fix the form validation issues first.",
    speechUnavailable: "Speech synthesis not supported in this browser.",
    or: "or",
    logout: "Logout",
    keepFreeTier: "Keep Free Tier",
    subscribeNow: "Subscribe Now",
    welcomeToClariMed: "Welcome to ClariMed",
    askQuestionPlaceholder: "Ask Claria a question about this report...",
    askBtn: "Ask",
    thinking: "Claria is thinking...",
    clariaAssistant: "Claria Interactive Voice & Chat Assistant",
    assistModeToggle: "Elderly Easy-Assist Mode",
    assistModeDesc: "Enables large fonts, automatic reading out loud, and a very simple design for our elders.",
    askClariaQuestion: "Ask Claria a Question",
    precautionHeading: "Important Precautions & Daily Advice",
    chatIntroduction: "Hello! I am Claria, your personal caring companion. Please feel free to ask me any questions about your report in very simple, easy-to-understand words. I am here to comfort you!",
    clearChat: "Clear Conversation",
    elderlyModeOn: "Easy Mode ON",
    elderlyModeOff: "Standard Mode",
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
    multilingualPremiumFeature: "बहुभाषी अनुवाद शामिल है! अपने 1 मुफ्त अनुवाद का आनंद लें। असीमित अनुवादों के लिए प्रीमियम की सदस्यता लें।",
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
    multilingualPremiumFeature: "బహుభాషా అనువాదం చేర్చబడింది! మీ 1 ఉచిత అనువాదాన్ని ఆస్వాదించండి. అపరిమిత అనువాదాల కోసం ప్రీమియంకు సబ్‌స్క్రైబ్ చేయండి.",
    uploadClinicalReport: "క్లినికల్ రిపోర్ట్ అప్‌లోడ్ చేయండి",
    narrativeLanguage: "వివరణ భాష",
    supportsFileTypes: "15MB వరకు PDF, PNG, లేదా JPEG స్కాన్‌లకు మద్దతు ఇస్తుంది",
    dragDropOr: "మీ వైద్య పత్రాన్ని ఇక్కడ లాగి వదలండి, లేదా",
    browseFiles: "ఫైళ్లను ఎంచుకోండి",
    clarifyWithGemini: "జెమిని AI ఉపయోగించి రిపోర్టును స్పష్టం చేయండి",
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
    extractedInsights: "సేకరించిన వైద్య అంతర్దృష్టులు",
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
    assistModeDesc: "మన పెద్దల కోసం పెద్ద అక్షరాలు, స్వయంచాలక వాయిస్ రీడింగ్ మరియు చాలా సరళమైన డిజైన్‌ను ప్రారంభిస్తుంది.",
    askClariaQuestion: "క్లారియాను ఒక ప్రశ్న అడగండి",
    precautionHeading: "ముఖ్యమైన జాగ్రత్తలు & రోజువారీ సలహా",
    chatIntroduction: "నమస్కారం! నేను క్లారియా, మీ వ్యక్తిగత సంరక్షక తోడు. దయచేసి మీ నివేదిక గురించి చాలా సరళమైన, సులభంగా అర్థమయ్యే పదాలలో నన్ను ఏవైనా ప్రశ్నలు అడగడానికి సంకోచించకండి. మీకు ఓదార్పునివ్వడానికి నేను ఇక్కడ ఉన్నాను!",
    clearChat: "సంభాషణను క్లియర్ చేయి",
    elderlyModeOn: "సులభ మోడ్ ఆన్",
    elderlyModeOff: "ప్రామాణిక మోడ్",
  },
  ta: {
    brandName: "கிளாரிமெட்",
    brandSubtitle: "தொழில்முறை நோயாளி அறிக்கை விளக்கமளிப்பவர்",
    clinicalEngine: "கிளினிக்கல் என்ஜின்",
    welcomeBack: "மீண்டும் வருக,",
    freePlan: "இலவச திட்டம்",
    premiumSubscription: "பிரீமியம் சந்தா",
    upgradeToPremium: "பிரீமியமிற்கு மேம்படுத்தவும்",
    cancelSubscription: "சந்தாவை ரத்துசெய்",
    analysisUsageLimit: "பகுப்பாய்வு பயன்பாட்டு வரம்பு",
    usedOfTotal: "பயன்படுத்தப்பட்டது",
    unlimited: "வரம்பற்றது (∞)",
    usageLimitAlert: "நீங்கள் {total} அறிக்கைகளில் {used} பகுப்பாய்வு செய்துள்ளீர்கள். வரம்பற்ற கோப்பு பகுப்பாய்விற்கு பிரீமியமிற்கு மேம்படுத்தவும்.",
    multilingualPremiumFeature: "பல்மொழி மொழிபெயர்ப்பு சேர்க்கப்பட்டுள்ளது! உங்களது 1 இலவச மொழிபெயர்ப்பை अनुभवவக்கவும். வரம்பற்ற மொழிபெயர்ப்புகளுக்கு பிரீமியத்திற்கு குழுசேரவும்.",
    uploadClinicalReport: "கிளினிக்கல் அறிக்கையைப் பதிவேற்றவும்",
    narrativeLanguage: "விளக்க உரை மொழி",
    supportsFileTypes: "15MB வரையிலான PDF, PNG அல்லது JPEG ஸ்கேன்களை ஆதரிக்கிறது",
    dragDropOr: "உங்கள் மருத்துவ ஆவணத்தை இங்கே இழுத்து விடவும், அல்லது",
    browseFiles: "கோப்புகளைத் தேடுக",
    clarifyWithGemini: "ஜெமினி AI ஐப் பயன்படுத்தி அறிக்கையைத் தெளிவுபடுத்துக",
    aiParsing: "AI கிளினிக்கல் பகுப்பாய்வு...",
    reportHistory: "அறிக்கை வரலாறு",
    noScannedReports: "இன்னும் ஸ்கேன் செய்யப்பட்ட மருத்துவ அறிக்கைகள் இல்லை. தொடங்க மேலே ஒரு PDF அல்லது படத்தை பதிவேற்றவும்.",
    reportName: "அறிக்கை பெயர்",
    date: "தேதி",
    language: "மொழி",
    actions: "செயல்கள்",
    listen: "கேள்",
    viewExplanation: "விளக்கத்தைக் காண்க",
    delete: "நீக்கு",
    clinicalAnalysisResult: "கிளினிக்கல் பகுப்பாய்வு முடிவு",
    listenToNarrative: "விளக்கத்தைக் கேளுங்கள்",
    voicePlaying: "ஆடியோ விளக்கம் ஒலிக்கிறது...",
    pauseVoice: "ஆடியோவை நிறுத்து",
    closeAnalysis: "பகுப்பாய்வை மூடு",
    extractedInsights: "மருத்துவ விவரங்கள்",
    patientFriendlyExplanation: "நோயாளிக்கான எளிய விளக்கம்",
    premiumPlanHeading: "கிளாரிமெட் பிரீமியம் திட்டம்",
    premiumPlanDesc: "வரம்பற்ற கிளினிக்கல் ஸ்கேன்கள், முன்னுரிமை செயலாக்கம் மற்றும் முழு பல்மொழி ஆவண ஆடியோ விளக்கத்துடன் முழு திறனையும் திறக்கவும்.",
    secureBilling: "பாது加ப்பான பில்லிங் விவரங்கள்",
    cardholderName: "அட்டைதாரர் பெயர்",
    cardNumber: "அட்டை எண்",
    payUpgrade: "பணம் செலுத்தி மேம்படுத்து",
    pricingOffer: "விலை சலுகை",
    cancelAnytime: "எப்போது வேண்டுமானாலும் உடனடியாக ரத்து செய்யலாம்",
    pricePerMonth: "$9 / மாதம்",
    continueWithGoogle: "கூகுள் கணக்குடன் உள்நுழைக",
    emailAddress: "மின்னஞ்சல் முகவரி",
    password: "கடவுச்சொல்",
    fullName: "முழு பெயர்",
    signInBtn: "கிளாரிமெட்டில் உள்நுழைக",
    createAccountBtn: "கணக்கை உருவாக்கு",
    dontHaveAccount: "கணக்கு இல்லையா? பதிவு செய்க",
    alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக",
    validationError: "தயவுசெய்து படிவத்தின் பிழைகளை முதலில் சரிசெய்யவும்.",
    speechUnavailable: "இந்த உலாவியில் பேச்சுத் தொகுப்பு ஆதரிக்கப்படவில்லை.",
    or: "அல்லது",
    logout: "வெளியேறு",
    keepFreeTier: "இலவச திட்டத்தைத் தொடரவும்",
    subscribeNow: "இப்போது குழுசேரவும்",
    welcomeToClariMed: "கிளாரிமெட்டிற்கு உங்களை வரவேற்கிறோம்",
    askQuestionPlaceholder: "இந்த அறிக்கை பற்றி கிளாரியாவிடம் ஒரு கேள்வி கேளுங்கள்...",
    askBtn: "கேள்",
    thinking: "கிளாரியா யோசிக்கிறது...",
    clariaAssistant: "கிளாரியா இன்டராக்டிவ் குரல் & அரட்டை உதவியாளர்",
    assistModeToggle: "முதியோர்களுக்கான எளிய உதவி முறை",
    assistModeDesc: "நமது முதியோர்களுக்காக பெரிய எழுத்துருக்கள், தானியங்கி குரல் வாசிப்பு மற்றும் மிகவும் எளிமையான வடிவமைப்பை செயல்படுத்துகிறது.",
    askClariaQuestion: "கிளாரியாவிடம் ஒரு கேள்வி கேளுங்கள்",
    precautionHeading: "முக்கியமான முன்னெச்சரிக்கைகள் & தினசரி ஆலோசனைகள்",
    chatIntroduction: "வணக்கம்! நான் கிளாரியா, உங்களை அன்போடு கவனித்துக் கொள்ளும் தோழி. உங்களது அறிக்கை பற்றி மிகவும் எளிமையான, புரியக்கூடிய வார்த்தைகளில் என்னிடம் எந்தக் கேள்வியும் தயங்காமல் கேளுங்கள். உங்களுக்கு ஆறுதல் அளிக்க நான் எப்போதும் இருக்கிறேன்!",
    clearChat: "உரையாடலை அழிக்கவும்",
    elderlyModeOn: "எளிய முறை இயக்கத்தில் உள்ளது",
    elderlyModeOff: "சாதாரண முறை",
  },
};
