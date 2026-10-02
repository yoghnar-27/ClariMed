# Care Saathi 🏥

### AI-Powered Healthcare Access & Continuity Platform

Care Saathi is an AI-powered healthcare accessibility and continuity platform designed to support patients and frontline healthcare workers in rural and underserved communities.

It helps users **UNDERSTAND → FIND → CONTINUE** throughout their healthcare journey by simplifying medical reports, helping users discover public healthcare facilities, and maintaining accessible health records for follow-up care.

---

## 🎯 Problem Statement

**SIH26133 – Accessibility and quality of public healthcare services, particularly in rural and underserved areas**

People in rural and underserved communities often face:

- Limited access to healthcare facilities
- Long travel distances to appropriate facilities
- Difficulty understanding medical reports
- Language and health-literacy barriers
- Fragmented medical information across visits
- Delayed referrals and follow-ups
- Poor or unreliable internet connectivity

Care Saathi addresses these challenges through an **offline-first, multilingual and AI-assisted healthcare platform**.

---

## 💡 Our Solution

Care Saathi brings three important parts of the healthcare journey into one platform:

### 1. UNDERSTAND

Upload a medical report as a PDF or image and receive a simple, patient-friendly explanation.

- OCR-based text extraction
- AI-assisted explanation
- Important values highlighted
- Medical terminology simplified
- Educational information
- Doctor-question generation
- No diagnosis or prescription

### 2. FIND

Help users discover relevant public healthcare services and facilities.

- Public healthcare facility directory
- Facility details and available services
- Contact information
- Referral guidance
- Healthcare access information
- Offline availability of cached facility data

### 3. CONTINUE

Help users maintain continuity across healthcare visits.

- Report history
- Saved medical information
- Follow-up notes
- Follow-up dates
- Search and filtering
- Doctor-ready summaries
- Offline access to saved records

---

## 🌐 Key Features

- 📄 Medical Report Upload
- 🔍 OCR using Tesseract.js
- 🤖 AI-powered report explanation using Google Gemini
- 🏥 Public Healthcare Facility Navigator
- 📋 Health Report History
- 🗣️ Voice-based interaction
- 🌐 Multilingual Support
- 📱 Progressive Web App (PWA)
- 📡 Offline-first functionality
- 💾 Local data storage using IndexedDB
- 🔄 Sync queue for pending changes
- 👨‍⚕️ Doctor-ready summaries
- ⚠️ Medical safety boundaries
- 🔐 User authentication

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │        USERS         │
                    │ Patients / Frontline │
                    │      Workers         │
                    └──────────┬───────────┘
                               │
                               ▼
              ┌──────────────────────────────┐
              │     CARE SAATHI PWA         │
              │ React + Vite + Tailwind CSS │
              └──────────────┬───────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐   ┌───────────┐  ┌──────────────┐
        │Understand│   │   Find    │  │   Continue   │
        │My Report │   │Healthcare │  │ My Records   │
        └────┬─────┘   └─────┬─────┘  └──────┬───────┘
             │               │               │
             └───────────────┼───────────────┘
                             ▼
                 ┌────────────────────────┐
                 │ Local / Offline Layer  │
                 │ IndexedDB + Dexie.js   │
                 └───────────┬────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
          ┌────────────────┐  ┌──────────────────┐
          │ Local OCR &    │  │ Service Worker   │
          │ Clinical Engine│  │ Offline Caching  │
          └────────────────┘  └──────────────────┘
                    │
              Internet Available?
                    │
             ┌──────┴──────┐
             │             │
            YES            NO
             │             │
             ▼             ▼
      ┌─────────────┐  Local Processing
      │ Node +      │  + Saved Data
      │ Express     │
      └──────┬──────┘
             │
             ▼
      ┌─────────────┐
      │ Gemini API  │
      │ Advanced AI │
      └─────────────┘
