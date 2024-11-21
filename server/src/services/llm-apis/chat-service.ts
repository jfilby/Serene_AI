const blake2b = require('blake2b')
import { jsonrepair } from 'jsonrepair'
import { CustomError } from '@/serene-core-server/types/errors'
import { sleepSeconds } from '@/serene-core-server/services/process/sleep'
import { RateLimitedApiEventModel } from '@/serene-core-server/models/tech/rate-limited-api-event-model'
import { RateLimitedApiModel } from '@/serene-core-server/models/tech/rate-limited-api-model'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { AiTechDefs } from '../../types/tech-defs'
import { LlmCacheModel } from '../../models/cache/llm-cache-model'
import { ChatApiUsageService } from '../api-usage/chat-api-usage-service'
import { DetectContentTypeService } from '../content/detect-content-type-service'
import { LlmUtilsService } from './utils-service'
import { TextParsingService } from '../content/text-parsing-service'

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
  textParsingService = new TextParsingService()

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
          jsonMode: boolean = false,
          tryGetFromCache: boolean = false) {

    // Debug
    const fnName = `${this.clName}.llmRequest()`

    // Loop until not rate-limited
    var chatCompletionResults: any = {
      message: `${fnName}: Not initialized`
    }

    var tries = 0
    const maxTries = 5

    while (tries < maxTries) {

      // Call Gemini to get full results
      chatCompletionResults = await
        this.prepAndSendLlmRequest(
          prisma,
          llmTechId,
          userProfileId,
          agent,
          messagesWithRoles,
          systemPrompt,
          jsonMode,
          tryGetFromCache)

      // If not rate-limited
      if (chatCompletionResults.isRateLimited === false) {

        // Inc tries
        tries += 1

        // Try to parse JSON
        if (jsonMode === true &&
            chatCompletionResults.json == null) {

          // Log the chatCompletionResults
          console.log(
            `${fnName}: jsonMode === true, but json not provided.\n` +
            `ChatCompletionResults: ` +
            JSON.stringify(chatCompletionResults))

          // Manually parse JSON
          var jsonText = chatCompletionResults.messages[0].text

          if (jsonText !== '[' && jsonText !== '{') {

            const jsonExtracts =
                    this.textParsingService.getJsonExtractExcludingQuotesWithBraces(
                      jsonText)

            try {
              jsonText =
                jsonrepair(
                  jsonExtracts.extracts.join('\n').trim())
            } catch(e) {
              console.log(`${fnName}: jsonRepair failed, retrying..`)
              continue
            }
          }

          chatCompletionResults.json = JSON.parse(jsonText)
        }

        // Done
        break
      } else {
        if (chatCompletionResults.waitSeconds != null) {
          await sleepSeconds(chatCompletionResults.waitSeconds)
        }
      }
    }

    // Failed?
    if (tries === maxTries) {

      throw new CustomError(`${fnName}: failed after ${maxTries} tries`)
    }

    return chatCompletionResults
  }

  // Note: don't call directly, rather call llmRequest().
  private async prepAndSendLlmRequest(
                  prisma: any,
                  llmTechId: string | undefined,
                  userProfileId: string | undefined,
                  agent: any,
                  messagesWithRoles: any[],
                  systemPrompt: string | undefined = undefined,
                  jsonMode: boolean = false,
                  tryGetFromCache: boolean = false) {

    // Debug
    const fnName = `${this.clName}.prepAndSendLlmRequest()`

    // console.log(`${fnName}: starting with jsonMode: ${jsonMode}`)

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

    // Get the cache key if required
    var cacheKey: string | undefined

    if (tryGetFromCache === true) {

      const cacheKeyOutput = new Uint8Array(64)
      const cacheKeyInput = Buffer.from(JSON.stringify(messagesWithRoles).toLowerCase())

      cacheKey = blake2b(cacheKeyOutput.length).update(cacheKeyInput).digest('hex')
    }

    // Try the cache
    if (tryGetFromCache === true &&
        cacheKey != null) {

      const llmCache = await
              this.llmCacheModel.getByTechIdAndKey(
                prisma,
                llmTechId,
                cacheKey)

      if (llmCache != null) {
        return {
          status: true,
          isRateLimited: false,
          waitSeconds: 0,
          llmTechId: llmTechId,
          fromCache: true,
          cacheKey: cacheKey,
          message: llmCache.stringValue,
          messages: llmCache.stringValues,
          json: llmCache.jsonValue
        }
      }
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
          message: undefined,
          messages: undefined,
          json: undefined,
          llmTechId: llmTechId,
          fromCache: false,
          cacheKey: cacheKey,
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
              prisma,
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
        cacheKey,
        messageText) */

      // Convert to generic message format
      results.messages = this.convertToGenericMessageFormat(results.messages)
    } else {
      throw new CustomError(`${fnName}: results == null`)
    }

    // Return
    var jsonEmpty: any

    return {
      status: results.status,
      isRateLimited: false,
      waitSeconds: 0,
      llmTechId: llmTechId,
      message: results.message,
      messages: results.messages,
      json: jsonEmpty,  // Set by caller, llmRequest()
      model: results.model,
      actualTech: results.actualTech,
      inputTokens: results.inputTokens,
      outputTokens: results.outputTokens,
      fromCache: false,
      cacheKey: cacheKey
    }
  }
}
