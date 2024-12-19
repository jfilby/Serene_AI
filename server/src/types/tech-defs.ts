export class AiTechDefs {

  // Consts
  static llms = 'LLMs'
  static chatCompletion = 'Chat Completion'

  // Categories (for UserTechProvider.category)
  static writerLlmCategory = 'Writer LLM'

  // Tech providers
  static googleGeminiProvider = 'Google Gemini'
  static gcpPlatform = 'GCP'
  static googleVendor = 'Google'
  static defaultLlmProvider = this.googleGeminiProvider

  static chatGptProvider = 'ChatGPT'

  // LLMs by provider
  static googleGemini = 'Google Gemini'

  // Variant names
  // Last updated: 18th Feb 2024
  // Run the Setup in /admin/setup to install new variants and effect any
  // upgrade paths in service/tech/data/llms.ts.
  static googleGeminiV1Pro = 'Google Gemini v1 Pro'
  static googleGeminiV1pt5Pro = 'Google Gemini v1.5 Pro'
  static googleGeminiV1pt5Flash = 'Google Gemini v1.5 Flash'
  static googleGeminiV2Flash = 'Google Gemini v2 Flash'
  static googleGeminiLatestExp = 'Google Gemini Latest Experimental'

  static genericModel = 'Generic'
  static v1ProVersion = 'v1 Pro'
  static v1pt5ProVersion = 'v1.5 Pro'
  static v1pt5FlashVersion = 'v1.5 Flash'
  static v2FlashVersion = 'v2 Flash'
  static expVersion = 'Experimental'

  // OpenAI
  static chatGpt4o = 'ChatGPT-4o'

  // The Llama models use OpenAI's client (provider)
  static llama3_8b = 'Llama 3 8B'

  // Project default
  static defaultLlmVariantName = this.googleGeminiV1pt5Pro
  static defaultChatVariantName = this.chatGpt4o

  // A list of available LLMs
  static userAILlms = [
    // Google Gemini
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGeminiV1Pro,
      default: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGeminiV1pt5Pro,
      default: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGeminiV1pt5Flash,
      default: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGeminiV2Flash,
      default: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGeminiLatestExp,
      default: true
    }
  ]

  // Model names
  static googleGeminiV1ProModelName = 'gemini-pro'
  static googleGeminiV1pt5ProModelName = 'gemini-1.5-pro'
  static googleGeminiV1pt5FlashModelName = 'gemini-1.5-flash'
  static googleGeminiV2FlashModelName = 'gemini-2.0-flash-exp'
  static googleGeminiLatestExpModelName = 'gemini-exp-1206'

  static chatGpt4oModelName = 'GPT-4o'

  static llama3_8bModelName = 'llama3-8b-8192'

  // Variant to model names
  static variantToModelNames = {
    // Google Gemini
    [AiTechDefs.googleGeminiV1Pro]: this.googleGeminiV1ProModelName,
    [AiTechDefs.googleGeminiV1pt5Pro]: this.googleGeminiV1pt5ProModelName,
    [AiTechDefs.googleGeminiV1pt5Flash]: this.googleGeminiV1pt5FlashModelName,
    [AiTechDefs.googleGeminiV2Flash]: this.googleGeminiV2FlashModelName,
    [AiTechDefs.googleGeminiLatestExp]: this.googleGeminiLatestExpModelName,

    // OpenAI
    [AiTechDefs.chatGpt4o]: this.chatGpt4oModelName,

    // OpenAI compatible
    [AiTechDefs.llama3_8b]: this.llama3_8bModelName
  }

  // Variant to providers
  static variantToProviders = {
    [AiTechDefs.googleGeminiV1Pro]: this.googleGeminiProvider,
    [AiTechDefs.googleGeminiV1pt5Pro]: this.googleGeminiProvider,
    [AiTechDefs.googleGeminiV1pt5Flash]: this.googleGeminiProvider,
    [AiTechDefs.googleGeminiV2Flash]: this.googleGeminiProvider,
    [AiTechDefs.googleGeminiLatestExp]: this.googleGeminiProvider,

    [AiTechDefs.chatGpt4o]: this.chatGptProvider,
    [AiTechDefs.llama3_8b]: this.chatGptProvider   // The Llama models use the OpenAI client
  }

  // Variant names to descriptions
  static variantNamesToDescriptions = {
    // Google Gemini
    [AiTechDefs.googleGeminiV1Pro]: 'Gemini v1 Pro',
    [AiTechDefs.googleGeminiV1pt5Pro]: 'Gemini v1.5 Pro',
    [AiTechDefs.googleGeminiV1pt5Flash]: 'Gemini v1.5 Flash',
    [AiTechDefs.googleGeminiV2Flash]: 'Gemini v2 Flash',
    [AiTechDefs.googleGeminiLatestExp]: 'Gemini Latest Experimental',

    // Llama 3
    [AiTechDefs.llama3_8b]: 'Llama 3 8B'
  }

  // Define a large context token size
  static largeContextTokenSize = 100000  // 100k

  // Context windows by variant
  static variantToMaxInputTokens = {
    // Google Gemini
    // Source: https://ai.google.dev/models/gemini
    [AiTechDefs.googleGeminiV1Pro]: 1048576,
    [AiTechDefs.googleGeminiV1pt5Pro]: 2097152,
    [AiTechDefs.googleGeminiV1pt5Flash]: 1048576,
    [AiTechDefs.googleGeminiV2Flash]: 1048576,
    [AiTechDefs.googleGeminiLatestExp]: 1048576,

    // Llama 3
    // Source: https://huggingface.co/meta-llama/Meta-Llama-3-8B
    [AiTechDefs.llama3_8b]: 8000
  }

  static variantToMaxOutputTokens = {
    // Google Gemini
    // Source: https://ai.google.dev/models/gemini
    [AiTechDefs.googleGeminiV1Pro]: 8192,
    [AiTechDefs.googleGeminiV1pt5Pro]: 8192,
    [AiTechDefs.googleGeminiV1pt5Flash]: 8192,
    [AiTechDefs.googleGeminiV2Flash]: 8192,
    [AiTechDefs.googleGeminiLatestExp]: 8192,

    // Llama 3
    // Source: https://huggingface.co/meta-llama/Meta-Llama-3-8B
    [AiTechDefs.llama3_8b]: 2048
  }

  // Variants for which to ignore jsonMode. This is useful for those that keep
  // raising an exception due to badly formed JSON. An alternative can then be
  // tried, e.g. jsonRepair.
  // Not used by the Google Gemini provider
  static variantNamesToIgnoreJsonMode = {
    [AiTechDefs.llama3_8b]: true
  }
}
