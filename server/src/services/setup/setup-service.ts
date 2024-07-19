import { RateLimitedApiModel } from '@/serene-core-server/models/tech/rate-limited-api-model'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { AiTechDefs } from '../../types/tech-defs'
import { ServerOnlyTypes } from '../../types/server-only-types'

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
              ServerOnlyTypes.restApi)

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
              true,       // isDefaultProvider
              AiTechDefs.googleGeminiV1pt5Pro,
              AiTechDefs.llms)

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
              true,       // isDefaultProvider
              AiTechDefs.googleGeminiV1pt5Flash,
              AiTechDefs.llms)

    await this.rateLimitedApiModel.upsert(
            prisma,
            undefined,  // id
            geminiV1pt5ProTech.id,
            15)

    // ChatGPT 4o
    const chatGpt4oTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              false,      // isDefaultProvider
              AiTechDefs.chatGpt4o,
              AiTechDefs.llms)

    // Llama3 8B
    const llama3_8bTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              false,      // isDefaultProvider
              AiTechDefs.llama3_8b,
              AiTechDefs.llms)
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
