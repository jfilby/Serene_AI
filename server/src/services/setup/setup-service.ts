import { AiTechDefs } from '../../types/tech-defs'
import { ServerOnlyTypes } from '../../types/server-only-types'
import { CommonTypes } from '../../types/types'
import { RateLimitedApiModel } from '../../models/chat/rate-limited-api-model'
import { TechModel } from '../../models/tech/tech-model'

export class SereneGeminiSetup {

  // Consts
  clName = 'SereneGeminiSetup'

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
