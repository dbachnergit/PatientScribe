# PatientScribe - Session Summaries

---

# Expo Migration Session - Production App Setup
**Date**: December 2, 2025 (Evening)

## Overview

Successfully migrated PatientScribe from the Rork prototype to a production-ready Expo React Native app. Created a complete project structure with NativeWind v4 (Tailwind CSS), Zustand state management, React Query, and all 7 screens ported from Rork. The app is fully functional on both iOS simulator and physical device, successfully connecting to the n8n webhook backend.

## Achievements

- ✅ **Expo project created**: Fresh TypeScript project with proper folder structure
- ✅ **NativeWind v4 configured**: Tailwind CSS styling with custom PatientScribe color palette
- ✅ **Design system implemented**: Button, Input, Card, Select components with consistent styling
- ✅ **All 7 screens ported**: Home, Recording, Upload, Details, Processing, Success, Error
- ✅ **State management**: Zustand stores for recording and appointment data
- ✅ **Multipart upload service**: Platform-aware file upload to n8n webhook
- ✅ **Audio recording hook**: Custom hook with start/stop/pause/resume functionality
- ✅ **Date picker**: Cross-platform date selection (iOS modal, Android native)
- ✅ **End-to-end testing**: Successful on physical iOS device with both recordings and uploads

## File Changes

### New Project: `/Users/dbachner/Projects/PatientScribe/app/`

**Configuration Files**:
- **[app.json](app/app.json)**: Expo config with iOS/Android permissions, expo-router root set to `./src/app`
- **[package.json](app/package.json)**: Dependencies including expo, nativewind, zustand, react-query
- **[tailwind.config.js](app/tailwind.config.js)**: PatientScribe color palette (primary, accent, recording, success, etc.)
- **[metro.config.js](app/metro.config.js)**: NativeWind metro configuration
- **[babel.config.js](app/babel.config.js)**: Babel presets for NativeWind and Reanimated
- **[tsconfig.json](app/tsconfig.json)**: TypeScript paths for `@/` imports
- **[.env](app/.env)**: Webhook URL environment variable

**Source Files** (`src/`):
- **[src/app/_layout.tsx](app/src/app/_layout.tsx)**: Root layout with providers (QueryClient, SafeArea, GestureHandler)
- **[src/app/index.tsx](app/src/app/index.tsx)**: Home screen with Record/Upload buttons
- **[src/app/recording.tsx](app/src/app/recording.tsx)**: Audio recording with timer and controls
- **[src/app/upload.tsx](app/src/app/upload.tsx)**: Document picker for audio/text files
- **[src/app/details.tsx](app/src/app/details.tsx)**: Appointment form with date picker
- **[src/app/processing.tsx](app/src/app/processing.tsx)**: Submission with progress animation
- **[src/app/success.tsx](app/src/app/success.tsx)**: Success confirmation with next steps
- **[src/app/error.tsx](app/src/app/error.tsx)**: Error handling with retry option

**Components** (`src/components/ui/`):
- **Button.tsx**: Primary, secondary, outline, ghost, destructive variants
- **Input.tsx**: Text input with label and error states
- **Card.tsx**: Container with default, bordered, elevated variants
- **Select.tsx**: Modal picker for specialty dropdown

**State & Services**:
- **[src/stores/useRecordingStore.ts](app/src/stores/useRecordingStore.ts)**: Recording URI, duration, format
- **[src/stores/useAppointmentStore.ts](app/src/stores/useAppointmentStore.ts)**: Form data (date, provider, specialty, email)
- **[src/services/webhook.ts](app/src/services/webhook.ts)**: Multipart/form-data submission
- **[src/hooks/useAudioRecording.ts](app/src/hooks/useAudioRecording.ts)**: Audio recording lifecycle

**Utilities**:
- **[src/lib/constants.ts](app/src/lib/constants.ts)**: Webhook URL, storage keys, recording options
- **[src/lib/utils.ts](app/src/lib/utils.ts)**: formatDuration, formatDate, validateEmail, getMimeType
- **[src/types/index.ts](app/src/types/index.ts)**: TypeScript interfaces and specialty list

## Technical Implementation

### Project Architecture
```
PatientScribe/
├── app/                          # New Expo project
│   ├── src/
│   │   ├── app/                  # Expo Router screens (7 screens)
│   │   ├── components/ui/        # Reusable UI components
│   │   ├── stores/               # Zustand state stores
│   │   ├── services/             # API/webhook layer
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utilities and constants
│   │   └── types/                # TypeScript definitions
│   ├── tailwind.config.js        # Design system colors
│   └── package.json              # Dependencies
├── PatientScribeMVP.json         # n8n webhook workflow (backend)
└── rork-patientscribe-app/       # Original Rork prototype (reference)
```

### Tech Stack
| Category | Choice |
|----------|--------|
| Framework | Expo SDK 54 + TypeScript |
| Routing | Expo Router (file-based) |
| Styling | NativeWind v4 (Tailwind CSS) |
| Local State | Zustand |
| Server State | TanStack React Query |
| Audio | expo-av |
| File Picking | expo-document-picker |
| Date Picker | @react-native-community/datetimepicker |
| Icons | lucide-react-native |

### Design System Colors
```javascript
colors: {
  primary: '#2D3A6E',      // Navy - buttons, headers
  accent: '#5B7FE1',       // Blue - links, controls
  recording: '#F56565',    // Red - recording state
  success: '#4FD1C5',      // Teal - success states
  warning: '#F6AD55',      // Orange - warnings
  background: '#FAF9F7',   // Off-white - app background
  card: '#FFFFFF',         // White - card backgrounds
  border: '#D5D3CF',       // Gray - borders
}
```

## Errors Fixed

### Error 1: Missing babel-preset-expo
**Symptom**: `Cannot find module 'babel-preset-expo'`
**Fix**: `npm install babel-preset-expo --legacy-peer-deps`

### Error 2: Missing react-native-worklets/plugin
**Symptom**: NativeWind babel preset requires reanimated
**Fix**:
1. `npx expo install react-native-reanimated`
2. Added `"react-native-reanimated/plugin"` to babel.config.js plugins

### Error 3: react-native-svg version mismatch
**Symptom**: Warning about expected version 15.12.1
**Fix**: `npx expo install react-native-svg@15.12.1`

### Error 4: npm peer dependency conflicts
**Symptom**: ERESOLVE could not resolve (react-dom peer dependency)
**Fix**: Used `--legacy-peer-deps` flag for all npm installs

## Testing Results

- ✅ **iOS Simulator**: App loads and navigates between all screens
- ✅ **Physical iPhone**: Full functionality via Expo Go
- ✅ **Audio Recording**: Microphone permission, recording, pause/resume work
- ✅ **File Upload**: Document picker selects audio and text files
- ✅ **Form Validation**: Email validation, date picker, specialty dropdown
- ✅ **Webhook Submission**: Multipart/form-data successfully reaches n8n
- ✅ **End-to-End**: Recording → n8n → AssemblyAI → Claude → Gamma → Email

## Key Decisions

### Why Fresh Expo Project (Not Port Rork Directly)?
- Rork generates flat file structure; needed proper feature folders
- Wanted clean TypeScript configuration with path aliases
- NativeWind v4 requires specific babel/metro setup
- Zustand stores needed proper architecture

### Why NativeWind v4 Over Other Options?
- Tailwind CSS utility classes are familiar and fast
- Excellent documentation and community support
- Works seamlessly with Expo
- Design tokens match web Tailwind (future web app)

### What Was Preserved from Rork?
- Multipart/form-data upload pattern (platform-aware)
- Form field definitions and validation logic
- Screen flow and navigation structure
- Color palette values

## Base64 vs Multipart Explanation

During this session, explained the technical difference between base64 JSON encoding and multipart/form-data:

| Aspect | Base64 in JSON | Multipart/form-data |
|--------|---------------|---------------------|
| Size overhead | +33% larger | No overhead |
| Memory usage | 2-3x file size during decode | 1x file size (streaming) |
| n8n handling | Manual Buffer.from() decode | Native binary field |
| Best for | Small files, JSON-only APIs | File uploads of any size |

**Conclusion**: Multipart/form-data remains the correct choice for the production app, regardless of whether using n8n or native backend.

## Next Steps

- [ ] Fix minor UI issues (to be identified tomorrow)
- [ ] Test with real doctor's appointment recording
- [ ] Add loading states and error boundaries
- [ ] Deploy to TestFlight for beta testing
- [ ] Consider migrating backend from n8n to AWS Lambda (future)

---

# Mobile App to n8n Integration Session
**Date**: December 2, 2025

## Overview

Successfully integrated the Rork-generated mobile app with the n8n webhook workflow. Resolved CORS issues, migrated from base64 JSON uploads to multipart/form-data for memory efficiency, and updated all node references from Google Drive triggers to the new webhook-based architecture. The complete mobile-to-email pipeline is now functional.

## Achievements

- ✅ **Rork app generated**: All 7 screens working with expo-av recording and document picker
- ✅ **CORS resolved**: Webhook configured with `Allowed Origins: *` and proper response headers
- ✅ **Multipart/form-data migration**: Eliminated n8n Cloud memory errors with large audio files
- ✅ **Webhook binary handling**: Configured `Field Name for Binary Data: data`
- ✅ **Process Webhook Payload node**: Extracts metadata and renames binary field `data0` → `data`
- ✅ **All node references updated**: Replaced `Merge Meeting Date` and `Google Drive Trigger` with `Process Webhook Payload`
- ✅ **End-to-end test successful**: Audio recording → AssemblyAI transcription → Claude analysis → Gamma presentation → Gmail delivery

## File Changes

- **[PatientScribeMVP.json](PatientScribeMVP.json)**: Updated n8n workflow with webhook trigger and multipart/form-data support
  - Added `Process Webhook Payload` code node
  - Updated `GetRecording` webhook with CORS and binary data settings
  - Fixed `Normalize AssemblyAI Output` node references
  - Fixed `Prepare Healthcare Presentation Output Data` node references
  - Fixed `Send Healthcare Email` node references

## Technical Implementation

### Updated Architecture
```
┌─────────────────────────────────────────┐
│  Mobile App (Rork + Expo)               │
│  ├── Record audio (expo-av)             │
│  ├── Upload file (expo-document-picker) │
│  └── FormData with multipart/form-data  │
└────────────────┬────────────────────────┘
                 │ POST (multipart/form-data)
                 ↓
┌─────────────────────────────────────────┐
│  n8n Webhook (PatientScribeMVP.json)    │
│  ├── GetRecording (binary: data0)       │
│  ├── Process Webhook Payload            │
│  │   └── Renames data0 → data           │
│  ├── Check File Type                    │
│  ├── AssemblyAI Transcription           │
│  ├── Claude Analysis                    │
│  ├── Gamma Presentation                 │
│  └── Gmail Delivery                     │
└─────────────────────────────────────────┘
```

### Webhook Configuration (GetRecording node)
| Setting | Value |
|---------|-------|
| HTTP Method | POST |
| Allowed Origins (CORS) | `*` |
| Field Name for Binary Data | `data` |
| Access-Control-Allow-Origin | `*` |
| Access-Control-Allow-Methods | `POST, OPTIONS` |
| Access-Control-Allow-Headers | `Content-Type` |

### Process Webhook Payload Code
```javascript
const input = $input.first();
const body = input.json.body || input.json || {};
const inputBinary = input.binary || {};

const appointmentDate = body.appointmentDate || '';
const providerName = body.providerName || '';
const specialty = body.specialty || '';
const recipientEmail = body.recipientEmail || '';
const fileFormat = body.fileFormat || 'm4a';

let meetingDate = DateTime.now();
let meetingDateSource = 'fallback';

if (appointmentDate) {
  const parsed = DateTime.fromISO(appointmentDate);
  if (parsed.isValid) {
    meetingDate = parsed;
    meetingDateSource = 'webhook';
  }
}

const mimeTypes = {
  'm4a': 'audio/m4a', 'mp3': 'audio/mpeg', 'wav': 'audio/wav',
  'webm': 'audio/webm', 'pdf': 'application/pdf', 'txt': 'text/plain'
};

const mimeType = mimeTypes[fileFormat] || `audio/${fileFormat}`;
const fileName = inputBinary.data0?.fileName || `recording.${fileFormat}`;

return [{
  json: {
    appointmentDate: meetingDate.toISODate(),
    meetingDate: meetingDate.toISODate(),
    meetingDateFormatted: meetingDate.toFormat('MMMM d, yyyy'),
    meetingDateShort: meetingDate.toFormat('MMM d, yyyy'),
    meetingDateSource: meetingDateSource,
    providerName, specialty, recipientEmail, fileFormat,
    name: fileName, mimeType: mimeType
  },
  binary: { data: inputBinary.data0 }
}];
```

### Rork App Update (multipart/form-data)
Changed from base64 JSON to FormData:
```javascript
const formData = new FormData();
formData.append('file', { uri: fileUri, type: mimeType, name: fileName });
formData.append('appointmentDate', metadata.appointmentDate);
formData.append('providerName', metadata.providerName);
formData.append('specialty', metadata.specialty || '');
formData.append('recipientEmail', metadata.recipientEmail);
formData.append('fileFormat', fileExtension);

await fetch(webhookUrl, { method: 'POST', body: formData });
```

## Errors Fixed

### Error 1: CORS "Failed to fetch"
**Symptom**: Browser blocked webhook request from Rork web preview
**Fix**: Added `Allowed Origins: *` and CORS response headers in GetRecording webhook

### Error 2: Google Drive 404
**Symptom**: `Download Transcript File` node failed - "resource could not be found"
**Fix**: Bypassed Google Drive nodes, connected webhook directly to Process Webhook Payload

### Error 3: n8n Memory Error (base64 conversion)
**Symptom**: `n8n may have run out of memory` when processing large audio files
**Fix**: Migrated from base64 JSON to multipart/form-data upload

### Error 4: AssemblyAI 422 "Upload failed"
**Symptom**: Binary data format incorrect for AssemblyAI upload
**Fix**: Used multipart/form-data so n8n receives binary directly (no conversion needed)

### Error 5: Binary field name mismatch
**Symptom**: `The item has no binary field 'data'` - field was named `data0`
**Fix**: Process Webhook Payload renames `inputBinary.data0` → `binary.data`

### Error 6: Referenced node doesn't exist
**Symptom**: `Normalize AssemblyAI Output` referenced `$('Merge Meeting Date')` which was removed
**Fix**: Updated to `$('Process Webhook Payload')` in three nodes:
- Normalize AssemblyAI Output
- Prepare Healthcare Presentation Output Data
- Send Healthcare Email

## Testing Results

- ✅ **Webhook receives multipart/form-data**: Binary field `data0` with audio file
- ✅ **Process Webhook Payload**: Extracts metadata, renames binary to `data`
- ✅ **Check File Type**: Correctly identifies audio format
- ✅ **AssemblyAI Upload**: Successfully uploads binary audio
- ✅ **AssemblyAI Transcription**: Returns transcript with medical entities
- ✅ **Claude Analysis**: Generates 7-slide patient summary
- ✅ **Gamma Presentation**: Creates visual presentation
- ✅ **Gmail Delivery**: Sends email with presentation link

## Key Decisions

### Why multipart/form-data instead of base64?
- **Memory efficiency**: n8n Cloud has memory limits; base64 doubles file size in memory
- **Native binary handling**: n8n receives file as binary directly, no conversion needed
- **Standard practice**: multipart/form-data is the standard for file uploads

### Why rename data0 → data?
- n8n webhooks name binary fields as `data0`, `data1`, etc.
- Downstream nodes (AssemblyAI upload) expect field named `data`
- Single rename in Process Webhook Payload fixes all downstream nodes

## Updated Webhook Contract

```
POST https://db6.app.n8n.cloud/webhook/d233c70b-11cd-4ee8-ade0-f943033281c0
Content-Type: multipart/form-data

FormData fields:
- file: <binary audio/text file>
- appointmentDate: "2025-12-02"
- providerName: "Dr. Smith"
- specialty: "urology" (optional)
- recipientEmail: "patient@email.com"
- fileFormat: "m4a"

Response: { "status": "accepted", "message": "Check email in ~5 min" }
```

## Next Steps

- [x] ~~Test webhook integration~~
- [x] ~~Fix CORS issues~~
- [x] ~~Fix memory errors with large files~~
- [x] ~~Update all node references~~
- [ ] Test with text file uploads (PDF, TXT)
- [ ] Test on physical iOS device
- [ ] Deploy to TestFlight for beta testing
- [ ] Add error handling for failed uploads in mobile app

---

# Mobile MVP Planning Session
**Date**: November 30, 2025

## Overview

Designed complete mobile MVP flow structure for PatientScribe using Rork (AI-powered React Native generator). Created detailed Rork prompt with all screens, design system colors, and webhook integration for n8n backend. The MVP follows a "fire-and-forget" pattern where users record → submit → receive email notification.

## Achievements

- ✅ **MVP scope confirmed**: No Convex, No Clerk for initial version (ready for later)
- ✅ **Fire-and-Forget architecture**: Simple webhook POST, no polling complexity
- ✅ **7-screen flow designed**: Home, Recording Tips, Recording, Details, Processing, Success, Error
- ✅ **Design system integrated**: All colors from [colors.js](colors.js) mapped to Rork prompt
- ✅ **Webhook URL configured**: `https://db6.app.n8n.cloud/webhook/d233c70b-11cd-4ee8-ade0-f943033281c0`
- ✅ **Logo upload confirmed**: LogoSimple.png can be uploaded to Rork assets

## User Decisions (Confirmed)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Specialty dropdown | Optional | AI auto-detects specialty |
| Recording tips modal | Yes | Shows first time only with "Don't show again" |
| Store last email | Yes | AsyncStorage for convenience |
| Audio length limits | None | No limits for MVP |
| Polling strategy | Fire-and-Forget | Simplest implementation |

## File Changes

- **[.claude/plans/curried-marinating-sunrise.md](../.claude/plans/curried-marinating-sunrise.md)**: Created - Complete MVP plan with flow diagrams, state machine, and finalized Rork prompt
- **[CLAUDE.md](CLAUDE.md)**: Previously updated with Mobile MVP Development section

## Technical Implementation

### MVP Architecture
```
┌─────────────────────────────────────────┐
│  Mobile App (Rork + Expo)               │
│  ├── Record audio (expo-av)             │
│  ├── Upload file (expo-document-picker) │
│  ├── AsyncStorage (tips, email)         │
│  └── Form validation                    │
└────────────────┬────────────────────────┘
                 │ POST (base64 audio + metadata)
                 ↓
┌─────────────────────────────────────────┐
│  n8n Webhook (PatientScribeMVP.json)    │
│  AssemblyAI → Claude → Gamma → Gmail    │
└─────────────────────────────────────────┘
```

### Webhook Contract
```json
POST https://db6.app.n8n.cloud/webhook/d233c70b-11cd-4ee8-ade0-f943033281c0

{
  "audio": "<base64 encoded>",
  "audioFormat": "m4a",
  "appointmentDate": "2025-11-29",
  "providerName": "Dr. Smith",
  "specialty": "urology",
  "recipientEmail": "patient@email.com"
}

Response: { "status": "accepted", "message": "Check email in ~5 min" }
```

### Design System (from colors.js)
| Element | Color | Hex |
|---------|-------|-----|
| Headers/Primary buttons | indigo-900 | #2D3A6E |
| Body text | indigo-800 | #3D4A7E |
| Secondary text | warmGray-600 | #6B6966 |
| Background | warmGray-50 | #FAF9F7 |
| Brand accent | periwinkle-500 | #5B7FE1 |
| Recording indicator | coral-500 | #F56565 |
| Success | teal-400 | #4FD1C5 |
| Card borders | warmGray-300 | #D5D3CF |

### AsyncStorage Keys
- `@PatientScribe:hasSeenRecordingTips` - boolean
- `@PatientScribe:lastUsedEmail` - string

## Screens Designed

1. **Home Screen** - Logo + tagline + Record/Upload buttons
2. **Recording Tips Modal** - First-time tips with "Don't show again"
3. **Recording Screen** - Timer, waveform, coral pulse animation
4. **Appointment Details** - Form with date, provider, specialty (optional), email
5. **Processing Screen** - Spinner + "Check your email in 3-5 min"
6. **Success Screen** - Teal checkmark + email confirmation
7. **Error Screen** - Coral warning + retry option

## Key Decisions

### Why Fire-and-Forget (Option A)?
- **Simplest implementation**: No need for polling endpoint in n8n
- **User expectation set**: "Check your email in ~5 min" is acceptable
- **App can be closed**: Users don't need to wait
- **Future upgrade path**: Can add polling later if needed

### Why Optional Specialty?
- AI in the n8n workflow already detects specialty from transcript
- Reduces form friction for users
- UI shows hint: "AI will auto-detect if left blank"

### Why Recording Tips Modal?
- Improves recording quality (better audio = better transcription)
- First-time only with dismiss option
- Consent reminder: "Ask permission before recording"

## Next Steps

- [ ] **Generate app in Rork**: Paste prompt from plan file, upload LogoSimple.png
- [ ] **Test webhook integration**: Verify n8n receives POST correctly
- [ ] **Test on iOS simulator**: Validate recording and file picker functionality
- [ ] **Deploy to TestFlight**: Beta testing with real appointments

## Rork Prompt Location

The finalized Rork prompt is saved at:
**[.claude/plans/curried-marinating-sunrise.md](../.claude/plans/curried-marinating-sunrise.md)** → Section: `## Rork Prompt (Final)`

---

# AssemblyAI Migration Session Summary
**Date**: November 23, 2025

## Overview

Successfully migrated PatientScribe workflow from Gemini 2.5 Pro to AssemblyAI SLAM-1 for medical transcription. This migration eliminates hallucination issues during silence periods while providing 90% cost savings and superior medical terminology accuracy.

## Migration Achievements

- ✅ **Zero hallucinations**: Cornell University research validated 0% hallucination rate across 13,140 medical audio segments
- ✅ **90% cost savings**: $0.16 vs $1.50 for 20-minute audio (compared to AWS Medical)
- ✅ **Medical entity extraction**: Automatic detection of medications, conditions, and procedures
- ✅ **HIPAA compliant**: Business Associate Agreement (BAA) available
- ✅ **Superior accuracy**: 66% fewer missed medical entities vs general-purpose models
- ✅ **Speaker diarization**: 2.9% error rate for provider vs patient speech separation

## File Organization Updates

### Current Production Workflow
- **[PatientScribe.json](PatientScribe.json)**: Current production version using AssemblyAI SLAM-1
  - 7-node async batch transcription flow
  - Custom medical vocabulary support
  - Medical entity extraction enabled
  - Speaker diarization active

### Previous Versions
- **[PatientScribeGem.json](PatientScribeGem.json)**: Previous version using Gemini 2.5 Pro
  - Kept for reference and fallback
  - Original working implementation

### Archive
- **OldWorkflows/**: Archive folder containing previous API iterations
  - AWS Transcribe Medical experiments
  - Other transcription service tests

### New Reference Documentation
- **[Gamma-API-ultimate-guide](Gamma-API-ultimate-guide)**: Complete Gamma API reference
  - Endpoint documentation
  - Authentication details
  - Request/response examples

- **gamma_themes.xlsx**: Excel spreadsheet of all available Gamma themes
  - Theme names and IDs
  - Visual characteristics
  - Use case recommendations

- **gamma_themes.json**: JSON version of Gamma themes
  - Programmatic access to theme data
  - Structured theme metadata

## Technical Implementation

### 7-Node AssemblyAI Workflow

1. **Upload Audio to AssemblyAI** (HTTP Request)
   - Endpoint: `https://api.assemblyai.com/v2/upload`
   - Uploads binary audio file
   - Returns `upload_url` for transcription job

2. **Submit AssemblyAI Medical Transcription** (HTTP Request)
   - Endpoint: `https://api.assemblyai.com/v2/transcript`
   - Configuration:
     - `speech_model: "slam-1"` (medical-optimized)
     - `speaker_labels: true` (diarization)
     - `entity_detection: true` (medical entities)
     - `redact_pii: false` (future enhancement)
     - Custom vocabulary: PSA, prostatectomy, biochemical recurrence, Dr. Saram, lisinopril, metoprolol
   - Returns `transcript_id` for polling

3. **Wait 10 Seconds** (Wait node)
   - Initial delay before first status check

4. **Check Transcription Status** (HTTP Request)
   - Endpoint: `https://api.assemblyai.com/v2/transcript/{transcript_id}`
   - Polls for completion status

5. **Route by Status** (Switch node)
   - `completed` → Normalize output
   - `processing/queued` → Retry logic
   - `error` → Error handler

6. **Handle Retry Logic - AssemblyAI** (Code node)
   - Max 20 retries × 10 seconds = 200 seconds (3.3 minutes)
   - Increments `retryCount` in payload
   - Throws timeout error if limit exceeded

7. **Normalize AssemblyAI Output** (Code node)
   - Extracts transcript text
   - Parses medical entities (medications, conditions, procedures)
   - Preserves meeting date metadata
   - Formats output for downstream nodes

### Errors Fixed During Implementation

#### Error 1: JSON Body Expression Not Evaluating
**Symptom**: 400 error - "audio_url should start with http"

**Root Cause**: JSON body was stringified instead of n8n expression
```json
// ❌ Incorrect
"jsonBody": "{\"audio_url\": \"={{ ... }}\", ...}"

// ✅ Correct
"jsonBody": "={{ {
  \"audio_url\": $('Upload Audio to AssemblyAI').item.json.upload_url,
  ...
} }}"
```

#### Error 2 & 3: Code Doesn't Return Items Properly
**Symptom**: "Please return an array of objects" error in retry logic and normalize nodes

**Root Cause**: Escaped newlines (`\\n`) in JavaScript code prevented n8n parsing

**Fix**: Provided properly formatted JavaScript code with actual line breaks for copy/paste

## Testing Results

### Test File: 20-Minute PSA Appointment Audio

**Transcript Quality**:
- ✅ Clean output with no hallucinations
- ✅ Accurate medical terminology (PSA, prostatectomy, biochemical recurrence)
- ✅ Proper name recognition ("Dr. Saram")
- ✅ Confidence score: 0.85 (85% - very good)

**Medical Entity Extraction**:
- **Conditions detected**: PSA failure
- **Procedures detected**: PSA test, surgery, ultra sensitive PSA, PET scan, radiation (14 instances total)
- **Medications detected**: None (correctly identified - no medications discussed)

**Performance Metrics**:
- **Audio duration**: 1,178 seconds (~20 minutes)
- **Processing time**: ~90 seconds (upload + transcription + polling)
- **Cost**: $0.16 (vs $1.50 for AWS Medical Transcribe)
- **Accuracy**: No hallucinations during silence periods

## Cost Analysis

### Per-Minute Pricing Comparison

| Service | Cost/Minute | 20-Min Cost | Notes |
|---------|-------------|-------------|-------|
| AssemblyAI SLAM-1 | $0.008 | $0.16 | Medical-optimized model |
| AWS Transcribe Medical | $0.075 | $1.50 | HIPAA-compliant |
| Gemini 2.5 Pro | ~$0.10 | ~$2.00 | Hallucination issues |

**Savings**: 90% cost reduction vs AWS Medical, 92% vs Gemini

### Annual Cost Projection (100 appointments/month)

- **Average appointment duration**: 20 minutes
- **Monthly transcription cost**: $16 (100 × $0.16)
- **Annual transcription cost**: $192

Compare to AWS Medical: $1,800/year (90% savings = $1,608/year saved)

## Key Decisions Made

### Why AssemblyAI SLAM-1?

1. **Zero hallucinations**: Cornell University validated across 13,140 medical audio segments
2. **Medical optimization**: Purpose-built for healthcare terminology
3. **Cost efficiency**: 90% cheaper than AWS Medical
4. **Entity extraction**: Automatic medical entity detection
5. **HIPAA compliance**: BAA available for healthcare use
6. **Custom vocabulary**: Support for up to 1,000 medical terms

### Why Remove Gemini Fallback?

- Simplifies workflow maintenance
- Gemini had hallucination issues during silence
- AssemblyAI reliability makes fallback unnecessary
- Original Gemini version preserved in PatientScribeGem.json for reference

### What's Next (Future Enhancements)

**Short-term (Next 30 days)**:
- [ ] Expand custom vocabulary to 100+ medical terms
- [ ] Test with different medical specialties (dental, cardiology, oncology)
- [ ] Benchmark accuracy against human medical transcriptionists

**Medium-term (Next 90 days)**:
- [ ] Implement PII redaction (`redact_pii: true`)
- [ ] Add speaker identification by name (not just "Speaker A/B")
- [ ] Create specialty-specific vocabulary lists

**Long-term (Next 6 months)**:
- [ ] Integrate medical entity extraction into Gamma presentation
- [ ] Add medication interaction checking
- [ ] Implement SNOMED CT medical coding

## Migration Timeline

- **Nov 15, 2025**: AWS Transcribe Medical hallucination issues identified
- **Nov 18, 2025**: Cornell University research on AssemblyAI discovered
- **Nov 22, 2025**: Migration decision made
- **Nov 23, 2025**: AssemblyAI workflow implemented and tested ✅
- **Nov 23, 2025**: File reorganization completed ✅

## References

### Documentation Created This Session
- [ASSEMBLYAI_MIGRATION.md](ASSEMBLYAI_MIGRATION.md): Migration rationale and research
- [ASSEMBLYAI_IMPLEMENTATION.md](ASSEMBLYAI_IMPLEMENTATION.md): Technical implementation guide
- [ASSEMBLYAI_QUICK_START.md](ASSEMBLYAI_QUICK_START.md): User-friendly testing guide

### External Resources
- AssemblyAI SLAM-1 Documentation: https://www.assemblyai.com/docs/speech-to-text/slam
- Cornell University Research: Hallucination rates in medical ASR systems
- n8n Expression Syntax: https://docs.n8n.io/code/expressions/

---

**Session completed successfully** ✅
Next session: Test with different medical specialties and expand custom vocabulary.
