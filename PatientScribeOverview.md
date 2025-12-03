# PatientScribe Mobile App - Development Instructions

## Project Overview
PatientScribe is a mobile application that empowers patients to record medical appointments, transcribe them automatically, and receive beautifully formatted PDF summaries via email. The app supports direct recording, file uploads (audio/transcript), transcription via AssemblyAI's medical-grade SLAM-1 model, AI-powered analysis, and presentation generation via Gamma. All data is securely stored in AWS S3 for longitudinal health tracking and family sharing capabilities.

---

## Technical Architecture

### Current Implementation (n8n Prototype)
**Workflow Status:** Fully functional n8n workflow serving as MVP/proof-of-concept
**File:** `PatientScribe_Assembly.json`

### Target Mobile App Stack
- **Frontend Framework:** React Native via Expo
- **Platform:** iOS (initial target)
- **Cloud Storage:** AWS S3 (patient health records, longitudinal data)
- **Backend Services:**
  - AssemblyAI (transcription with SLAM-1 medical model)
  - OpenRouter (GPT-5.1 for analysis)
  - Gamma API (presentation generation)
  - Google Drive (file monitoring/storage - prototype phase)
  - Gmail (delivery)
- **Future Enhancements:**
  - Vector database (Pinecone/Weaviate/pgvector) for semantic search
  - Longitudinal trend analysis engine
  - Family member access control (AWS Cognito)

---

## AWS S3 Storage Architecture

### Bucket Structure
```
patientscribe-production/
├── users/
│   └── {userId}/
│       ├── recordings/
│       │   ├── raw/
│       │   │   └── {appointmentId}_{timestamp}.{ext}
│       │   └── processed/
│       │       └── {appointmentId}_{timestamp}_processed.mp3
│       ├── transcripts/
│       │   ├── raw/
│       │   │   └── {appointmentId}_{timestamp}_raw.json
│       │   └── normalized/
│       │       └── {appointmentId}_{timestamp}_normalized.json
│       ├── analyses/
│       │   └── {appointmentId}_{timestamp}_analysis.json
│       ├── presentations/
│       │   ├── markdown/
│       │   │   └── {appointmentId}_{timestamp}_summary.md
│       │   └── pdf/
│       │       └── {appointmentId}_{timestamp}_presentation.pdf
│       └── metadata/
│           └── {appointmentId}_{timestamp}_metadata.json
└── shared/
    └── {familyGroupId}/
        └── {userId}/
            └── [readonly access to above structure]
```

### Storage Decision Matrix

| Asset Type | Store in S3? | Rationale | Retention Policy |
|------------|--------------|-----------|------------------|
| **Raw Audio Recording** | ✅ Yes | Required for: re-transcription if AI improves, legal/medical record compliance, patient archive | Indefinite (user-controlled deletion) |
| **Processed Audio** | ⚠️ Optional | Normalized/compressed version for faster playback | 90 days (regenerable from raw) |
| **Raw Transcript (AssemblyAI)** | ✅ Yes | Includes speaker labels, entity detection, confidence scores, timestamps | Indefinite |
| **Normalized Transcript** | ✅ Yes | Cleaned text used for AI analysis, essential for vector DB indexing | Indefinite |
| **AI Analysis (GPT output)** | ✅ Yes | 1200-1500 word summary, critical for: trend analysis, vector search, audit trail | Indefinite |
| **Presentation Markdown** | ✅ Yes | Source format for regenerating presentations with updated templates | Indefinite |
| **Gamma PDF** | ✅ Yes | Final deliverable, patient-facing document | Indefinite |
| **Metadata JSON** | ✅ Yes | Healthcare classification, provider info, appointment date, specialty | Indefinite (indexed for search) |

### S3 Object Metadata Tagging

**Every S3 object should include:**
```json
{
  "x-amz-meta-user-id": "{userId}",
  "x-amz-meta-appointment-id": "{appointmentId}",
  "x-amz-meta-appointment-date": "2025-11-12",
  "x-amz-meta-provider-name": "Dr. Saram",
  "x-amz-meta-specialty": "urology",
  "x-amz-meta-appointment-type": "follow-up-monitoring",
  "x-amz-meta-contains-phi": "true",
  "x-amz-meta-shared-with": "{familyGroupId1},{familyGroupId2}",
  "x-amz-meta-created-at": "2025-11-12T14:23:45Z",
  "x-amz-meta-file-type": "transcript-normalized"
}
```

**Purpose:** Enables fast filtering without downloading objects (S3 Select, metadata-only queries)

---

## Core Workflow Logic (Updated with S3 Integration)

### 1. **Input Processing Pipeline**

The system accepts three input types and normalizes them to a unified transcript format:

#### A. Audio Files
**Supported formats:** `.mp3`, `.m4a`, `.wav`, `.webm`, `.ogg`, `.flac`, `.mpeg`, `.mpga`, `.mp4`

**Processing flow:**
1. **Store raw audio in S3:**
   ```javascript
   const s3Key = `users/${userId}/recordings/raw/${appointmentId}_${timestamp}.${ext}`;
   await s3.putObject({
     Bucket: 'patientscribe-production',
     Key: s3Key,
     Body: audioBuffer,
     Metadata: {
       'user-id': userId,
       'appointment-id': appointmentId,
       'appointment-date': appointmentDate,
       'contains-phi': 'true'
     },
     ServerSideEncryption: 'aws:kms',
     SSEKMSKeyId: 'arn:aws:kms:...'
   });
   ```

2. Upload binary audio to AssemblyAI (`/v2/upload`)
3. Submit transcription job with medical configuration:
   ```json
   {
     "speech_model": "slam-1",
     "speaker_labels": true,
     "entity_detection": true,
     "redact_pii": false,
     "keyterms_prompt": ["PSA", "prostatectomy", "biochemical recurrence", ...]
   }
   ```
4. Poll transcription status every 10 seconds (max 20 retries = 200 seconds)
5. **Store raw transcript in S3:**
   ```javascript
   const transcriptKey = `users/${userId}/transcripts/raw/${appointmentId}_${timestamp}_raw.json`;
   await s3.putObject({
     Bucket: 'patientscribe-production',
     Key: transcriptKey,
     Body: JSON.stringify(assemblyAIResponse),
     ContentType: 'application/json',
     Metadata: { /* same as audio */ }
   });
   ```
6. Normalize output to `$json.text` and `$json.data` fields
7. **Store normalized transcript in S3:**
   ```javascript
   const normalizedKey = `users/${userId}/transcripts/normalized/${appointmentId}_${timestamp}_normalized.json`;
   ```

#### B. PDF Transcripts
**Processing flow:**
1. Extract text using `extractFromFile` (PDF mode)
2. **Store original PDF in S3** (if user uploaded)
3. Populate `$json.data` with extracted text
4. **Store normalized transcript in S3**
5. Preserve binary data for downstream processing

#### C. Text Files (JSON/VTT/TXT)
**Supported formats:** `.txt`, `.json`, `.vtt`

**Processing flow:**
1. **Store original file in S3**
2. Extract raw text content
3. Parse JSON structures (support for Whisper API, generic transcript formats)
4. Clean VTT timestamps and formatting
5. Normalize to `$json.data` field
6. **Store normalized transcript in S3**

**All paths converge at "Merge Transcripts" node** → unified `$json.data` field

---

### 2. **Meeting Date Extraction**

**Critical feature:** Automatically extract appointment date from filename or metadata to ensure accurate temporal references in generated summaries.

**Supported date formats:**
- `MM-DD-YYYY`, `MM-DD-YY` (hyphens)
- `YYYY-MM-DD` (ISO with hyphens)
- `MM/DD/YYYY`, `MM/DD/YY` (slashes)
- `YYYY/MM/DD` (ISO with slashes)

**Fallback logic:**
1. Parse filename with regex patterns
2. Check JSON metadata (`jsonData.meetingDate`)
3. Default to current date if extraction fails

**Output fields:**
- `meetingDate` (ISO: `YYYY-MM-DD`)
- `meetingDateFormatted` (`"January 15, 2025"`)
- `meetingDateShort` (`"Jan 15, 2025"`)
- `meetingDateSource` (`"filename"` | `"json"` | `"fallback"`)

**⚠️ CRITICAL:** These fields must propagate through ALL downstream nodes to ensure AI analysis calculates future appointments correctly.

---

### 3. **Healthcare Validation & Metadata Classification**

**Purpose:** Validate transcript is healthcare-related and extract specialty metadata.

#### Validation Requirements
**Minimum healthcare keyword score:** 3 matches
**Keywords:** `patient`, `doctor`, `diagnosis`, `treatment`, `medication`, `PSA`, `blood pressure`, `ultrasound`, `urologist`, etc.

**If validation fails:** Throw descriptive error with keyword count and minimum threshold.

#### Specialty Detection
**Supported specialties:**
- Urology, Cardiology, Oncology, Endocrinology, Dental
- Physical Therapy, Mental Health, Primary Care, Dermatology, Orthopedics

**Detection logic:** Keyword scoring with 2+ matches required for specialty assignment (default: `"general-medical"`)

#### Provider Detection
- Extract `Dr. [Name]` from transcript
- Infer provider role from detected specialty or context

#### Output Structure
```json
{
  "healthcareMetadata": {
    "specialty": "urology",
    "appointmentType": "follow-up-monitoring",
    "provider": {
      "name": "Dr. Saram",
      "role": "urology",
      "isPrimary": true
    },
    "patientPresent": true
  },
  "sensitiveDataFlags": {
    "phi": true,
    "pii": false,
    "financialData": false
  }
}
```

**Store metadata in S3:**
```javascript
const metadataKey = `users/${userId}/metadata/${appointmentId}_${timestamp}_metadata.json`;
await s3.putObject({
  Bucket: 'patientscribe-production',
  Key: metadataKey,
  Body: JSON.stringify(healthcareMetadata),
  ContentType: 'application/json'
});
```

---

### 4. **AI-Powered Patient Summary Generation**

**Model:** OpenRouter GPT-5.1
**Word count:** 1200-1500 words
**Structure:** 7 slides (6 section breaks: `---`)

#### Critical Prompt Requirements

**A. Date Context Handling**
The AI MUST calculate future appointments from `meetingDateFormatted`, not the transcript's implicit "today":
```
**Today's Date:** {{ $('Merge Meeting Date').item.json.meetingDateFormatted }}

If today is November 14, 2025, and transcript says "six months" → **May 2026**
```

**B. Medical Jargon Translation (8th-grade reading level)**
```
"Biochemical recurrence" → "The level where doctors start to be concerned"
"Ultrasensitive PSA" → "A very precise test that can detect tiny amounts"
"Within normal limits" → "Your results look good"
```

**C. Metric Contextualization**
Every number requires 4 elements:
1. Current value (with units)
2. Reference range/threshold
3. Trend (vs. previous)
4. Plain-language interpretation

Example:
> "Your PSA is 0.18 (November 2025), stable compared to 0.15 six months ago. The concern threshold is 0.2, so you're comfortably below. This stability 8 years post-surgery is exactly what we want to see."

**D. Slide Structure**
1. **Visit Overview** (~150 words): Date, provider, visit type, key points
2. **Key Numbers** (~200-250 words): Test results with visual zones (🟢🟡🔴)
3. **What Your Doctor Said** (~250-300 words): Assessment, Q&A, implications
4. **Treatment Plan** (~200-250 words): Medications, lifestyle, procedures
5. **What to Watch For** (~200 words): Normal vs. warning signs (🔴🟡)
6. **Action Checklist** (~150-200 words): To-do table with timelines
7. **Understanding Your Condition** (~200-250 words): Education, long-term outlook

**Output:** Markdown text with section breaks (`---`)

**Store AI analysis in S3:**
```javascript
const analysisKey = `users/${userId}/analyses/${appointmentId}_${timestamp}_analysis.json`;
await s3.putObject({
  Bucket: 'patientscribe-production',
  Key: analysisKey,
  Body: JSON.stringify({
    prompt: fullPrompt,
    response: aiGeneratedSummary,
    model: 'gpt-5.1',
    timestamp: new Date().toISOString(),
    wordCount: wordCount,
    metadata: healthcareMetadata
  }),
  ContentType: 'application/json'
});
```

**Store markdown summary:**
```javascript
const markdownKey = `users/${userId}/presentations/markdown/${appointmentId}_${timestamp}_summary.md`;
await s3.putObject({
  Bucket: 'patientscribe-production',
  Key: markdownKey,
  Body: aiGeneratedSummary,
  ContentType: 'text/markdown'
});
```

---

### 5. **Gamma Presentation Generation**

#### Payload Construction
**Theme Selection:** Keyword-based scoring selects from healthcare-appropriate themes:
- `pearl`: Clinical/professional (keywords: diagnosis, surgery, treatment)
- `sage`: Wellness/holistic (keywords: nutrition, lifestyle, preventive)
- `consultant`: Chronic monitoring (keywords: follow-up, monitoring, management)

#### API Request Structure
```json
{
  "inputText": "{{ AI-generated summary }}",
  "textMode": "preserve",
  "format": "presentation",
  "themeId": "consultant",
  "numCards": 7,
  "cardSplit": "inputTextBreaks",
  "exportAs": "pdf",
  "additionalInstructions": "Preserve medical terminology with plain-language explanations...",
  "textOptions": {
    "tone": "professional medical, warm, educational, reassuring",
    "audience": "patient and family members"
  },
  "imageOptions": {
    "source": "aiGenerated",
    "model": "gemini-2.5-flash-image",
    "style": "professional, trustworthy, healthcare, modern medical"
  },
  "cardOptions": {
    "dimensions": "16x9",
    "headerFooter": {
      "bottomLeft": {
        "value": "{{ meetingDate }} | Confidential Medical Record"
      }
    }
  }
}
```

#### Polling Logic
- Check generation status every 15 seconds
- Max retries: 20 (5 minutes timeout)
- Success condition: `status === "completed"`

**After PDF generation, download and store in S3:**
```javascript
const pdfResponse = await fetch(gammaExportUrl);
const pdfBuffer = await pdfResponse.arrayBuffer();

const pdfKey = `users/${userId}/presentations/pdf/${appointmentId}_${timestamp}_presentation.pdf`;
await s3.putObject({
  Bucket: 'patientscribe-production',
  Key: pdfKey,
  Body: pdfBuffer,
  ContentType: 'application/pdf',
  Metadata: {
    'user-id': userId,
    'appointment-id': appointmentId,
    'appointment-date': appointmentDate,
    'provider-name': providerName,
    'specialty': specialty,
    'gamma-url': gammaUrl
  }
});
```

---

### 6. **Email Delivery**

**Recipient:** `lastModifyingUser.emailAddress` from Google Drive trigger (prototype) OR user's registered email (production)
**Subject:** `"Your Medical Visit Summary ({{ meetingDateFormatted }})"`

**Body template:**
```
Your medical visit summary is ready.

**Visit Date:** {{ meetingDateFormatted }}
**Provider:** {{ provider.name }}

**View Online:** {{ gammaUrl }}
**Download PDF:** {{ s3PresignedUrl }}

⚠️ **CONFIDENTIAL MEDICAL RECORD**
This summary contains protected health information (PHI). 
Do not forward without patient authorization.

Questions about your visit? Contact your provider's office directly.
```

**S3 Presigned URL Generation:**
```javascript
const presignedUrl = await s3.getSignedUrlPromise('getObject', {
  Bucket: 'patientscribe-production',
  Key: pdfKey,
  Expires: 604800 // 7 days
});
```

---

## Longitudinal Health Tracking & Vector Database Integration

### Future Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  S3 Storage (Source of Truth)                           │
│  ├── Normalized Transcripts                             │
│  ├── AI Analyses (1200-1500 word summaries)            │
│  └── Metadata (structured healthcare data)              │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ Batch Processing (Lambda/ECS)
                 │ - Chunk documents (512 tokens)
                 │ - Generate embeddings (OpenAI/Cohere)
                 │ - Extract medical entities (NER)
                 ↓
┌─────────────────────────────────────────────────────────┐
│  Vector Database (Pinecone/Weaviate/pgvector)          │
│  ├── Embeddings for semantic search                     │
│  ├── Metadata filters (date, provider, specialty)       │
│  └── Hybrid search (vector + keyword + time-based)      │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ Query Interface (GraphQL/REST)
                 ↓
┌─────────────────────────────────────────────────────────┐
│  Application Features                                   │
│  ├── "Show PSA trends over 5 years"                     │
│  ├── "What did Dr. Saram say about exercise?"          │
│  ├── "Has my blood pressure medication changed?"        │
│  └── "Generate care summary for my daughter"            │
└─────────────────────────────────────────────────────────┘
```

### Vector Database Schema Design

**Document chunking strategy:**
```javascript
// Each visit generates multiple vector DB entries:
{
  id: `${userId}_${appointmentId}_chunk_${chunkIndex}`,
  vector: [0.123, -0.456, ...], // 1536-dim embedding
  metadata: {
    userId: userId,
    appointmentId: appointmentId,
    appointmentDate: '2025-11-12',
    provider: 'Dr. Saram',
    specialty: 'urology',
    appointmentType: 'follow-up-monitoring',
    chunkType: 'key-numbers' | 'assessment' | 'treatment-plan' | 'action-items',
    s3Keys: {
      transcript: 'users/{userId}/transcripts/normalized/...',
      analysis: 'users/{userId}/analyses/...',
      pdf: 'users/{userId}/presentations/pdf/...'
    }
  },
  text: "Your PSA is 0.18 (November 2025), stable compared to 0.15..."
}
```

### Longitudinal Query Examples

**1. Metric Trend Analysis**
```javascript
// User query: "Show my PSA levels over the past 2 years"
const trendQuery = {
  filter: {
    userId: currentUserId,
    specialty: 'urology',
    appointmentDate: { $gte: '2023-11-01' },
    chunkType: 'key-numbers'
  },
  vector: embedQuery("PSA test results prostate specific antigen"),
  topK: 20,
  includeMetadata: true
};

// Post-processing: Extract PSA values, create timeline visualization
const psaTimeline = results.map(r => ({
  date: r.metadata.appointmentDate,
  value: extractPSAValue(r.text), // Regex: /PSA.*?(\d+\.\d+)/
  provider: r.metadata.provider
}));
```

**2. Cross-Provider Knowledge Synthesis**
```javascript
// User query: "What have all my doctors said about my blood pressure?"
const synthesisQuery = {
  filter: {
    userId: currentUserId,
    appointmentDate: { $gte: '2024-01-01' }
  },
  vector: embedQuery("blood pressure hypertension medication management"),
  topK: 50,
  includeMetadata: true
};

// GPT-4 synthesis prompt:
const synthesisPrompt = `
Based on these ${results.length} medical visit excerpts, create a timeline showing:
1. Blood pressure readings over time
2. Changes in medication (additions, dose adjustments, discontinuations)
3. Lifestyle recommendations from different providers
4. Current status and next steps

Present in patient-friendly language, grouped by provider specialty.
`;
```

**3. Family Member Care Summary**
```javascript
// Daughter monitoring elderly father's health
// Query: "Generate a 6-month care summary for my dad's cardiologist appointment"

const familySummaryQuery = {
  filter: {
    userId: fatherUserId,
    sharedWith: daughterFamilyGroupId, // Access control
    appointmentDate: { $gte: sixMonthsAgo }
  },
  vector: embedQuery("medical history summary recent changes medications"),
  topK: 100
};

// Generate comprehensive summary:
// - All appointments (dates, providers, specialties)
// - Medication timeline (what changed, why)
// - Test results trends
// - Action items status (completed vs pending)
// - Warning signs to monitor
```

### S3 → Vector DB ETL Pipeline

**Trigger:** New file uploaded to S3 `analyses/` folder
**Process:**
```javascript
// Lambda function triggered by S3 event
export async function indexNewAnalysis(s3Event) {
  const { bucket, key } = s3Event;
  
  // 1. Download analysis from S3
  const analysis = await s3.getObject({ Bucket: bucket, Key: key }).promise();
  const data = JSON.parse(analysis.Body.toString());
  
  // 2. Parse metadata from S3 object tags
  const metadata = await s3.getObjectTagging({ Bucket: bucket, Key: key }).promise();
  
  // 3. Chunk the 1200-1500 word analysis
  const chunks = chunkBySlideSection(data.response); // Respect --- breaks
  
  // 4. Generate embeddings
  const embeddings = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: chunks.map(c => c.text)
  });
  
  // 5. Upsert to vector DB
  await vectorDB.upsert({
    vectors: chunks.map((chunk, i) => ({
      id: `${metadata.userId}_${metadata.appointmentId}_chunk_${i}`,
      values: embeddings.data[i].embedding,
      metadata: {
        ...metadata,
        chunkType: chunk.slideTitle,
        s3Key: key,
        appointmentDate: metadata.appointmentDate
      }
    }))
  });
  
  // 6. Store medical entities separately (structured search)
  const entities = extractMedicalEntities(data); // NER on medications, labs
  await dynamoDB.putItem({
    TableName: 'MedicalEntities',
    Item: {
      userId: metadata.userId,
      appointmentId: metadata.appointmentId,
      entities: entities, // { medications: [...], labs: [...], conditions: [...] }
      appointmentDate: metadata.appointmentDate
    }
  });
}
```

---

## Mobile App Implementation Roadmap

### Phase 1: Core Recording & Storage
**Priority features:**
1. In-app audio recording with waveform visualization
2. File picker for audio/transcript uploads
3. AWS S3 upload with progress tracking
4. Local caching with encryption (PHI compliance)
5. Upload queue management (retry logic, background uploads)

**React Native libraries:**
- `expo-av` (audio recording)
- `expo-document-picker` (file selection)
- `expo-file-system` (local storage)
- `react-native-encrypted-storage` (secure storage)
- `react-native-aws3` or `aws-sdk-mobile` (S3 uploads)

**AWS Integration:**
```javascript
// Example: Upload audio recording to S3
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import { getSecureItem } from './secureStorage';

async function uploadRecording(audioUri, appointmentMetadata) {
  const credentials = await getSecureItem('awsCredentials');
  
  const s3 = new AWS.S3({
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    region: 'us-east-1'
  });
  
  const fileContent = await FileSystem.readAsStringAsync(audioUri, {
    encoding: FileSystem.EncodingType.Base64
  });
  
  const params = {
    Bucket: 'patientscribe-production',
    Key: `users/${appointmentMetadata.userId}/recordings/raw/${appointmentMetadata.appointmentId}_${Date.now()}.m4a`,
    Body: Buffer.from(fileContent, 'base64'),
    ContentType: 'audio/mp4',
    Metadata: {
      'user-id': appointmentMetadata.userId,
      'appointment-id': appointmentMetadata.appointmentId,
      'appointment-date': appointmentMetadata.date,
      'contains-phi': 'true'
    },
    ServerSideEncryption: 'aws:kms'
  };
  
  return s3.upload(params).promise();
}
```

### Phase 2: API Integration & Orchestration
**Services to implement:**
1. AssemblyAI transcription client
2. OpenRouter GPT-5.1 wrapper
3. Gamma API integration
4. Gmail send via OAuth2
5. S3 lifecycle management (multipart uploads, presigned URLs)

**State management:** React Context or Redux for:
- Recording status
- S3 upload progress
- Transcription polling
- Generation status
- S3 presigned URL caching

### Phase 3: Longitudinal Health Features
**Vector database integration:**
1. Search interface: "Show my PSA trends"
2. Timeline visualizations (React Native Charts)
3. Cross-provider synthesis (GPT-4 powered)
4. Export longitudinal reports (PDF generation)

**Family sharing features:**
1. Family group management (AWS Cognito groups)
2. Readonly S3 access via presigned URLs
3. Notification system (new appointment summaries)
4. Care summary generation for shared appointments

### Phase 4: User Experience Enhancements
1. Onboarding flow (permissions, AWS setup, tutorial)
2. Appointment history with search
3. PDF viewer (react-native-pdf with S3 presigned URLs)
4. Push notifications for completion
5. Settings:
   - Email preferences
   - S3 storage usage/limits
   - Family member access control
   - Data retention policies

### Phase 5: Compliance & Security
**HIPAA considerations:**
- End-to-end encryption for audio files
- AWS KMS for S3 server-side encryption
- Secure API key storage (AWS Secrets Manager + Expo SecureStore)
- User authentication (AWS Cognito with MFA)
- Audit logging (CloudTrail, S3 access logs)
- Data retention policies (S3 lifecycle rules)
- BAA (Business Associate Agreement) with AWS

**AWS S3 Security Configuration:**
```javascript
// Bucket policy: Enforce encryption, restrict public access
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyUnencryptedObjectUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::patientscribe-production/*",
      "Condition": {
        "StringNotEquals": {
          "s3:x-amz-server-side-encryption": "aws:kms"
        }
      }
    },
    {
      "Sid": "RequireSecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::patientscribe-production",
        "arn:aws:s3:::patientscribe-production/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

---

## Environment Variables (Production)

```env
# API Keys (store in AWS Secrets Manager, not in app bundle)
ASSEMBLYAI_API_KEY=<your_key>
OPENROUTER_API_KEY=<your_key>
GAMMA_API_KEY=<your_key>

# AWS Configuration
AWS_REGION=us-east-1
AWS_S3_BUCKET=patientscribe-production
AWS_KMS_KEY_ID=arn:aws:kms:us-east-1:123456789:key/...
AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXX
AWS_COGNITO_CLIENT_ID=<your_client_id>

# OAuth (for Gmail delivery)
GOOGLE_OAUTH_CLIENT_ID=<your_id>
GOOGLE_OAUTH_CLIENT_SECRET=<your_secret>

# Vector Database (future)
PINECONE_API_KEY=<your_key>
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_NAME=patientscribe-embeddings
```

**⚠️ Security:** 
- Use AWS Secrets Manager for API keys
- Use Expo SecureStore for temporary credentials (STS tokens)
- NEVER hardcode credentials in React Native bundle
- Use AWS Cognito Identity Pools for temporary S3 access

---

## AWS Cost Optimization Strategy

### S3 Storage Tiers
```javascript
// Lifecycle policy: Transition old recordings to cheaper storage
{
  "Rules": [
    {
      "Id": "ArchiveOldRecordings",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "STANDARD_IA" // Infrequent Access
        },
        {
          "Days": 365,
          "StorageClass": "GLACIER_INSTANT_RETRIEVAL"
        }
      ],
      "Filter": {
        "Prefix": "users/*/recordings/"
      }
    },
    {
      "Id": "RetainCriticalForever",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "users/*/transcripts/normalized/"
      },
      "Transitions": [
        {
          "Days": 180,
          "StorageClass": "INTELLIGENT_TIERING" // Auto-optimize
        }
      ]
    }
  ]
}
```

### Estimated Monthly Costs (1000 active users, 2 appointments/user/month)

| Service | Usage | Cost/Month |
|---------|-------|------------|
| **S3 Storage** | 50GB (transcripts, analyses, PDFs) | $1.15 |
| **S3 Storage** | 500GB (audio recordings in STANDARD) | $11.50 |
| **S3 Requests** | 2000 PUT, 10K GET | $0.02 |
| **AssemblyAI** | 2000 transcripts × 30 min avg × $0.15/min | $9,000 |
| **OpenRouter (GPT-5.1)** | 2000 analyses × 5K tokens × $0.02/1K | $200 |
| **Gamma API** | 2000 presentations × $0.50/presentation | $1,000 |
| **Data Transfer** | 100GB egress (PDF downloads) | $9.00 |
| **KMS** | 10K requests | $0.30 |
| **CloudWatch Logs** | 10GB | $5.00 |
| **TOTAL (without AI)** | | $26.97 |
| **TOTAL (with AI)** | | **$10,226.97** |

**🔍 Cost Optimization Opportunities:**
1. **Batch transcription:** Group short clips to reduce per-request overhead
2. **Aggressive caching:** Store normalized transcripts, avoid re-transcription
3. **Tiered features:** Free tier (1 appt/month), Premium ($9.99/month for 5 appts)
4. **Shared infrastructure:** Multi-tenant vector DB reduces per-user costs

---

## Testing Strategy

### Unit Tests
- Date extraction regex patterns
- Healthcare keyword validation
- File type detection logic
- Transcript normalization
- S3 key generation (ensure proper path structure)
- Metadata tagging (validate required fields)

### Integration Tests
- AssemblyAI upload → transcription → polling → S3 storage
- AI prompt → summary generation → validation → S3 storage
- Gamma payload → generation → PDF retrieval → S3 storage
- S3 presigned URL generation and expiration
- S3 lifecycle policy application

### End-to-End Tests
- Record 30-second audio → S3 upload → verify email delivery → verify S3 storage
- Upload PDF transcript → verify Gamma output → verify S3 storage
- Upload JSON (Whisper format) → verify normalization → verify S3 storage
- Family member access: verify readonly S3 presigned URL works, write fails
- Longitudinal query: create 5 mock appointments, query "PSA trends", verify correct retrieval

### Security Tests
- Verify S3 encryption at rest (KMS)
- Verify S3 encryption in transit (TLS)
- Verify unauthenticated access denied
- Verify cross-user data isolation (user A cannot access user B's S3 objects)
- Verify presigned URL expiration
- Verify family sharing permissions (readonly vs write)

---

## Known Limitations & Future Enhancements

### Current Limitations
1. **Single-language support:** English only (AssemblyAI supports 100+ languages)
2. **Email-only delivery:** No in-app PDF storage (being addressed with S3)
3. **No real-time transcription:** Batch processing only
4. **Manual appointment date:** Fallback to current date if extraction fails
5. **No longitudinal analytics:** Vector DB not yet implemented

### Planned Enhancements

#### Phase 1 (MVP+):
1. **S3 storage for all assets** ✅ (in progress)
2. **Presigned URL-based PDF access** (eliminate email dependency)
3. **Family member readonly sharing**

#### Phase 2 (Longitudinal Intelligence):
1. **Vector database integration** (Pinecone/Weaviate)
2. **Semantic search:** "What did Dr. Saram say about exercise?"
3. **Trend analysis:** "Show my PSA levels over 3 years" (chart visualization)
4. **Cross-provider synthesis:** "Summarize all medication changes"

#### Phase 3 (Advanced Features):
1. **Speaker diarization display:** "Patient:" vs "Dr. [Name]:" labels
2. **Medical entity highlighting:** Medications, conditions, procedures with interactive tooltips
3. **Custom prompt templates:** User-configurable summary formats
4. **Calendar integration:** Auto-schedule follow-up appointments from action items
5. **Multi-language support:** Spanish, Chinese, etc.
6. **Voice command interface:** "Start recording my doctor's appointment"
7. **Real-time transcription:** Live captions during appointment (AssemblyAI Streaming API)

#### Phase 4 (Clinical Decision Support):
1. **Medication interaction warnings:** Cross-reference new prescriptions with patient history
2. **Guideline adherence checks:** "Patient overdue for colonoscopy" (USPSTF guidelines)
3. **Symptom tracker integration:** Correlate patient-reported symptoms with appointment notes
4. **Care gap identification:** "No blood pressure check in 18 months"

---

## Data Retention & Compliance

### HIPAA-Compliant Data Lifecycle

**User-initiated deletion:**
- Immediate: Remove from vector DB index
- 30 days: Soft delete in S3 (add `x-amz-meta-deleted: true`)
- 90 days: Permanent deletion (S3 lifecycle rule)

**Regulatory requirements:**
- Medical records retention: 7 years (varies by state)
- Audit logs: 6 years (HIPAA)
- Backup retention: 30 days (point-in-time recovery)

**S3 versioning:**
```javascript
// Enable versioning for accidental deletion protection
{
  "VersioningConfiguration": {
    "Status": "Enabled"
  },
  "LifecycleConfiguration": {
    "Rules": [
      {
        "Id": "ExpireOldVersions",
        "NoncurrentVersionExpiration": {
          "NoncurrentDays": 90
        }
      }
    ]
  }
}
```

---
