# Complete Gamma API Documentation
## The Ultimate Comprehensive Guide

**Last Updated:** November 8, 2025
**API Version:** v1.0
**Scraped from:** https://developers.gamma.app

---

# Table of Contents

1. [Overview](#overview)
   - [Introduction to Gamma's API](#introduction)
   - [What is Gamma?](#what-is-gamma)
   - [Key Features](#key-features)
   - [Ways to Use the API](#ways-to-use)
   - [Authentication](#authentication)
2. [Understanding API Options](#understanding-api-options)
3. [Generate API Parameters Explained](#generate-api-parameters)
4. [Create from Template API Parameters Explained](#create-from-template-parameters)
5. [List Themes and List Folders APIs](#list-apis)
6. [Access and Pricing](#access-and-pricing)
7. [Getting Help](#getting-help)
8. [API Reference](#api-reference)
   - [Generate a Gamma](#generate-a-gamma)
   - [Create from Template](#create-from-template)
   - [Get Gamma File URLs](#get-gamma-file-urls)
   - [Image Model Accepted Values](#image-models)
   - [Output Language Accepted Values](#output-languages)
   - [List Themes](#list-themes)
   - [List Folders](#list-folders)
   - [Error Codes](#error-codes)
   - [Warnings](#warnings)
9. [Changelog](#changelog)

---

# Overview

## Introduction to Gamma's API {#introduction}

Gamma's APIs allow you to programmatically create presentations, documents, social media posts, and websites. This API mirrors much of the AI generation functionality available through Gamma's web application.

## What is Gamma? {#what-is-gamma}

[Gamma](https://gamma.app/about) is an AI-powered design partner that helps you create professional-looking presentations, documents, social posts, and websites quickly using AI-generated content and images. Our APIs extends this functionality to developers and users of automation tools, allowing them to integrate Gamma's content generation capabilities into their own applications and workflows.

## Key Features {#key-features}

### Versatile Content Creation
- Create presentations, documents, social posts, and websites in various sizes and styles
- Generate from any text -- a one-line prompt, messy notes, or polished content
- Support for 60+ languages makes your content globally accessible

### Intelligent Design
- Get thoughtfully designed content with customizable themes and images from AI or a source of your choosing
- Fine-tune your output by defining tone, audience, and detail level

### Seamless Workflow
- Further refine your API generated content in the Gamma app or export directly to PDF or PPTX via API
- You can also connect Gamma into your favorite automation tool to create an end to end workflow

## Ways to Use the API {#ways-to-use}

You can use the Gamma API in multiple ways:

- On automation platforms like [Make](https://www.make.com/en/integrations/gamma-app), [Zapier](https://zapier.com/apps/gamma/integrations), Workato, N8N, etc, to automate your workflows
- By directly integrating it into backend code to power your apps

## Authentication {#authentication}

We currently support authentication via API keys only; OAuth support is coming soon.

---

# Understanding the API Options {#understanding-api-options}

Overview of the different API offerings and when to use each.

## Important Notice

> **The Create from Template API is currently in beta.**
>
> **Functionality, rate limits, and pricing are subject to change.**

## Two Ways to Create Gammas

There are two ways to create gammas using our APIs: generate from scratch ([Generate API](#generate-api-parameters)) and create based on an existing template ([Create from Template API](#create-from-template-parameters)).

| Category | Generate API | Create from Template API |
|----------|--------------|--------------------------|
| **When to use** | <ul><li>Create a net new gamma (without an existing template).</li><li>Users have maximum flexibility to specify parameters.</li><li>Gamma uses full range of tools within defined parameters to create the output.</li></ul> | <ul><li>Create a new gamma based on an existing gamma template.</li><li>Allows users to define a good template with the Gamma app.</li><li>Gamma adapts new content to the existing template.</li></ul> |
| **Important distinctions** | <ul><li>Has many parameters to provide users maximum flexibility.</li><li>Use `inputText` to pass in text content and image URLs. Use other parameters to pass in more guidance.</li></ul> | <ul><li>Requires an existing gamma template and its gammaId.</li><li>Use `prompt` to pass in text content, image URLs, as well as instructions for how to use this content.</li></ul> |

Additionally, you can use [GET Themes and GET Folders APIs](#list-apis) to retrieve all available options for themes and folders.

---

# Generate API Parameters Explained {#generate-api-parameters}

How the Generate API parameters influence your gamma. Read this before heading to the API Reference page.

The sample API requests below shows all required and optional API parameters, as well as sample responses.

## Sample POST Request

```bash
curl --request POST \
  --url https://public-api.gamma.app/v1.0/generations \
  --header 'Content-Type: application/json' \
  --header 'X-API-KEY: sk-gamma-xxxxxxxx' \
  --data '{
    "inputText": "Best hikes in the United States",
    "textMode": "generate",
    "format": "presentation",
    "themeId": "Oasis",
    "numCards": 10,
    "cardSplit": "auto",
    "additionalInstructions": "Make the titles catchy",
    "folderIds": ["123abc456", "456def789"],
    "exportAs": "pdf",
    "textOptions": {
      "amount": "detailed",
      "tone": "professional, inspiring",
      "audience": "outdoors enthusiasts, adventure seekers",
      "language": "en"
    },
    "imageOptions": {
      "source": "aiGenerated",
      "model": "imagen-4-pro",
      "style": "photorealistic"
    },
    "cardOptions": {
      "dimensions": "fluid",
      "headerFooter": {
        "topRight": {
          "type": "image",
          "source": "themeLogo",
          "size": "sm"
        },
        "bottomRight": {
          "type": "cardNumber"
        },
        "hideFromFirstCard": true,
        "hideFromLastCard": false
      }
    },
    "sharingOptions": {
      "workspaceAccess": "view",
      "externalAccess": "noAccess",
      "emailOptions": {
        "recipients": ["email@example.com"],
        "access": "comment"
      }
    }
  }'
```

## Sample GET Request (Check Status)

```bash
curl --request GET \
  --url https://public-api.gamma.app/v1.0/generations/yyyyyyyyyy \
  --header 'X-API-KEY: sk-gamma-xxxxxxxx' \
  --header 'accept: application/json'
```

---

## Top Level Parameters

### `inputText` (required)

Content used to generate your gamma, including text and image URLs.

**Add images to the input:**
You can provide URLs for specific images you want to include. Simply insert the URLs into your content where you want each image to appear. You can also add instructions for how to display the images in `additionalInstructions`, e.g., "Group the last 10 images into a gallery to showcase them together."

**Note:** If you want your gamma to use *only* the images you provide (and not generate additional ones), set `imageOptions.source` to `noImages`.

**Token limits:**
The token limit is 100,000, which is approximately 400,000 characters. However, in some cases, the token limit may be lower, especially if your use case requires extra reasoning from our AI models. We highly recommend keeping inputText below 100,000 tokens and testing out a variety of inputs to get a good sense of what works for your use case.

**Other tips:**
- Text can be as little as a few words that describe the topic of the content you want to generate.
- You can also input longer text -- pages of messy notes or highly structured, detailed text.
- You can control where cards are split by adding `\n---\n` to the text.
- You may need to apply JSON escaping to your text. Find out more about JSON escaping and [try it out here](https://www.devtoolsdaily.com/json/escape/).

**Examples:**

```json
"inputText": "Ways to use AI for productivity"
```

```json
"inputText": "# The Final Frontier: Deep Sea Exploration\n* Less than 20% of our oceans have been explored\n* Deeper than 1,000 meters remains largely mysterious\n* More people have been to space than to the deepest parts of our ocean\n\nhttps://img.genially.com/5b34eda40057f90f3a45b977/1b02d693-2456-4379-a56d-4bc5e14c6ae1.jpeg\n---\n# Technological Breakthroughs\n* Advanced submersibles capable of withstanding extreme pressure\n* ROVs (Remotely Operated Vehicles) with HD cameras and sampling tools\n* Autonomous underwater vehicles for extended mapping missions\n* Deep-sea communication networks enabling real-time data transmission\n\nhttps://images.encounteredu.com/excited-hare/production/uploads/subject-update-about-exploring-the-deep-hero.jpg?w=1200&h=630&q=82&auto=format&fit=crop&dm=1631569543&s=48f275c76c565fdaa5d4bd365246afd3\n---\n# Ecological Discoveries\n* Unique ecosystems thriving without sunlight\n* Hydrothermal vent communities using chemosynthesis\n* Creatures with remarkable adaptations: bioluminescence, pressure resistance\n* Thousands of new species discovered annually\n---\n# Scientific & Economic Value\n* Understanding climate regulation and carbon sequestration\n* Pharmaceutical potential from deep-sea organisms\n* Mineral resources and rare earth elements\n* Insights into extreme life that could exist on other planets\n\nhttps://publicinterestnetwork.org/wp-content/uploads/2023/11/Western-Pacific-Jarvis_PD_NOAA-OER.jpg\n---\n# Future Horizons\n* Expansion of deep-sea protected areas\n* Sustainable exploration balancing discovery and conservation\n* Technological miniaturization enabling broader coverage\n* Citizen science initiatives through shared deep-sea data"
```

---

### `textMode` (required)

Determines how your `inputText` is modified, if at all.

- You can choose between `generate`, `condense`, or `preserve`
- **`generate`**: Using your `inputText` as a starting point, Gamma will rewrite and expand the content. Works best when you have brief text in the input that you want to elaborate on.
- **`condense`**: Gamma will summarize your `inputText` to fit the content length you want. Works best when you start with a large amount of text that you'd like to summarize.
- **`preserve`**: Gamma will retain the exact text in `inputText`, sometimes structuring it where it makes sense to do so, e.g., adding headings to sections. (If you do not want any modifications at all, you can specify this in the `additionalInstructions` parameter.)

**Example:**
```json
"textMode": "generate"
```

---

### `format` (optional, defaults to `presentation`)

Determines the artifact Gamma will create for you.

- You can choose between `presentation`, `document`, `social`, or `webpage`.
- You can use the `cardOptions.dimensions` field to further specify the shape of your output.

**Example:**
```json
"format": "presentation"
```

---

### `themeId` (optional, defaults to workspace default theme)

Defines which theme from Gamma will be used for the output. Themes determine the look and feel of the gamma, including colors and fonts.

- You can use the [GET Themes](#list-themes) endpoint to pull a list of themes from your workspace. Or you can copy over the themeId from the app directly.

**Example:**
```json
"themeId": "abc123def456ghi"
```

---

### `numCards` (optional, defaults to `10`)

Determines how many cards are created if `auto` is chosen in `cardSplit`

- Pro users can choose any integer between 1 and 60.
- Ultra users can choose any integer between 1 and 75.

**Example:**
```json
"numCards": 10
```

---

### `cardSplit` (optional, defaults to `auto`)

Determines how your content will be divided into cards.

- You can choose between `auto` or `inputTextBreaks`
- Choosing `auto` tells Gamma to looks at the `numCards` field and divide up content accordingly. (It will not adhere to text breaks `\n---\n` in your `inputText`.)
- Choosing `inputTextBreaks` tells Gamma that it should look for text breaks `\n---\n` in your `inputText` and divide the content based on this. (It will not respect `numCards`.)
  - **Note:** One `\n---\n` = one break, i.e., text with one break will produce two cards, two break will produce three cards, and so on.
- Here are some scenarios to guide your use of these parameters and explain how they work

| inputText contains `\n---\n` and how many | cardSplit | numCards | output has |
|------------------------------------------|-----------|----------|------------|
| No | auto | 9 | 9 cards |
| No | auto | left blank | 10 cards (default) |
| No | inputTextBreaks | 9 | 1 card |
| Yes, 5 | auto | 9 | 9 cards |
| Yes, 5 | inputTextBreaks | 9 | 6 cards |

**Example:**
```json
"cardSplit": "auto"
```

---

### `additionalInstructions` (optional)

Helps you add more specifications about your desired output.

- You can add specifications to steer content, layouts, and other aspects of the output.
- Works best when the instructions do not conflict with other parameters, e.g., if the `textMode` is defined as `condense`, and the `additionalInstructions` say to preserve all text, the output will not be able to respect these conflicting requests.
- Character limits: 1-2000.

**Example:**
```json
"additionalInstructions": "Make the card headings humorous and catchy"
```

---

### `folderIds` (optional)

Defines which folder(s) your gamma is stored in.

- You can use the [GET Folders](#list-folders) endpoint to pull a list of folders. Or you can copy over the folderIds from the app directly.
- You must be a member of a folder to be able to add gammas to that folder.

**Example:**
```json
"folderIds": ["123abc456def", "456123abcdef"]
```

---

### `exportAs` (optional)

Indicates if you'd like to return the generated gamma as a PDF or PPTX file as well as a Gamma URL.

- Options are `pdf` or `pptx`
- Download the files once generated as the links will become invalid after a period of time.
- If you do not wish to directly export to a PDF or PPTX via the API, you may always do so later via the app.

**Example:**
```json
"exportAs": "pdf"
```

---

## textOptions

### `textOptions.amount` (optional, defaults to `medium`)

Influences how much text each card contains. Relevant only if `textMode` is set to `generate` or `condense`.

- You can choose between `brief`, `medium`, `detailed` or `extensive`

**Example:**
```json
"textOptions": { "amount": "detailed" }
```

---

### `textOptions.tone` (optional)

Defines the mood or voice of the output. Relevant only if `textMode` is set to `generate`.

- You can add one or multiple words to hone in on the mood/voice to convey.
- Character limits: 1-500.

**Examples:**
```json
"textOptions": { "tone": "neutral" }
```

```json
"textOptions": { "tone": "professional, upbeat, inspiring" }
```

---

### `textOptions.audience` (optional)

Describes who will be reading/viewing the gamma, which allows Gamma to cater the output to the intended group. Relevant only if `textMode` is set to `generate`.

- You can add one or multiple words to hone in on the intended viewers/readers of the gamma.
- Character limits: 1-500.

**Examples:**
```json
"textOptions": { "audience": "outdoors enthusiasts, adventure seekers" }
```

```json
"textOptions": { "audience": "seven year olds" }
```

---

### `textOptions.language` (optional, defaults to `en`)

Determines the language in which your gamma is generated, regardless of the language of the `inputText`.

- You can choose from the languages listed [here](#output-languages).

**Example:**
```json
"textOptions": { "language": "en" }
```

---

## imageOptions

### `imageOptions.source` (optional, defaults to `aiGenerated`)

Determines where the images for the gamma are sourced from. You can choose from the options below. If you are providing your own image URLs in `inputText` and want only those to be used, set `imageOptions.source` to `noImages` to indicate that Gamma should not generate additional images.

| Options for `source` | Notes |
|---------------------|-------|
| `aiGenerated` | If you choose this option, you can also specify the `imageOptions.model` you want to use as well as an `imageOptions.style`. These parameters do not apply to other `source` options. |
| `pictographic` | Pulls images from Pictographic. |
| `unsplash` | Gets images from Unsplash. |
| `giphy` | Gets GIFs from Giphy. |
| `webAllImages` | Pulls the most relevant images from the web, even if licensing is unknown. |
| `webFreeToUse` | Pulls images licensed for personal use. |
| `webFreeToUseCommercially` | Gets images licensed for commercial use, like a sales pitch. |
| `placeholder` | Creates a gamma with placeholders for which images can be manually added later. |
| `noImages` | Creates a gamma with no images. Select this option if you are providing your own image URLs in `inputText` and want only those in your gamma. |

**Example:**
```json
"imageOptions": { "source": "aiGenerated" }
```

---

### `imageOptions.model` (optional)

This field is relevant if the `imageOptions.source` chosen is `aiGenerated`. The `imageOptions.model` parameter determines which model is used to generate images.

- You can choose from the models listed [here](#image-models).
- If no value is specified for this parameter, Gamma automatically selects a model for you.

**Example:**
```json
"imageOptions": { "model": "flux-1-pro" }
```

---

### `imageOptions.style` (optional)

This field is relevant if the `imageOptions.source` chosen is `aiGenerated`. The `imageOptions.style` parameter influences the artistic style of the images generated. While this is an optional field, we highly recommend adding some direction here to create images in a cohesive style.

- You can add one or multiple words to define the visual style of the images you want.
- Adding some direction -- even a simple one word like "photorealistic" -- can create visual consistency among the generated images.
- Character limits: 1-500.

**Example:**
```json
"imageOptions": { "style": "minimal, black and white, line art" }
```

---

## cardOptions

### `cardOptions.dimensions` (optional)

Determines the aspect ratio of the cards to be generated. Fluid cards expand with your content. Not applicable if `format` is `webpage`.

- Options if `format` is `presentation`: `fluid` **(default)**, `16x9`, `4x3`
- Options if `format` is `document`: `fluid` **(default)**, `pageless`, `letter`, `a4`
- Options if `format` is `social`: `1x1`, `4x5` **(default)** (good for Instagram posts and LinkedIn carousels), `9x16` (good for Instagram and TikTok stories)

**Example:**
```json
"cardOptions": { "dimensions": "16x9" }
```

---

### `cardOptions.headerFooter` (optional)

Allows you to specify elements in the header and footer of the cards. Not applicable if `format` is `webpage`.

**Step 1:** Pick which positions you want to populate. Options: `topLeft`, `topRight`, `topCenter`, `bottomLeft`, `bottomRight`, `bottomCenter`.

**Step 2:** For each position, specify what type of content goes there. Options: `text`, `image`, and `cardNumber`.

**Step 3:** Configure based on type.
- For `text`, define a `value` (required)
- For `image`:
  - Set the `source`. Options: `themeLogo` or `custom` image (required)
  - Set the `size`. Options: `sm`, `md`, `lg`, `xl` (optional)
  - For a `custom` image, define a `src` image URL (required)
- For `cardNumber`, no additional configuration is available.

**Step 4:** For any position, you can control whether it appears on the first or last card:
- `hideFromFirstCard` (optional) - Set to `true` to hide from first card. Default: `false`
- `hideFromLastCard` (optional) - Set to `true` to hide from last card. Default: `false`

**Examples:**

```json
"cardOptions": {
  "headerFooter": {
    "topRight": {
      "type": "image",
      "source": "themeLogo",
      "size": "sm"
    },
    "bottomRight": {
      "type": "cardNumber"
    },
    "hideFromFirstCard": true
  }
}
```

```json
"cardOptions": {
  "headerFooter": {
    "topRight": {
      "type": "image",
      "source": "custom",
      "src": "https://example.com/logo.png",
      "size": "md"
    },
    "bottomRight": {
      "type": "text",
      "value": "© 2025 Company™"
    },
    "hideFromFirstCard": true,
    "hideFromLastCard": true
  }
}
```

---

## sharingOptions

### `sharingOptions.workspaceAccess` (optional, defaults to workspace share settings)

Determines level of access members in your workspace will have to your generated gamma.

- Options are: `noAccess`, `view`, `comment`, `edit`, `fullAccess`
- `fullAccess` allows members from your workspace to view, comment, edit, and share with others.

**Example:**
```json
"sharingOptions": { "workspaceAccess": "comment" }
```

---

### `sharingOptions.externalAccess` (optional, defaults to workspace share settings)

Determines level of access members **outside your workspace** will have to your generated gamma.

- Options are: `noAccess`, `view`, `comment`, or `edit`

**Example:**
```json
"sharingOptions": { "externalAccess": "noAccess" }
```

---

### `sharingOptions.emailOptions` (optional)

#### `sharingOptions.emailOptions.recipients` (optional)

Allows you to share your gamma with specific recipients via their email address.

**Example:**
```json
"sharingOptions": {
  "emailOptions": {
    "recipients": ["ceo@example.com", "cto@example.com"]
  }
}
```

#### `sharingOptions.emailOptions.access` (optional)

Determines level of access those specified in `sharingOptions.emailOptions.recipients` have to your generated gamma. Only workspace members can have `fullAccess`

- Options are: `view`, `comment`, `edit`, or `fullAccess`

**Example:**
```json
"sharingOptions": {
  "emailOptions": {
    "access": "comment"
  }
}
```

---

# Create from Template API Parameters Explained {#create-from-template-parameters}

What Create from Template API parameters represent and how they affect your Gamma creation. Read this before heading to the API Reference page.

> **The Create from Template API is currently in beta.**
>
> **Functionality, rate limits, and pricing are subject to change.**

The sample API requests below shows all required and optional API parameters, as well as sample responses.

## Sample POST Request

```bash
curl --request POST \
  --url https://public-api.gamma.app/v1.0/generations/from-template \
  --header 'Content-Type: application/json' \
  --header 'X-API-KEY: sk-gamma-xxxxxxxx' \
  --data '{
    "gammaId": "g_abcdef123456ghi",
    "prompt": "Rework this pitch deck for a non-technical audience.",
    "themeId": "Chisel",
    "folderIds": ["123abc456", "456def789"],
    "exportAs": "pdf"
    "imageOptions": {
      "model": "imagen-4-pro",
      "style": "photorealistic"
    },
    "sharingOptions": {
      "workspaceAccess": "view",
      "externalAccess": "noAccess",
      "emailOptions": {
        "recipients": ["email@example.com"],
        "access": "comment"
      }
    }
  }'
```

## Sample GET Request (Check Status)

```bash
curl --request GET \
  --url https://public-api.gamma.app/v1.0/generations/yyyyyyyyyy \
  --header 'X-API-KEY: sk-gamma-xxxxxxxx' \
  --header 'accept: application/json'
```

---

## Top Level Parameters

### `gammaId` (required)

Identifies the template you want to modify. You can find and copy the gammaId for a template as shown in the screenshots in the documentation.

---

### `prompt` (required)

Use this parameter to send text content, image URLs, as well as instructions for how to use this content in relation to the template gamma.

**Add images to the input:**
You can provide URLs for specific images you want to include. Simply insert the URLs into your content where you want each image to appear. You can also add instructions for how to display the images, e.g., "Group the last 10 images into a gallery to showcase them together."

**Token limits:**
The total token limit is 100,000, which is approximately 400,000 characters, but because part of your input is the gamma template, in practice, the token limit for your prompt becomes shorter. We highly recommend keeping your prompt well below 100,000 tokens and testing out a variety of inputs to get a good sense of what works for your use case.

**Other tips:**
- Text can be as little as a few words that describe the topic of the content you want to generate.
- You can also input longer text -- pages of messy notes or highly structured, detailed text.
- You may need to apply JSON escaping to your text. Find out more about JSON escaping and [try it out here](https://www.devtoolsdaily.com/json/escape/).

**Examples:**

```json
"prompt": "Change this pitch deck about deep sea exploration into one about space exploration."
```

```json
"prompt": "Change this pitch deck about deep sea exploration into one about space exploration. Use this quote and this image in the title card: That's one small step for man, one giant leap for mankind - Neil Armstrong, https://www.global-aero.com/wp-content/uploads/2020/06/ga-iss.jpg"
```

---

### `themeId` (optional, defaults to the template's theme)

Defines which theme from Gamma will be used for the output. Themes determine the look and feel of the gamma, including colors and fonts.

- You can use the [GET Themes](#list-themes) endpoint to pull a list of themes from your workspace. Or you can copy over the themeId from the app directly.

**Example:**
```json
"themeId": "abc123def456ghi"
```

---

### `folderIds` (optional)

Defines which folder(s) your gamma is stored in.

- You can use the [GET Folders](#list-folders) endpoint to pull a list of folders. Or you can copy over the folderIds from the app directly.
- You must be a member of a folder to be able to add gammas to that folder.

**Example:**
```json
"folderIds": ["123abc456", "def456789"]
```

---

### `exportAs` (optional)

Indicates if you'd like to return the generated gamma as a PDF or PPTX file as well as a Gamma URL.

- Options are `pdf` or `pptx`
- Download the files once generated as the links will become invalid after a period of time.
- If you do not wish to directly export to a PDF or PPTX via the API, you may always do so later via the app.

**Example:**
```json
"exportAs": "pdf"
```

---

## imageOptions

When you create content from a Gamma template, new images automatically match the image source used in the original template. For example if you used Pictographic images to generate your original template, any new images will be sourced from Pictographic.

For templates with AI-generated images, you can override the default AI image settings using the optional parameters below.

### `imageOptions.model` (optional)

This field is relevant if the original template was created using AI generated images. The `imageOptions.model` parameter determines which model is used to generate new images.

- You can choose from the models listed [here](#image-models).
- If no value is specified for this parameter, Gamma automatically selects a model for you.

**Example:**
```json
"imageOptions": { "model": "flux-1-pro" }
```

---

### `imageOptions.style` (optional)

This field is relevant if the original template was created using AI generated images. The `imageOptions.style` parameter influences the artistic style of the images generated.

- You can add one or multiple words to define the visual style of the images you want.
- Adding some direction -- even a simple one word like "photorealistic" -- can create visual consistency among the generated images.
- Character limits: 1-500.

**Example:**
```json
"imageOptions": { "style": "minimal, black and white, line art" }
```

---

## sharingOptions

### `sharingOptions.workspaceAccess` (optional, defaults to workspace share settings)

Determines level of access members in your workspace will have to your generated gamma.

- Options are: `noAccess`, `view`, `comment`, `edit`, `fullAccess`
- `fullAccess` allows members from your workspace to view, comment, edit, and share with others.

**Example:**
```json
"sharingOptions": { "workspaceAccess": "comment" }
```

---

### `sharingOptions.externalAccess` (optional, defaults to workspace share settings)

Determines level of access members **outside your workspace** will have to your generated gamma.

- Options are: `noAccess`, `view`, `comment`, or `edit`

**Example:**
```json
"sharingOptions": { "externalAccess": "noAccess" }
```

---

### `sharingOptions.emailOptions` (optional)

#### `sharingOptions.emailOptions.recipients` (optional)

Allows users to share gamma with specific recipients via their email.

**Example:**
```json
"sharingOptions": {
  "emailOptions": {
    "recipients": ["ceo@example.com", "cto@example.com"]
  }
}
```

#### `sharingOptions.emailOptions.access` (optional)

Determines level of access users defined in `sharingOptions.emailOptions.recipients` have to your generated gamma.

- Options are: `view`, `comment`, `edit`, or `fullAccess`

**Example:**
```json
"sharingOptions": {
  "emailOptions": {
    "access": "comment"
  }
}
```

---

# List Themes and List Folders APIs {#list-apis}

List API methods support bulk fetching through cursor-based pagination. The endpoints `GET /v1.0/folders` and `GET /v1.0/themes` share common structures and pagination parameters.

## Common Parameters

All list endpoints accept:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | optional | Search by name (case-insensitive). Filters results to items matching the search term. |
| `limit` | integer | optional | Number of items to return per page. Maximum: 50. |
| `after` | string | optional | Cursor token for fetching the next page. Use the nextCursor value from the previous response. |

## Response Format

| Field | Type | Description |
|-------|------|-------------|
| `data` | array | Array of folder or theme objects. |
| `hasMore` | boolean | Indicates whether more pages exist. |
| `nextCursor` | string or null | Opaque cursor token for the next page. |

## List Themes

Returns paginated themes list from workspace, including both workspace-specific and global themes.

**Sample Response:**
```json
{
  "data": [
    {
      "id": "abc123def456",
      "name": "Standard Dark",
      "type": "standard",
      "colorKeywords": ["black", "gray", "accent"],
      "toneKeywords": ["sophisticated", "modern"]
    }
  ],
  "hasMore": true,
  "nextCursor": "abc123def456ghi789"
}
```

## List Folders

Returns paginated folders list from workspace.

**Sample Response:**
```json
{
  "data": [
    { "id": "abcdef", "name": "Design" },
    { "id": "xyzabc", "name": "Marketing" }
  ],
  "hasMore": true,
  "nextCursor": "abc123def456ghi789"
}
```

## Pagination Example: Fetch all folders

**Request 1:**
```
GET /v1.0/folders?limit=50
```

**Response 1:**
```json
{
  "data": [
    { "id": "abcdef", "name": "Design" },
    { "id": "xyzabc", "name": "Marketing" }
  ],
  "hasMore": true,
  "nextCursor": "abc123def456ghi789"
}
```

**Request 2:**
```
GET /v1.0/folders?limit=50&after=abc123def456ghi789
```

**Response 2:**
```json
{
  "data": [
    { "id": "lmnop1", "name": "Sales" },
    { "id": "qrstuv", "name": "Product" }
  ],
  "hasMore": false,
  "nextCursor": null
}
```

## Query Example: Search for a theme

**Request:**
```
GET /v1.0/themes?query=dark&limit=50
```

**Response:**
```json
{
  "data": [
    {
      "id": "abc123def456",
      "name": "Standard Dark",
      "type": "standard",
      "colorKeywords": ["black", "gray", "accent"],
      "toneKeywords": ["sophisticated", "modern"]
    },
    {
      "id": "123abc456def",
      "name": "Dark Gradient",
      "type": "custom",
      "colorKeywords": ["purple", "black", "navy"],
      "toneKeywords": ["dramatic", "elegant"]
    }
  ],
  "hasMore": false,
  "nextCursor": null
}
```

## Key Notes

- The `after` parameter uses forward-only cursors; backward pagination is not supported
- When `hasMore` is false and `nextCursor` is null, results are exhausted
- Returned theme `id` values work with Generate and Create from Template APIs

---

# Access and Pricing {#access-and-pricing}

## Access

API access is available to Pro, Ultra, Teams, and Business plan subscribers. Users can generate API keys through account settings. View [pricing plans here](https://gamma.app/pricing).

## Usage and Pricing

The platform employs a credit-based billing system, with higher-tier subscribers receiving increased monthly credits. When credits are depleted, users can upgrade their subscription, buy credits individually, or activate auto-recharge at [https://gamma.app/settings/billing](https://gamma.app/settings/billing).

## How Credits Work - Pricing Table

| Feature | API Parameter | Credits Charged |
|---------|---------------|-----------------|
| Number of cards | `numCards` | 3-4 credits per card |
| AI image model - Basic | `imageOptions.model` | ~2 credits per image |
| AI image model - Advanced | `imageOptions.model` | ~10-20 credits per image |
| AI image model - Premium | `imageOptions.model` | ~20-40 credits per image |
| AI image model - Ultra | `imageOptions.model` | ~40-120 credits per image |

*Note: Credit charges subject to change.

## Illustrative Scenarios

- 10-card deck with 5 basic model images: ~40-50 credits
- 20-card document with 15 premium model images: ~360-680 credits
- 30-card social content with 30 ultra model images: ~1290-3720 credits

Additional credit information available at [Help Center](https://help.gamma.app/en/articles/7834324-how-do-ai-credits-work-in-gamma).

---

# Getting Help {#getting-help}

## Support Channels

### 1. Questions, Quick Feedback, and Debugging

Join the Gamma API Slack channel for immediate assistance. We recommend including the `x-request-id` header from API responses when seeking debugging help.

### 2. Broader Feedback

Google Forms feedback option available for general API feedback and suggestions.

### 3. Contact Support

Reach Gamma's Support team through their help center for additional assistance.

---

# API Reference {#api-reference}

## Generate a Gamma {#generate-a-gamma}

### Endpoint Details

- **HTTP Method:** POST
- **URL:** `https://public-api.gamma.app/v1.0/generations`
- **Description:** Create a new gamma using this endpoint.

### Important Notes

We highly recommend you read [Generate API parameters explained](#generate-api-parameters) before delving into this page.

For parameters with a long list of accepted values, please reference:

- `imageOptions.model` accepts values listed in [Image model accepted values](#image-models).
- `textOptions.language` accepts values listed in [Output language accepted values](#output-languages).
- [List Themes and List Folders](#list-apis) endpoints can be used to find values for the `themeId` and `folderIds` parameters.

Generated gammas appear in a separate tab in your dashboard. This tab appears only after you have successfully created at least one gamma using the API.

### Request Parameters

See [Generate API Parameters Explained](#generate-api-parameters) for detailed parameter documentation.

### Code Examples

Available in: Shell, Node, Ruby, PHP, Python

### Response Codes

- **200** - Successful response
  ```json
  {
    "generationId": "xxxxxxxxxxx"
  }
  ```
- **400** - Bad Request
- **401** - Unauthorized

---

## Create from Template {#create-from-template}

### Endpoint Details

- **HTTP Method:** POST
- **URL:** `https://public-api.gamma.app/v1.0/generations/from-template`
- **Description:** Create new content based on an existing gamma template using this endpoint.

### Important Notes

> **The Create from Template API is currently in beta. Functionality, rate limits, and pricing are subject to change.**

### Request Parameters

See [Create from Template API Parameters Explained](#create-from-template-parameters) for detailed parameter documentation.

Key parameters mentioned include:

- `gammaId` - Template identifier (required)
- `prompt` - Content and instructions (required)
- `imageOptions.model` - Image generation model selection
- `themeId` - Theme identifier
- `folderIds` - Folder identifiers

### Code Examples

Available in: Shell, Node, Ruby, PHP, Python

### Important Notes

Generated gammas appear in a separate tab in your dashboard. This tab appears only after you have successfully created at least one gamma using the API.

---

## Get Gamma File URLs {#get-gamma-file-urls}

### Endpoint Details

- **HTTP Method:** GET
- **URL:** `https://public-api.gamma.app/v1.0/generations/{generationId}`
- **Description:** This GET endpoint allows you to monitor and retrieve results from generation requests.

### Key Capabilities

- Monitoring request status through polling (recommended at ~5 second intervals)
- Obtaining the URL to your generated gamma for further editing
- Retrieving URLs for PDF or PPTX exports if requested
- Generated gammas appear in a separate dashboard tab after first API creation

### Path Parameters

- `generationId` - The unique identifier for the generation request

### Key Notes

- PDF and PPTX files obtained through this endpoint won't save to your in-app dashboard
- Generated content appears in a dedicated API tab (visible only after first successful creation)
- Polling approach recommended for status checks

### Code Examples

Available in: Shell, Node, Ruby, PHP, Python

---

## Image Model Accepted Values {#image-models}

Complete list of accepted image models for AI-generated images in Gamma:

### Quick Models (2 Credits)
- **Flux Fast 1.1** - `flux-1-quick`
- **Flux Kontext Fast** - `flux-kontext-fast`
- **Imagen 3 Fast** - `imagen-3-flash`
- **Luma Photon Flash** - `luma-photon-flash-1`

### Standard Models (8-15 Credits)
- **Flux Pro** - `flux-1-pro` (8 credits)
- **Imagen 3** - `imagen-3-pro` (8 credits)
- **Ideogram 3 Turbo** - `ideogram-v3-turbo` (10 credits)
- **Luma Photon** - `luma-photon-1` (10 credits)
- **Leonardo Phoenix** - `leonardo-phoenix` (15 credits)

### Advanced Models (20-30 Credits)
- **Flux Kontext Pro** - `flux-kontext-pro` (20 credits)
- **Gemini 2.5 Flash** - `gemini-2.5-flash-image` (20 credits)
- **Ideogram 3** - `ideogram-v3` (20 credits)
- **Imagen 4** - `imagen-4-pro` (20 credits)
- **Recraft** - `recraft-v3` (20 credits)
- **GPT Image** - `gpt-image-1-medium` (30 credits)
- **Dall E 3** - `dall-e-3` (33 credits)

### Ultra Plan Models (30-120 Credits)
- **Flux Ultra** - `flux-1-ultra` (30 credits)
- **Imagen 4 Ultra** - `imagen-4-ultra` (30 credits)
- **Flux Kontext Max** - `flux-kontext-max` (40 credits)
- **Recraft Vector Illustration** - `recraft-v3-svg` (40 credits)
- **Ideogram 3.0 Quality** - `ideogram-v3-quality` (45 credits)
- **GPT Image Detailed** - `gpt-image-1-high` (120 credits)

### Implementation Notes

To use these models, set the `imageOptions.source` parameter to "aiGenerated" and specify your chosen model string in `imageOptions.model`. Alternatively, leaving the model parameter blank allows Gamma to select automatically.

---

## Output Language Accepted Values {#output-languages}

The Gamma Generate API supports 78 languages for output generation through the `textOptions.language` parameter. If unspecified, the default is English (US).

### Complete Language List with Codes:

| Language | Code |
|----------|------|
| Afrikaans | `af` |
| Albanian | `sq` |
| Arabic | `ar` |
| Arabic (Saudi Arabia) | `ar-sa` |
| Bengali | `bn` |
| Bosnian | `bs` |
| Bulgarian | `bg` |
| Catalan | `ca` |
| Croatian | `hr` |
| Czech | `cs` |
| Danish | `da` |
| Dutch | `nl` |
| English (India) | `en-in` |
| English (UK) | `en-gb` |
| English (US) | `en` |
| Estonian | `et` |
| Finnish | `fi` |
| French | `fr` |
| German | `de` |
| Greek | `el` |
| Gujarati | `gu` |
| Hausa | `ha` |
| Hebrew | `he` |
| Hindi | `hi` |
| Hungarian | `hu` |
| Icelandic | `is` |
| Indonesian | `id` |
| Italian | `it` |
| Japanese (です/ます style) | `ja` |
| Japanese (だ/である style) | `ja-da` |
| Kannada | `kn` |
| Kazakh | `kk` |
| Korean | `ko` |
| Latvian | `lv` |
| Lithuanian | `lt` |
| Macedonian | `mk` |
| Malay | `ms` |
| Malayalam | `ml` |
| Marathi | `mr` |
| Norwegian | `nb` |
| Persian | `fa` |
| Polish | `pl` |
| Portuguese (Brazil) | `pt-br` |
| Portuguese (Portugal) | `pt-pt` |
| Romanian | `ro` |
| Russian | `ru` |
| Serbian | `sr` |
| Simplified Chinese | `zh-cn` |
| Slovenian | `sl` |
| Spanish | `es` |
| Spanish (Latin America) | `es-419` |
| Spanish (Mexico) | `es-mx` |
| Spanish (Spain) | `es-es` |
| Swahili | `sw` |
| Swedish | `sv` |
| Tagalog | `tl` |
| Tamil | `ta` |
| Telugu | `te` |
| Thai | `th` |
| Traditional Chinese | `zh-tw` |
| Turkish | `tr` |
| Ukrainian | `uk` |
| Urdu | `ur` |
| Uzbek | `uz` |
| Vietnamese | `vi` |
| Welsh | `cy` |
| Yoruba | `yo` |

**Default behavior:** If nothing is specified in this parameter, Gamma creates your output in `en`, i.e. English (US).

---

## List Themes {#list-themes}

### Endpoint Details

- **HTTP Method:** GET
- **URL:** `https://public-api.gamma.app/v1.0/themes`
- **Description:** Use this endpoint to fetch the list of themes in your workspace.

### Code Examples

Available in: Shell, Node, Ruby, PHP, Python

For detailed pagination and query parameters, see [List Themes and List Folders APIs](#list-apis).

---

## List Folders {#list-folders}

### Endpoint Details

- **HTTP Method:** GET
- **URL:** `https://public-api.gamma.app/v1.0/folders`
- **Description:** This endpoint retrieves a list of folders available in your workspace.

### Code Examples

Available in: Shell, Node, Ruby, PHP, Python

For detailed pagination and query parameters, see [List Themes and List Folders APIs](#list-apis).

---

## Error Codes {#error-codes}

Complete reference of all documented error codes:

| HTTP Status | Error Message | Cause | Resolution |
|---|---|---|---|
| **400** | Input validation errors | "Invalid parameters detected." Parameters don't meet requirements | Verify all input parameters match API specifications |
| **401** | Invalid API key | Provided key is invalid or not linked to Pro account | Confirm API key is correct and account has Pro status |
| **403** | Forbidden | "No credits left." Insufficient account balance | Upgrade plan or purchase additional credits |
| **404** | Generation ID not found (generationId: xxxxxx) | Specified generation ID doesn't exist in system | Double-check and correct the generation ID value |
| **422** | Failed to generate text. Check inputs and try again. | "Generation produced an empty output." Instructions unclear or invalid parameters | Review input parameters; clarify and refine instructions |
| **429** | Too many requests | Exceeded rate limit threshold | Wait for rate limit window to reset before retrying |
| **500** | An error occurred while generating the gamma. | "An unexpected error occurred." Internal system failure | Contact support with x-request-id header for assistance |
| **502** | Bad gateway | Temporary gateway processing failure | Retry request after brief delay |

**Error Response Format:**
```json
{
  "message": "[error text]",
  "statusCode": [code]
}
```

---

## Warnings {#warnings}

Complete list of documented warnings:

### Warning 1: Conflicting Format and Dimensions

**Trigger:** Specifying invalid `pageOptions.dimensions` for the selected format

**Message:**
```json
{
  "message": "cardOptions.dimensions 1x1 is not valid for format presentation. Valid dimensions are: [ 16x9, 4x3, fluid ]. Using default: fluid."
}
```

**Example:** Using `"dimensions": "1x1"` with `"format": "presentation"`

**Recommended Action:** Use valid dimension values matching your format (16x9, 4x3, or fluid for presentations)

---

### Warning 2: Conflicting Image Source and Model

**Trigger:** Specifying an image model when `imageOptions.source` is not set to "aiGenerated"

**Message:**
```json
{
  "message": "imageOptions.model and imageOptions.style are ignored when imageOptions.source is not aiGenerated."
}
```

**Example:** Using `"source": "pictographic"` while also setting `"model": "flux-1-pro"`

**Recommended Action:** Only specify image models when using AI-generated image sources

---

### General Pattern

The documentation notes that warnings are returned when API parameters conflict or are ignored, ensuring transparency about which parameters were disregarded during processing.

---

# Changelog {#changelog}

## v1.0 - November 5th, 2025

**Generate API GA, Create from Template and much more**

Major release featuring:
- Generate API exits beta and reaches general availability
- "Create from Template API in beta" - the API version of the in-app Remix feature
- New generation capabilities: webpages, headers, and footers
- Image URL input support for both Generate and Create from Template APIs
- Folder definition and email-based sharing features
- New endpoints for listing themes and folders
- Official Make.com integration launched
- Removal of hard generation limits (rate limiting handled case-by-case)

**Critical notice:** "Gamma's v0.2 API offerings will be deprecated Jan 16, 2026"

---

## October 1st, 2025

**Even higher usage, credit recharges, and a new API tab**

Updates include:
- Generation caps increased from 50/day to 50/hour
- New credit purchasing options with optional auto-recharge functionality
- Separate dashboard tab for API-generated content

---

## September 15th, 2025

**Higher usage, new models, and credit-based pricing**

Enhancements:
- Usage caps raised to 50 generations per user per day
- Access to more powerful image models via Ultra pricing tier
- Ultra users can generate up to 75-card-long presentations
- Credits-based pricing system implementation
- Zapier integration availability

---

## July 28th, 2025

**Beta release of Gamma Generate endpoints**

Initial beta launch of Generate POST and Generate GET endpoints for API-based gamma creation and retrieval.

---

# End of Documentation

This comprehensive guide includes all content from the Gamma API documentation as of November 8, 2025.

**Source:** https://developers.gamma.app
**Compiled by:** Claude Code (Anthropic)
**Total Pages Scraped:** 17 (7 Overview + 10 API Reference + 1 Changelog)
