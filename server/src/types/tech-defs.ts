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

  // LLMs by provider
  static googleGemini = 'Google Gemini'

  // Variant names
  // Last updated: 18th Feb 2024
  // Run the Setup in /admin/setup to install new variants and effect any
  // upgrade paths in service/tech/data/llms.ts.
  static googleGeminiV1Pro = 'Google Gemini v1 Pro'
  static googleGeminiV1pt5Pro = 'Google Gemini v1.5 Pro'

  static genericModel = 'Generic'
  static v1ProVersion = 'v1 Pro'
  static v1pt5ProVersion = 'v1.5 Pro'

  // Project default
  static defaultLlmVariantName = this.googleGeminiV1pt5Pro
  static defaultChatVariantName = this.googleGeminiV1pt5Pro

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
      default: true
    }
  ]

  // Model names
  static googleGeminiV1ProModelName = 'gemini-pro'
  static googleGeminiV1pt5ProModelName = 'gemini-1.5-pro-latest'

  // Variant to model names
  static variantToModelNames = {
    // Google Gemini
    [AiTechDefs.googleGeminiV1Pro]: this.googleGeminiV1ProModelName,
    [AiTechDefs.googleGeminiV1pt5Pro]: this.googleGeminiV1pt5ProModelName
  }

  static variantNamesToDescriptions = {
    // Google Gemini
    [AiTechDefs.googleGeminiV1Pro]: 'Gemini Pro v1 Pro',
    [AiTechDefs.googleGeminiV1pt5Pro]: 'Gemini Pro v1.5 Pro'
  }

  static contextWindows = [
    // Google Gemini
    // Source: https://ai.google.dev/models/gemini
    {
      variant: this.googleGeminiV1Pro,
      size: 1048576
    },
    {
      variant: this.googleGeminiV1pt5Pro,
      size: 30720
    }
  ]
}
