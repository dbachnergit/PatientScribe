# PatientScribe - Project Overview

## What is PatientScribe?

PatientScribe is a healthcare application that empowers patients to **record medical appointments, automatically transcribe them, and receive beautifully formatted PDF summaries** via email. The core insight: patients retain only 10-20% of medical information from appointments. PatientScribe automates the conversion of complex medical conversations into comprehensible, shareable health records.

---

## Core Value Proposition

```
Record → Transcribe → Summarize → Deliver
```

**Input:** Audio recording of a medical appointment (or existing transcript)  
**Output:** Patient-friendly 7-slide PDF summary with:
- Plain-language explanations (8th-grade reading level)
- Key metrics with visual indicators (🟢🟡🔴)
- Action checklist with timelines
- Educational content about their condition

---

## Current Implementation Status

### n8n Prototype (Working)

The project currently exists as a **fully functional n8n workflow** that serves as MVP/proof-of-concept:

| Component | Status | Implementation |
|-----------|--------|----------------|
| Audio Transcription | ✅ Complete | AssemblyAI SLAM-1 (medical-grade) |
| AI Summary Generation | ✅ Complete | Claude Sonnet 4.5 via OpenRouter |
| PDF Presentation | ✅ Complete | Gamma API |
| Email Delivery | ✅ Complete | Gmail OAuth2 |
| File Storage | 🔜 Planned | AWS S3 |
| Mobile App | 🔜 Planned | React Native + Expo |

**Production workflow file:** `PatientScribe.json`

---

## Architecture

### Current: n8n Workflow

```
Google Drive (file upload)
    ↓
Extract Meeting Date (from filename)
    ↓
Download & Route by File Type
    ↓
┌────────────────┬────────────────┬────────────────┐
│ Audio Files    │ PDF Files      │ Text Files     │
│ AssemblyAI     │ PDF Extract    │ Parse JSON/VTT │
└────────┬───────┴────────┬───────┴────────┬───────┘
         └────────────────┼────────────────┘
                          ↓
              Merge to Unified Format
                          ↓
         Healthcare Validation & Specialty Detection
                          ↓
            AI Patient Analysis (Claude)
                          ↓
            Gamma PDF Generation (polling)
                          ↓
               Email Delivery (Gmail)
```

### Future: Mobile App + AWS

```
┌─────────────────────────────────────────────────┐
│  Mobile App (React Native + Expo)               │
│  ├── In-app recording (expo-av)                 │
│  ├── File upload (expo-document-picker)         │
│  └── Processing status UI                       │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  Backend Proxy (n8n webhook or serverless)      │
└─────────────────┬───────────────────────────────┘
                  ↓
    ┌─────────────┼─────────────┬──────────────┐
    ↓             ↓             ↓              ↓
AssemblyAI    OpenAI/GPT    Gamma API     AWS S3
(SLAM-1)      (analysis)    (PDF gen)     (storage)
```

---

## Key APIs & Services

### 1. AssemblyAI SLAM-1 (Transcription)

**Why:** Zero hallucinations, medical-grade accuracy, 90% cheaper than AWS Medical

```json
{
  "speech_model": "slam-1",
  "speaker_labels": true,
  "entity_detection": true,
  "word_boost": ["PSA", "prostatectomy", "Dr. Saram"]
}
```

**Cost:** $0.16 per 20-minute appointment

### 2. Claude Sonnet 4.5 via OpenRouter (AI Summary)

**Purpose:** Generate 7-slide patient-friendly summary from transcript

**Key features:**
- Translates medical jargon to 8th-grade reading level
- Calculates future appointment dates from meeting date
- Adds visual indicators for test results (🟢 normal, 🟡 watch, 🔴 concern)
- Creates action checklist with timelines

### 3. Gamma API (PDF Generation)

**Purpose:** Turn markdown summary into professional healthcare presentation

**Themes used:** `pearl` (clinical), `sage` (wellness), `consultant` (chronic care)

### 4. Gmail (Delivery)

**Purpose:** Send completed summary to patient's email with Gamma link and privacy disclaimers

---

## Healthcare Features

### Specialty Detection
Automatic detection of 10+ medical specialties:
- Urology, Cardiology, Oncology, Endocrinology
- Dental, Physical Therapy, Mental Health
- Primary Care, Dermatology, Orthopedics

### Validation
- Minimum 3 healthcare keyword matches required
- Non-medical transcripts are rejected with helpful error

### Sensitive Data Handling
- PHI/PII detection flags
- Confidential footer on all slides
- Privacy warnings in email

---

## MVP Strategy

### Phase 1: No-Storage MVP (Current Target)

The simplest viable product uses n8n as the backend:

1. Mobile app sends audio to n8n webhook
2. n8n runs existing workflow (transcribe → analyze → generate)
3. PDF delivered via email

**Estimated build time:** ~2 days

**Advantages:**
- Zero storage complexity
- Existing workflow validated
- Immediate value ("record → email PDF")

### Phase 2: AWS S3 Storage

Add persistent storage for longitudinal health tracking:

```
patientscribe-production/
├── users/{userId}/
│   ├── recordings/raw/
│   ├── transcripts/normalized/
│   ├── analyses/
│   └── presentations/pdf/
└── shared/{familyGroupId}/
```

### Phase 3: Longitudinal Intelligence

Add vector database for semantic search:
- "Show my PSA trends over 5 years"
- "What did Dr. Saram say about exercise?"
- "Has my blood pressure medication changed?"

---

## Mobile App Screens (Planned)

1. **Home Screen** - Record/Upload buttons
2. **Recording Screen** - Waveform, timer, stop button
3. **Appointment Details** - Date picker, provider name, specialty, email
4. **Processing Status** - Step indicators (Uploading → Transcribing → Analyzing → Done)
5. **Error/Retry Screen** - Friendly error message, retry option

---

## Cost Analysis

### Per Appointment (~20 minutes)

| Service | Cost |
|---------|------|
| AssemblyAI SLAM-1 | $0.16 |
| OpenRouter (Claude) | ~$0.10 |
| Gamma API | ~$0.05 |
| **Total** | **~$0.31** |

### Annual (100 appointments/month)

- **Total:** ~$372/year
- **Savings vs AWS Medical:** $1,608/year (90% reduction)

---

## Key Project Files

| File | Purpose |
|------|---------|
| `PatientScribe.json` | Production n8n workflow (AssemblyAI) |
| `PatientScribeGem.json` | Previous version (Gemini, archived) |
| `Summary.md` | Latest session work, API status |
| `PatientScribeOverview.md` | Detailed mobile app roadmap |
| `Gamma-API-ultimate-guide.md` | Gamma API documentation |
| `Assemblyai-api-ultimate-guide.md` | AssemblyAI API reference |
| `gamma_themes_complete.json` | All available Gamma themes |
| `CLAUDE.md` | Development guide for AI assistants |
| `RorkIdea.txt` | MVP mobile app strategy |

---

## Recent Milestones

- **Nov 23, 2025:** Migrated from Gemini 2.5 Pro to AssemblyAI SLAM-1
- **Nov 2025:** Added 10+ specialty detection
- **Nov 2025:** Implemented healthcare validation
- **Nov 2025:** Added sensitive data safeguards

---

## Next Steps

1. **Immediate:** Build mobile UI scaffold (React Native + Expo)
2. **Short-term:** Replace Google Drive trigger with webhook for mobile integration
3. **Medium-term:** Add AWS S3 storage for longitudinal tracking
4. **Long-term:** Vector database for semantic search across appointments

---

## Quick Start (Testing the Workflow)

1. Import `PatientScribe.json` into n8n
2. Configure credentials (AssemblyAI, OpenRouter, Gamma, Gmail, Google Drive)
3. Upload audio file to monitored Google Drive folder
4. Check email for PDF summary (~4 minutes processing time)

**Test files available:**
- `TranscriptsRecordings/PSA Recording11-12-25.m4a`
- `TranscriptsRecordings/PSA TransGemini11-12-25.txt`

