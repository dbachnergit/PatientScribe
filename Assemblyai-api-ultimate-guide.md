# AssemblyAI API - Ultimate Reference Guide

**Version:** 2024  
**Author:** Comprehensive API Documentation  
**Last Updated:** November 2024

---

## Table of Contents

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Authentication](#authentication)
4. [Base URLs & Regions](#base-urls--regions)
5. [Rate Limits](#rate-limits)
6. [Core Transcription API](#core-transcription-api)
7. [Audio Intelligence Models](#audio-intelligence-models)
8. [LeMUR - Language Model API](#lemur---language-model-api)
9. [Streaming Real-Time Transcription](#streaming-real-time-transcription)
10. [LLM Gateway](#llm-gateway)
11. [Error Handling](#error-handling)
12. [SDK Examples](#sdk-examples)
13. [Best Practices](#best-practices)
14. [Appendices](#appendices)

---

## Introduction

AssemblyAI is a comprehensive Speech AI platform providing:

- **Async Transcription**: Transcribe audio/video files with extensive configuration options
- **Real-Time Streaming**: WebSocket-based live transcription
- **Audio Intelligence**: Speaker diarization, sentiment analysis, entity detection, content moderation, topic detection, auto-chapters, summarization
- **LeMUR**: Large Language Model API for transcript analysis, Q&A, summarization, and custom tasks
- **LLM Gateway**: Unified interface for multiple LLM providers
- **Multi-language Support**: 99 languages with automatic detection

### Key Capabilities

- Transcription accuracy optimized for various domains
- Word-level timestamps and confidence scores
- PII redaction (audio and text)
- Custom vocabulary and spelling
- Webhook notifications
- Subtitle generation (SRT, VTT)
- Paragraph and sentence segmentation

---

## Quick Start

### Basic Transcription Flow

```bash
# 1. Submit audio for transcription
curl -X POST https://api.assemblyai.com/v2/transcript \
  -H "Authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "audio_url": "https://example.com/audio.mp3"
  }'

# Response: {"id": "transcript_id", "status": "queued"}

# 2. Poll for completion
curl https://api.assemblyai.com/v2/transcript/transcript_id \
  -H "Authorization: YOUR_API_KEY"

# When status is "completed", transcript is ready
```

### Transcription States

- **queued**: Submitted and waiting to process
- **processing**: Currently being transcribed
- **completed**: Successfully transcribed
- **error**: Failed (check `error` field)

---

## Authentication

All API requests require an API key in the `Authorization` header.

### Getting Your API Key

1. Sign up at https://www.assemblyai.com
2. Navigate to your dashboard
3. Copy your API key

### Authentication Header

```http
Authorization: YOUR_API_KEY
```

**Important:** Never expose your API key in client-side code. For client applications, generate temporary tokens (see Streaming section).

---

## Base URLs & Regions

### Standard Endpoints

```
US (Primary): https://api.assemblyai.com
EU: https://api.eu.assemblyai.com
```

### Streaming Endpoints

```
Streaming: wss://api.assemblyai.com/v2/realtime/ws
```

### Region Support

| Feature | US Endpoint | EU Endpoint |
|---------|-------------|-------------|
| Async Transcription | ✅ | ✅ |
| LeMUR | ✅ | ✅ |
| Streaming STT | ✅ | ❌ |
| LLM Gateway | ✅ | ✅ |

**Note:** EU endpoint is for data residency compliance. Streaming STT is not available on EU servers.

---

## Rate Limits

### LeMUR API Rate Limits

Rate limits are applied per 60-second window. Exceeding limits returns `429 Too Many Requests`.

**Response Headers:**

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Max requests allowed per window |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Seconds until rate limit resets |

If headers are absent, the endpoint is not rate-limited.

### Increasing Limits

Contact support@assemblyai.com to request rate limit increases.

---

## Core Transcription API

### Create Transcript

**Endpoint:** `POST /v2/transcript`

Submit audio/video for transcription.

#### Request Parameters

```json
{
  "audio_url": "string (required)",
  "audio_start_from": "integer (optional)",
  "audio_end_at": "integer (optional)",
  "language_code": "string (optional)",
  "language_detection": "boolean (optional)",
  "language_confidence_threshold": "number (optional)",
  "speech_model": "string (optional)",
  "punctuate": "boolean (default: true)",
  "format_text": "boolean (default: true)",
  "disfluencies": "boolean (default: false)",
  "multichannel": "boolean (default: false)",
  "webhook_url": "string (optional)",
  "webhook_auth_header_name": "string (optional)",
  "webhook_auth_header_value": "string (optional)",
  
  // Audio Intelligence Features
  "speaker_labels": "boolean (default: false)",
  "speakers_expected": "integer (optional)",
  "content_safety": "boolean (default: false)",
  "content_safety_confidence": "integer (25-100, default: 50)",
  "iab_categories": "boolean (default: false)",
  "auto_chapters": "boolean (default: false)",
  "auto_highlights": "boolean (default: false)",
  "entity_detection": "boolean (default: false)",
  "sentiment_analysis": "boolean (default: false)",
  "summarization": "boolean (default: false)",
  "summary_type": "string (optional)",
  "summary_model": "string (optional)",
  
  // PII Redaction
  "redact_pii": "boolean (default: false)",
  "redact_pii_audio": "boolean (default: false)",
  "redact_pii_audio_quality": "string (mp3|wav)",
  "redact_pii_policies": "array (optional)",
  "redact_pii_sub": "string (entity_type|hash)",
  
  // Customization
  "custom_spelling": "array (optional)",
  "keyterms_prompt": "array (optional)",
  "filter_profanity": "boolean (default: false)",
  "speech_threshold": "number (0-1, optional)",
  
  // Speech Understanding
  "speech_understanding": "object (optional)"
}
```

#### Core Parameters Explained

##### Audio Source

- **audio_url** (required): Public URL to audio/video file or base64-encoded data URI
- **audio_start_from**: Start transcription at this millisecond
- **audio_end_at**: Stop transcription at this millisecond

##### Language Options

- **language_code**: Specify language (e.g., `en_us`, `es`, `fr`, `de`)
  - Default: `en_us` (US English)
  - Supports 99 languages
- **language_detection**: Automatically detect language
- **language_confidence_threshold**: Min confidence for auto-detected language (0-1)

##### Speech Models

- **speech_model**: Choose transcription model
  - `best`: Default, highest accuracy
  - `slam-1`: Contextual model optimized for customization
  - `universal`: Balanced accuracy, latency, and multi-language support

##### Text Formatting

- **punctuate**: Add punctuation automatically
- **format_text**: Format text (numbers, dates, etc.)
- **disfluencies**: Include filler words (um, uh, etc.)
- **multichannel**: Transcribe multiple audio channels separately

##### Webhooks

- **webhook_url**: POST completion notification here
- **webhook_auth_header_name**: Custom auth header name
- **webhook_auth_header_value**: Custom auth header value

#### Example Request

```bash
curl -X POST https://api.assemblyai.com/v2/transcript \
  -H "Authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "audio_url": "https://example.com/meeting.mp3",
    "speaker_labels": true,
    "auto_chapters": true,
    "sentiment_analysis": true,
    "entity_detection": true,
    "language_detection": true
  }'
```

#### Response

```json
{
  "id": "643c2e0d-4e9b-4a1e-8f8c-5d8e6f7a1b2c",
  "status": "queued",
  "audio_url": "https://example.com/meeting.mp3",
  "language_code": null,
  "webhook_url": null
}
```

---

### Get Transcript

**Endpoint:** `GET /v2/transcript/{transcript_id}`

Retrieve transcript details and results.

#### Request

```bash
curl https://api.assemblyai.com/v2/transcript/643c2e0d-4e9b-4a1e-8f8c-5d8e6f7a1b2c \
  -H "Authorization: YOUR_API_KEY"
```

#### Response Fields

```json
{
  "id": "string",
  "status": "completed|error|queued|processing",
  "audio_url": "string",
  "text": "string",
  "words": [
    {
      "text": "string",
      "start": "integer (milliseconds)",
      "end": "integer (milliseconds)",
      "confidence": "number (0-1)",
      "speaker": "string (optional)"
    }
  ],
  "utterances": [
    {
      "confidence": "number",
      "start": "integer",
      "end": "integer",
      "text": "string",
      "words": "array",
      "speaker": "string"
    }
  ],
  "confidence": "number (0-1)",
  "audio_duration": "number (seconds)",
  "language_code": "string",
  "language_confidence": "number",
  
  // Audio Intelligence Results
  "chapters": "array (optional)",
  "sentiment_analysis_results": "array (optional)",
  "entities": "array (optional)",
  "iab_categories_result": "object (optional)",
  "content_safety_labels": "object (optional)",
  "summary": "string (optional)",
  "auto_highlights_result": "object (optional)",
  
  "error": "string (if status=error)"
}
```

---

### Get Sentences

**Endpoint:** `GET /v2/transcript/{transcript_id}/sentences`

Retrieve transcript segmented into sentences.

#### Response

```json
{
  "id": "string",
  "confidence": "number",
  "audio_duration": "number",
  "sentences": [
    {
      "text": "string",
      "start": "integer",
      "end": "integer",
      "confidence": "number",
      "words": "array",
      "speaker": "string (optional)"
    }
  ]
}
```

---

### Get Paragraphs

**Endpoint:** `GET /v2/transcript/{transcript_id}/paragraphs`

Retrieve transcript segmented into paragraphs.

#### Response

```json
{
  "id": "string",
  "confidence": "number",
  "audio_duration": "number",
  "paragraphs": [
    {
      "text": "string",
      "start": "integer",
      "end": "integer",
      "confidence": "number",
      "words": "array"
    }
  ]
}
```

---

### Get Subtitles

**Endpoint:** `GET /v2/transcript/{transcript_id}/subtitles/{format}`

Generate subtitles in SRT or VTT format.

#### Parameters

- **format**: `srt` or `vtt`
- **chars_per_caption** (query param): Max characters per subtitle (default: 32)

#### Example

```bash
curl https://api.assemblyai.com/v2/transcript/transcript_id/srt?chars_per_caption=50 \
  -H "Authorization: YOUR_API_KEY"
```

#### Response (SRT)

```srt
1
00:00:00,100 --> 00:00:02,000
This is the first sentence.

2
00:00:02,100 --> 00:00:05,000
This is the second sentence.
```

---

### Search Words

**Endpoint:** `GET /v2/transcript/{transcript_id}/word-search`

Search for specific words or phrases in transcript.

#### Parameters

- **words** (query): Comma-separated words to search

#### Response

```json
{
  "id": "string",
  "total_count": "integer",
  "matches": [
    {
      "text": "string",
      "count": "integer",
      "timestamps": [[start, end]],
      "indexes": "array"
    }
  ]
}
```

---

### List Transcripts

**Endpoint:** `GET /v2/transcript`

List all transcripts with pagination.

#### Query Parameters

- **limit**: Max results per page (default: 10)
- **status**: Filter by status (completed, queued, processing, error)
- **created_on**: Filter by creation date
- **before_id**: Return transcripts before this ID
- **after_id**: Return transcripts after this ID
- **throttled_only**: Filter throttled transcripts only

#### Response

```json
{
  "page_details": {
    "limit": "integer",
    "result_count": "integer",
    "current_url": "string",
    "prev_url": "string",
    "next_url": "string"
  },
  "transcripts": [
    {
      "id": "string",
      "audio_url": "string",
      "status": "string",
      "created": "string"
    }
  ]
}
```

---

### Delete Transcript

**Endpoint:** `DELETE /v2/transcript/{transcript_id}`

Permanently delete a transcript.

#### Response

Returns the deleted transcript object with `audio_url` and `text` set to "Deleted by user".

---

## Audio Intelligence Models

### Speaker Diarization

Identify "who spoke when" in audio with multiple speakers.

#### Configuration

```json
{
  "speaker_labels": true,
  "speakers_expected": 2  // Optional: hint for number of speakers
}
```

#### Response Format

Utterances include speaker labels:

```json
{
  "utterances": [
    {
      "speaker": "A",
      "text": "Hello, how are you?",
      "start": 100,
      "end": 2000,
      "confidence": 0.95,
      "words": [...]
    },
    {
      "speaker": "B",
      "text": "I'm doing great, thanks!",
      "start": 2100,
      "end": 4000,
      "confidence": 0.97,
      "words": [...]
    }
  ]
}
```

---

### Sentiment Analysis

Detect sentiment (positive, negative, neutral) throughout transcript.

#### Configuration

```json
{
  "sentiment_analysis": true
}
```

#### Response

```json
{
  "sentiment_analysis_results": [
    {
      "text": "I'm really happy with the results!",
      "start": 1000,
      "end": 3000,
      "sentiment": "POSITIVE",
      "confidence": 0.89,
      "speaker": "A"
    },
    {
      "text": "Unfortunately, we missed the deadline.",
      "start": 5000,
      "end": 7000,
      "sentiment": "NEGATIVE",
      "confidence": 0.92,
      "speaker": "B"
    }
  ]
}
```

---

### Entity Detection

Extract named entities (people, organizations, locations, dates, etc.)

#### Configuration

```json
{
  "entity_detection": true
}
```

#### Entity Types

- `person_name`
- `location`
- `organization`
- `date`
- `date_of_birth`
- `phone_number`
- `email_address`
- `occupation`
- `medical_condition`
- `drug`
- `event`
- `filename`
- and more...

#### Response

```json
{
  "entities": [
    {
      "entity_type": "person_name",
      "text": "John Doe",
      "start": 1500,
      "end": 2000
    },
    {
      "entity_type": "organization",
      "text": "Google",
      "start": 5000,
      "end": 5500
    }
  ]
}
```

---

### Content Moderation

Detect sensitive content (profanity, hate speech, violence, etc.)

#### Configuration

```json
{
  "content_safety": true,
  "content_safety_confidence": 75  // 25-100, default: 50
}
```

#### Content Labels

- Hate Speech
- Violence
- Sexual Content
- Profanity
- Drugs
- Gambling

#### Response

```json
{
  "content_safety_labels": {
    "status": "success",
    "results": [
      {
        "text": "offensive content here",
        "labels": [
          {
            "label": "profanity",
            "confidence": 0.92,
            "severity": 0.75
          }
        ],
        "sentences_idx_start": 10,
        "sentences_idx_end": 12,
        "timestamp": {
          "start": 5000,
          "end": 7000
        }
      }
    ],
    "summary": {
      "profanity": 3,
      "hate_speech": 1
    },
    "severity_score_summary": {
      "low": 0.2,
      "medium": 0.5,
      "high": 0.3
    }
  }
}
```

---

### Topic Detection (IAB Categories)

Classify content into IAB (Interactive Advertising Bureau) categories.

#### Configuration

```json
{
  "iab_categories": true
}
```

#### Response

```json
{
  "iab_categories_result": {
    "status": "success",
    "results": [
      {
        "text": "We discussed the new software release...",
        "labels": [
          {
            "relevance": 0.95,
            "label": "Technology>Software"
          },
          {
            "relevance": 0.78,
            "label": "Business>Business Operations"
          }
        ],
        "timestamp": {
          "start": 1000,
          "end": 5000
        }
      }
    ],
    "summary": {
      "Technology>Software": 0.95,
      "Business>Business Operations": 0.78
    }
  }
}
```

---

### Auto Chapters

Automatically segment long audio into chapters with summaries.

#### Configuration

```json
{
  "auto_chapters": true
}
```

#### Response

```json
{
  "chapters": [
    {
      "gist": "Project kickoff discussion",
      "headline": "Introduction and Project Overview",
      "summary": "The team discusses the project timeline, key milestones, and resource allocation for Q1.",
      "start": 0,
      "end": 60000
    },
    {
      "gist": "Technical requirements review",
      "headline": "System Architecture and Technical Stack",
      "summary": "Deep dive into the technical architecture, chosen technologies, and integration points.",
      "start": 60000,
      "end": 180000
    }
  ]
}
```

---

### Key Phrases (Auto Highlights)

Extract important phrases and key points.

#### Configuration

```json
{
  "auto_highlights": true
}
```

#### Response

```json
{
  "auto_highlights_result": {
    "status": "success",
    "results": [
      {
        "count": 5,
        "rank": 0.95,
        "text": "artificial intelligence",
        "timestamps": [
          [1000, 2000],
          [5000, 6000],
          [10000, 11000]
        ]
      }
    ]
  }
}
```

---

### Summarization

Generate summaries of transcripts.

#### Configuration

```json
{
  "summarization": true,
  "summary_type": "bullets",  // bullets, bullets_verbose, gist, headline, paragraph
  "summary_model": "informative"  // informative, conversational, catchy
}
```

#### Summary Types

- **bullets**: Bullet-point summary
- **bullets_verbose**: Detailed bullet points
- **gist**: Very brief one-liner
- **headline**: Title-style summary
- **paragraph**: Prose paragraph

#### Summary Models

- **informative**: Factual, objective
- **conversational**: Natural, friendly tone
- **catchy**: Engaging, memorable

#### Response

```json
{
  "summary": "• Meeting covered Q1 results and exceeded targets by 15%\n• New product launch scheduled for March\n• Team expansion approved for engineering and sales\n• Budget review completed with positive outlook"
}
```

---

### PII Redaction

Redact personally identifiable information from text and/or audio.

#### Configuration

```json
{
  "redact_pii": true,
  "redact_pii_audio": true,
  "redact_pii_audio_quality": "mp3",  // mp3 or wav
  "redact_pii_policies": [
    "us_social_security_number",
    "credit_card_number",
    "phone_number",
    "email_address",
    "person_name",
    "date_of_birth"
  ],
  "redact_pii_sub": "hash"  // entity_type or hash
}
```

#### Available PII Policies

- `account_number`
- `banking_information`
- `blood_type`
- `credit_card_cvv`
- `credit_card_expiration`
- `credit_card_number`
- `date_of_birth`
- `drivers_license`
- `drug`
- `email_address`
- `event`
- `filename`
- `medical_condition`
- `organization`
- `person_age`
- `person_name`
- `phone_number`
- `political_affiliation`
- `us_social_security_number`

#### Substitution Methods

- **entity_type**: Replace with `[ENTITY_TYPE]` (e.g., `[PHONE_NUMBER]`)
- **hash**: Replace with hash value (e.g., `[hash_12345]`)

#### Response

```json
{
  "text": "My name is [PERSON_NAME] and my phone is [PHONE_NUMBER].",
  "redacted_audio_url": "https://example.com/redacted_audio.mp3"
}
```

---

### Custom Vocabulary

Customize spelling and formatting of specific words.

#### Configuration

```json
{
  "custom_spelling": [
    {
      "from": ["AssemblyAI", "assembly AI"],
      "to": "AssemblyAI"
    },
    {
      "from": ["covid", "COVID"],
      "to": "COVID-19"
    }
  ]
}
```

---

### Key Terms Boost

Improve accuracy for domain-specific terminology.

#### Configuration

```json
{
  "keyterms_prompt": [
    "kubernetes",
    "microservices architecture",
    "continuous integration",
    "DevOps pipeline"
  ]
}
```

**Limits:**
- Universal model: 200 phrases
- Slam-1 model: 1000 phrases
- Max 6 words per phrase

---

### Speech Threshold

Reject audio files with insufficient speech content.

#### Configuration

```json
{
  "speech_threshold": 0.3  // Reject if less than 30% speech
}
```

Value range: 0.0 to 1.0

---

## LeMUR - Language Model API

LeMUR (Large Language Model Utterance Refinement) applies LLMs directly to transcripts for advanced analysis.

### Supported Models

- `anthropic/claude-sonnet-4-20250514` (default)
- `anthropic/claude-opus-4-20250514`
- `anthropic/claude-3-7-sonnet-20250219`
- `anthropic/claude-3-5-sonnet`
- `anthropic/claude-3-5-haiku-20241022`
- `anthropic/claude-3-opus`
- `anthropic/claude-3-haiku`

---

### LeMUR Task

**Endpoint:** `POST /lemur/v3/generate/task`

Run custom prompts against transcripts.

#### Request

```json
{
  "transcript_ids": ["transcript_id_1", "transcript_id_2"],
  "prompt": "Analyze this meeting and identify action items with owners and deadlines.",
  "final_model": "anthropic/claude-sonnet-4-20250514",
  "max_output_size": 4000,
  "temperature": 0.7
}
```

#### Alternative: Direct Text Input

```json
{
  "input_text": "Full transcript text here...",
  "prompt": "Your task here...",
  "final_model": "anthropic/claude-sonnet-4-20250514"
}
```

#### Response

```json
{
  "request_id": "uuid",
  "response": "Action items:\n1. John to finalize budget by Friday...",
  "usage": {
    "input_tokens": 1500,
    "output_tokens": 250
  }
}
```

---

### LeMUR Summary

**Endpoint:** `POST /lemur/v3/generate/summary`

Generate summaries with custom parameters.

#### Request

```json
{
  "transcript_ids": ["transcript_id"],
  "context": "This is a technical discussion between engineers.",
  "answer_format": "one detailed paragraph"
}
```

---

### LeMUR Question & Answer

**Endpoint:** `POST /lemur/v3/generate/question-answer`

Ask specific questions about transcripts.

#### Request

```json
{
  "transcript_ids": ["transcript_id"],
  "questions": [
    {
      "question": "What were the main challenges discussed?",
      "answer_format": "bullet points"
    },
    {
      "question": "Who is responsible for the budget review?",
      "answer_format": "short sentence",
      "context": "Focus on action items section"
    }
  ],
  "final_model": "anthropic/claude-sonnet-4-20250514"
}
```

#### Response

```json
{
  "request_id": "uuid",
  "response": [
    {
      "question": "What were the main challenges discussed?",
      "answer": "• Resource constraints\n• Timeline pressures\n• Technical debt management"
    },
    {
      "question": "Who is responsible for the budget review?",
      "answer": "Sarah from finance is responsible for completing the budget review."
    }
  ],
  "usage": {
    "input_tokens": 2000,
    "output_tokens": 150
  }
}
```

---

### LeMUR Action Items

**Endpoint:** `POST /lemur/v3/generate/action-items`

Extract action items from meetings.

#### Request

```json
{
  "transcript_ids": ["transcript_id"],
  "context": "Weekly team standup meeting"
}
```

#### Response

```json
{
  "request_id": "uuid",
  "response": "Action Items:\n1. John: Complete API documentation by Friday\n2. Sarah: Review pull requests\n3. Team: Prepare Q1 presentation for stakeholders",
  "usage": {
    "input_tokens": 1800,
    "output_tokens": 100
  }
}
```

---

### LeMUR Context & Follow-up

LeMUR has no memory between requests. For follow-up questions, include previous responses as context:

```python
# First request
result1 = lemur.task(prompt="What were the key topics?")

# Follow-up with context
context = result1.response
result2 = lemur.task(
    prompt=f"Based on the previous analysis: {context}\n\nWhat are the risks?",
    transcript_ids=["id"]
)
```

---

### Purge LeMUR Request Data

**Endpoint:** `DELETE /lemur/v3/purge-request-data/{request_id}`

Delete LeMUR request data for privacy compliance.

#### Response

```json
{
  "deleted": true
}
```

---

## Streaming Real-Time Transcription

Real-time transcription via WebSocket connection.

### Architecture

1. Generate temporary token (server-side)
2. Establish WebSocket connection
3. Stream audio data
4. Receive real-time transcripts
5. Close connection

---

### Generate Temporary Token

**Endpoint:** `POST /v3/token`

**IMPORTANT:** Only call this from your server. Never expose your API key to clients.

#### Request

```bash
curl -X POST https://api.assemblyai.com/v3/token \
  -H "Authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "expires_in_seconds": 3600,
    "max_session_duration_seconds": 3600
  }'
```

#### Parameters

- **expires_in_seconds**: Token expiration (1-600 seconds)
- **max_session_duration_seconds**: Max session length (60-10800 seconds, default: 10800)

#### Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in_seconds": 3600
}
```

---

### WebSocket Connection

**Endpoint:** `wss://api.assemblyai.com/v2/realtime/ws`

#### Connection Parameters

```json
{
  "token": "temporary_token_from_server",
  "sample_rate": 16000,
  "encoding": "pcm_s16le",
  "word_boost": ["custom", "words"]
}
```

#### Audio Format Requirements

- **Sample Rate**: 8000, 16000, 22050, 24000, 32000, 44100, 48000 Hz
- **Encoding**: `pcm_s16le`, `pcm_mulaw`
- **Channels**: Mono (1 channel)
- **Bit Depth**: 16-bit (for PCM)

---

### WebSocket Messages

#### Session Begins

Server sends when connection established:

```json
{
  "message_type": "SessionBegins",
  "session_id": "session_uuid",
  "expires_at": "2024-03-20T12:00:00Z"
}
```

#### Partial Transcript

Real-time partial results:

```json
{
  "message_type": "PartialTranscript",
  "text": "Hello, this is",
  "created": "2024-03-20T12:00:00.123Z",
  "audio_start": 0,
  "audio_end": 1500
}
```

#### Final Transcript

Complete sentence/phrase:

```json
{
  "message_type": "FinalTranscript",
  "text": "Hello, this is a complete sentence.",
  "confidence": 0.95,
  "created": "2024-03-20T12:00:00.456Z",
  "audio_start": 0,
  "audio_end": 3500,
  "words": [
    {
      "text": "Hello",
      "start": 0,
      "end": 500,
      "confidence": 0.97
    }
  ]
}
```

#### Send Audio

Client sends binary audio data:

```json
{
  "audio_data": "base64_encoded_audio"
}
```

Or send raw PCM bytes directly.

#### Terminate Session

Client sends to end session:

```json
{
  "terminate_session": true
}
```

---

### Streaming Example (JavaScript)

```javascript
const WebSocket = require('ws');

// Get token from your server
const token = await getTemporaryToken();

const ws = new WebSocket(
  `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
);

ws.on('open', () => {
  console.log('Connected to AssemblyAI');
  
  // Start sending audio data
  sendAudioData(ws);
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  
  switch(message.message_type) {
    case 'SessionBegins':
      console.log('Session started:', message.session_id);
      break;
      
    case 'PartialTranscript':
      console.log('Partial:', message.text);
      break;
      
    case 'FinalTranscript':
      console.log('Final:', message.text);
      break;
  }
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.on('close', () => {
  console.log('Connection closed');
});
```

---

## LLM Gateway

Unified API for multiple LLM providers with OpenAI-compatible interface.

**Endpoint:** `POST /v1/chat/completions`

### Supported Providers

- Anthropic (Claude)
- OpenAI (GPT)
- Google (Gemini)
- And more...

### Request

```bash
curl -X POST https://llm-gateway.assemblyai.com/v1/chat/completions \
  -H "Authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-4-20250514",
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum computing in simple terms"
      }
    ],
    "max_tokens": 500,
    "temperature": 0.7
  }'
```

### Parameters

- **model**: Model identifier (required)
- **messages**: Conversation history (required)
- **max_tokens**: Max response length
- **temperature**: Creativity (0-2)
- **tools**: Function calling tools
- **tool_choice**: Control tool usage

### Response

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Quantum computing is..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 120,
    "total_tokens": 135
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Verify API key |
| 404 | Not Found | Check transcript ID |
| 429 | Rate Limited | Implement exponential backoff |
| 500 | Server Error | Retry with backoff |
| 503 | Service Unavailable | Retry later |
| 504 | Gateway Timeout | Retry request |

### Error Response Format

```json
{
  "error": "Detailed error message"
}
```

### Retry Strategy

```python
import time

def transcribe_with_retry(audio_url, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = create_transcript(audio_url)
            return response
        except RateLimitError:
            if attempt < max_retries - 1:
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                time.sleep(wait_time)
            else:
                raise
```

---

## SDK Examples

### Python SDK

#### Installation

```bash
pip install assemblyai
```

#### Basic Transcription

```python
import assemblyai as aai

aai.settings.api_key = "YOUR_API_KEY"

transcriber = aai.Transcriber()

# From URL
transcript = transcriber.transcribe("https://example.com/audio.mp3")

# From local file
transcript = transcriber.transcribe("./local_audio.mp3")

# With options
config = aai.TranscriptionConfig(
    speaker_labels=True,
    auto_chapters=True,
    entity_detection=True
)
transcript = transcriber.transcribe("audio.mp3", config=config)

print(transcript.text)
```

#### Async Transcription

```python
# Submit without waiting
transcript = transcriber.submit("audio.mp3")
print(transcript.id)

# Poll later
while transcript.status not in ['completed', 'error']:
    transcript = transcriber.get_by_id(transcript.id)
    time.sleep(5)
```

#### Real-Time Streaming

```python
def on_data(transcript: aai.RealtimeTranscript):
    if isinstance(transcript, aai.RealtimeFinalTranscript):
        print(transcript.text)

transcriber = aai.RealtimeTranscriber(
    sample_rate=16000,
    on_data=on_data
)

transcriber.connect()
transcriber.stream(audio_stream)
transcriber.close()
```

#### LeMUR

```python
# Task
result = transcript.lemur.task(
    "Summarize this meeting and extract action items",
    final_model=aai.LemurModel.claude_sonnet_4
)
print(result.response)

# Question & Answer
questions = [
    aai.LemurQuestion(
        question="What were the main topics?",
        answer_format="bullet points"
    )
]
result = transcript.lemur.question(questions)
print(result.response)

# Action Items
result = transcript.lemur.action_items()
print(result.response)

# Summary
result = transcript.lemur.summary(
    answer_format="one paragraph"
)
print(result.response)
```

---

### Node.js SDK

#### Installation

```bash
npm install assemblyai
```

#### Basic Transcription

```javascript
const { AssemblyAI } = require('assemblyai');

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY
});

// Transcribe from URL
const transcript = await client.transcripts.transcribe({
  audio: 'https://example.com/audio.mp3'
});

// Transcribe local file
const transcript = await client.transcripts.transcribe({
  audio: './audio.mp3'
});

// With options
const transcript = await client.transcripts.transcribe({
  audio: 'audio.mp3',
  speaker_labels: true,
  auto_chapters: true,
  entity_detection: true
});

console.log(transcript.text);
```

#### Async Transcription

```javascript
// Submit
const transcript = await client.transcripts.submit({
  audio: 'audio.mp3'
});

// Wait for completion
const completed = await client.transcripts.waitUntilReady(
  transcript.id,
  { pollingInterval: 3000 }
);
```

#### Real-Time Streaming

```javascript
const rt = client.streaming.transcriber();

rt.on('open', ({ sessionId }) => {
  console.log('Session:', sessionId);
});

rt.on('transcript', (transcript) => {
  console.log(transcript.text);
});

await rt.connect();

// Stream audio
audioStream.pipeTo(rt.stream());

// Or send chunks
rt.sendAudio(audioChunk);

await rt.close();
```

#### LeMUR

```javascript
// Task
const result = await transcript.lemur.task({
  prompt: 'Extract action items',
  final_model: 'anthropic/claude-sonnet-4-20250514'
});
console.log(result.response);

// Question & Answer
const questions = [
  {
    question: 'What were the key decisions?',
    answer_format: 'bullet points'
  }
];
const result = await transcript.lemur.questionAnswer({ questions });
console.log(result.response);
```

---

## Medical Transcription & Healthcare Applications

### Overview

AssemblyAI provides **purpose-built capabilities for medical transcription** with HIPAA compliance, specialized medical terminology recognition, and clinical documentation workflows.

### Why AssemblyAI for Healthcare

**Key Advantages:**
- **66% reduction in missed medical entities** vs traditional speech recognition
- **2.9% speaker diarization error rate** for accurate provider/patient separation
- **HIPAA compliant** with Business Associate Agreement (BAA) available
- **Slam-1 model** specifically trained on medical terminology
- **Unified platform** for transcription, PII redaction, and clinical note generation

---

### HIPAA Compliance & Security

#### Certifications & Agreements

- **HIPAA Compliant Infrastructure**
- **Business Associate Agreement (BAA)** available
- **Data Processing Agreement (DPA)** for EU healthcare
- **SOC 2 Type II** certified
- **Encryption** in transit and at rest
- **No training** on customer PHI data

#### Data Handling

- Configurable data retention policies
- Automatic deletion schedules
- Audit logging for compliance
- Regional data residency options (US, EU)

---

### Slam-1 Medical Model

#### Specialized Medical Accuracy

The **Slam-1** model is optimized for healthcare:

```json
{
  "audio_url": "patient_encounter.mp3",
  "speech_model": "slam-1",
  "speaker_labels": true,
  "entity_detection": true
}
```

**Medical Terminology Coverage:**
- Drug names (brand and generic)
- Medical procedures and surgeries
- Diagnoses and conditions
- Anatomical terms
- Lab tests and values
- Medical abbreviations
- Specialty-specific vocabulary

#### Custom Medical Vocabulary

Boost accuracy with patient context:

```json
{
  "speech_model": "slam-1",
  "keyterms_prompt": [
    "hypertension",
    "metformin",
    "coronary artery disease",
    "echocardiogram",
    "Type 2 diabetes mellitus",
    "hemoglobin A1C",
    "lisinopril 10mg",
    "patient name: John Smith"
  ]
}
```

**Limits:**
- Slam-1: Up to **1000 medical terms**
- Universal: Up to 200 terms
- Max 6 words per phrase

---

### Speaker Diarization for Clinical Settings

#### Provider vs Patient Separation

**2.9% speaker error rate** - industry-leading accuracy

```json
{
  "speaker_labels": true,
  "speakers_expected": 2
}
```

#### Multi-Speaker Scenarios

- Doctor + Patient
- Doctor + Patient + Family member
- Multi-provider consultations
- Interdisciplinary rounds

#### Response Format

```json
{
  "utterances": [
    {
      "speaker": "A",
      "text": "How long have you been experiencing chest pain?",
      "start": 1000,
      "end": 3000
    },
    {
      "speaker": "B", 
      "text": "It started about three days ago, mostly when climbing stairs.",
      "start": 3200,
      "end": 6500
    }
  ]
}
```

---

### Medical Entity Detection

#### Specialized Healthcare Entities

```json
{
  "entity_detection": true
}
```

**Detected Entity Types:**

| Entity Type | Examples |
|-------------|----------|
| `medical_condition` | diabetes, hypertension, pneumonia |
| `drug` | metformin, lisinopril, amoxicillin |
| `medical_process` | echocardiogram, MRI, appendectomy |
| `injury` | fracture, laceration, contusion |
| `blood_type` | O positive, AB negative |
| `medical_device` | pacemaker, insulin pump, stent |
| `body_part` | heart, lung, femur |

**Example Response:**

```json
{
  "entities": [
    {
      "entity_type": "medical_condition",
      "text": "Type 2 diabetes",
      "start": 5000,
      "end": 6500
    },
    {
      "entity_type": "drug",
      "text": "metformin 500mg",
      "start": 8000,
      "end": 9200
    },
    {
      "entity_type": "medical_process",
      "text": "hemoglobin A1C test",
      "start": 12000,
      "end": 14000
    }
  ]
}
```

---

### Medical PII Redaction

#### HIPAA-Compliant De-identification

**Text Redaction:**

```json
{
  "redact_pii": true,
  "redact_pii_policies": [
    "person_name",
    "date_of_birth",
    "medical_condition",
    "drug",
    "phone_number",
    "email_address",
    "us_social_security_number",
    "medical_process",
    "blood_type",
    "date"
  ],
  "redact_pii_sub": "entity_type"
}
```

**Audio Redaction:**

```json
{
  "redact_pii_audio": true,
  "redact_pii_audio_quality": "mp3"
}
```

Critical for:
- Research de-identification
- Training materials
- Quality assurance recordings
- Compliance with 18 HIPAA identifiers

#### Example Output

**Original:**
> "Patient John Smith, DOB 3/15/1965, presents with chest pain. He takes metformin for diabetes."

**Redacted:**
> "Patient [PERSON_NAME], DOB [DATE_OF_BIRTH], presents with [MEDICAL_CONDITION]. He takes [DRUG] for [MEDICAL_CONDITION]."

---

### Clinical Documentation with LeMUR

#### SOAP Note Generation

```python
import assemblyai as aai

# Transcribe patient encounter
transcript = transcriber.transcribe("patient_visit.mp3")

# Generate SOAP note
soap_note = transcript.lemur.task(
    prompt="""
    Convert this patient encounter transcript into a structured SOAP note:
    
    SUBJECTIVE:
    - Chief complaint
    - History of present illness
    - Past medical history
    - Medications
    - Allergies
    - Social history
    - Review of systems
    
    OBJECTIVE:
    - Vital signs
    - Physical examination findings
    
    ASSESSMENT:
    - Primary diagnosis with ICD-10 code
    - Differential diagnoses
    
    PLAN:
    - Medications prescribed
    - Orders/referrals
    - Patient education
    - Follow-up
    
    Use standard clinical documentation format.
    """,
    final_model=aai.LemurModel.claude_sonnet_4
)

print(soap_note.response)
```

#### Other Clinical Note Types

**History & Physical (H&P):**
```python
hp_note = transcript.lemur.task(
    prompt="Generate admission H&P note with complete ROS and physical exam"
)
```

**Progress Note:**
```python
progress = transcript.lemur.task(
    prompt="Create daily progress note in hospital format"
)
```

**Discharge Summary:**
```python
discharge = transcript.lemur.task(
    prompt="Generate discharge summary with hospital course and discharge instructions"
)
```

**Procedure Note:**
```python
procedure = transcript.lemur.task(
    prompt="Document procedure note with indication, technique, findings, and complications"
)
```

---

### Medical Scribe Implementation

#### Pre-recorded (Post-Visit)

**Best for:** After-visit documentation, highest accuracy

```python
import assemblyai as aai

aai.settings.api_key = "YOUR_API_KEY"

# Configure for medical transcription
config = aai.TranscriptionConfig(
    speech_model=aai.SpeechModel.slam_1,
    speaker_labels=True,
    speakers_expected=2,
    entity_detection=True,
    redact_pii=True,
    keyterms_prompt=[
        "patient medications",
        "chronic conditions",
        "recent lab results"
    ]
)

# Transcribe
transcript = aai.Transcriber().transcribe(
    "patient_encounter.mp3",
    config=config
)

# Generate clinical note
clinical_note = transcript.lemur.task(
    prompt="Generate complete SOAP note from this encounter",
    context="Patient is established with history of HTN and T2DM"
)
```

#### Real-Time (Live Encounter)

**Best for:** During-visit documentation, ~300ms latency

```python
import assemblyai as aai

def on_final_transcript(transcript: aai.RealtimeFinalTranscript):
    """Process completed utterances in real-time"""
    speaker = transcript.speaker
    text = transcript.text
    
    # Route to appropriate section
    if speaker == "provider":
        add_to_clinical_note(text, section="provider")
    else:
        add_to_clinical_note(text, section="patient")

# Configure real-time transcriber
transcriber = aai.RealtimeTranscriber(
    sample_rate=16000,
    on_data=on_final_transcript,
    speaker_labels=True,
    keyterms_prompt=["diabetes", "metformin", "A1C"]
)

# Start streaming
transcriber.connect()
stream_microphone_audio(transcriber)
transcriber.close()

# Post-process into structured note
final_note = generate_soap_note(accumulated_transcript)
```

---

### Multi-Transcript Clinical Intelligence

#### Query Across Patient Encounters

**LeMUR can analyze multiple transcripts simultaneously:**

```python
# Transcribe multiple patient encounters
encounter_ids = [
    "patient1_morning.mp3",
    "patient2_morning.mp3",
    "patient3_morning.mp3",
    # ... up to entire day
]

transcript_ids = [transcribe(audio) for audio in encounter_ids]

# Run clinical surveillance queries
result = aai.Lemur().task(
    transcript_ids=transcript_ids,
    prompt="""
    Across all patient encounters today:
    
    1. Which patients reported chest pain or shortness of breath?
    2. List all new medication prescriptions
    3. Identify patients with uncontrolled blood pressure (>140/90)
    4. Flag any medication allergy concerns
    5. Extract all follow-up appointments scheduled
    
    Format as structured list with patient identifiers.
    """
)
```

**Use Cases:**
- **Clinical surveillance**: Identify high-risk symptoms across patient panel
- **Quality assurance**: Flag documentation gaps or compliance issues
- **Population health**: Track chronic disease management across cohort
- **Care coordination**: Identify patients needing follow-up or referrals
- **Risk stratification**: Extract factors for risk scoring models

---

### Use Case Examples

#### 1. Telemedicine Documentation

```json
{
  "audio_url": "telemedicine_visit.mp4",
  "speech_model": "slam-1",
  "speaker_labels": true,
  "entity_detection": true,
  "summarization": true,
  "summary_type": "bullets",
  "webhook_url": "https://ehr.example.com/webhook"
}
```

**Workflow:**
1. Record virtual consultation
2. Transcribe with speaker separation
3. Extract medical entities
4. Generate visit summary
5. Push to EHR via webhook

#### 2. Medical Research Interviews

```json
{
  "audio_url": "research_interview.mp3",
  "speech_model": "slam-1",
  "redact_pii": true,
  "redact_pii_audio": true,
  "redact_pii_policies": [
    "person_name",
    "date_of_birth",
    "phone_number",
    "email_address",
    "medical_condition"
  ],
  "sentiment_analysis": true
}
```

**De-identified output** for IRB compliance

#### 3. Clinical Education

```json
{
  "audio_url": "grand_rounds.mp3",
  "speech_model": "slam-1",
  "auto_chapters": true,
  "entity_detection": true,
  "iab_categories": true
}
```

**Features:**
- Automatic chapter segmentation
- Medical entity extraction
- Topic categorization
- Searchable transcript library

#### 4. Medical Device Voice Control

```python
# Real-time voice commands in surgical environment
transcriber = aai.RealtimeTranscriber(
    sample_rate=16000,
    on_data=process_command,
    keyterms_prompt=[
        "laser on",
        "laser off",
        "increase power",
        "decrease power",
        "zoom in",
        "zoom out"
    ]
)
```

**Benefits:**
- Hands-free operation
- Sterile field maintenance
- Real-time command recognition

---

### EHR Integration Patterns

#### Webhook-Based Integration

```python
# AssemblyAI configuration
{
  "audio_url": "encounter.mp3",
  "webhook_url": "https://your-server.com/ehr-webhook",
  "webhook_auth_header_name": "X-EHR-Secret",
  "webhook_auth_header_value": "your_secret"
}
```

**Server endpoint:**
```python
from flask import Flask, request
import ehr_system

@app.route('/ehr-webhook', methods=['POST'])
def handle_transcript():
    data = request.json
    
    if data['status'] == 'completed':
        # Fetch full transcript
        transcript = get_transcript(data['transcript_id'])
        
        # Generate clinical note via LeMUR
        soap_note = generate_soap_note(transcript)
        
        # Push to EHR
        ehr_system.create_note(
            patient_id=data['patient_id'],
            note_type='SOAP',
            content=soap_note
        )
    
    return 'OK', 200
```

#### FHIR-Compatible Output

Use LeMUR to format as FHIR resources:

```python
fhir_note = transcript.lemur.task(
    prompt="""
    Convert this encounter into FHIR DocumentReference resource:
    - resourceType: DocumentReference
    - status: current
    - type: Progress note
    - subject: Patient reference
    - content: attachment with encounter text
    
    Output valid FHIR R4 JSON.
    """
)
```

---

### Performance Benchmarks

| Metric | Value |
|--------|-------|
| Speaker Diarization Error | 2.9% |
| Medical Entity Recall | 66% better than competitors |
| Real-time Latency | ~300ms |
| Supported Languages | 99+ |
| Max Audio Duration | No limit (tested 24+ hours) |
| HIPAA Compliance | ✅ with BAA |

---

### Medical Transcription Best Practices

#### 1. Audio Quality in Clinical Settings

**Challenges:**
- Background noise (equipment, hallway traffic)
- Multiple speakers
- Varying distances from microphone

**Solutions:**
- Use directional microphones
- Close-mic placement (lapel or desktop)
- Noise-canceling technology
- 16kHz+ sample rate

#### 2. Contextual Priming

Always provide medical context:

```json
{
  "keyterms_prompt": [
    "patient name",
    "chronic conditions",
    "current medications",
    "recent procedures",
    "specialty-specific terms"
  ]
}
```

#### 3. Speaker Attribution

```json
{
  "speaker_labels": true,
  "speakers_expected": 2  // Always specify if known
}
```

Then use LeMUR for semantic labeling:

```python
result = transcript.lemur.task(
    prompt="Label Speaker A as 'Provider' and Speaker B as 'Patient' throughout"
)
```

#### 4. PII Handling Strategy

**During transcription:**
- Enable basic PII redaction
- Keep medical entities unredacted

**Post-processing:**
- Apply additional de-identification via LeMUR
- Generate separate redacted versions for different use cases

#### 5. Clinical Note Generation

**Multi-stage approach:**

1. **Transcribe** with medical configuration
2. **Extract** entities and structure
3. **Generate** clinical note via LeMUR
4. **Validate** using secondary LLM pass
5. **Format** for EHR integration

---

### Compliance Considerations

#### HIPAA Minimum Necessary Rule

Only transcribe/store what's required:
- Use audio trimming (`audio_start_from`, `audio_end_at`)
- Delete transcripts after EHR integration
- Redact unnecessary PHI

#### Audit Logging

Track all access to medical transcripts:
- API call logging
- Transcript retrieval events
- LeMUR processing requests
- Deletion confirmations

#### Data Retention

```python
# Example: Auto-delete after 90 days
schedule_deletion(
    transcript_id=transcript.id,
    days=90
)
```

---

### Cost Optimization for Medical Use

**Strategies:**
1. **Batch processing**: Submit multiple encounters together
2. **Smart audio trimming**: Only transcribe clinical portions
3. **Selective features**: Enable only needed audio intelligence
4. **LeMUR optimization**: Use specific prompts, set `max_output_size`
5. **Caching**: Store commonly used templates and contexts

---

### Troubleshooting Medical Transcription

#### Low Accuracy on Medical Terms

**Solutions:**
- Switch to Slam-1 model
- Add terms to `keyterms_prompt`
- Increase audio quality
- Check speaker separation

#### Speaker Attribution Errors

**Solutions:**
- Provide `speakers_expected`
- Use consistent mic positioning
- Increase speaker turn clarity
- Post-process with LeMUR semantic labeling

#### PII Not Fully Redacted

**Solutions:**
- Enable comprehensive `redact_pii_policies`
- Use LeMUR for additional de-identification pass
- Validate output against 18 HIPAA identifiers

#### Integration Issues

**Solutions:**
- Use webhooks for async workflows
- Implement retry logic with exponential backoff
- Validate JSON before EHR submission
- Monitor webhook delivery status

---

## Best Practices

### 1. Audio Quality

**Optimal Settings:**
- Sample Rate: 16kHz or higher
- Bit Depth: 16-bit minimum
- Format: WAV, FLAC (lossless) > MP3 > compressed formats
- Clear audio with minimal background noise

**Pre-processing:**
- Remove silence at start/end
- Normalize audio levels
- Reduce background noise
- Use appropriate mic positioning

---

### 2. Language Detection

Use automatic language detection when language is unknown:

```json
{
  "language_detection": true,
  "language_confidence_threshold": 0.7
}
```

Or specify language for better accuracy:

```json
{
  "language_code": "en_us"
}
```

---

### 3. Custom Vocabulary

Always use custom spelling for:
- Brand names
- Product names
- Technical terminology
- Acronyms
- Industry jargon

```json
{
  "custom_spelling": [
    {"from": ["assembly AI"], "to": "AssemblyAI"}
  ],
  "keyterms_prompt": ["kubernetes", "microservices"]
}
```

---

### 4. Webhooks for Long Audio

For files >10 minutes, use webhooks instead of polling:

```json
{
  "webhook_url": "https://your-server.com/webhook",
  "webhook_auth_header_name": "X-Webhook-Secret",
  "webhook_auth_header_value": "your_secret_here"
}
```

---

### 5. Cost Optimization

**Audio Intelligence Models:**
- Only enable features you need
- Each feature adds processing time and cost
- Combine related features in single request

**LeMUR:**
- Use specific prompts
- Set appropriate `max_output_size`
- Consider caching results for repeated queries

---

### 6. Error Handling

Always implement:
- Exponential backoff for rate limits
- Retry logic for 5xx errors
- Validation before submission
- Timeout handling for long-running jobs

---

### 7. Security

**API Keys:**
- Never expose in client code
- Use environment variables
- Rotate regularly
- Use temporary tokens for streaming

**Data Privacy:**
- Enable PII redaction when needed
- Delete transcripts when no longer needed
- Purge LeMUR request data for compliance

---

### 8. LeMUR Prompting

**Effective Prompts:**
- Be specific and clear
- Provide context
- Specify output format
- Include examples if needed

**Example:**
```
Analyze this meeting transcript and:
1. List all action items with owner names
2. Identify unresolved issues
3. Extract key decisions made
Format as numbered lists with clear headers.
```

---

## Appendices

### A. Supported Languages

AssemblyAI supports 99 languages including:

- English (en, en_us, en_uk, en_au)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Dutch (nl)
- Polish (pl)
- Russian (ru)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)
- Arabic (ar)
- Hindi (hi)
- And 85+ more...

Use automatic language detection or specify language code.

---

### B. Pagination Pattern

All list endpoints use consistent pagination:

```json
{
  "page_details": {
    "limit": 10,
    "result_count": 100,
    "current_url": "...",
    "prev_url": "...",
    "next_url": "..."
  },
  "transcripts": [...]
}
```

Navigate using `prev_url` and `next_url`.

---

### C. Transcript Object Schema

Complete transcript response structure:

```json
{
  "id": "uuid",
  "status": "completed|queued|processing|error",
  "language_code": "string",
  "audio_url": "string",
  "text": "string",
  "words": "array",
  "utterances": "array",
  "confidence": "number",
  "audio_duration": "number",
  "punctuate": "boolean",
  "format_text": "boolean",
  "disfluencies": "boolean",
  "multichannel": "boolean",
  "webhook_url": "string",
  "webhook_status_code": "number",
  "webhook_auth": "boolean",
  "audio_start_from": "number",
  "audio_end_at": "number",
  "word_boost": "array",
  "boost_param": "string",
  "filter_profanity": "boolean",
  "redact_pii": "boolean",
  "redact_pii_audio": "boolean",
  "redact_pii_audio_quality": "string",
  "redact_pii_policies": "array",
  "redact_pii_sub": "string",
  "speaker_labels": "boolean",
  "speakers_expected": "number",
  "content_safety_labels": "object",
  "iab_categories": "boolean",
  "iab_categories_result": "object",
  "language_detection": "boolean",
  "language_confidence": "number",
  "custom_spelling": "array",
  "auto_chapters": "boolean",
  "chapters": "array",
  "summarization": "boolean",
  "summary_type": "string",
  "summary_model": "string",
  "summary": "string",
  "custom_topics": "boolean",
  "topics": "array",
  "speech_threshold": "number",
  "auto_highlights": "boolean",
  "auto_highlights_result": "object",
  "sentiment_analysis": "boolean",
  "sentiment_analysis_results": "array",
  "entity_detection": "boolean",
  "entities": "array",
  "speech_model": "string",
  "language_model": "string",
  "acoustic_model": "string",
  "error": "string"
}
```

---

### D. Quick Reference - Common Tasks

**Transcribe with Speaker Labels:**
```json
{
  "audio_url": "url",
  "speaker_labels": true
}
```

**Transcribe + Summarize:**
```json
{
  "audio_url": "url",
  "summarization": true,
  "summary_type": "bullets"
}
```

**Transcribe + PII Redaction:**
```json
{
  "audio_url": "url",
  "redact_pii": true,
  "redact_pii_policies": ["phone_number", "email_address"]
}
```

**Full Audio Intelligence:**
```json
{
  "audio_url": "url",
  "speaker_labels": true,
  "sentiment_analysis": true,
  "entity_detection": true,
  "auto_chapters": true,
  "iab_categories": true,
  "content_safety": true
}
```

---

### E. Rate Limit Calculator

LeMUR requests are limited per 60-second window. Example:

- Limit: 100 requests/minute
- Current: 85 requests
- Remaining: 15 requests
- Reset in: 25 seconds

Check `X-RateLimit-*` headers in responses.

---

### F. Webhooks Implementation

#### Server Endpoint

```python
from flask import Flask, request
import hmac
import hashlib

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    # Verify auth header
    auth_header = request.headers.get('X-Webhook-Secret')
    if auth_header != 'your_secret':
        return 'Unauthorized', 401
    
    # Process transcript
    data = request.json
    transcript_id = data['transcript_id']
    status = data['status']
    
    if status == 'completed':
        # Fetch full transcript
        transcript = get_transcript(transcript_id)
        # Process...
    
    return 'OK', 200
```

---

### G. File Upload Endpoint

AssemblyAI can transcribe files from public URLs. To upload local files:

**Option 1:** Use SDK (handles upload automatically)

```python
transcript = transcriber.transcribe("./local_file.mp3")
```

**Option 2:** Manual upload to AssemblyAI's upload endpoint

```bash
curl https://api.assemblyai.com/v2/upload \
  -H "Authorization: YOUR_API_KEY" \
  --data-binary @audio.mp3
```

Response:
```json
{
  "upload_url": "https://cdn.assemblyai.com/upload/..."
}
```

Then use `upload_url` as `audio_url` in transcription request.

---

### H. Supported Audio Formats

**Recommended:**
- WAV (uncompressed)
- FLAC (lossless compression)

**Supported:**
- MP3
- MP4
- M4A
- AAC
- OGG
- WebM
- OPUS

**Video Formats** (audio extracted):
- MP4
- MOV
- AVI
- FLV
- MKV

---

### I. Usage Limits

- **Max File Size**: 5GB
- **Max Duration**: No hard limit (tested up to 24+ hours)
- **Min Duration**: 0.5 seconds
- **Concurrent Jobs**: Depends on plan
- **LeMUR Context**: 100K+ tokens per request

---

### J. Changelog & API Versions

AssemblyAI uses versioned endpoints:

- `/v2/transcript` - Current stable API
- `/v3/token` - Latest streaming API
- `/lemur/v3/` - Latest LeMUR endpoints

Check documentation for latest versions: https://www.assemblyai.com/docs

---

## Conclusion

This guide covers the complete AssemblyAI API surface. For latest updates, code examples, and detailed guides, visit:

- Documentation: https://www.assemblyai.com/docs
- API Reference: https://www.assemblyai.com/docs/api-reference
- GitHub: https://github.com/AssemblyAI
- Support: support@assemblyai.com

### Next Steps

1. Get your API key from the dashboard
2. Try basic transcription with your audio
3. Explore audio intelligence features
4. Experiment with LeMUR for advanced analysis
5. Implement webhooks for production workflows
6. Consider real-time streaming for live applications

---

**Document Version:** 1.0  
**Last Updated:** November 2024  
**Created by:** AI Documentation System

---
