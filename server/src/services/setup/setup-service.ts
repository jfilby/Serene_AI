import { RateLimitedApiModel } from '@/serene-core-server/models/tech/rate-limited-api-model'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { AiTechDefs } from '../../types/tech-defs'
import { AiTechPricing } from '../../types/tech-pricing'
import { ServerOnlyTypes } from '../../types/server-only-types'
import { SereneCoreServerTypes } from '@/serene-core-server/types/user-types'

export class SereneAiSetup {

  // Consts
  clName = 'SereneAiSetup'

  // Models
  rateLimitedApiModel = new RateLimitedApiModel()
  techModel = new TechModel()
  // tipModel = new TipModel()

  // Code
  async upsertTech(prisma: any) {

    // Apollo.io API
    const apolloIoApiTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              true,       // isDefaultProvider
              ServerOnlyTypes.apolloIoApi,
              ServerOnlyTypes.restApi,
              SereneCoreServerTypes.free)

    await this.rateLimitedApiModel.upsert(
            prisma,
            undefined,  // id
            apolloIoApiTech.id,
            1000000)

    // Gemini v1.5 Pro
    const geminiV1pt5ProTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              false,      // isDefaultProvider
              AiTechDefs.googleGeminiV1pt5Pro,
              AiTechDefs.llms,
              SereneCoreServerTypes.paid)

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
              false,      // isDefaultProvider
              AiTechDefs.googleGeminiV1pt5Flash,
              AiTechDefs.llms,
              SereneCoreServerTypes.paid)

    await this.rateLimitedApiModel.upsert(
            prisma,
            undefined,    // id
            geminiV1pt5FlashTech.id,
            15 - 1)       // -1 for a buffer (found to be needed in actual runs)

    // Gemini v2 Flash
    const geminiV2FlashTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              true,       // isDefaultProvider
              AiTechDefs.googleGeminiV2Flash,
              AiTechDefs.llms,
              SereneCoreServerTypes.paid)

    await this.rateLimitedApiModel.upsert(
            prisma,
            undefined,    // id
            geminiV2FlashTech.id,
            10)

    // Gemini latest experimental
    const geminiLatestExpTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              false,      // isDefaultProvider
              AiTechDefs.googleGeminiLatestExp,
              AiTechDefs.llms,
              SereneCoreServerTypes.paid)

    await this.rateLimitedApiModel.upsert(
            prisma,
            undefined,    // id
            geminiLatestExpTech.id,
            10)

    // ChatGPT 4o
    const chatGpt4oTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              false,      // isDefaultProvider
              AiTechDefs.chatGpt4o,
              AiTechDefs.llms,
              SereneCoreServerTypes.paid)

    // Llama3 8B
    const llama3_8bTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              false,      // isDefaultProvider
              AiTechDefs.llama3_8b,
              AiTechDefs.llms,
              SereneCoreServerTypes.paid)

    await this.rateLimitedApiModel.upsert(
            prisma,
            undefined,  // id
            llama3_8bTech.id,
            15)
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
