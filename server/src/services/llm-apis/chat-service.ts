const blake2b = require('blake2b')
import { jsonrepair } from 'jsonrepair'
import { CustomError } from '@/serene-core-server/types/errors'
import { SereneCoreServerTypes } from '@/serene-core-server/types/user-types'
import { sleepSeconds } from '@/serene-core-server/services/process/sleep'
import { RateLimitedApiEventModel } from '@/serene-core-server/models/tech/rate-limited-api-event-model'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { ResourceQuotasQueryService } from '@/serene-core-server/services/quotas/query-service'
import { LlmCacheModel } from '../../models/cache/llm-cache-model'
import { ChatApiUsageService } from '../api-usage/chat-api-usage-service'
import { ChatMessageService } from '../chats/messages/service'
import { DetectContentTypeService } from '../content/detect-content-type-service'
import { LlmUtilsService } from './utils-service'
import { TextParsingService } from '../content/text-parsing-service'

// Models
const llmCacheModel = new LlmCacheModel()
const rateLimitedApiEventModel = new RateLimitedApiEventModel()
const techModel = new TechModel()

// Services
const chatApiUsageService = new ChatApiUsageService()
const chatMessageService = new ChatMessageService(process.env.NEXT_PUBLIC_DB_ENCRYPT_SECRET)
const detectContentTypeService = new DetectContentTypeService()
const llmUtilsService = new LlmUtilsService()
const resourceQuotasService = new ResourceQuotasQueryService()
const textParsingService = new TextParsingService()

// Class
export class ChatService {

  // Consts
  clName = 'ChatService'

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
      const type = detectContentTypeService.detect(message)

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
          userProfile: any | undefined,
          agentUser: any,
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
          userProfile,
          agentUser,
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

          // Note: some LLMs (e.g. Google Gemini) return the JSON as text, even
          // for JSON mode.

          // Debug
          // console.log(
          //   `${fnName}: jsonMode === true, chatCompletionResults: ` +
          //   JSON.stringify(chatCompletionResults))

          // Manually parse JSON
          var jsonText = chatCompletionResults.messages[0].text

          if (jsonText !== '[' && jsonText !== '{') {

            const jsonExtracts =
                    textParsingService.getJsonExtractExcludingQuotesWithBraces(
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
                  userProfile: any,
                  agentUser: any,
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
        techModel.getByVariantName(
          prisma,
          process.env.NEXT_PUBLIC_DEFAULT_LLM_VARIANT as string)

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
              llmCacheModel.getByTechIdAndKey(
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
          json: llmCache.jsonValue,
          pricingTier: 'cached',
          inputTokens: 0,
          outputTokens: 0
        }
      }
    }

    // Get userProfileId if agent specified
    if (userProfile == null &&
        agentUser != null) {

      userProfile = agentUser
    }

    if (userProfile == null) {
      throw new CustomError(
                  `${fnName}: no userProfileId given and agent not available`)
    }

    // Check to see if rate limited
    const rateLimitedData = await
            chatApiUsageService.isRateLimited(
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
      await rateLimitedApiEventModel.create(
              prisma,
              undefined,  // id
              rateLimitedData.rateLimitedApiId,
              userProfile.id)
    }

    // Get Tech if not yet retrieved
    if (tech == null) {

      tech = await
        techModel.getById(
          prisma,
          llmTechId)
    }

    // Prepare messages by provider
    const messagesResults = await
            llmUtilsService.prepareChatMessages(
              prisma,
              tech,
              agentUser,
              systemPrompt,
              messagesWithRoles)

    // Calc estimated cost
    const costInCents =
            chatMessageService.calcCost(
              tech,
              'text',
              messagesResults.estimatedInputTokens,
              messagesResults.estimatedOutputTokens)

    // Is there quota available for this user?
    const isQuotaAvailable = await
            resourceQuotasService.isQuotaAvailable(
              prisma,
              userProfile.id,
              SereneCoreServerTypes.credits,
              costInCents)

    if (isQuotaAvailable === false) {

      return {
        status: false,
        message: `Insufficient quota, please buy or upgrade your subscription`
      }
    }

    // Send messages by provider
    const results = await
            llmUtilsService.sendChatMessages(
              prisma,
              tech,
              agentUser,
              systemPrompt,
              messagesResults.messages,
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
