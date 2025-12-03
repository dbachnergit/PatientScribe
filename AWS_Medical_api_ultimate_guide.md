# AWS Medical Transcription API: The Ultimate Guide

*A comprehensive technical reference for implementing medical transcription using Amazon Transcribe Medical*

---

## Table of Contents

1. [Overview & Architecture](#overview--architecture)
2. [Core Concepts](#core-concepts)
3. [Getting Started](#getting-started)
4. [Batch Medical Transcription](#batch-medical-transcription)
5. [Real-Time Streaming](#real-time-streaming)
6. [Custom Medical Vocabularies](#custom-medical-vocabularies)
7. [Speaker Diarization](#speaker-diarization)
8. [PHI Identification & HIPAA Compliance](#phi-identification--hipaa-compliance)
9. [Output Formats & Response Structure](#output-formats--response-structure)
10. [Error Handling & Troubleshooting](#error-handling--troubleshooting)
11. [Best Practices](#best-practices)
12. [Regional Availability & Pricing Considerations](#regional-availability--pricing-considerations)

---

## Overview & Architecture

Amazon Transcribe Medical is a HIPAA-eligible automatic speech recognition (ASR) service designed specifically for medical professionals. It provides two primary operational modes:

### Operational Modes

**1. DICTATION Mode**
- For physician-dictated medical notes
- Single speaker assumed
- Optimized for medical terminology
- Supports clinical documentation workflow

**2. CONVERSATION Mode**
- For clinician-patient dialogues
- Multi-speaker support
- Enables speaker partitioning (diarization)
- Suitable for telemedicine appointments

### Medical Specialties

The `Specialty` parameter fundamentally affects the acoustic model:

- **PRIMARYCARE**: Optimized for conversational turn-taking patterns, patient interruptions, and questions. Best for family medicine, internal medicine, and general practice.
- **CARDIOLOGY**: Optimized for longer uninterrupted technical descriptions with heavy anatomical terminology. Expects continuous medical dictation.

> **Critical**: Selecting the wrong specialty can degrade accuracy by 15-20% even with perfect custom vocabularies, as it affects audio segmentation algorithms, not just vocabulary matching.

### Supported Languages

Currently supports:
- English (US) - `en-US`
- English (GB) - `en-GB`
- English (AU) - `en-AU`
- Spanish (US) - `es-US`

---

## Core Concepts

### Job Types

1. **Batch Jobs**: Process pre-recorded audio files stored in S3
   - Asynchronous processing
   - Supports larger files
   - Results stored in S3
   - Best for post-appointment documentation

2. **Streaming Jobs**: Real-time transcription
   - HTTP/2 or WebSocket protocols
   - Low-latency results
   - Suitable for live dictation or telemedicine
   - Maximum 4-hour session duration

### Audio Requirements

**Batch Processing:**
- **Formats**: MP3, MP4, WAV, FLAC, AMR, OGG, WebM
- **Sample Rate**: 8 kHz minimum (16 kHz recommended)
- **Channels**: Mono or stereo (multi-channel supported with channel identification)
- **Max File Size**: 2 GB
- **Max Duration**: 4 hours

**Streaming:**
- **Encoding**: PCM (signed 16-bit little-endian)
- **Sample Rate**: 16 kHz (medical streaming requires 16 kHz)
- **Chunk Size**: 1024 bytes recommended
- **Protocol**: HTTP/2 or WebSocket

---

## Getting Started

### Prerequisites

1. **AWS Account** with appropriate permissions
2. **IAM Role** with transcribe permissions
3. **S3 Bucket** for audio input/output
4. **SDK Installation**:

```bash
# Python
pip install boto3 --break-system-packages

# Node.js
npm install @aws-sdk/client-transcribe

# AWS CLI
pip install awscli --break-system-packages
```

### Basic Configuration

```python
import boto3

# Initialize client
transcribe = boto3.client(
    'transcribe',
    region_name='us-west-2',
    aws_access_key_id='YOUR_ACCESS_KEY',
    aws_secret_access_key='YOUR_SECRET_KEY'
)
```

```javascript
// Node.js v3
import { TranscribeClient } from "@aws-sdk/client-transcribe";

const client = new TranscribeClient({ 
    region: "us-west-2" 
});
```

### IAM Permissions

Minimum required permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "transcribe:StartMedicalTranscriptionJob",
                "transcribe:GetMedicalTranscriptionJob",
                "transcribe:ListMedicalTranscriptionJobs",
                "transcribe:DeleteMedicalTranscriptionJob",
                "transcribe:StartMedicalStreamTranscription",
                "transcribe:CreateMedicalVocabulary",
                "transcribe:GetMedicalVocabulary",
                "transcribe:ListMedicalVocabularies",
                "transcribe:DeleteMedicalVocabulary"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

---

## Batch Medical Transcription

### Starting a Batch Job

#### DICTATION Example

**Python (Boto3):**

```python
from __future__ import print_function
import time
import boto3

transcribe = boto3.client('transcribe', 'us-west-2')

job_name = "physician-dictation-001"
job_uri = "s3://medical-audio-bucket/dictations/exam-001.wav"

# Start transcription job
transcribe.start_medical_transcription_job(
    MedicalTranscriptionJobName=job_name,
    Media={
        'MediaFileUri': job_uri
    },
    OutputBucketName='medical-transcripts-bucket',
    OutputKey='transcripts/',
    LanguageCode='en-US',
    Specialty='PRIMARYCARE',
    Type='DICTATION',
    Settings={
        'ShowSpeakerLabels': False,  # Not applicable for dictation
        'MaxSpeakerLabels': 1,
        'ChannelIdentification': False,
        'ShowAlternatives': True,
        'MaxAlternatives': 2
    }
)

# Poll for completion
while True:
    status = transcribe.get_medical_transcription_job(
        MedicalTranscriptionJobName=job_name
    )
    
    job_status = status['MedicalTranscriptionJob']['TranscriptionJobStatus']
    
    if job_status in ['COMPLETED', 'FAILED']:
        print(f"Job {job_status}")
        if job_status == 'COMPLETED':
            print(f"Transcript URI: {status['MedicalTranscriptionJob']['Transcript']['TranscriptFileUri']}")
        break
    
    print("Processing...")
    time.sleep(5)
```

**AWS CLI:**

```bash
aws transcribe start-medical-transcription-job \
    --medical-transcription-job-name "physician-dictation-001" \
    --language-code "en-US" \
    --media MediaFileUri="s3://medical-audio-bucket/dictations/exam-001.wav" \
    --output-bucket-name "medical-transcripts-bucket" \
    --output-key "transcripts/" \
    --specialty "PRIMARYCARE" \
    --type "DICTATION" \
    --region us-west-2
```

**JavaScript (AWS SDK v3):**

```javascript
import { 
    TranscribeClient, 
    StartMedicalTranscriptionJobCommand,
    GetMedicalTranscriptionJobCommand 
} from "@aws-sdk/client-transcribe";

const client = new TranscribeClient({ region: "us-west-2" });

const startJobCommand = new StartMedicalTranscriptionJobCommand({
    MedicalTranscriptionJobName: "physician-dictation-001",
    LanguageCode: "en-US",
    Media: {
        MediaFileUri: "s3://medical-audio-bucket/dictations/exam-001.wav"
    },
    OutputBucketName: "medical-transcripts-bucket",
    OutputKey: "transcripts/",
    Specialty: "PRIMARYCARE",
    Type: "DICTATION"
});

try {
    const response = await client.send(startJobCommand);
    console.log("Job started:", response.MedicalTranscriptionJob.MedicalTranscriptionJobName);
    
    // Poll for status
    let jobComplete = false;
    while (!jobComplete) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const statusCommand = new GetMedicalTranscriptionJobCommand({
            MedicalTranscriptionJobName: "physician-dictation-001"
        });
        
        const statusResponse = await client.send(statusCommand);
        const status = statusResponse.MedicalTranscriptionJob.TranscriptionJobStatus;
        
        if (status === 'COMPLETED' || status === 'FAILED') {
            jobComplete = true;
            console.log("Job status:", status);
            if (status === 'COMPLETED') {
                console.log("Transcript:", statusResponse.MedicalTranscriptionJob.Transcript.TranscriptFileUri);
            }
        }
    }
} catch (error) {
    console.error("Error:", error);
}
```

#### CONVERSATION Example

**Python with Speaker Partitioning:**

```python
import boto3
import time

transcribe = boto3.client('transcribe', 'us-west-2')

job_name = "patient-consultation-001"
job_uri = "s3://medical-audio-bucket/consultations/visit-001.mp3"

# Start conversation transcription with speaker labels
response = transcribe.start_medical_transcription_job(
    MedicalTranscriptionJobName=job_name,
    Media={
        'MediaFileUri': job_uri
    },
    OutputBucketName='medical-transcripts-bucket',
    OutputKey='consultations/',
    LanguageCode='en-US',
    Specialty='PRIMARYCARE',
    Type='CONVERSATION',
    Settings={
        'ShowSpeakerLabels': True,
        'MaxSpeakerLabels': 2,  # Physician and patient
        'ChannelIdentification': False,
        'ShowAlternatives': False
    }
)

print(f"Started job: {job_name}")

# Monitor job status
while True:
    status = transcribe.get_medical_transcription_job(
        MedicalTranscriptionJobName=job_name
    )
    
    current_status = status['MedicalTranscriptionJob']['TranscriptionJobStatus']
    
    if current_status == 'COMPLETED':
        transcript_uri = status['MedicalTranscriptionJob']['Transcript']['TranscriptFileUri']
        print(f"Completed! Transcript: {transcript_uri}")
        break
    elif current_status == 'FAILED':
        failure_reason = status['MedicalTranscriptionJob'].get('FailureReason', 'Unknown')
        print(f"Failed: {failure_reason}")
        break
    
    time.sleep(10)
```

### Job Management Operations

#### List Jobs

```python
def list_medical_jobs(status_filter=None, max_results=100):
    """
    List medical transcription jobs with optional status filter
    """
    transcribe = boto3.client('transcribe')
    
    params = {
        'MaxResults': max_results
    }
    
    if status_filter:
        params['Status'] = status_filter  # 'QUEUED', 'IN_PROGRESS', 'COMPLETED', 'FAILED'
    
    response = transcribe.list_medical_transcription_jobs(**params)
    
    jobs = response['MedicalTranscriptionJobSummaries']
    
    # Handle pagination
    while 'NextToken' in response:
        response = transcribe.list_medical_transcription_jobs(
            NextToken=response['NextToken'],
            **params
        )
        jobs.extend(response['MedicalTranscriptionJobSummaries'])
    
    return jobs

# Usage
completed_jobs = list_medical_jobs(status_filter='COMPLETED')
for job in completed_jobs:
    print(f"{job['MedicalTranscriptionJobName']}: {job['CreationTime']}")
```

#### Get Job Details

```python
def get_job_details(job_name):
    """
    Retrieve detailed information about a specific job
    """
    transcribe = boto3.client('transcribe')
    
    response = transcribe.get_medical_transcription_job(
        MedicalTranscriptionJobName=job_name
    )
    
    job = response['MedicalTranscriptionJob']
    
    return {
        'name': job['MedicalTranscriptionJobName'],
        'status': job['TranscriptionJobStatus'],
        'language': job['LanguageCode'],
        'specialty': job['Specialty'],
        'type': job['Type'],
        'media_uri': job['Media']['MediaFileUri'],
        'transcript_uri': job.get('Transcript', {}).get('TranscriptFileUri'),
        'creation_time': job['CreationTime'],
        'completion_time': job.get('CompletionTime'),
        'settings': job.get('Settings', {})
    }
```

#### Delete Job

```python
def delete_medical_job(job_name):
    """
    Delete a medical transcription job
    WARNING: This only removes the job record, not the output files
    """
    transcribe = boto3.client('transcribe')
    
    try:
        transcribe.delete_medical_transcription_job(
            MedicalTranscriptionJobName=job_name
        )
        print(f"Deleted job: {job_name}")
        return True
    except Exception as e:
        print(f"Error deleting job: {e}")
        return False
```

---

## Real-Time Streaming

### WebSocket Streaming (Recommended)

WebSocket provides better performance and reliability for streaming medical transcription.

**Python Implementation:**

```python
import asyncio
import aiofile
from amazon_transcribe.client import TranscribeStreamingClient
from amazon_transcribe.handlers import TranscriptResultStreamHandler
from amazon_transcribe.model import TranscriptEvent, MedicalTranscriptResultStream

class MedicalTranscribeEventHandler(TranscriptResultStreamHandler):
    """
    Custom handler for medical transcription events
    """
    async def handle_transcript_event(self, transcript_event: TranscriptEvent):
        results = transcript_event.transcript.results
        
        for result in results:
            if not result.is_partial:
                # Final result
                for alt in result.alternatives:
                    transcript = alt.transcript
                    print(f"Final: {transcript}")
                    
                    # Check for identified entities (PHI)
                    if hasattr(alt, 'entities') and alt.entities:
                        for entity in alt.entities:
                            print(f"  PHI Detected: {entity.content} ({entity.category})")

async def stream_medical_audio(audio_file_path):
    """
    Stream audio file to Medical Transcribe
    """
    client = TranscribeStreamingClient(region="us-west-2")
    
    # Configure stream
    stream = await client.start_medical_stream_transcription(
        language_code="en-US",
        media_sample_rate_hz=16000,
        media_encoding="pcm",
        vocabulary_name="medical-terms-vocab",  # Optional
        specialty="PRIMARYCARE",
        type="DICTATION",
        content_identification_type="PHI",  # Enable PHI detection
        show_speaker_label=False
    )
    
    # Create handler
    handler = MedicalTranscribeEventHandler(stream.output_stream)
    
    async def write_chunks():
        # Read and stream audio in chunks
        async with aiofile.async_open(audio_file_path, 'rb') as audio:
            chunk_size = 1024 * 8  # 8KB chunks
            async for chunk in audio.iter_chunked(chunk_size):
                await stream.input_stream.send_audio_event(audio_chunk=chunk)
        
        # Signal end of audio
        await stream.input_stream.end_stream()
    
    # Run handler and writer concurrently
    await asyncio.gather(write_chunks(), handler.handle_events())

# Usage
if __name__ == "__main__":
    asyncio.run(stream_medical_audio("path/to/medical_audio.wav"))
```

**Node.js WebSocket Implementation:**

```javascript
import { 
    TranscribeStreamingClient, 
    StartMedicalStreamTranscriptionCommand 
} from "@aws-sdk/client-transcribe-streaming";
import { createReadStream } from 'fs';

async function streamMedicalAudio(audioFilePath) {
    const client = new TranscribeStreamingClient({ region: "us-west-2" });
    
    // Create audio stream
    const audioStream = async function* () {
        const audioFile = createReadStream(audioFilePath, {
            highWaterMark: 1024 * 8 // 8KB chunks
        });
        
        for await (const chunk of audioFile) {
            yield { AudioEvent: { AudioChunk: chunk } };
        }
    };
    
    const command = new StartMedicalStreamTranscriptionCommand({
        LanguageCode: "en-US",
        MediaSampleRateHertz: 16000,
        MediaEncoding: "pcm",
        Specialty: "PRIMARYCARE",
        Type: "DICTATION",
        ContentIdentificationType: "PHI",
        AudioStream: audioStream()
    });
    
    try {
        const response = await client.send(command);
        
        // Process transcript events
        for await (const event of response.TranscriptResultStream) {
            if (event.TranscriptEvent) {
                const results = event.TranscriptEvent.Transcript.Results;
                
                results.forEach(result => {
                    if (!result.IsPartial) {
                        result.Alternatives.forEach(alt => {
                            console.log(`Transcript: ${alt.Transcript}`);
                            
                            // Check for PHI
                            if (alt.Entities) {
                                alt.Entities.forEach(entity => {
                                    console.log(`PHI: ${entity.Content} (${entity.Category})`);
                                });
                            }
                        });
                    }
                });
            }
        }
        
        console.log("Streaming complete");
    } catch (error) {
        console.error("Streaming error:", error);
    }
}

// Usage
streamMedicalAudio('./medical_recording.wav');
```

### HTTP/2 Streaming

For environments where WebSocket isn't available:

**AWS CLI Presigned URL:**

```bash
# Generate presigned URL for HTTP/2 streaming
aws transcribestreaming start-medical-stream-transcription \
    --language-code en-US \
    --media-encoding pcm \
    --media-sample-rate-hertz 16000 \
    --specialty PRIMARYCARE \
    --type DICTATION \
    --content-identification-type PHI \
    --region us-west-2 \
    --generate-cli-skeleton
```

---

## Custom Medical Vocabularies

Custom vocabularies improve accuracy for domain-specific terminology, drug names, and medical abbreviations.

### Creating a Vocabulary

#### Text File Format

Create a text file with one term per line:

```text
amiodarone
metoprolol
lisinopril
atorvastatin
clopidogrel
warfarin
enoxaparin
furosemide
spironolactone
digoxin
echocardiogram
electrocardiogram
troponin
B-type natriuretic peptide
ejection fraction
myocardial infarction
percutaneous coronary intervention
```

#### Upload and Create Vocabulary

**Python:**

```python
import boto3
import time

def create_medical_vocabulary(vocab_name, s3_vocab_uri, language_code='en-US'):
    """
    Create a medical custom vocabulary from S3-hosted text file
    """
    transcribe = boto3.client('transcribe')
    
    try:
        response = transcribe.create_medical_vocabulary(
            VocabularyName=vocab_name,
            LanguageCode=language_code,
            VocabularyFileUri=s3_vocab_uri
        )
        
        print(f"Creating vocabulary: {vocab_name}")
        
        # Wait for vocabulary to be ready
        while True:
            status = transcribe.get_medical_vocabulary(
                VocabularyName=vocab_name
            )
            
            vocab_state = status['VocabularyState']
            
            if vocab_state == 'READY':
                print(f"Vocabulary {vocab_name} is ready!")
                return status
            elif vocab_state == 'FAILED':
                failure_reason = status.get('FailureReason', 'Unknown')
                print(f"Vocabulary creation failed: {failure_reason}")
                return None
            
            print(f"Status: {vocab_state}")
            time.sleep(5)
            
    except Exception as e:
        print(f"Error creating vocabulary: {e}")
        return None

# Usage
vocab_uri = "s3://medical-vocab-bucket/cardiology-terms.txt"
create_medical_vocabulary("cardiology-terms-v1", vocab_uri)
```

**AWS CLI:**

```bash
# Upload vocabulary file to S3
aws s3 cp medical_terms.txt s3://medical-vocab-bucket/medical_terms.txt

# Create vocabulary
aws transcribe create-medical-vocabulary \
    --vocabulary-name "medical-terms-v1" \
    --language-code "en-US" \
    --vocabulary-file-uri "s3://medical-vocab-bucket/medical_terms.txt" \
    --region us-west-2

# Check status
aws transcribe get-medical-vocabulary \
    --vocabulary-name "medical-terms-v1" \
    --region us-west-2
```

### Using Vocabulary in Transcription

**Batch Job with Custom Vocabulary:**

```python
response = transcribe.start_medical_transcription_job(
    MedicalTranscriptionJobName="job-with-vocab",
    Media={'MediaFileUri': "s3://bucket/audio.wav"},
    OutputBucketName='output-bucket',
    LanguageCode='en-US',
    Specialty='CARDIOLOGY',
    Type='DICTATION',
    Settings={
        'VocabularyName': 'cardiology-terms-v1'
    }
)
```

**Streaming with Vocabulary:**

```python
stream = await client.start_medical_stream_transcription(
    language_code="en-US",
    media_sample_rate_hz=16000,
    media_encoding="pcm",
    vocabulary_name="cardiology-terms-v1",  # Add vocabulary
    specialty="CARDIOLOGY",
    type="DICTATION"
)
```

### Managing Vocabularies

**List Vocabularies:**

```python
def list_medical_vocabularies(name_contains=None):
    """
    List all medical vocabularies, optionally filtered by name
    """
    transcribe = boto3.client('transcribe')
    
    params = {'MaxResults': 100}
    if name_contains:
        params['NameContains'] = name_contains
    
    response = transcribe.list_medical_vocabularies(**params)
    vocabularies = response['Vocabularies']
    
    # Handle pagination
    while 'NextToken' in response:
        response = transcribe.list_medical_vocabularies(
            NextToken=response['NextToken'],
            **params
        )
        vocabularies.extend(response['Vocabularies'])
    
    return vocabularies

# Usage
vocabs = list_medical_vocabularies(name_contains='cardio')
for vocab in vocabs:
    print(f"{vocab['VocabularyName']}: {vocab['VocabularyState']}")
```

**Delete Vocabulary:**

```python
def delete_medical_vocabulary(vocab_name):
    transcribe = boto3.client('transcribe')
    
    try:
        transcribe.delete_medical_vocabulary(VocabularyName=vocab_name)
        print(f"Deleted vocabulary: {vocab_name}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False
```

---

## Speaker Diarization

Speaker diarization (speaker partitioning) identifies and separates different speakers in medical conversations.

### Enabling Speaker Labels

**Configuration:**

```python
response = transcribe.start_medical_transcription_job(
    MedicalTranscriptionJobName="conversation-with-speakers",
    Media={'MediaFileUri': "s3://bucket/patient-visit.mp3"},
    OutputBucketName='transcripts-bucket',
    LanguageCode='en-US',
    Specialty='PRIMARYCARE',
    Type='CONVERSATION',  # Required for speaker labels
    Settings={
        'ShowSpeakerLabels': True,
        'MaxSpeakerLabels': 2,  # Set expected number of speakers (2-30)
        'ChannelIdentification': False
    }
)
```

### Output with Speaker Labels

The response includes a `speaker_labels` section:

```json
{
    "jobName": "conversation-with-speakers",
    "accountId": "123456789012",
    "results": {
        "transcripts": [{
            "transcript": "Good morning, how are you feeling today? I've been having some chest pain."
        }],
        "speaker_labels": {
            "speakers": 2,
            "segments": [
                {
                    "start_time": "0.0",
                    "speaker_label": "spk_0",
                    "end_time": "2.5",
                    "items": [
                        {
                            "start_time": "0.1",
                            "speaker_label": "spk_0",
                            "end_time": "0.4"
                        },
                        {
                            "start_time": "0.4",
                            "speaker_label": "spk_0",
                            "end_time": "0.8"
                        }
                    ]
                },
                {
                    "start_time": "2.5",
                    "speaker_label": "spk_1",
                    "end_time": "5.0",
                    "items": [
                        {
                            "start_time": "2.6",
                            "speaker_label": "spk_1",
                            "end_time": "2.9"
                        }
                    ]
                }
            ]
        },
        "items": [
            {
                "start_time": "0.1",
                "end_time": "0.4",
                "alternatives": [{
                    "confidence": "0.99",
                    "content": "Good"
                }],
                "type": "pronunciation"
            }
        ]
    },
    "status": "COMPLETED"
}
```

### Processing Speaker-Labeled Output

**Python Helper Function:**

```python
import json

def extract_speaker_segments(transcript_json):
    """
    Parse speaker-labeled transcript into organized segments
    """
    with open(transcript_json, 'r') as f:
        data = json.load(f)
    
    results = data['results']
    items = results['items']
    speaker_labels = results['speaker_labels']
    
    segments = []
    
    for segment in speaker_labels['segments']:
        speaker = segment['speaker_label']
        start_time = float(segment['start_time'])
        end_time = float(segment['end_time'])
        
        # Extract words for this speaker segment
        words = []
        for item_index in segment['items']:
            if isinstance(item_index, dict):
                item_start = float(item_index['start_time'])
                # Find matching item in items array
                for item in items:
                    if item.get('start_time') == str(item_start):
                        content = item['alternatives'][0]['content']
                        words.append(content)
        
        text = ' '.join(words)
        
        segments.append({
            'speaker': speaker,
            'start_time': start_time,
            'end_time': end_time,
            'text': text
        })
    
    return segments

# Usage
segments = extract_speaker_segments('transcript.json')
for seg in segments:
    print(f"[{seg['speaker']}] ({seg['start_time']:.2f}s - {seg['end_time']:.2f}s)")
    print(f"  {seg['text']}\n")
```

### Channel Identification vs Speaker Diarization

Can be combined (as of March 2023):

```python
Settings={
    'ShowSpeakerLabels': True,
    'MaxSpeakerLabels': 4,
    'ChannelIdentification': True  # Each channel can have multiple speakers
}
```

---

## PHI Identification & HIPAA Compliance

Amazon Transcribe Medical can identify and flag Protected Health Information (PHI) for HIPAA compliance.

### Enabling PHI Identification

**Batch Transcription:**

```python
response = transcribe.start_medical_transcription_job(
    MedicalTranscriptionJobName="phi-identification-job",
    Media={'MediaFileUri': "s3://bucket/consultation.mp3"},
    OutputBucketName='secure-transcripts-bucket',
    LanguageCode='en-US',
    Specialty='PRIMARYCARE',
    Type='CONVERSATION',
    ContentIdentificationType='PHI'  # Enable PHI identification
)
```

**Streaming Transcription:**

```python
stream = await client.start_medical_stream_transcription(
    language_code="en-US",
    media_sample_rate_hz=16000,
    media_encoding="pcm",
    specialty="PRIMARYCARE",
    type="DICTATION",
    content_identification_type="PHI"  # Enable PHI detection
)
```

**AWS CLI:**

```bash
aws transcribe start-medical-transcription-job \
    --medical-transcription-job-name "phi-job" \
    --language-code "en-US" \
    --media MediaFileUri="s3://bucket/audio.wav" \
    --output-bucket-name "output-bucket" \
    --specialty "PRIMARYCARE" \
    --type "CONVERSATION" \
    --content-identification-type "PHI" \
    --region us-west-2
```

### PHI Categories Detected

Amazon Transcribe Medical identifies these PHI types:

- **NAME**: Patient names, physician names
- **ADDRESS**: Street addresses, city, state, ZIP codes
- **AGE**: Specific ages (90+ considered PHI under HIPAA)
- **PROFESSION**: Job titles that could identify individuals
- **DATE**: Birth dates, admission dates, discharge dates
- **PHONE**: Phone numbers
- **SSN**: Social Security Numbers
- **EMAIL**: Email addresses
- **MRN**: Medical Record Numbers
- **ID**: Other identification numbers

### Output with PHI Identification

```json
{
    "jobName": "phi-identification-job",
    "accountId": "123456789012",
    "results": {
        "transcripts": [{
            "transcript": "The patient's name is Sarah Johnson. Date of birth March 15, 1985."
        }],
        "items": [
            {
                "start_time": "0.5",
                "end_time": "0.8",
                "alternatives": [{
                    "confidence": "0.99",
                    "content": "Sarah"
                }],
                "type": "pronunciation"
            },
            {
                "start_time": "0.8",
                "end_time": "1.2",
                "alternatives": [{
                    "confidence": "0.98",
                    "content": "Johnson"
                }],
                "type": "pronunciation"
            }
        ],
        "entities": [
            {
                "content": "Sarah Johnson",
                "category": "PHI",
                "type": "NAME",
                "startTime": 0.5,
                "endTime": 1.2,
                "confidence": 0.98
            },
            {
                "content": "March 15, 1985",
                "category": "PHI",
                "type": "DATE",
                "startTime": 2.0,
                "endTime": 3.5,
                "confidence": 0.95
            }
        ]
    },
    "status": "COMPLETED"
}
```

### Processing PHI-Identified Output

**Python Helper:**

```python
def extract_phi(transcript_json):
    """
    Extract all identified PHI from transcript
    """
    with open(transcript_json, 'r') as f:
        data = json.load(f)
    
    if 'entities' not in data['results']:
        return []
    
    phi_items = []
    
    for entity in data['results']['entities']:
        if entity['category'] == 'PHI':
            phi_items.append({
                'type': entity['type'],
                'content': entity['content'],
                'start_time': entity['startTime'],
                'end_time': entity['endTime'],
                'confidence': entity['confidence']
            })
    
    return phi_items

# Usage
phi_data = extract_phi('transcript.json')
print(f"Found {len(phi_data)} PHI items:")
for phi in phi_data:
    print(f"  [{phi['type']}] {phi['content']} (confidence: {phi['confidence']:.2f})")
```

### Redacting PHI

While Amazon Transcribe Medical identifies PHI, it doesn't automatically redact it. Implement custom redaction:

```python
def redact_phi(transcript_data):
    """
    Replace PHI content with [REDACTED] tags
    """
    transcript = transcript_data['results']['transcripts'][0]['transcript']
    entities = transcript_data['results'].get('entities', [])
    
    # Sort by start time in reverse to maintain string positions
    phi_entities = [e for e in entities if e['category'] == 'PHI']
    phi_entities.sort(key=lambda x: x['startTime'], reverse=True)
    
    # Build redacted transcript by replacing PHI content
    redacted = transcript
    for entity in phi_entities:
        content = entity['content']
        phi_type = entity['type']
        redacted = redacted.replace(content, f"[{phi_type}]", 1)
    
    return redacted

# Usage
with open('transcript.json', 'r') as f:
    data = json.load(f)

redacted_text = redact_phi(data)
print("Redacted transcript:")
print(redacted_text)
```

### HIPAA Compliance Considerations

1. **Encryption in Transit**: Use HTTPS/TLS for all API calls
2. **Encryption at Rest**: Enable S3 bucket encryption for audio and transcripts
3. **Access Controls**: Implement strict IAM policies
4. **Audit Logging**: Enable CloudTrail logging for all Transcribe operations
5. **BAA Required**: Sign AWS Business Associate Agreement
6. **Data Retention**: Implement lifecycle policies for transcript deletion
7. **PHI Handling**: Never log or display PHI in plain text in application logs

---

## Output Formats & Response Structure

### Batch Job Output Structure

**Complete Response:**

```json
{
    "jobName": "medical-job-001",
    "accountId": "123456789012",
    "results": {
        "transcripts": [
            {
                "transcript": "Patient presents with chest pain radiating to left arm."
            }
        ],
        "items": [
            {
                "start_time": "0.5",
                "end_time": "0.9",
                "alternatives": [
                    {
                        "confidence": "0.99",
                        "content": "Patient"
                    }
                ],
                "type": "pronunciation"
            },
            {
                "start_time": "0.9",
                "end_time": "1.4",
                "alternatives": [
                    {
                        "confidence": "0.98",
                        "content": "presents"
                    }
                ],
                "type": "pronunciation"
            },
            {
                "alternatives": [
                    {
                        "confidence": "0.0",
                        "content": "."
                    }
                ],
                "type": "punctuation"
            }
        ],
        "audio_segments": [
            {
                "id": 0,
                "transcript": "Patient presents with chest pain radiating to left arm.",
                "start_time": "0.5",
                "end_time": "5.2",
                "items": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            }
        ]
    },
    "status": "COMPLETED"
}
```

### Response Fields Explained

**Top Level:**
- `jobName`: Unique identifier for the job
- `accountId`: AWS account ID
- `status`: Job status (QUEUED, IN_PROGRESS, COMPLETED, FAILED)
- `results`: Container for transcription results

**Transcripts Array:**
- Contains final assembled transcript text
- Multiple transcripts for multi-channel audio

**Items Array:**
- Individual words and punctuation
- `start_time`/`end_time`: Timestamps in seconds
- `alternatives`: Possible transcriptions with confidence scores
- `type`: "pronunciation" or "punctuation"

**Audio Segments:**
- Grouped items representing phrases or sentences
- Links to items by index

### Streaming Output Structure

**Partial Results:**

```json
{
    "TranscriptResultStream": {
        "TranscriptEvent": {
            "Transcript": {
                "Results": [
                    {
                        "Alternatives": [{
                            "Transcript": "patient complains of",
                            "Items": [
                                {
                                    "Content": "patient",
                                    "StartTime": 0.5,
                                    "EndTime": 0.9,
                                    "Type": "pronunciation",
                                    "Confidence": 0.95
                                }
                            ]
                        }],
                        "IsPartial": true,
                        "ResultId": "uuid-here",
                        "StartTime": 0.5,
                        "EndTime": 2.0
                    }
                ]
            }
        }
    }
}
```

**Final Results:**

```json
{
    "TranscriptResultStream": {
        "TranscriptEvent": {
            "Transcript": {
                "Results": [
                    {
                        "Alternatives": [{
                            "Transcript": "patient complains of chest pain",
                            "Items": [...],
                            "Entities": [
                                {
                                    "Content": "chest pain",
                                    "Category": "MEDICAL_CONDITION",
                                    "Type": "DX_NAME",
                                    "StartTime": 1.5,
                                    "EndTime": 2.0,
                                    "Confidence": 0.98
                                }
                            ]
                        }],
                        "IsPartial": false,
                        "ResultId": "uuid-here",
                        "StartTime": 0.5,
                        "EndTime": 2.0
                    }
                ]
            }
        }
    }
}
```

---

## Error Handling & Troubleshooting

### Common Errors

#### 1. BadRequestException

**Cause:** Invalid parameters or malformed request

**Example:**
```
BadRequestException: Invalid sample rate. Medical transcription requires 16000 Hz.
```

**Solution:**
```python
# Correct configuration
response = transcribe.start_medical_stream_transcription(
    language_code="en-US",
    media_sample_rate_hz=16000,  # Must be 16000 for medical
    media_encoding="pcm",
    specialty="PRIMARYCARE",
    type="DICTATION"
)
```

#### 2. LimitExceededException

**Cause:** Exceeded service quotas

**Quotas:**
- Concurrent batch jobs: 100
- Concurrent streaming connections: 100
- API request rate: 100 TPS

**Solution:**
```python
import time
from botocore.exceptions import ClientError

def start_job_with_retry(params, max_retries=5):
    """
    Start job with exponential backoff on rate limiting
    """
    transcribe = boto3.client('transcribe')
    
    for attempt in range(max_retries):
        try:
            return transcribe.start_medical_transcription_job(**params)
        except ClientError as e:
            if e.response['Error']['Code'] == 'LimitExceededException':
                if attempt < max_retries - 1:
                    wait_time = (2 ** attempt)  # Exponential backoff
                    print(f"Rate limited. Waiting {wait_time}s...")
                    time.sleep(wait_time)
                    continue
            raise
```

#### 3. ConflictException

**Cause:** Job name already exists

**Solution:**
```python
import uuid

def generate_unique_job_name(prefix="medical-job"):
    """
    Generate unique job name with timestamp and UUID
    """
    from datetime import datetime
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    return f"{prefix}-{timestamp}-{unique_id}"

# Usage
job_name = generate_unique_job_name("patient-visit")
```

#### 4. InternalFailureException

**Cause:** AWS service issue

**Solution:**
```python
def handle_internal_failure(func, *args, max_retries=3, **kwargs):
    """
    Retry on internal service failures
    """
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except ClientError as e:
            if e.response['Error']['Code'] == 'InternalFailureException':
                if attempt < max_retries - 1:
                    time.sleep(5)
                    continue
            raise
```

### Audio File Issues

**Problem:** Job fails with "Invalid media format"

**Diagnosis:**
```bash
# Check audio properties
ffprobe -v error -show_format -show_streams input.mp3

# Expected output:
# codec_name=mp3
# sample_rate=16000
# channels=1 (mono) or 2 (stereo)
```

**Fix:**
```bash
# Convert to compatible format
ffmpeg -i input.mp3 \
    -ar 16000 \
    -ac 1 \
    -c:a pcm_s16le \
    output.wav
```

### IAM Permission Issues

**Error:**
```
AccessDeniedException: User is not authorized to perform: transcribe:StartMedicalTranscriptionJob
```

**Required Policy:**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "transcribe:StartMedicalTranscriptionJob",
                "transcribe:GetMedicalTranscriptionJob"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::input-bucket/*",
                "arn:aws:s3:::output-bucket/*"
            ]
        }
    ]
}
```

### Debugging Tools

**Comprehensive Error Logger:**

```python
import logging
import traceback
from botocore.exceptions import ClientError

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def transcribe_with_detailed_logging(job_params):
    """
    Start transcription with comprehensive error logging
    """
    transcribe = boto3.client('transcribe')
    
    try:
        logger.info(f"Starting job with params: {job_params}")
        response = transcribe.start_medical_transcription_job(**job_params)
        logger.info(f"Job started successfully: {response['MedicalTranscriptionJob']['MedicalTranscriptionJobName']}")
        return response
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        
        logger.error(f"AWS Error: {error_code}")
        logger.error(f"Message: {error_message}")
        logger.error(f"Request ID: {e.response['ResponseMetadata']['RequestId']}")
        
        if error_code == 'BadRequestException':
            logger.error("Check audio format, sample rate, and required parameters")
        elif error_code == 'LimitExceededException':
            logger.error("Rate limit exceeded. Implement exponential backoff")
        elif error_code == 'ConflictException':
            logger.error("Job name already exists. Use unique job names")
        
        raise
        
    except Exception as e:
        logger.error(f"Unexpected error: {type(e).__name__}")
        logger.error(traceback.format_exc())
        raise
```

---

## Best Practices

### Performance Optimization

#### 1. Audio Quality

```python
# Best practices for audio preparation
RECOMMENDED_SETTINGS = {
    'sample_rate': 16000,  # Hz
    'bit_depth': 16,       # bits
    'channels': 1,         # mono (stereo if multi-channel needed)
    'format': 'WAV',       # or FLAC for lossless
    'encoding': 'PCM'      # linear PCM
}

def validate_audio_quality(audio_path):
    """
    Validate audio meets quality requirements
    """
    import subprocess
    import json
    
    cmd = [
        'ffprobe',
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_streams',
        audio_path
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    info = json.loads(result.stdout)
    
    audio_stream = info['streams'][0]
    
    warnings = []
    
    if int(audio_stream.get('sample_rate', 0)) < 16000:
        warnings.append("Sample rate below 16kHz may reduce accuracy")
    
    if int(audio_stream.get('channels', 0)) > 2:
        warnings.append("More than 2 channels detected. Consider downmixing")
    
    return warnings
```

#### 2. Batch Processing

```python
def batch_process_medical_files(audio_files, specialty='PRIMARYCARE', type='DICTATION'):
    """
    Process multiple audio files efficiently
    """
    transcribe = boto3.client('transcribe')
    jobs = []
    
    for audio_file in audio_files:
        job_name = generate_unique_job_name(f"batch-{Path(audio_file).stem}")
        
        try:
            response = transcribe.start_medical_transcription_job(
                MedicalTranscriptionJobName=job_name,
                Media={'MediaFileUri': audio_file},
                OutputBucketName='transcripts-bucket',
                LanguageCode='en-US',
                Specialty=specialty,
                Type=type
            )
            
            jobs.append({
                'name': job_name,
                'status': 'STARTED',
                'input': audio_file
            })
            
        except Exception as e:
            logger.error(f"Failed to start job for {audio_file}: {e}")
            jobs.append({
                'name': job_name,
                'status': 'FAILED',
                'input': audio_file,
                'error': str(e)
            })
    
    return jobs

def monitor_batch_jobs(job_names, poll_interval=30):
    """
    Monitor multiple jobs until completion
    """
    transcribe = boto3.client('transcribe')
    pending_jobs = set(job_names)
    
    while pending_jobs:
        completed_this_round = set()
        
        for job_name in pending_jobs:
            try:
                response = transcribe.get_medical_transcription_job(
                    MedicalTranscriptionJobName=job_name
                )
                
                status = response['MedicalTranscriptionJob']['TranscriptionJobStatus']
                
                if status in ['COMPLETED', 'FAILED']:
                    completed_this_round.add(job_name)
                    logger.info(f"Job {job_name}: {status}")
                    
            except Exception as e:
                logger.error(f"Error checking {job_name}: {e}")
        
        pending_jobs -= completed_this_round
        
        if pending_jobs:
            time.sleep(poll_interval)
    
    logger.info("All jobs completed")
```

#### 3. Cost Optimization

```python
def estimate_transcription_cost(audio_duration_seconds, is_streaming=False):
    """
    Estimate cost based on AWS pricing (as of 2025)
    Batch: $0.012 per minute
    Streaming: $0.03 per minute
    """
    minutes = audio_duration_seconds / 60
    
    if is_streaming:
        rate_per_minute = 0.03
    else:
        rate_per_minute = 0.012
    
    estimated_cost = minutes * rate_per_minute
    
    return {
        'duration_minutes': round(minutes, 2),
        'rate_per_minute': rate_per_minute,
        'estimated_cost': round(estimated_cost, 4),
        'type': 'streaming' if is_streaming else 'batch'
    }

# Usage
cost = estimate_transcription_cost(3600, is_streaming=False)  # 1 hour batch
print(f"Estimated cost: ${cost['estimated_cost']:.4f}")
```

### Security Best Practices

#### 1. Encryption Configuration

```python
def start_encrypted_job(job_name, audio_uri, kms_key_id):
    """
    Start job with customer-managed KMS encryption
    """
    transcribe = boto3.client('transcribe')
    
    response = transcribe.start_medical_transcription_job(
        MedicalTranscriptionJobName=job_name,
        Media={'MediaFileUri': audio_uri},
        OutputBucketName='encrypted-transcripts',
        OutputEncryptionKMSKeyId=kms_key_id,  # Customer KMS key
        LanguageCode='en-US',
        Specialty='PRIMARYCARE',
        Type='DICTATION'
    )
    
    return response
```

#### 2. Secure S3 Bucket Policy

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "TranscribeAccess",
            "Effect": "Allow",
            "Principal": {
                "Service": "transcribe.amazonaws.com"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::medical-transcripts/*",
            "Condition": {
                "StringEquals": {
                    "aws:SourceAccount": "123456789012"
                }
            }
        },
        {
            "Sid": "EnforceSSL",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::medical-transcripts/*",
            "Condition": {
                "Bool": {
                    "aws:SecureTransport": "false"
                }
            }
        }
    ]
}
```

#### 3. CloudTrail Logging

```python
def enable_audit_logging():
    """
    Enable CloudTrail for Transcribe API calls
    """
    cloudtrail = boto3.client('cloudtrail')
    
    response = cloudtrail.create_trail(
        Name='TranscribeMedicalAudit',
        S3BucketName='audit-logs-bucket',
        IncludeGlobalServiceEvents=True,
        IsMultiRegionTrail=True,
        EnableLogFileValidation=True
    )
    
    # Start logging
    cloudtrail.start_logging(Name='TranscribeMedicalAudit')
    
    # Add event selector for Transcribe
    cloudtrail.put_event_selectors(
        TrailName='TranscribeMedicalAudit',
        EventSelectors=[{
            'ReadWriteType': 'All',
            'IncludeManagementEvents': True,
            'DataResources': [{
                'Type': 'AWS::Transcribe::TranscriptionJob',
                'Values': ['arn:aws:transcribe:*:123456789012:*']
            }]
        }]
    )
```

### Production Architecture

**Complete Production-Ready Implementation:**

```python
import boto3
import logging
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('transcription.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class TranscriptionType(Enum):
    DICTATION = "DICTATION"
    CONVERSATION = "CONVERSATION"

class MedicalSpecialty(Enum):
    PRIMARYCARE = "PRIMARYCARE"
    CARDIOLOGY = "CARDIOLOGY"

@dataclass
class TranscriptionConfig:
    """Configuration for medical transcription jobs"""
    specialty: MedicalSpecialty
    job_type: TranscriptionType
    language_code: str = "en-US"
    enable_phi_detection: bool = True
    enable_speaker_labels: bool = False
    max_speakers: int = 2
    custom_vocabulary: Optional[str] = None
    output_bucket: str = "medical-transcripts"
    kms_key_id: Optional[str] = None

class MedicalTranscriptionService:
    """
    Production-ready service for AWS Medical Transcription
    """
    
    def __init__(self, region_name: str = 'us-west-2'):
        self.transcribe = boto3.client('transcribe', region_name=region_name)
        self.s3 = boto3.client('s3', region_name=region_name)
        
    def start_batch_job(
        self,
        audio_uri: str,
        config: TranscriptionConfig,
        job_prefix: str = "medical"
    ) -> Dict:
        """
        Start batch transcription job with comprehensive configuration
        """
        job_name = self._generate_job_name(job_prefix)
        
        params = {
            'MedicalTranscriptionJobName': job_name,
            'Media': {'MediaFileUri': audio_uri},
            'OutputBucketName': config.output_bucket,
            'OutputKey': f'transcripts/{datetime.now().strftime("%Y/%m/%d/")}',
            'LanguageCode': config.language_code,
            'Specialty': config.specialty.value,
            'Type': config.job_type.value
        }
        
        # Build settings
        settings = {}
        
        if config.enable_speaker_labels and config.job_type == TranscriptionType.CONVERSATION:
            settings['ShowSpeakerLabels'] = True
            settings['MaxSpeakerLabels'] = config.max_speakers
        
        if config.custom_vocabulary:
            settings['VocabularyName'] = config.custom_vocabulary
        
        if settings:
            params['Settings'] = settings
        
        if config.enable_phi_detection:
            params['ContentIdentificationType'] = 'PHI'
        
        if config.kms_key_id:
            params['OutputEncryptionKMSKeyId'] = config.kms_key_id
        
        try:
            response = self.transcribe.start_medical_transcription_job(**params)
            logger.info(f"Started job: {job_name}")
            return {
                'success': True,
                'job_name': job_name,
                'response': response
            }
        except Exception as e:
            logger.error(f"Failed to start job: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_job_status(self, job_name: str) -> Dict:
        """
        Get detailed job status
        """
        try:
            response = self.transcribe.get_medical_transcription_job(
                MedicalTranscriptionJobName=job_name
            )
            
            job = response['MedicalTranscriptionJob']
            
            return {
                'name': job['MedicalTranscriptionJobName'],
                'status': job['TranscriptionJobStatus'],
                'creation_time': job['CreationTime'],
                'completion_time': job.get('CompletionTime'),
                'failure_reason': job.get('FailureReason'),
                'transcript_uri': job.get('Transcript', {}).get('TranscriptFileUri')
            }
        except Exception as e:
            logger.error(f"Error getting job status: {e}")
            return {'error': str(e)}
    
    def wait_for_completion(
        self,
        job_name: str,
        poll_interval: int = 30,
        timeout: int = 3600
    ) -> Dict:
        """
        Wait for job completion with timeout
        """
        import time
        start_time = time.time()
        
        while True:
            if time.time() - start_time > timeout:
                return {'status': 'TIMEOUT', 'job_name': job_name}
            
            status_info = self.get_job_status(job_name)
            
            if 'error' in status_info:
                return status_info
            
            status = status_info['status']
            
            if status == 'COMPLETED':
                logger.info(f"Job {job_name} completed successfully")
                return status_info
            
            elif status == 'FAILED':
                logger.error(f"Job {job_name} failed: {status_info.get('failure_reason')}")
                return status_info
            
            time.sleep(poll_interval)
    
    def download_transcript(self, transcript_uri: str, local_path: str) -> bool:
        """
        Download transcript from S3
        """
        try:
            # Parse S3 URI
            bucket = transcript_uri.split('/')[2]
            key = '/'.join(transcript_uri.split('/')[3:])
            
            self.s3.download_file(bucket, key, local_path)
            logger.info(f"Downloaded transcript to {local_path}")
            return True
        except Exception as e:
            logger.error(f"Error downloading transcript: {e}")
            return False
    
    def process_transcript(self, transcript_path: str) -> Dict:
        """
        Process and analyze downloaded transcript
        """
        with open(transcript_path, 'r') as f:
            data = json.load(f)
        
        results = data['results']
        
        # Extract basic info
        full_transcript = results['transcripts'][0]['transcript']
        
        # Extract PHI if present
        phi_items = []
        if 'entities' in results:
            phi_items = [
                {
                    'type': e['type'],
                    'content': e['content'],
                    'confidence': e['confidence']
                }
                for e in results['entities']
                if e.get('category') == 'PHI'
            ]
        
        # Extract speaker segments if present
        speaker_segments = []
        if 'speaker_labels' in results:
            for segment in results['speaker_labels']['segments']:
                speaker_segments.append({
                    'speaker': segment['speaker_label'],
                    'start_time': float(segment['start_time']),
                    'end_time': float(segment['end_time'])
                })
        
        return {
            'transcript': full_transcript,
            'word_count': len(full_transcript.split()),
            'phi_count': len(phi_items),
            'phi_items': phi_items,
            'speaker_segments': speaker_segments,
            'duration': float(results['items'][-1].get('end_time', 0))
        }
    
    @staticmethod
    def _generate_job_name(prefix: str) -> str:
        """Generate unique job name"""
        import uuid
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        return f"{prefix}-{timestamp}-{unique_id}"

# Usage Example
if __name__ == "__main__":
    # Initialize service
    service = MedicalTranscriptionService(region_name='us-west-2')
    
    # Configure transcription
    config = TranscriptionConfig(
        specialty=MedicalSpecialty.PRIMARYCARE,
        job_type=TranscriptionType.CONVERSATION,
        enable_phi_detection=True,
        enable_speaker_labels=True,
        max_speakers=2,
        custom_vocabulary='medical-terms-v1',
        output_bucket='medical-transcripts-prod',
        kms_key_id='arn:aws:kms:us-west-2:123456789012:key/12345678-1234-1234-1234-123456789012'
    )
    
    # Start job
    result = service.start_batch_job(
        audio_uri='s3://medical-audio/consultations/patient-001.wav',
        config=config,
        job_prefix='consultation'
    )
    
    if result['success']:
        job_name = result['job_name']
        
        # Wait for completion
        status = service.wait_for_completion(job_name)
        
        if status['status'] == 'COMPLETED':
            # Download transcript
            local_path = f'transcripts/{job_name}.json'
            service.download_transcript(status['transcript_uri'], local_path)
            
            # Process transcript
            analysis = service.process_transcript(local_path)
            
            print(f"Transcript length: {analysis['word_count']} words")
            print(f"Duration: {analysis['duration']:.2f} seconds")
            print(f"PHI items detected: {analysis['phi_count']}")
            print(f"Speakers: {len(analysis['speaker_segments'])}")
```

---

## Regional Availability & Pricing Considerations

### Available Regions

Amazon Transcribe Medical is available in:

- **US East (N. Virginia)** - `us-east-1`
- **US East (Ohio)** - `us-east-2`
- **US West (Oregon)** - `us-west-2`
- **Asia Pacific (Mumbai)** - `ap-south-1`
- **Asia Pacific (Seoul)** - `ap-northeast-2`
- **Asia Pacific (Singapore)** - `ap-southeast-1`
- **Asia Pacific (Sydney)** - `ap-southeast-2`
- **Asia Pacific (Tokyo)** - `ap-northeast-1`
- **Canada (Central)** - `ca-central-1`
- **Europe (Frankfurt)** - `eu-central-1`
- **Europe (Ireland)** - `eu-west-1`
- **Europe (London)** - `eu-west-2`

**NOT Available in:**
- AWS GovCloud regions
- Africa (Cape Town)
- China regions

### Pricing Structure (2025)

**Batch Transcription:**
- $0.012 per minute of audio transcribed
- Minimum charge: 15 seconds
- Pricing rounded to nearest second

**Streaming Transcription:**
- $0.03 per minute of audio streamed
- 15-second minimum charge per session
- Charged per audio stream

**Custom Vocabularies:**
- No additional charge

**PHI Identification:**
- No additional charge

**Data Transfer:**
- Standard AWS data transfer rates apply
- Same-region S3 transfer: No charge

### Cost Optimization Strategies

```python
def optimize_transcription_costs(
    audio_files: List[str],
    min_duration_seconds: int = 30
) -> Dict:
    """
    Analyze and optimize transcription costs
    """
    import subprocess
    import json
    
    total_duration = 0
    short_files = []
    batch_candidates = []
    
    for audio_file in audio_files:
        # Get duration
        cmd = [
            'ffprobe',
            '-v', 'quiet',
            '-print_format', 'json',
            '-show_format',
            audio_file
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        info = json.loads(result.stdout)
        duration = float(info['format']['duration'])
        
        total_duration += duration
        
        if duration < min_duration_seconds:
            short_files.append({
                'file': audio_file,
                'duration': duration,
                'waste': 15 - duration if duration < 15 else 0
            })
        else:
            batch_candidates.append(audio_file)
    
    # Calculate costs
    batch_cost = (total_duration / 60) * 0.012
    streaming_cost = (total_duration / 60) * 0.03
    
    return {
        'total_duration_minutes': total_duration / 60,
        'batch_cost': round(batch_cost, 2),
        'streaming_cost': round(streaming_cost, 2),
        'savings_using_batch': round(streaming_cost - batch_cost, 2),
        'short_files_count': len(short_files),
        'wasted_seconds': sum(f['waste'] for f in short_files),
        'recommendation': 'Use batch processing' if len(batch_candidates) > 0 else 'Consider concatenating short files'
    }
```

### Service Quotas

**Default Quotas:**

| Resource | Default Limit | Adjustable |
|----------|--------------|------------|
| Concurrent batch jobs | 100 | Yes |
| Concurrent streaming sessions | 100 | Yes |
| API request rate | 100 TPS | Yes |
| Maximum audio file size | 2 GB | No |
| Maximum audio duration | 4 hours | No |
| Custom vocabularies | 100 | Yes |
| Vocabulary file size | 50 KB | No |

**Request Quota Increase:**

```bash
# Via AWS CLI
aws service-quotas request-service-quota-increase \
    --service-code transcribe \
    --quota-code L-xxxxx \
    --desired-value 200 \
    --region us-west-2
```

---

## Appendix: Quick Reference

### Essential API Operations

```python
# Batch Operations
transcribe.start_medical_transcription_job(...)
transcribe.get_medical_transcription_job(MedicalTranscriptionJobName='...')
transcribe.list_medical_transcription_jobs(Status='COMPLETED', MaxResults=10)
transcribe.delete_medical_transcription_job(MedicalTranscriptionJobName='...')

# Vocabulary Operations
transcribe.create_medical_vocabulary(VocabularyName='...', VocabularyFileUri='...')
transcribe.get_medical_vocabulary(VocabularyName='...')
transcribe.list_medical_vocabularies(NameContains='...', MaxResults=10)
transcribe.delete_medical_vocabulary(VocabularyName='...')
```

### Common Configuration Patterns

**Basic Dictation:**
```python
{
    'Specialty': 'PRIMARYCARE',
    'Type': 'DICTATION',
    'Settings': {
        'ShowSpeakerLabels': False
    }
}
```

**Conversation with Speakers:**
```python
{
    'Specialty': 'PRIMARYCARE',
    'Type': 'CONVERSATION',
    'Settings': {
        'ShowSpeakerLabels': True,
        'MaxSpeakerLabels': 2
    }
}
```

**PHI Detection Enabled:**
```python
{
    'Specialty': 'PRIMARYCARE',
    'Type': 'CONVERSATION',
    'ContentIdentificationType': 'PHI'
}
```

**With Custom Vocabulary:**
```python
{
    'Specialty': 'CARDIOLOGY',
    'Type': 'DICTATION',
    'Settings': {
        'VocabularyName': 'cardiology-terms-v1'
    }
}
```

### Audio Format Reference

| Format | Batch | Streaming | Recommended |
|--------|-------|-----------|-------------|
| WAV (PCM) | ✓ | ✓ | ✓ |
| MP3 | ✓ | ✗ | ✓ |
| MP4 | ✓ | ✗ | |
| FLAC | ✓ | ✓ | ✓ |
| AMR | ✓ | ✗ | |
| OGG | ✓ | ✗ | |
| WebM | ✓ | ✗ | |

**Recommended Settings:**
- Sample Rate: 16 kHz
- Bit Depth: 16-bit
- Channels: Mono (1 channel)
- Encoding: PCM (uncompressed)

---

## Conclusion

This guide provides comprehensive coverage of AWS Medical Transcription API capabilities. Key takeaways:

1. **Choose the right mode**: DICTATION vs CONVERSATION based on use case
2. **Specialty matters**: PRIMARYCARE vs CARDIOLOGY affects acoustic model behavior
3. **Enable PHI detection**: Critical for HIPAA compliance
4. **Use custom vocabularies**: Significantly improves accuracy for specialized terms
5. **Implement proper error handling**: Production systems need robust retry logic
6. **Optimize costs**: Batch processing is 2.5x cheaper than streaming
7. **Security first**: Enable encryption, implement IAM properly, audit everything

For latest updates and API changes, always refer to official AWS documentation.

**Resources:**
- AWS Transcribe Medical Documentation: https://docs.aws.amazon.com/transcribe/latest/dg/transcribe-medical.html
- AWS SDK Documentation: https://aws.amazon.com/sdk-for-python/
- HIPAA Compliance Guide: https://aws.amazon.com/compliance/hipaa-compliance/

---

*Document Version: 1.0*  
*Last Updated: November 2025*  
*Author: AWS Medical Transcription Implementation Guide*
