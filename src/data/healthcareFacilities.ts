import { HealthcareFacility } from "../types";

export interface HealthcareNeedOption {
  id: string;
  key: string;
  labelEn: string;
  labelHi: string;
  labelTe: string;
  iconName: string;
}

export const HEALTHCARE_NEEDS: HealthcareNeedOption[] = [
  { id: "all", key: "all", labelEn: "All Services", labelHi: "सभी सेवाएं", labelTe: "అన్ని సేవలు", iconName: "LayoutGrid" },
  { id: "general", key: "general", labelEn: "General Consultation", labelHi: "सामान्य परामर्श", labelTe: "సాధారణ సంప్రదింపులు", iconName: "UserCheck" },
  { id: "primary", key: "primary", labelEn: "Primary Care / PHC", labelHi: "प्राथमिक स्वास्थ्य केंद्र", labelTe: "ప్రాథమిక ఆరోగ్య కేంద్రం", iconName: "Building2" },
  { id: "emergency", key: "emergency", labelEn: "Emergency Care (24x7)", labelHi: "आपातकालीन चिकित्सा (24 घंटे)", labelTe: "అత్యవసర చికిత్స (24x7)", iconName: "Ambulance" },
  { id: "diagnostic", key: "diagnostic", labelEn: "Diagnostic Testing / Labs", labelHi: "जांच एवं प्रयोगशाला", labelTe: "రోగనిర్ధారణ పరీక్షలు / ల్యాబ్", iconName: "FlaskConical" },
  { id: "maternal", key: "maternal", labelEn: "Maternal & Antenatal Care", labelHi: "मातृ एवं प्रसव पूर्व देखभाल", labelTe: "మాతృ & ప్రసవ సంరక్షణ", iconName: "HeartPulse" },
  { id: "child", key: "child", labelEn: "Child Healthcare & Vaccines", labelHi: "शिशु स्वास्थ्य एवं टीकाकरण", labelTe: "శిశు ఆరోగ్యం & టీకాలు", iconName: "Baby" },
  { id: "specialist", key: "specialist", labelEn: "Specialist Consultation", labelHi: "विशेषज्ञ डॉक्टर परामर्श", labelTe: "స్పెషలిస్ట్ కన్సల్టేషన్", iconName: "Stethoscope" },
  { id: "pharmacy", key: "pharmacy", labelEn: "Free Medicines / Pharmacy", labelHi: "मुफ्त दवाएं / जन औषधि", labelTe: "ఉచిత మందులు / ఫార్మసీ", iconName: "Pill" },
  { id: "followup", key: "followup", labelEn: "Follow-up & Chronic Care", labelHi: "फॉलो-अप एवं पुरानी बीमारी", labelTe: "ఫాలో-అప్ & దీర్ఘకాలిక సంరక్షణ", iconName: "CalendarClock" },
];

export const PUBLIC_HEALTHCARE_FACILITIES: HealthcareFacility[] = [
  {
    id: "fac-1",
    name: "Ayushman Arogya Mandir (Sub-Health Centre)",
    type: "Ayushman Arogya Mandir",
    location: "Rampur Village, Near Panchayat Bhavan",
    distanceKm: 1.2,
    services: [
      "Basic Health Screening (BP, Sugar, Hemoglobin)",
      "Free Essential Generic Medicines",
      "Maternal Immunization & ANC Checkups",
      "Teleconsultation with District Specialist (e-Sanjeevani)",
      "First Aid & Dressing"
    ],
    contact: "+91 94123 45601 / ASHA Helpline",
    openingHours: "Mon - Sat: 9:00 AM - 4:00 PM (On-call ASHA available 24x7)",
    isEmergency24x7: false,
    isAyushmanEmpaneled: true,
    hasFreeMedicines: true,
    doctorsAvailable: "Community Health Officer (CHO) & ANM Worker",
    referralGuidance: "Ideal first stop for common cough, fever, routine BP/sugar check, and teleconsultation. Severe chest pain or trauma is referred to CHC or District Hospital.",
    needs: ["general", "primary", "maternal", "child", "pharmacy", "followup"]
  },
  {
    id: "fac-2",
    name: "Primary Health Centre (PHC) Chandanpur",
    type: "Primary Health Centre (PHC)",
    location: "Chandanpur Block Junction, Main Road",
    distanceKm: 4.8,
    services: [
      "MBBS Medical Officer Consultation",
      "Complete Blood Count (CBC) & Urine Analysis",
      "Basic Labor Room (Institutional Delivery - 24x7)",
      "Janani Suraksha Yojana (JSY) Benefits",
      "Government Free Drug Dispensation Counter",
      "Routine Immunization Days (Wednesdays)"
    ],
    contact: "0522-2849102 / +91 98765 12093",
    openingHours: "OPD: 8:00 AM - 2:00 PM | Emergency/Delivery: 24x7",
    isEmergency24x7: true,
    isAyushmanEmpaneled: true,
    hasFreeMedicines: true,
    doctorsAvailable: "2 Medical Officers (MBBS), Staff Nurse, Lab Technician",
    referralGuidance: "Visit for non-critical illness, lab blood testing, routine childbirth, and follow-ups. If patient needs ultrasound, surgery or blood transfusion, referred directly to CHC.",
    needs: ["general", "primary", "diagnostic", "maternal", "child", "pharmacy", "followup", "emergency"]
  },
  {
    id: "fac-3",
    name: "Community Health Centre (CHC) Shivpuri",
    type: "Community Health Centre (CHC)",
    location: "Shivpuri Tehsil Headquarters, Opp. Bus Stand",
    distanceKm: 11.5,
    services: [
      "30-Bed Inpatient Facility with Oxygen Beds",
      "Emergency Trauma Stabilization (24x7)",
      "Gynecology & Obstetric Specialist Care",
      "Pediatric Care & Neonatal Stabilization Unit",
      "Digital X-Ray, ECG & Automated Biochemistry Lab",
      "Free Surgical OPD & Minor OT",
      "PM-JAY Golden Card Helpdesk"
    ],
    contact: "0522-2910404 / 108 Dispatch",
    openingHours: "Open 24 Hours (Emergency & Inpatient) | Specialist OPD: 9 AM - 2 PM",
    isEmergency24x7: true,
    isAyushmanEmpaneled: true,
    hasFreeMedicines: true,
    doctorsAvailable: "Surgeon, Gynecologist, Physician, Pediatrician, Anesthetist",
    referralGuidance: "First Referral Unit (FRU). Handles complicated deliveries, fractures, severe infections, and high-risk diabetes/hypertension complications.",
    needs: ["general", "primary", "emergency", "diagnostic", "maternal", "child", "specialist", "pharmacy", "followup"]
  },
  {
    id: "fac-4",
    name: "Maharaja Agrasen District Civil Hospital",
    type: "District Hospital",
    location: "Civil Lines, District Headquarters, City Center",
    distanceKm: 26.0,
    services: [
      "250-Bed Comprehensive Multi-Specialty Hospital",
      "24x7 Emergency Trauma Center & Intensive Care Unit (ICU)",
      "Cardiology, Orthopedic & Neurological Consultations",
      "Complete Diagnostic Wing: CT Scan, Sonography, Advanced Pathology",
      "Blood Bank & Dialysis Center (Free under PMNDP)",
      "Jan Aushadhi Kendra (Discounted and Free Generic Drugs)",
      "Ayushman Bharat / PM-JAY Cashless Ward"
    ],
    contact: "0522-2621100 / Emergency: 108",
    openingHours: "Open 24 Hours (Emergency & Casualty) | General OPD: 8:00 AM - 2:00 PM",
    isEmergency24x7: true,
    isAyushmanEmpaneled: true,
    hasFreeMedicines: true,
    doctorsAvailable: "Senior Consultants, MD Specialists, MS Surgeons, 24x7 Duty Casualty Officers",
    referralGuidance: "Highest public tier in district. Accepts referrals from PHCs and CHCs for complex surgeries, dialysis, ICU admissions, and rare diagnostics.",
    needs: ["general", "emergency", "diagnostic", "maternal", "child", "specialist", "pharmacy", "followup"]
  },
  {
    id: "fac-5",
    name: "Pradhan Mantri Jan Aushadhi Kendra - Rural Block",
    type: "Sub-Centre",
    location: "Chandanpur Bazaar, Near Post Office",
    distanceKm: 4.6,
    services: [
      "Government-Certified Quality Generic Medicines",
      "50% to 90% Savings on Chronic Illness Medicines (BP, Diabetes, Thyroid)",
      "Surgical Consumables & Blood Glucose Strips",
      "Nutritional Supplements for Children & Expecting Mothers",
      "Pharmacist Consultation for Dosage Timing"
    ],
    contact: "+91 97110 33421",
    openingHours: "Mon - Sat: 8:30 AM - 8:30 PM | Sun: 9:00 AM - 1:00 PM",
    isEmergency24x7: false,
    isAyushmanEmpaneled: true,
    hasFreeMedicines: true,
    doctorsAvailable: "Registered Pharmacist",
    referralGuidance: "Visit with your doctor's prescription or hospital discharge summary to obtain high-quality medicines at nominal public rates.",
    needs: ["pharmacy", "followup"]
  }
];

export const EMERGENCY_HELPLINES = [
  { number: "108", name: "National Ambulance Service (24x7 Free)", desc: "Emergency medical transport with oxygen and paramedic" },
  { number: "102", name: "Janani Shishu Suraksha Vahan", desc: "Free transport for pregnant mothers and newborns" },
  { number: "104", name: "Health Information & Tele-triage", desc: "Speak with medical officers for health guidance in local languages" },
  { number: "14477", name: "Ayushman Bharat PM-JAY Toll Free", desc: "Check eligibility and find empaneled hospitals" },
];
