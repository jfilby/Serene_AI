import { RateLimitedApiModel } from '@/serene-core-server/models/tech/rate-limited-api-model'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { TechProviderModel } from '@/serene-core-server/models/tech/tech-provider-model'
import { AiTechDefs } from '../../types/tech-defs'
import { SereneAiServerOnlyTypes } from '../../types/server-only-types'
import { SereneCoreServerTypes } from '@/serene-core-server/types/user-types'

export class SereneAiSetup {

  // Consts
  clName = 'SereneAiSetup'

  // Models
  rateLimitedApiModel = new RateLimitedApiModel()
  techModel = new TechModel()
  techProviderModel = new TechProviderModel()
  // tipModel = new TipModel()

  // Code
  async upsertTech(prisma: any) {

    // Apollo.io API
    const apolloIoTechProvider = await
            this.techProviderModel.upsert(
              prisma,
              undefined,  // id
              SereneAiServerOnlyTypes.activeStatus,
              'Apollo.io',
              null)       // baseUrl

    const apolloIoApiTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              apolloIoTechProvider.id,
              SereneAiServerOnlyTypes.activeStatus,
              SereneAiServerOnlyTypes.apolloIoApi,
              SereneAiServerOnlyTypes.restApi,
              SereneAiServerOnlyTypes.graphQlProtocol,
              SereneCoreServerTypes.free,
              true,       // isDefaultProvider
              false)      // isAdminOnly

    await this.rateLimitedApiModel.upsert(
            prisma,
            undefined,  // id
            apolloIoApiTech.id,
            1000000)

    // Mocked LLM (paid)
    const mockedProvider = await
            this.techProviderModel.upsert(
              prisma,
              undefined,  // id
              SereneAiServerOnlyTypes.activeStatus,
              'Mock provider',
              null)       // baseUrl

    const mockedLlmPaidTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              mockedProvider.id,
              SereneAiServerOnlyTypes.activeStatus,
              AiTechDefs.mockedLlmPaid,
              AiTechDefs.llms,
              AiTechDefs.mockedAiProtocol,
              SereneCoreServerTypes.paid,
              false,      // isDefaultProvider
              true)       // isAdminOnly

    // Mocked LLM (free)
    const mockedLlmFreeTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              mockedProvider.id,
              SereneAiServerOnlyTypes.activeStatus,
              AiTechDefs.mockedLlmFree,
              AiTechDefs.llms,
              AiTechDefs.mockedAiProtocol,
              SereneCoreServerTypes.free,
              false,      // isDefaultProvider
              true)       // isAdminOnly

    // Google Gemini provider
    const googleGeminiTechProvider = await
            this.techProviderModel.upsert(
              prisma,
              undefined,  // id
              SereneAiServerOnlyTypes.activeStatus,
              'Google Gemini',
              null)       // baseUrl

    // Gemini v1.5 Pro
    const geminiV1pt5ProTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              googleGeminiTechProvider.id,
              SereneAiServerOnlyTypes.activeStatus,
              AiTechDefs.googleGeminiV1pt5Pro,
              AiTechDefs.llms,
              AiTechDefs.geminiProtocol,
              SereneCoreServerTypes.paid,
              false,      // isDefaultProvider
              false)      // isAdminOnly

    await this.rateLimitedApiModel.upsert(
            prisma,
            undefined,  // id
            geminiV1pt5ProTech.id,
            2)

    // Gemini v1.5 Flash
    const geminiV1pt5FlashTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              googleGeminiTechProvider.id,
              SereneAiServerOnlyTypes.activeStatus,
              AiTechDefs.googleGeminiV1pt5Flash,
              AiTechDefs.llms,
              AiTechDefs.geminiProtocol,
              SereneCoreServerTypes.paid,
              false,      // isDefaultProvider
              false)      // isAdminOnly

    await this.rateLimitedApiModel.upsert(
            prisma,
            undefined,    // id
            geminiV1pt5FlashTech.id,
            15 - 1)       // -1 for a buffer (found to be needed in actual runs)

    // Gemini v2 Flash (free / admin only)
    const geminiV2FlashFreeTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              googleGeminiTechProvider.id,
              SereneAiServerOnlyTypes.activeStatus,
              AiTechDefs.googleGeminiV2FlashFree,
              AiTechDefs.llms,
              AiTechDefs.geminiProtocol,
              SereneCoreServerTypes.free,
              true,       // isDefaultProvider
              true)       // isAdminOnly

    await this.rateLimitedApiModel.upsert(
            prisma,
            undefined,    // id
            geminiV2FlashFreeTech.id,
            10)

    // Gemini v2 Flash (paid)
    const geminiV2FlashPaidTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              googleGeminiTechProvider.id,
              SereneAiServerOnlyTypes.activeStatus,
              AiTechDefs.googleGeminiV2Flash,
              AiTechDefs.llms,
              AiTechDefs.geminiProtocol,
              SereneCoreServerTypes.paid,
              false,      // isDefaultProvider
              false)      // isAdminOnly

    // Gemini latest experimental
    const geminiLatestExpTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              googleGeminiTechProvider.id,
              SereneAiServerOnlyTypes.activeStatus,
              AiTechDefs.googleGeminiLatestExpFree,
              AiTechDefs.llms,
              AiTechDefs.geminiProtocol,
              SereneCoreServerTypes.paid,
              false,      // isDefaultProvider
              true)       // isAdminOnly

    await this.rateLimitedApiModel.upsert(
            prisma,
            undefined,    // id
            geminiLatestExpTech.id,
            10)

    // OpenAI provider
    const openAiTechProvider = await
            this.techProviderModel.upsert(
              prisma,
              undefined,  // id
              SereneAiServerOnlyTypes.activeStatus,
              'OpenAI',
              null)       // baseUrl

    // ChatGPT 4o
    const chatGpt4oTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              openAiTechProvider.id,
              SereneAiServerOnlyTypes.activeStatus,
              AiTechDefs.chatGpt4o,
              AiTechDefs.llms,
              AiTechDefs.openAiProtocol,
              SereneCoreServerTypes.paid,
              false,      // isDefaultProvider
              false)      // isAdminOnly

    // OpenRouter provider
    const openRouterTechProvider = await
            this.techProviderModel.upsert(
              prisma,
              undefined,                       // id
              SereneAiServerOnlyTypes.activeStatus,
              'OpenRouter',
              'https://openrouter.ai/api/v1')  // baseUrl

    // Deepseek R1 (Chutes)
    const deepseekR1ChutesTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              openRouterTechProvider.id,
              SereneAiServerOnlyTypes.activeStatus,
              AiTechDefs.deepSeekR1_0528_Chutes,
              AiTechDefs.llms,
              AiTechDefs.openAiProtocol,
              SereneCoreServerTypes.free,
              false,      // isDefaultProvider
              false)      // isAdminOnly
  }

  /* async upsertTips(prisma: any) {

    // Worksheet intro tips
    await this.tipModel.upsert(
            prisma,
            undefined,  // id
            CommonTypes.sendChatMessageTipName,
            [CommonTypes.workbookTipTag])

    await this.tipModel.upsert(
            prisma,
            undefined,  // id
            CommonTypes.nextStageTipName,
            [CommonTypes.workbookTipTag])
  } */

  async setup(prisma: any,
              userProfileId: string) {

    // Upsert data
    await this.upsertTech(prisma)
    // await this.upsertTips(prisma)

    // Return
    return {
      status: true
    }
  }
}
