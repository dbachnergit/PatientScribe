# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Guide

### Essential First Steps
1. **ALWAYS read [Summary.md](Summary.md) first** - Contains current API status, known issues, and recent changes
2. **This is an n8n workflow project** - Not traditional code; workflow logic is in JSON files
3. **Production workflow**: [PatientScribe.json](PatientScribe.json) (AssemblyAI SLAM-1)
4. **Test files**: `TranscriptsRecordings/PSA Recording11-12-25.m4a` (audio) and `PSATranscriptAssembly11-12-25.txt` (transcript)

### Mobile App Commands (Expo)

```bash
cd app && npm start          # Start Expo dev server (scan QR with Expo Go)
cd app && npm run ios        # Run on iOS simulator
cd app && npm run android    # Run on Android emulator
cd app && npm run typecheck  # TypeScript type checking
cd app && npm run lint       # Run ESLint
```

**Common Fixes**:
- Use `--legacy-peer-deps` flag for all npm installs (peer dependency conflicts)
- Use `npx expo install <package>` for Expo-compatible versions

### n8n Workflow Commands

**Using n8n-mcp server** (available via MCP tools):
- `mcp__n8n-mcp__n8n_get_workflow` - Get workflow details by ID
- `mcp__n8n-mcp__n8n_validate_workflow` - Validate workflow structure
- `mcp__n8n-mcp__n8n_update_partial_workflow` - Make incremental updates
- `mcp__n8n-mcp__search_nodes` - Search for available n8n nodes
- `mcp__n8n-mcp__get_node` - Get detailed node documentation

**Manual workflow operations**:
- Import workflow: Upload JSON to n8n UI → Workflows → Import
- Test node: Click node → Execute Node
- View logs: n8n UI → Executions tab
- Enable DEBUG_MODE: n8n Settings → Variables → `DEBUG_MODE=true`

**Custom Slash Commands**:
- `/summary` - Generate a comprehensive session summary and save to Summary.md

### Key Files Quick Reference

| File | Purpose |
|------|---------|
| **Workflows** | |
| [PatientScribe.json](PatientScribe.json) | Production workflow (AssemblyAI SLAM-1, Google Drive trigger) |
| [PatientScribeMVP.json](PatientScribeMVP.json) | MVP workflow with webhook trigger (for mobile app) |
| [PatientScribeGem.json](PatientScribeGem.json) | Archived workflow (Gemini 2.5 Pro) |
| **Mobile App** | |
| [app/](app/) | Expo React Native mobile app |
| [app/src/services/webhook.ts](app/src/services/webhook.ts) | Multipart/form-data upload to n8n |
| [app/tailwind.config.js](app/tailwind.config.js) | NativeWind design tokens |
| **Documentation** | |
| [Summary.md](Summary.md) | Session history, current status, known issues |
| [PatientScribeOverview.md](PatientScribeOverview.md) | AWS architecture, mobile roadmap, vector DB plans |
| **API References** | |
| [Gamma-API-ultimate-guide.md](Gamma-API-ultimate-guide.md) | Gamma API documentation |
| [Assemblyai-api-ultimate-guide.md](Assemblyai-api-ultimate-guide.md) | AssemblyAI API reference |
| gamma_themes_complete.json | All Gamma theme options |
| **Assets** | |
| [colors.js](colors.js) | Design system color tokens |
| TranscriptsRecordings/ | Test audio and transcript files |
| Examples/ | Sample generated PDFs |

### Available MCP Servers

**Core Tools**:
- **n8n-mcp**: Direct n8n instance management (workflows, nodes, validation, executions)
- **Context7**: Up-to-date library documentation (AssemblyAI, OpenRouter, React Native, etc.)
- **github**: GitHub repository operations (create branches, PRs, issues)
- **playwright**: Browser automation for testing

**Use MCP tools** to look up current API documentation instead of relying on potentially outdated information.

## Table of Contents

- [Quick Start Guide](#quick-start-guide) - Commands, files, MCP servers
- [Project Overview](#project-overview) - What PatientScribe is and current phase
- [Architecture Overview](#architecture-overview) - n8n workflow + mobile app structure
- [Critical n8n Workflow Patterns](#critical-n8n-workflow-patterns) - Binary data, polling, healthcare validation
- [Prompt Engineering Strategy](#prompt-engineering-strategy) - 7-slide summary structure
- [Configuration Requirements](#configuration-requirements) - API credentials, environment variables
- [Development Workflow](#development-workflow) - Testing n8n and mobile app, MCP tools
- [Common Issues and Solutions](#common-issues-and-solutions) - Troubleshooting reference
- [Architecture Decisions](#architecture-decisions) - Why AssemblyAI, Claude, Gamma, n8n
- [Key Contact Points for Modifications](#key-contact-points-for-modifications) - Frequently modified nodes

## Getting Started with Each Session

**CRITICAL FIRST STEP**: Read [Summary.md](Summary.md) before making any changes. This file contains:
- Most recent session work and migration status
- Current API integrations and their configuration
- Known issues with documented solutions
- Pending enhancements and next steps

This prevents recommending deprecated approaches (e.g., suggesting Gemini or Whisper when AssemblyAI is now standard).

## Project Overview

PatientScribe is a **mobile health application** (under development) that empowers patients to record medical appointments, receive automatic transcription, and get beautifully formatted PDF summaries. The app will support direct recording, file uploads, transcription via AssemblyAI's medical-grade SLAM-1 model, AI-powered analysis, and presentation generation via Gamma. All data will be securely stored in AWS S3 for longitudinal health tracking and family sharing.

**Core Problem Solved**: Patients retain only 10-20% of medical information from appointments. PatientScribe automates the conversion of complex medical conversations into comprehensible, shareable health records.

### Current Development Phase

**Status**: Prototype/MVP using n8n workflow automation

The current implementation is a **fully functional n8n workflow** serving as proof-of-concept. This allows rapid iteration on:
- Transcription API evaluation (tested Gemini, Whisper, AWS Medical → settled on AssemblyAI SLAM-1)
- Prompt engineering for patient education summaries
- Gamma theme selection strategies
- Healthcare specialty detection algorithms
- File type handling and normalization patterns

**Migration Path**: Once core workflows are validated, migrate to React Native mobile app (iOS initial target) with AWS infrastructure.

## Architecture Overview

### Current Implementation (n8n Prototype)

This is an **n8n workflow automation project**, not a traditional codebase. The "code" is the n8n workflow JSON:

- **[PatientScribe.json](PatientScribe.json)**: Production prototype using AssemblyAI SLAM-1
- **[PatientScribeGem.json](PatientScribeGem.json)**: Previous version using Gemini 2.5 Pro (archived)
- **OldWorkflows/**: Historical API experiments (AWS Transcribe Medical, etc.)

### Target Production Architecture

**Mobile App Stack** (planned): React Native (Expo) → AWS S3 → AssemblyAI → OpenRouter → Gamma → AWS Cognito

**Why n8n First?** Visual debugging, non-technical validation, faster iteration. Migrate to mobile when processing >1,000 appointments/month or need <5-minute latency.

See [PatientScribeOverview.md](PatientScribeOverview.md) for complete mobile roadmap, [Summary.md](Summary.md) for latest MVP planning (Rork + webhook), and [colors.js](colors.js) for design system.

### n8n Workflow Execution Flow

**PatientScribe.json** (desktop testing):
```
Google Drive Trigger (new file in Transcripts folder)
  ↓
Extract Meeting Date (from filename patterns)
  ↓
Download File (binary data)
  ↓
Check File Type (audio/pdf/text detection)
  ↓
Route by Type → [Audio: AssemblyAI] [PDF: Extract] [Text: Parse]
  ↓
Merge Transcripts (normalize to unified format)
  ↓
Healthcare Metadata Classifier (validate healthcare, detect specialty)
  ↓
Healthcare Patient Analysis (Claude Sonnet 4.5 → 7-slide summary)
  ↓
Construct Healthcare Payload (Gamma API request with theme selection)
  ↓
Generate Presentation (Gamma API with retry polling)
  ↓
Send Email (Gmail with presentation link)
```

**PatientScribeMVP.json** (mobile app):
```
Webhook Trigger (POST from mobile app with audio + metadata)
  ↓
[Same flow as above, but metadata comes from webhook payload]
```

### Mobile App Architecture (Expo)

```
app/
├── src/
│   ├── app/                  # Expo Router screens (file-based routing)
│   │   ├── _layout.tsx       # Root layout with providers (QueryClient, SafeArea)
│   │   ├── index.tsx         # Home screen (Record/Upload buttons)
│   │   ├── recording.tsx     # Audio recording with timer
│   │   ├── upload.tsx        # Document picker for audio/text
│   │   ├── details.tsx       # Appointment form with date picker
│   │   ├── processing.tsx    # Submission with progress animation
│   │   ├── success.tsx       # Success confirmation
│   │   └── error.tsx         # Error handling with retry
│   ├── components/ui/        # Reusable components (Button, Card, Input, Select)
│   ├── stores/               # Zustand state management
│   │   ├── useRecordingStore.ts   # Recording URI, duration, format
│   │   └── useAppointmentStore.ts # Form data (date, provider, email)
│   ├── services/webhook.ts   # Multipart/form-data submission to n8n
│   ├── hooks/useAudioRecording.ts # Audio recording lifecycle
│   ├── lib/                  # Utilities
│   │   ├── constants.ts      # Webhook URL, storage keys
│   │   └── utils.ts          # formatDuration, validateEmail, getMimeType
│   └── types/index.ts        # TypeScript interfaces, specialty list
├── tailwind.config.js        # NativeWind design tokens (PatientScribe colors)
├── .env                      # EXPO_PUBLIC_WEBHOOK_URL
└── package.json
```

### Mobile Tech Stack

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

Defined in [tailwind.config.js](app/tailwind.config.js) and [colors.js](colors.js):

| Element | Color | Hex |
|---------|-------|-----|
| Primary (buttons, headers) | indigo-900 | `#2D3A6E` |
| Accent (links, controls) | periwinkle-500 | `#5B7FE1` |
| Recording indicator | coral-500 | `#F56565` |
| Success states | teal-400 | `#4FD1C5` |
| Warning | orange-400 | `#F6AD55` |
| Background | warmGray-50 | `#FAF9F7` |
| Card backgrounds | white | `#FFFFFF` |
| Borders | warmGray-300 | `#D5D3CF` |

## Critical n8n Workflow Patterns

### 1. Binary Data Preservation

**Problem**: n8n custom code nodes can accidentally drop binary data when transforming JSON.

**Solution**: Always return `binary: inputBinary` in custom code nodes:

```javascript
const input = $input.first();
const inputBinary = input.binary;  // Capture at start

return [{
  json: { ...transformedData },
  binary: inputBinary  // CRITICAL: Pass through
}];
```

**Affected Nodes**: Check File Type, Extract Meeting Date, all custom code nodes before audio/PDF extraction.

### 2. AssemblyAI Async Polling Pattern

The workflow uses a **7-node async pattern** for AssemblyAI transcription:

1. Upload Audio → Returns `upload_url`
2. Submit Transcription Job → Returns `transcript_id`
3. Wait 10 seconds (initial delay)
4. Check Status (poll endpoint)
5. Route by Status (completed/processing/error)
6. Retry Logic (max 20 retries × 10s = 3.3 minutes)
7. Normalize Output (extract text + medical entities)

**Key Configuration** (Submit Transcription Job node):
```json
{
  "speech_model": "slam-1",           // Medical-optimized
  "speaker_labels": true,             // Speaker diarization
  "entity_detection": true,           // Medical entity extraction
  "word_boost": ["PSA", "prostatectomy", "Dr. Saram"],  // Custom vocabulary
  "redact_pii": false                 // Future: enable for PII redaction
}
```

### 3. Gamma API Retry Pattern

Gamma generation uses **polling with exponential backoff**:

```javascript
// Retry Logic Node (max 20 retries × 15s = 5 minutes)
const retryCount = $('Handle Retry Logic - Healthcare').item.json.retryCount || 0;

if (retryCount >= 20) {
  throw new Error('Gamma generation timeout after 5 minutes');
}

return [{
  json: {
    ...inputJson,
    retryCount: retryCount + 1
  }
}];
```

If timeout occurs, user receives automated "Gamma Timeout Notification" email.

### 4. Healthcare Validation & Specialty Detection

**Healthcare Metadata Classifier** node validates transcripts and detects specialty:

```javascript
// Minimum 3 healthcare keywords required
const healthcareKeywords = [
  'patient', 'doctor', 'appointment', 'diagnosis', 'treatment',
  'medication', 'symptoms', 'prescription', 'medical', 'health'
];

// Specialty detection (10+ specialties)
const specialtyPatterns = {
  'dental': ['dentist', 'tooth', 'cavity', 'crown', 'root canal'],
  'cardiology': ['cardiologist', 'heart', 'blood pressure', 'EKG'],
  'urology': ['urologist', 'prostate', 'PSA', 'bladder'],
  // ... etc (see node for full list)
};
```

**Output Structure**:
```json
{
  "healthcareMetadata": {
    "isHealthcare": true,
    "specialty": "urology",
    "specialtyScore": 15,
    "appointmentType": "follow-up-monitoring",
    "provider": {
      "name": "Dr. Saram",
      "role": "urology",
      "isPrimary": true
    },
    "patientPresent": true,
    "sensitiveDataFlags": {
      "phi": true,
      "pii": false,
      "financialData": false
    }
  }
}
```

## Prompt Engineering Strategy

### Healthcare Patient Analysis Prompt

The Claude Sonnet 4.5 prompt generates **exactly 7 slides** using `---` as section breaks (mapped to `cardSplit: 'inputTextBreaks'` in Gamma payload).

**Slide Structure**:
1. Visit Overview (date, provider, visit type, current status)
2. Key Numbers & What They Mean (metrics with 🟢🟡🔴 zones, trends)
3. What Your Doctor Said (plain language assessment)
4. Your Treatment Plan (medications, procedures, lifestyle)
5. What to Watch For (warning signs, when to call)
6. Your Action Checklist (table format with timeline)
7. Understanding Your Condition (educational content, resources)

**Key Prompt Directives**:
- **Reading level**: 8th-grade language (avoid medical jargon)
- **Contextualized metrics**: Not just numbers, but what they mean
- **Reassurance framing**: Address patient anxiety when clinically appropriate
- **Date awareness**: Calculate future appointments from `meetingDateFormatted` (TODAY'S date)

**Example Translation**:
```
Raw: "PSA 0.18, biochemical recurrence defined as 0.2+"

Output: "Your PSA is 0.18 (November reading), which is stable and
reassuring. The clinical concern threshold is 0.2, so you're
comfortably below that level."
```

### Gamma Theme Selection Logic

**Construct Healthcare Payload** node selects themes based on appointment context:

```javascript
const themeMap = {
  'clinical': 'pearl',          // Professional medical appointments
  'wellness': 'sage',           // Holistic/preventive care
  'chronic': 'consultant',      // Ongoing condition monitoring
  'default': 'pearl'
};

const footer = sensitiveDataFlags.pii
  ? `${meetingDate} | Confidential Medical Record | ⚠️ CONTAINS PERSONAL IDENTIFIERS`
  : `${meetingDate} | Confidential Medical Record`;
```

## Configuration Requirements

### Required API Credentials

Configure in n8n Settings → Credentials:

1. **Google Drive OAuth2** (ID: `jnXCGJLtcnWTVuMM`)
   - Scopes: `drive.readonly`, folder monitoring
   - Trigger: Google Drive Trigger node
   - Action: Download Transcript File node

2. **AssemblyAI API Key** (ID: `[YOUR_CREDENTIAL_ID]`)
   - Used in: Upload Audio, Submit Transcription, Check Status nodes
   - Header: `Authorization: YOUR_API_KEY`

3. **OpenRouter API** (ID: `AfZYknoqBJOf8tWD`)
   - Current model: `anthropic/claude-sonnet-4.5` (prototype)
   - Target model: `openai/gpt-5.1` (production mobile app)
   - Used in: Healthcare Patient Analysis node

4. **Gamma API Key** (ID: `v58YEG3NmyitKQOv`)
   - Endpoints: `/v1.0/generations` (create), `/v1.0/generations/{id}` (status)
   - Used in: Generate Gamma, Check Gamma Status nodes

5. **Gmail OAuth2** (ID: `ZWg3TzOLOBRwS0B9`)
   - Used in: Send Healthcare Email node

### Environment Variables

Optional environment variables (n8n Settings → Variables):

- **DEBUG_MODE**: Set to `true` to enable debug metadata in workflow outputs
  - Includes: `classificationDebug`, `meetingDateDebug`, `detectionDebug`, `mergeDebug`
  - Disable in production for 5-10% performance improvement

### Google Drive Folder IDs

- **Transcripts Folder**: `1ROaSk8lphvkgLyFWl29A0qqZPnOCw9TI`
  - Monitored by Google Drive Trigger node
  - Polls every minute for new files

## Development Workflow

### Working with n8n-mcp Server

This project includes the **n8n-mcp** MCP server for programmatic workflow management. Use these tools to validate, inspect, and modify workflows without manually editing JSON.

**Key n8n-mcp operations**:

1. **Get workflow details**:
   ```
   mcp__n8n-mcp__n8n_get_workflow({ id: "workflow_id", mode: "structure" })
   ```
   Modes: `minimal` (metadata only), `structure` (nodes/connections), `full` (complete workflow)

2. **Validate workflow**:
   ```
   mcp__n8n-mcp__n8n_validate_workflow({ id: "workflow_id" })
   ```
   Returns errors/warnings/suggestions for nodes, connections, expressions

3. **Search for nodes**:
   ```
   mcp__n8n-mcp__search_nodes({ query: "http request", includeExamples: true })
   ```
   Returns node types with real-world configuration examples

4. **Get node documentation**:
   ```
   mcp__n8n-mcp__get_node({ nodeType: "n8n-nodes-base.httpRequest", detail: "standard" })
   ```
   Details: `minimal`, `standard`, `full`

5. **Update workflow incrementally**:
   ```
   mcp__n8n-mcp__n8n_update_partial_workflow({
     id: "workflow_id",
     operations: [
       { type: "updateNode", nodeId: "node123", updates: { parameters: {...} } }
     ]
   })
   ```

**When to use n8n-mcp vs manual editing**:
- ✅ Use n8n-mcp for: validation, looking up node schemas, incremental updates
- ⚠️ Manual JSON editing for: large-scale restructuring, copying between workflows
- 📝 Always validate with `n8n_validate_workflow` after manual edits

### Testing the n8n Workflow

1. Import [PatientScribe.json](PatientScribe.json) into n8n instance
2. Configure all credentials (see above)
3. Upload test file to Google Drive Transcripts folder
4. Monitor execution in n8n UI
5. Check each node's output for errors

**Test Files Available**:
- `TranscriptsRecordings/PSA Recording11-12-25.m4a` (audio file)
- `PSATranscriptAssembly11-12-25.txt` (AssemblyAI text transcript)
- `TranscriptsRecordings/PSA TransNotebook11-12-25.txt` (notebook transcript)
- `TranscriptsRecordings/PSA TransGemini11-12-25.txt` (Gemini transcript - for comparison)

### Testing the Mobile App

1. Start the development server:
   ```bash
   cd app && npm start
   ```
2. Scan QR code with Expo Go app on physical device (or press `i` for iOS simulator)
3. Test recording flow: Home → Record → Details → Submit
4. Test upload flow: Home → Upload → Select file → Details → Submit
5. Verify webhook receives multipart/form-data payload in n8n executions
6. Check email delivery with Gamma presentation link

**End-to-End Test**:
- Recording → n8n webhook → AssemblyAI → Claude → Gamma → Email delivery

**Known Mobile Issues**:
- Use `--legacy-peer-deps` for all npm installs
- If `babel-preset-expo` missing: `npm install babel-preset-expo --legacy-peer-deps`
- If react-native-svg version mismatch: `npx expo install react-native-svg@15.12.1`

**Using n8n-mcp for testing**:
```
# Validate workflow before importing
mcp__n8n-mcp__n8n_validate_workflow({ id: "your_workflow_id" })

# Check execution status
mcp__n8n-mcp__n8n_executions({ action: "list", workflowId: "your_workflow_id", limit: 5 })

# Get detailed execution results
mcp__n8n-mcp__n8n_executions({ action: "get", id: "execution_id", mode: "summary" })
```

### Looking Up API Documentation

**ALWAYS use MCP documentation servers** instead of relying on potentially outdated information:

**AssemblyAI API queries**:
```
# Get latest AssemblyAI documentation
mcp__Context7__resolve_library_id({ libraryName: "AssemblyAI" })
mcp__Context7__get_library_docs({
  context7CompatibleLibraryID: "/assemblyai/assemblyai-python-sdk",
  topic: "medical transcription",
  mode: "code"
})
```

**Gamma API queries**:
```
# Search for Gamma API documentation
mcp__Ref__ref_search_documentation({ query: "Gamma API presentation generation" })
mcp__Ref__ref_read_url({ url: "https://docs.gamma.app/api/..." })
```

**General web search for updated docs**:
```
mcp__exa__web_search_exa({ query: "AssemblyAI SLAM-1 medical model", numResults: 5 })
mcp__exa__get_code_context_exa({ query: "n8n HTTP request node examples" })
```

**When to use each MCP server**:
- **Context7**: Official library/SDK documentation (AssemblyAI, OpenRouter, React Native)
- **Ref**: GitHub repos, framework docs, API references
- **exa**: General web search, blog posts, recent announcements
- **n8n-workflows**: n8n-specific documentation and workflow examples

### Adding Support for New File Types

To add support for new formats (e.g., DOCX, VTT with timestamps):

1. **Update Check File Type** node:
   ```javascript
   const newExtensions = ['.docx', '.vtt'];
   const isNewType = newExtensions.some(ext => fileName.endsWith(ext));
   ```

2. **Add output to Route by File Type** switch node

3. **Create extraction node** for the format

4. **Normalize output** to: `{ json: { data: transcriptText } }`

5. **Connect to Merge Transcripts** node

### Modifying the Healthcare Prompt

**Location**: Healthcare Patient Analysis node → Message parameter

**To update**:
1. Edit in n8n UI (recommended for escaping)
2. Test with Examples/ folder transcripts
3. Verify slide count remains exactly 7
4. Check medical terminology translations are accurate

**Warning**: Editing raw JSON requires careful escaping of quotes and newlines.

### Adding Specialty-Specific Prompts

**Current State**: All specialties use general medical prompt. Specialty detection is implemented but routing is not.

**To implement specialty routing**:

1. Create new LLM chain node (e.g., "Dental Patient Analysis")
2. Design specialty-specific slide structure:
   - **Dental**: Tooth charts, oral hygiene plans
   - **PT**: Exercise programs, ROM tracking
   - **Mental Health**: Therapy goals (no metrics slide)
3. Add Switch node after Healthcare Metadata Classifier
4. Route based on `healthcareMetadata.specialty` field
5. Test with specialty-specific transcripts

**Supported Specialties**: dental, physical-therapy, mental-health, urology, cardiology, oncology, endocrinology, primary-care, dermatology, orthopedics

## Common Issues and Solutions

### Quick Troubleshooting Reference

| Problem | First Check | Solution |
|---------|-------------|----------|
| Workflow fails immediately | [Summary.md](Summary.md), API credentials | Enable `DEBUG_MODE=true`, validate with `mcp__n8n-mcp__n8n_validate_workflow` |
| Wrong output | Healthcare Metadata Classifier logs | Check `meetingDateFormatted`, review AI prompt output |
| API 400/401/500 | Credential configuration | AssemblyAI: `Authorization` header; Gamma: check key expiry; OpenRouter: verify model name |
| Binary data lost | Custom code nodes | Ensure all return `binary: inputBinary` |
| AssemblyAI fails | API key, audio format | Supported: MP3, M4A, WAV, WEBM, OGG, FLAC |
| Gamma timeout | Gamma API status | Auto-notification sent; retry by re-uploading |
| Not recognized as healthcare | Keyword threshold | Requires 3+ matches; add to `healthcareKeywords` array |
| Wrong specialty | Keyword patterns | Requires 2+ matches; add to `specialtyPatterns` object |
| Date extraction fails | Filename format | Add regex to `datePatterns` array; supports MM-DD-YYYY, YYYY-MM-DD variants |
| Mobile app upload fails | Webhook config | Check CORS settings in n8n webhook; verify `Allowed Origins: *` |
| Mobile app CORS error | n8n webhook | Add `Access-Control-Allow-Origin: *` header in webhook response |

## Architecture Decisions

### Why AssemblyAI SLAM-1?

**Migration Completed**: November 2025 (previously used Gemini 2.5 Pro, then Whisper)

**Rationale**:
- **Zero hallucinations**: Cornell University validated across 13,140 medical audio segments
- **90% cost savings**: $0.16 vs $1.50 for 20-minute audio (vs AWS Medical)
- **Medical entity extraction**: Automatic detection of medications, conditions, procedures
- **HIPAA compliant**: BAA available for healthcare use
- **Custom vocabulary**: Support for 1,000+ medical terms
- **Speaker diarization**: 2.9% error rate for provider vs patient separation

**Previous Issues**:
- Gemini 2.5 Pro: Hallucinations during silence periods
- Whisper: Poor medical terminology accuracy
- AWS Medical: 10x more expensive

### Why Claude Sonnet 4.5 for Prototype (GPT-5.1 for Production)?

**Current (n8n prototype)**: Claude Sonnet 4.5 via OpenRouter
- Superior medical terminology understanding
- Better at nuanced reassurance framing
- Longer context window for full appointment transcripts
- More consistent adherence to complex structured prompts (7-slide structure)

**Planned (mobile app)**: OpenRouter GPT-5.1
- Cost optimization at scale ($0.02/1K tokens vs Claude's higher pricing)
- Faster response times for mobile UX
- Comparable medical accuracy (validated via A/B testing during prototype phase)
- Native support for structured outputs (JSON mode for metadata extraction)

### Why Gamma API for Presentations?

**Alternatives considered**:
- Google Slides API: Requires extensive template engineering
- PowerPoint libraries: Poor visual design out-of-box
- Custom HTML/PDF: No shareable presentation interface

**Gamma advantages**:
- AI-generated images matching healthcare themes
- Professional templates without manual design
- Web-based sharing (no large email attachments)
- Built-in analytics (view tracking)

### Why n8n Prototype Before Building Mobile App?

**Current Phase**: n8n serves as MVP/proof-of-concept

**Benefits of n8n-first approach**:
- **Rapid validation**: Test AI prompts, API integrations, workflow logic without mobile development overhead
- **Non-technical iteration**: Stakeholders can modify prompts, theme selection, email templates in UI
- **Visual debugging**: See data flow between nodes, inspect JSON at each step
- **API evaluation**: Tested Gemini, Whisper, AWS Medical, AssemblyAI without code refactoring
- **Cost efficiency**: Validate product-market fit before investing in mobile infrastructure

**Mobile App Triggers** (when to migrate from n8n → React Native):
- User demand for **in-app recording** (vs file upload)
- Processing >1,000 appointments/month (n8n execution queue limits)
- Need <5-minute latency (n8n polling overhead)
- **Longitudinal features required**: Timeline views, trend charts, semantic search
- **Family sharing**: Multi-user access control, AWS Cognito integration
- **AWS S3 storage**: Long-term health record archive, vector database indexing

**Current Status**: n8n prototype validates core workflow. Mobile app development begins once AWS S3 architecture is designed (see [PatientScribeOverview.md](PatientScribeOverview.md)).

## PHI and HIPAA Considerations

**Important**: This workflow is designed for **patient-initiated recording**, which is **exempt from HIPAA**. Patients recording their own appointments are exercising rights to their health information.

**Current Safeguards**:
1. **Encryption**: All API calls use HTTPS/TLS
2. **Access Control**: Gmail sends only to patient's email
3. **Watermarking**: Footer on all slides: "Confidential Medical Record"
4. **Privacy Warnings**: Email includes PHI disclaimer
5. **Sensitive Data Detection**: Flags SSN/financial data, adds warnings to email/footer

**If Extending for Provider Use** (clinic partnerships):
- [ ] Implement BAA with all vendors
- [ ] Add AES-256 encryption at rest
- [ ] Implement audit logging (access tracking)
- [ ] Add patient consent management
- [ ] Configure auto-deletion policies

## Performance Metrics

### Current Processing Time (20-minute audio)

- Upload + AssemblyAI transcription: ~90 seconds
- Healthcare validation & specialty detection: <5 seconds
- LLM Analysis (Claude): ~45 seconds
- Gamma Generation: ~2-3 minutes (polling)
- **Total**: ~4 minutes end-to-end

### Cost Analysis (per 20-minute appointment)

- AssemblyAI SLAM-1: $0.16
- OpenRouter (Claude Sonnet 4.5): ~$0.10
- Gamma API: ~$0.05
- **Total**: ~$0.31 per appointment

**Annual cost** (100 appointments/month): ~$372/year

### Scaling Considerations

**Current Bottlenecks**:
1. Gamma API rate limits (sequential polling adds latency)
2. OpenRouter concurrency (typically 10 requests/min)
3. n8n workflow execution queue (depends on hosting)

**Mitigation for >100 appointments/day**:
- Implement Redis queue for async processing
- Batch Gamma generations during off-peak hours
- Upgrade to n8n Pro (higher execution limits)
- Consider dedicated Claude API key (higher throughput)

## Future Mobile App Architecture

**Detailed planning is in [PatientScribeOverview.md](PatientScribeOverview.md)**, including:
- AWS S3 storage strategy and bucket structure
- Longitudinal health tracking with vector database (Pinecone/Weaviate)
- Family sharing architecture
- React Native library recommendations
- Phase-by-phase implementation roadmap

## Recent Changes

See [Summary.md](Summary.md) for detailed session history. Key milestones:

- **Dec 2, 2025**: Expo mobile app created with full n8n webhook integration
- **Dec 2, 2025**: Migrated from base64 JSON to multipart/form-data uploads
- **Nov 30, 2025**: Mobile MVP architecture designed (Rork + webhook)
- **Nov 23, 2025**: AssemblyAI SLAM-1 migration completed (replaced Gemini)
- **Nov 2025**: Multi-specialty detection, healthcare validation, debug mode

## Key Contact Points for Modifications

### n8n Workflow (Most frequently modified nodes)

1. **Healthcare Patient Analysis** - Prompt engineering
2. **Healthcare Metadata Classifier** - Specialty detection, validation logic
3. **Construct Healthcare Payload** - Gamma theme selection, footer modifications
4. **Extract Meeting Date** - Date format support
5. **Submit AssemblyAI Medical Transcription** - Custom vocabulary, entity detection settings
6. **Send Healthcare Email** - Email template, warning messages
7. **Process Webhook Payload** (MVP) - Metadata extraction, binary field renaming

### Mobile App (Most frequently modified files)

1. **[app/src/services/webhook.ts](app/src/services/webhook.ts)** - API integration, form data construction
2. **[app/src/app/details.tsx](app/src/app/details.tsx)** - Appointment form fields, validation
3. **[app/src/stores/](app/src/stores/)** - State management (recording, appointment data)
4. **[app/src/hooks/useAudioRecording.ts](app/src/hooks/useAudioRecording.ts)** - Recording settings
5. **[app/tailwind.config.js](app/tailwind.config.js)** - Design system colors
6. **[app/.env](app/.env)** - Webhook URL configuration

### Future Mobile App Development

**When transitioning from n8n → React Native**, preserve these validated patterns:

**Core Logic to Port**:
1. **Date Extraction** (`Extract Meeting Date` node) → React Native regex utilities
2. **File Type Detection** (`Check File Type` node) → MIME type + extension checking
3. **Healthcare Validation** (`Healthcare Metadata Classifier` node) → Keyword scoring algorithm
4. **Transcript Normalization** (`Normalize AssemblyAI Output` node) → API response mapping
5. **Prompt Template** (`Healthcare Patient Analysis` node) → Centralized template file (JSON/YAML)

**What Changes in Mobile App**:
- **Google Drive polling** → In-app recording + file picker
- **Gmail delivery** → Push notification + in-app PDF viewer
- **n8n merge nodes** → React state management (Redux/Context)
- **Hardcoded retry logic** → Exponential backoff library (e.g., `axios-retry`)
- **Sequential polling** → React Native background tasks (expo-task-manager)

**What Stays the Same**:
- AssemblyAI API integration (same endpoints, same configuration)
- Gamma API payload structure (same JSON structure)
- OpenRouter API calls (GPT-5.1 instead of Claude, but same pattern)
- 7-slide summary structure (same prompt template)
- Healthcare metadata schema (same JSON output format)

**Testing Strategy**:
- Use n8n workflow outputs as **golden test fixtures** for mobile app unit tests
- Compare mobile app transcript normalization against n8n node outputs
- Validate prompt output consistency (n8n Claude vs mobile GPT-5.1)

See [PatientScribeOverview.md](PatientScribeOverview.md) Section: "Mobile App Implementation Roadmap" for phase-by-phase development plan, React Native library recommendations, and AWS integration code examples.
