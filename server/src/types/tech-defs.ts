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

  // Last updated: 18th Feb 2024
  // Run the Setup in /admin/setup to install new variants and effect any
  // upgrade paths in service/tech/data/llms.ts.
  static googleGeminiV1Pro = 'Google Gemini v1 Pro'
  static googleGeminiV1pt5Pro = 'Google Gemini v1.5 Pro'
  static googleGeminiV1pt5Flash = 'Google Gemini v1.5 Flash'
  static googleGeminiV2Flash = 'Google Gemini v2 Flash'
  static googleGeminiV2FlashFree = 'Google Gemini v2 Flash (free tier)'
  static googleGeminiLatestExpFree = 'Google Gemini Latest Experimental (free tier)'

  static genericModel = 'Generic'
  static v1ProVersion = 'v1 Pro'
  static v1pt5ProVersion = 'v1.5 Pro'
  static v1pt5FlashVersion = 'v1.5 Flash'
  static v2FlashVersion = 'v2 Flash'
  static expVersion = 'Experimental'

  // OpenAI
  static chatGpt4o = 'GPT-4o'

  // OpenRouter
  static deepSeekR1_0528_Chutes = 'DeepSeek R1 (0528)'

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
      variantName: this.googleGeminiV2FlashFree,
      default: false
    },
    {
      provider: this.googleGeminiProvider,
      variantName: this.googleGeminiLatestExpFree,
      default: true
    },

    // OpenAI
    {
      provider: this.chatGptProvider,
      variantName: this.chatGpt4o,
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
  static googleGeminiV1ProModelName = 'gemini-pro'
  static googleGeminiV1pt5ProModelName = 'gemini-1.5-pro'
  static googleGeminiV1pt5FlashModelName = 'gemini-1.5-flash'
  static googleGeminiV2FlashModelName = 'gemini-2.0-flash'
  static googleGeminiLatestExpModelName = 'gemini-2.0-pro-exp-02-05'

  static chatGpt4oModelName = 'gpt-4o'

  static openRouterDeepSeekR1_0528_Chutes_ModelName = 'deepseek/deepseek-r1-0528:free'

  // Variant to model names
  static variantToModelNames = {
    // Google Gemini
    [AiTechDefs.googleGeminiV1Pro]: this.googleGeminiV1ProModelName,
    [AiTechDefs.googleGeminiV1pt5Pro]: this.googleGeminiV1pt5ProModelName,
    [AiTechDefs.googleGeminiV1pt5Flash]: this.googleGeminiV1pt5FlashModelName,
    [AiTechDefs.googleGeminiV2Flash]: this.googleGeminiV2FlashModelName,
    [AiTechDefs.googleGeminiV2FlashFree]: this.googleGeminiV2FlashModelName,
    [AiTechDefs.googleGeminiLatestExpFree]: this.googleGeminiLatestExpModelName,

    // OpenAI
    [AiTechDefs.chatGpt4o]: this.chatGpt4oModelName,

    // OpenRouter
    [AiTechDefs.deepSeekR1_0528_Chutes]: this.openRouterDeepSeekR1_0528_Chutes_ModelName
  }

  // Variant to providers
  static variantToProviders = {
    [AiTechDefs.mockedLlmPaid]: this.mockedProvider,
    [AiTechDefs.mockedLlmFree]: this.mockedProvider,

    [AiTechDefs.googleGeminiV1Pro]: this.googleGeminiProvider,
    [AiTechDefs.googleGeminiV1pt5Pro]: this.googleGeminiProvider,
    [AiTechDefs.googleGeminiV1pt5Flash]: this.googleGeminiProvider,
    [AiTechDefs.googleGeminiV2Flash]: this.googleGeminiProvider,
    [AiTechDefs.googleGeminiV2FlashFree]: this.googleGeminiProvider,
    [AiTechDefs.googleGeminiLatestExpFree]: this.googleGeminiProvider,

    [AiTechDefs.chatGpt4o]: this.chatGptProvider,
    [AiTechDefs.deepSeekR1_0528_Chutes]: this.openRouterProvider
  }

  // Variant names to descriptions
  static variantNamesToDescriptions = {

    // Mocked
    [AiTechDefs.mockedLlmPaid]: 'Mocked LLM',
    [AiTechDefs.mockedLlmFree]: 'Mocked LLM (free iter)',

    // Google Gemini
    [AiTechDefs.googleGeminiV1Pro]: 'Gemini v1 Pro',
    [AiTechDefs.googleGeminiV1pt5Pro]: 'Gemini v1.5 Pro',
    [AiTechDefs.googleGeminiV1pt5Flash]: 'Gemini v1.5 Flash',
    [AiTechDefs.googleGeminiV2Flash]: 'Gemini v2 Flash',
    [AiTechDefs.googleGeminiV2FlashFree]: 'Gemini v2 Flash (free)',
    [AiTechDefs.googleGeminiLatestExpFree]: 'Gemini Latest Experimental (free)',

    // OpenAI
    [AiTechDefs.chatGpt4o]: 'GPT-4o',

    // OpenRouter
    [AiTechDefs.deepSeekR1_0528_Chutes]: 'DeepSeek R1 (0528) (OpenRouter/Chutes)'
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
    [AiTechDefs.googleGeminiV1Pro]: 1048576,
    [AiTechDefs.googleGeminiV1pt5Pro]: 2097152,
    [AiTechDefs.googleGeminiV1pt5Flash]: 1048576,
    [AiTechDefs.googleGeminiV2Flash]: 1048576,
    [AiTechDefs.googleGeminiV2FlashFree]: 1048576,
    [AiTechDefs.googleGeminiLatestExpFree]: 1048576,

    // OpenAI
    [AiTechDefs.chatGpt4o]: 128000,

    // OpenRouter
    [AiTechDefs.deepSeekR1_0528_Chutes]: 163840
  }

  static variantToMaxOutputTokens = {

    // Mocked
    [AiTechDefs.mockedLlmPaid]: AiTechDefs.mockedOutputTokens,
    [AiTechDefs.mockedLlmFree]: AiTechDefs.mockedOutputTokens,

    // Google Gemini
    // Source: https://ai.google.dev/models/gemini
    [AiTechDefs.googleGeminiV1Pro]: 8192,
    [AiTechDefs.googleGeminiV1pt5Pro]: 8192,
    [AiTechDefs.googleGeminiV1pt5Flash]: 8192,
    [AiTechDefs.googleGeminiV2Flash]: 8192,
    [AiTechDefs.googleGeminiV2FlashFree]: 8192,
    [AiTechDefs.googleGeminiLatestExpFree]: 8192,

    // OpenAI
    [AiTechDefs.chatGpt4o]: 16384,

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
