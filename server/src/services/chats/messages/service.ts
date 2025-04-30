import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { AiTechPricing } from '../../../types/tech-pricing'
import { ChatMessageCreatedModel } from '../../../models/chat/chat-message-created-model'
import { ChatMessageModel } from '../../../models/chat/chat-message-model'

export class ChatMessageService {

  // Consts
  clName = 'ChatMessageService'

  million1 = 1000000  // 1 million

  // Models
  chatMessageCreatedModel = new ChatMessageCreatedModel()
  chatMessageModel

  // Code
  constructor(encryptionKey: string | undefined) {

    this.chatMessageModel = new ChatMessageModel(encryptionKey)
  }

  calcCost(
    tech: any,
    pricingTier: string,
    resource: string,
    inputTokens: number,
    outputTokens: number) {

    // Debug
    const fnName = `${this.clName}.calcCost()`

    // Define pricing key
    const pricingKey = `${tech.variantName}/${pricingTier}/${resource}`

    // Validate
    if (!AiTechPricing.pricing.hasOwnProperty(pricingKey)) {

      const message = `${fnName}: pricing not found for key: ${pricingKey}`

      console.error(message)
      throw new CustomError(message)
    }

    // Get pricing
    const pricing = AiTechPricing.pricing[pricingKey]

    // Calc cost
    const costInCents =
            ((inputTokens * pricing.inputTokens) +
             (outputTokens * pricing.outputTokens)) / this.million1 * 100

    // Rounding (to cents)
    const roundedCostInCents = Math.round(costInCents)

    // Return
    return roundedCostInCents
  }

  async getAllByChatSessionId(
          prisma: PrismaClient,
          chatSession: any) {

    return await this.chatMessageModel.getByChatSessionId(
                   prisma,
                   chatSession,
                   null)  // maxPrevMessages
  }

  async saveChatMessage(
          prisma: PrismaClient,
          chatSession: any,
          replyToId: string | null,
          fromUserProfileId: string,
          fromChatParticipantId: string,
          toChatParticipantId: string,
          externalId: string | null,
          sentByAi: boolean,
          message: string,
          tech: any,
          pricingTier: string | undefined,
          inputTokens: number | undefined,
          outputTokens: number | undefined) {

    // Debug
    const fnName = `${this.clName}.saveChatMessage()`

    // console.log(`${fnName}: inputTokens: ${inputTokens} outputTokens ` +
    //             `${outputTokens}`)

    // Create ChatMessage
    const chatMessage = await
            this.chatMessageModel.create(
              prisma,
              undefined,  // id
              chatSession,
              replyToId,
              fromUserProfileId,
              fromChatParticipantId,
              toChatParticipantId,
              externalId,
              sentByAi,
              message)

    // There are cases where the message is just for context, and was never
    // sent to an AI API. In these cases return early (don't create a
    // ChatMessageCreated record).
    if (tech == null) {
      return chatMessage
    }

    // Validate
    if (inputTokens == null ||
        outputTokens == null) {

      const message = `${fnName}: inputTokens or outputTokens not ` +
                      `specified, but tech was specified`

      console.error(message)
      throw new CustomError(message)
    }

    // Calculate the cost, but only if tokens are present and the pricing tier
    // is paid.
    var costInCents = 0.0

    if (pricingTier === 'paid' &&
        (inputTokens > 0 ||
         outputTokens > 0)) {

      costInCents =
        this.calcCost(
          tech,
          pricingTier,
          'text',
          inputTokens,
          outputTokens)
    }

    // Create ChatMessageCreated
    await this.chatMessageCreatedModel.create(
            prisma,
            fromUserProfileId,
            tech.id,
            sentByAi,
            inputTokens,
            outputTokens,
            costInCents)

    // Return
    return chatMessage
  }
}
