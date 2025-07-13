import { SereneCoreServerTypes } from '@/serene-core-server/types/user-types'

export class AiTechDefs {

  // Consts
  static llms = 'LLMs'
  static chatCompletion = 'Chat Completion'

  // Categories (for UserTechProvider.category)
  static writerLlmCategory = 'Writer LLM'

  // Tech providers
  static mockedProvider = 'Mocked provider'
  static googleGeminiProvider = 'Google Gemini'
  static defaultLlmProvider = this.googleGeminiProvider

  static chatGptProvider = 'ChatGPT'
  static openRouterProvider = 'OpenRouter'

  // Tech protocols: AI
  static mockedAiProtocol = 'Mocked AI'
  static openAiProtocol = 'OpenAI'
  static geminiProtocol = 'Gemini'

  // LLMs by provider
  static googleGemini = 'Google Gemini'

  // Variant names
  // Mock
  static mockedLlmPaid = 'Mocked LLM'
  static mockedLlmFree = 'Mocked LLM (free tier)'

  // Last updated: 3rd July Feb 2025
  // Run the Setup in /admin/setup to install new variants and effect any
  // upgrade paths in service/tech/data/llms.ts.
  // static googleGemini_V1Pro = 'Google Gemini v1 Pro'
  // static googleGemini_V1pt5Pro = 'Google Gemini v1.5 Pro'
  // static googleGemini_V1pt5Flash = 'Google Gemini v1.5 Flash'
  static googleGemini_V2Flash = 'Google Gemini v2 Flash'
  static googleGemini_V2FlashFree = 'Google Gemini v2 Flash (free tier)'
  static googleGemini_LatestExpFree = 'Google Gemini Latest Experimental (free tier)'
  static googleGemini_V2pt5Pro = 'Google Gemini v2.5 Pro'
  static googleGemini_V2pt5Flash = 'Google Gemini v2.5 Flash'
  static googleGemini_V2pt5FlashFree = 'Google Gemini v2.5 Flash (free tier)'
  static googleGemini_V2pt5FlashLite = 'Google Gemini v2.5 Flash-Lite'

  // OpenAI
  static openAi_Gpt4o = 'GPT-4o'
  static openAi_Gpt4pt1 = 'GPT-4.1'
  static openAi_O4Mini = 'o4-mini'
  static openAi_O3 = 'o3'

  // OpenRouter
  static openRouter_MistralSmall3pt2_24b_Chutes = 'Mistral Small 3.2 24B'

  // Model names
  static googleGemini_V1Pro_ModelName = 'gemini-pro'
  static googleGemini_V1pt5Pro_ModelName = 'gemini-1.5-pro'
  static googleGemini_V1pt5Flash_ModelName = 'gemini-1.5-flash'
  static googleGemini_V2Flash_ModelName = 'gemini-2.0-flash'
  static googleGemini_LatestExp_ModelName = 'gemini-2.0-pro-exp-02-05'
  static googleGemini_V2pt5Pro_ModelName = 'gemini-2.5-pro'
  static googleGemini_V2pt5Flash_ModelName = 'gemini-2.5-flash'
  static googleGemini_V2pt5FlashLite_ModelName = 'gemini-2.5-flash-lite-preview-06-17'

  static openAi_Gpt4o_ModelName = 'gpt-4o'
  static openAi_Gpt4pt1_ModelName = 'gpt-4.1-2025-04-14'
  static openAi_O4Mini_ModelName = 'o4-mini-2025-04-16'
  static openAi_O3_ModelName = 'o3-2025-04-16'

  static openRouter_MistralSmall3pt2_24b_Chutes_ModelName = 'mistralai/mistral-small-3.2-24b-instruct-2506:free'

  // Context sizes
  static mockedInputTokens = 1000
  static mockedOutputTokens = 1000

  // LLM tech providers
  static llmTechProviders = [
    {
      name: this.googleGeminiProvider
    },
    {
      name: this.chatGptProvider
    },
    {
      name: this.openRouterProvider,
      baseUrl: 'https://openrouter.ai/api/v1'
    },
    {
      name: this.mockedProvider
    }    
  ]

  // A list of available LLMs
  static llmTechs = [
    // Google Gemini
    /* {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V1Pro,
      model: this.googleGemini_V1Pro_ModelName,
      protocol: this.geminiProtocol,
      pricingTier: SereneCoreServerTypes.paid,
      inputTokens: 1048576,
      outputTokens: 8192,
      default: false,
      isAdminOnly: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V1pt5Pro,
      model: this.googleGemini_V1pt5Pro_ModelName,
      protocol: this.geminiProtocol,
      pricingTier: SereneCoreServerTypes.paid,
      inputTokens: 2097152,
      outputTokens: 8192,
      default: false,
      isAdminOnly: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V1pt5Flash,
      model: this.googleGeminiV1pt5Flash_ModelName,
      protocol: this.geminiProtocol,
      pricingTier: SereneCoreServerTypes.paid,
      inputTokens: 1048576,
      outputTokens: 8192,
      default: false,
      isAdminOnly: false
    }, */
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V2Flash,
      model: this.googleGemini_V2Flash_ModelName,
      protocol: this.geminiProtocol,
      pricingTier: SereneCoreServerTypes.paid,
      inputTokens: 1048576,
      outputTokens: 8192,
      default: false,
      isAdminOnly: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V2FlashFree,
      model: this.googleGemini_V2Flash_ModelName,
      protocol: this.geminiProtocol,
      pricingTier: SereneCoreServerTypes.free,
      inputTokens: 1048576,
      outputTokens: 8192,
      default: false,
      isAdminOnly: true,
      rateLimited: {
        perMinute: 15
      }
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_LatestExpFree,
      model: this.googleGemini_LatestExp_ModelName,
      protocol: this.geminiProtocol,
      pricingTier: SereneCoreServerTypes.free,
      inputTokens: 1048576,
      outputTokens: 8192,
      default: true,
      isAdminOnly: true,
      rateLimited: {
        perMinute: 10
      }
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V2pt5Pro,
      model: this.googleGemini_V2pt5Pro_ModelName,
      protocol: this.geminiProtocol,
      pricingTier: SereneCoreServerTypes.paid,
      inputTokens: 1048576,
      outputTokens: 65536,
      default: false,
      isAdminOnly: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V2pt5Flash,
      model: this.googleGemini_V2pt5Flash_ModelName,
      protocol: this.geminiProtocol,
      pricingTier: SereneCoreServerTypes.paid,
      inputTokens: 1048576,
      outputTokens: 65536,
      default: false,
      isAdminOnly: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V2pt5FlashFree,
      model: this.googleGemini_V2pt5Flash_ModelName,
      protocol: this.geminiProtocol,
      pricingTier: SereneCoreServerTypes.free,
      inputTokens: 1048576,
      outputTokens: 65536,
      default: false,
      isAdminOnly: true,
      rateLimited: {
        perMinute: 10
      }
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V2pt5FlashLite,
      model: this.googleGemini_V2pt5FlashLite_ModelName,
      protocol: this.geminiProtocol,
      pricingTier: SereneCoreServerTypes.paid,
      inputTokens: 1000000,
      outputTokens: 64000,
      default: false,
      isAdminOnly: false
    },

    // OpenAI
    {
      provider: this.chatGptProvider,
      variantName: this.openAi_Gpt4o,
      model: this.openAi_Gpt4o_ModelName,
      protocol: this.openAiProtocol,
      pricingTier: SereneCoreServerTypes.paid,
      inputTokens: 128000,
      outputTokens: 16384,
      default: false,
      isAdminOnly: false
    },
    {
      provider: this.chatGptProvider,
      variantName: this.openAi_Gpt4pt1,
      model: this.openAi_Gpt4pt1_ModelName,
      protocol: this.openAiProtocol,
      pricingTier: SereneCoreServerTypes.paid,
      inputTokens: 1047576,
      outputTokens: 32768,
      default: false,
      isAdminOnly: false
    },
    {
      provider: this.chatGptProvider,
      variantName: this.openAi_O4Mini,
      model: this.openAi_O4Mini_ModelName,
      protocol: this.openAiProtocol,
      pricingTier: SereneCoreServerTypes.paid,
      inputTokens: 200000,
      outputTokens: 100000,
      default: false,
      isAdminOnly: false
    },
    {
      provider: this.chatGptProvider,
      variantName: this.openAi_O3,
      model: this.openAi_O3_ModelName,
      protocol: this.openAiProtocol,
      pricingTier: SereneCoreServerTypes.paid,
      inputTokens: 200000,
      outputTokens: 100000,
      default: false,
      isAdminOnly: false
    },
    // OpenRouter
    {
      provider: this.openRouterProvider,
      variantName: this.openRouter_MistralSmall3pt2_24b_Chutes,
      model: this.openRouter_MistralSmall3pt2_24b_Chutes_ModelName,
      protocol: this.openAiProtocol,
      pricingTier: SereneCoreServerTypes.free,
      inputTokens: 96000,   // Note: this is really a combined input+output size
      outputTokens: 96000,
      default: false,
      isAdminOnly: false
    },
    // Mock
    {
      provider: this.mockedProvider,
      variantName: this.mockedLlmPaid,
      model: null,
      protocol: this.mockedAiProtocol,
      pricingTier: SereneCoreServerTypes.paid,
      inputTokens: 1000,
      outputTokens: 1000,
      default: false,
      isAdminOnly: false
    },
    {
      provider: this.mockedProvider,
      variantName: this.mockedLlmFree,
      model: null,
      protocol: this.mockedAiProtocol,
      pricingTier: SereneCoreServerTypes.free,
      inputTokens: 1000,
      outputTokens: 1000,
      default: false,
      isAdminOnly: false
    }
  ]

  // Variants for which to ignore jsonMode. This is useful for those that keep
  // raising an exception due to badly formed JSON. An alternative can then be
  // tried, e.g. jsonRepair.
  // Not used by the Google Gemini provider
  static variantNamesToIgnoreJsonMode = [
    ''  // Can't be an empty array or a TypeScript error is raised
  ]
}
