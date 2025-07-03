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
  static googleGemini_V2pt5FlashLite = 'Google Gemini v2.5 Flash-Lite'

  // OpenAI
  static openAi_Gpt4o = 'GPT-4o'
  static openAi_Gpt4pt1 = 'GPT-4.1'
  static openAi_O4Mini = 'o4-mini'
  static openAi_O3 = 'o3'

  // OpenRouter
  static deepSeekR1_0528_Chutes = 'DeepSeek R1 (0528)'

  // A list of available LLMs
  static userAILlms = [
    // Google Gemini
    /* {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V1Pro,
      default: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V1pt5Pro,
      default: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V1pt5Flash,
      default: false
    }, */
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V2Flash,
      default: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V2FlashFree,
      default: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_LatestExpFree,
      default: true
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V2pt5Pro,
      default: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V2pt5Flash,
      default: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGemini_V2pt5FlashLite,
      default: false
    },

    // OpenAI
    {
      provider: this.chatGptProvider,
      variantName: this.openAi_Gpt4o,
      default: false
    },
    {
      provider: this.chatGptProvider,
      variantName: this.openAi_Gpt4pt1,
      default: false
    },
    {
      provider: this.chatGptProvider,
      variantName: this.openAi_O4Mini,
      default: false
    },
    {
      provider: this.chatGptProvider,
      variantName: this.openAi_O3,
      default: false
    },
    // OpenRouter
    {
      provider: this.openRouterProvider,
      variantName: this.deepSeekR1_0528_Chutes,
      default: false
    },
    // Mock
    {
      provider: this.mockedProvider,
      variantName: this.mockedLlmPaid,
      default: false
    },
    {
      provider: this.mockedProvider,
      variantName: this.mockedLlmFree,
      default: false
    }
  ]

  // Model names
  static googleGeminiV1Pro_ModelName = 'gemini-pro'
  static googleGeminiV1pt5Pro_ModelName = 'gemini-1.5-pro'
  static googleGeminiV1pt5Flash_ModelName = 'gemini-1.5-flash'
  static googleGeminiV2Flash_ModelName = 'gemini-2.0-flash'
  static googleGeminiLatestExp_ModelName = 'gemini-2.0-pro-exp-02-05'
  static googleGeminiV2pt5Pro_ModelName = 'gemini-2.5-pro'
  static googleGeminiV2pt5Flash_ModelName = 'gemini-2.5-flash'
  static googleGeminiV2pt5FlashLite_ModelName = 'gemini-2.5-flash-lite-preview-06-17'

  static openAiGpt4o_ModelName = 'gpt-4o'
  static openAiGpt4pt1_ModelName = 'gpt-4.1-2025-04-14'
  static openAiO4Mini_ModelName = 'o4-mini-2025-04-16'
  static openAiO3_ModelName = 'o3-2025-04-16'

  static openRouterDeepSeekR1_0528_Chutes_ModelName = 'deepseek/deepseek-r1-0528:free'

  // Variant to model names
  static variantToModelNames = {
    // Google Gemini
    /* [AiTechDefs.googleGeminiV1Pro]: this.googleGeminiV1Pro_ModelName,
    [AiTechDefs.googleGeminiV1pt5Pro]: this.googleGeminiV1pt5Pro_ModelName,
    [AiTechDefs.googleGeminiV1pt5Flash]: this.googleGeminiV1pt5Flash_ModelName, */
    [AiTechDefs.googleGemini_V2Flash]: this.googleGeminiV2Flash_ModelName,
    [AiTechDefs.googleGemini_V2FlashFree]: this.googleGeminiV2Flash_ModelName,
    [AiTechDefs.googleGemini_LatestExpFree]: this.googleGeminiLatestExp_ModelName,
    [AiTechDefs.googleGemini_V2pt5Pro]: this.googleGeminiV2pt5Pro_ModelName,
    [AiTechDefs.googleGemini_V2pt5Flash]: this.googleGeminiV2pt5Flash_ModelName,
    [AiTechDefs.googleGemini_V2pt5FlashLite]: this.googleGeminiV2pt5FlashLite_ModelName,

    // OpenAI
    [AiTechDefs.openAi_Gpt4o]: this.openAiGpt4o_ModelName,
    [AiTechDefs.openAi_Gpt4pt1]: this.openAiGpt4pt1_ModelName,
    [AiTechDefs.openAi_O4Mini]: this.openAiO4Mini_ModelName,
    [AiTechDefs.openAi_O3]: this.openAiO3_ModelName,

    // OpenRouter
    [AiTechDefs.deepSeekR1_0528_Chutes]: this.openRouterDeepSeekR1_0528_Chutes_ModelName
  }

  // Define a large context token size
  static largeContextTokenSize = 100000  // 100k

  // Context windows by variant
  static mockedInputTokens = 1000
  static mockedOutputTokens = 1000

  static variantToMaxInputTokens = {

    // Mocked
    [AiTechDefs.mockedLlmPaid]: AiTechDefs.mockedInputTokens,
    [AiTechDefs.mockedLlmFree]: AiTechDefs.mockedInputTokens,

    // Google Gemini
    // Source: https://ai.google.dev/models/gemini
    /* [AiTechDefs.googleGemini_V1Pro]: 1048576,
    [AiTechDefs.googleGemini_V1pt5Pro]: 2097152,
    [AiTechDefs.googleGemini_V1pt5Flash]: 1048576, */
    [AiTechDefs.googleGemini_V2Flash]: 1048576,
    [AiTechDefs.googleGemini_V2FlashFree]: 1048576,
    [AiTechDefs.googleGemini_LatestExpFree]: 1048576,
    [AiTechDefs.googleGemini_V2pt5Pro]: 1048576,
    [AiTechDefs.googleGemini_V2pt5Flash]: 1048576,
    [AiTechDefs.googleGemini_V2pt5FlashLite]: 1000000,

    // OpenAI
    [AiTechDefs.openAi_Gpt4o]: 128000,
    [AiTechDefs.openAi_Gpt4pt1]: 1047576,
    [AiTechDefs.openAi_O4Mini]: 200000,
    [AiTechDefs.openAi_O3]: 200000,

    // OpenRouter
    [AiTechDefs.deepSeekR1_0528_Chutes]: 163840
  }

  static variantToMaxOutputTokens = {

    // Mocked
    [AiTechDefs.mockedLlmPaid]: AiTechDefs.mockedOutputTokens,
    [AiTechDefs.mockedLlmFree]: AiTechDefs.mockedOutputTokens,

    // Google Gemini
    // Source: https://ai.google.dev/models/gemini
    /* [AiTechDefs.googleGemini_V1Pro]: 8192,
    [AiTechDefs.googleGemini_V1pt5Pro]: 8192,
    [AiTechDefs.googleGemini_V1pt5Flash]: 8192, */
    [AiTechDefs.googleGemini_V2Flash]: 8192,
    [AiTechDefs.googleGemini_V2FlashFree]: 8192,
    [AiTechDefs.googleGemini_LatestExpFree]: 8192,
    [AiTechDefs.googleGemini_V2pt5Pro]: 65536,
    [AiTechDefs.googleGemini_V2pt5Flash]: 65536,
    [AiTechDefs.googleGemini_V2pt5FlashLite]: 64000,

    // OpenAI
    [AiTechDefs.openAi_Gpt4o]: 16384,
    [AiTechDefs.openAi_Gpt4pt1]: 32768,
    [AiTechDefs.openAi_O4Mini]: 100000,
    [AiTechDefs.openAi_O3]: 100000,

    // OpenRouter
    [AiTechDefs.deepSeekR1_0528_Chutes]: 163840
  }

  // Variants for which to ignore jsonMode. This is useful for those that keep
  // raising an exception due to badly formed JSON. An alternative can then be
  // tried, e.g. jsonRepair.
  // Not used by the Google Gemini provider
  static variantNamesToIgnoreJsonMode = [
    ''  // Can't be an empty array or a TypeScript error is raised
  ]
}
