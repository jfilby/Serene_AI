import { CustomError } from '@/serene-core-server/types/errors'
import { RateLimitedApiEventModel } from '@/serene-core-server/models/tech/rate-limited-api-event-model'
import { RateLimitedApiModel } from '@/serene-core-server/models/tech/rate-limited-api-model'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { AiTechDefs } from '../../types/tech-defs'
import { LlmCacheModel } from '../../models/cache/llm-cache-model'
import { ChatApiUsageService } from '../api-usage/chat-api-usage-service'
import { DetectContentTypeService } from '../content/detect-content-type-service'
import { LlmUtilsService } from './utils-service'

export class ChatService {

  // Consts
  clName = 'ChatService'

  // Models
  llmCacheModel = new LlmCacheModel()
  rateLimitedApiEventModel = new RateLimitedApiEventModel()
  rateLimitedApiModel = new RateLimitedApiModel()
  techModel = new TechModel()

  // Services
  chatApiUsageService = new ChatApiUsageService()
  detectContentTypeService = new DetectContentTypeService()
  llmUtilsService = new LlmUtilsService()

  // Code
  cleanMultiLineFormatting(messages: string[]) {

    const contents: string[] = messages.join('\n').split('\n')
    var newContents: string[] = []

    for (const content of contents) {

      if (content.length < 3) {
        newContents.push(content)
      } else {
        // Check for leading chars with a space, e.g. `- ` and `o `
        if (this.isAlphaNumeric(content[0]) === false &&
            content[1] === ' ') {

          newContents.push(content.slice(2))
          continue
        }

        newContents.push(content)
      }
    }

    return newContents
  }

  convertToGenericMessageFormat(messages: any) {

    // Debug
    const fnName = `${this.clName}.convertToGenericMessageFormat()`

    // Convert
    var newMessages: any[] = []

    for (const message of messages) {

      // Try to determine the message type
      const type = this.detectContentTypeService.detect(message)

      // Add new message
      newMessages.push({
        type: type,
        text: message
      })
    }

    // Return
    return newMessages
  }

  isAlphaNumeric(chr: string) {

    // chr is a string that is meant to represent a single char
    const code = chr.charCodeAt(0)

    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false
    }

    return true
  }

  async llmRequest(
          prisma: any,
          llmTechId: string | undefined,
          userProfileId: string | undefined,
          agent: any,
          messagesWithRoles: any[],
          systemPrompt: string | undefined = undefined,
          jsonMode: boolean = false) {

    // Debug
    const fnName = `${this.clName}.llmRequest()`

    // Get the messages as a lowercase string
    const lowerMessagesStr = JSON.stringify(messagesWithRoles).toLowerCase()

    /* Try the cache
    const llmCache = await
            this.llmCacheModel.getByKey(
              prisma,
              lowerMessagesStr)

    if (llmCache != null) {
      return llmCache.value.split('\n')
    } */

    // If llmTechId isn't specified, get the default
    var tech: any

    if (llmTechId == null) {

      tech = await
        this.techModel.getDefaultProvider(
          prisma,
          AiTechDefs.llms)

      if (tech != null) {
        llmTechId = tech.id
      }
    }

    if (llmTechId == null) {
      throw new CustomError(`${fnName}: no LLM default LLM tech available`)
    }

    // Get userProfileId if agent specified
    if (userProfileId == null &&
        agent != null) {

      userProfileId = agent.userProfileId
    }

    if (userProfileId == null) {
      throw new CustomError(
                  `${fnName}: no userProfileId given and agent not available`)
    }

    // Check to see if rate limited
    const rateLimitedData = await
            this.chatApiUsageService.isRateLimited(
              prisma,
              llmTechId)

    // If a rate-limited tech
    if (rateLimitedData != null) {

      if (rateLimitedData.isRateLimited === true) {

        return {
          isRateLimited: rateLimitedData.isRateLimited,
          waitSeconds: rateLimitedData.waitSeconds,
          messages: undefined
        }
      }

      // Create rate-limited API event
      await this.rateLimitedApiEventModel.create(
              prisma,
              undefined,  // id
              rateLimitedData.rateLimitedApiId,
              userProfileId)
    }

    // Get Tech if not yet retrieved
    if (tech == null) {

      tech = await
        this.techModel.getById(
          prisma,
          llmTechId)
    }

    // Prepare messages and send request by provider
    const results = await
            this.llmUtilsService.prepareAndSendChatMessages(
              tech,
              agent,
              systemPrompt,
              messagesWithRoles,
              jsonMode)

    // Get result output as a string
    var messageText = ''

    if (results != null) {

      for (const message of results.messages) {

        if (messageText.length > 0) {
          messageText += '\n'
        }

        messageText += message
      }

      /* Add to the cache
      this.llmCacheModel.upsert(
        prisma,
        undefined,  // id
        lowerMessagesStr,
        messageText) */

      // Convert to generic message format
      results.messages = this.convertToGenericMessageFormat(results.messages)
    } else {
      throw new CustomError(`${fnName}: results == null`)
    }

    // Return
    return {
      status: results.status,
      isRateLimited: false,
      waitSeconds: 0,
      message: results.message,
      messages: results.messages,
      model: results.model,
      actualTech: results.actualTech,
      inputTokens: results.inputTokens,
      outputTokens: results.outputTokens
    }
  }
}
