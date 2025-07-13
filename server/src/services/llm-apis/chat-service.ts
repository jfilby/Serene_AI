const blake2b = require('blake2b')
import { jsonrepair } from 'jsonrepair'
import { CustomError } from '@/serene-core-server/types/errors'
import { SereneCoreServerTypes } from '@/serene-core-server/types/user-types'
import { sleepSeconds } from '@/serene-core-server/services/process/sleep'
import { RateLimitedApiEventModel } from '@/serene-core-server/models/tech/rate-limited-api-event-model'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { ResourceQuotasMutateService } from '@/serene-core-server/services/quotas/mutate-service'
import { ResourceQuotasQueryService } from '@/serene-core-server/services/quotas/query-service'
import { ChatMessageCreatedModel } from '../../models/chat/chat-message-created-model'
import { LlmCacheModel } from '../../models/cache/llm-cache-model'
import { ChatApiUsageService } from '../api-usage/chat-api-usage-service'
import { ChatMessageService } from '../chats/messages/service'
import { DetectContentTypeService } from '../content/detect-content-type-service'
import { LlmUtilsService } from './utils-service'
import { TextParsingService } from '../content/text-parsing-service'

// Models
const chatMessageCreatedModel = new ChatMessageCreatedModel()
const llmCacheModel = new LlmCacheModel()
const rateLimitedApiEventModel = new RateLimitedApiEventModel()
const resourceQuotasMutateService = new ResourceQuotasMutateService()
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
          llmTech: any | undefined,
          chatSession: any,
          userProfile: any | undefined,
          agentUser: any,
          messagesWithRoles: any[],
          systemPrompt: string | undefined = undefined,
          jsonMode: boolean = false,
          tryGetFromCache: boolean = false) {

    // Debug
    const fnName = `${this.clName}.llmRequest()`

    // Validate
    if (agentUser == null) {
      throw new CustomError(`${fnName}: agentUser == null`)
    }

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
          llmTech,
          chatSession,
          userProfile,
          agentUser,
          messagesWithRoles,
          systemPrompt,
          jsonMode,
          tryGetFromCache)

      // Validate
      if (chatCompletionResults.isRateLimited == null) {

        // Can return an errors?
        if (chatCompletionResults.status === false) {
          return chatCompletionResults
        }

        // Else throw an exception
        throw new CustomError(
                    `${fnName}: chatCompletionResults.isRateLimited == null`)
      }

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
                  llmTech: any | undefined,
                  chatSession: any,
                  userProfile: any,
                  agentUser: any,
                  messagesWithRoles: any[],
                  systemPrompt: string | undefined = undefined,
                  jsonMode: boolean = false,
                  tryGetFromCache: boolean = false) {

    // Debug
    const fnName = `${this.clName}.prepAndSendLlmRequest()`

    // console.log(`${fnName}: starting with jsonMode: ${jsonMode}`)

    // Validate
    if (agentUser == null) {
      throw new CustomError(`${fnName}: agentUser == null`)
    }

    // If llmTechId isn't specified, get the default
    if (llmTech == null) {

      llmTech = await
        techModel.getByVariantName(
          prisma,
          process.env.DEFAULT_LLM_VARIANT as string)
    }

    if (llmTech == null) {
      throw new CustomError(`${fnName}: no LLM default LLM tech available`)
    }

    // Get the cache key if required
    var cacheKey: string | undefined = undefined

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
                llmTech.id,
                cacheKey)

      if (llmCache != null) {
        return {
          status: true,
          isRateLimited: false,
          waitSeconds: 0,
          llmTechId: llmTech.id,
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
              llmTech.id)

    // If a rate-limited tech
    if (rateLimitedData != null) {

      if (rateLimitedData.isRateLimited === true) {

        return {
          isRateLimited: rateLimitedData.isRateLimited,
          waitSeconds: rateLimitedData.waitSeconds,
          message: undefined,
          messages: undefined,
          json: undefined,
          llmTechId: llmTech.id,
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

    // Validate the Tech
    if (llmTech.isEnabled === false) {

      return {
        status: false,
        message: `Tech is disabled for id: ${llmTech.id}`,
        isRateLimited: null
      }
    }

    // Prepare messages by provider, but don't add the systemPrompt yet or it
    // will be added in a later step.
    const messagesResults = await
            llmUtilsService.prepareChatMessages(
              prisma,
              llmTech,
              agentUser,
              undefined,  // systemPrompt
              messagesWithRoles)

    // Calc estimated cost
    const estimatedCostInCents =
            chatMessageService.calcCostInCents(
              llmTech,
              'text',
              messagesResults.estimatedInputTokens,
              messagesResults.estimatedOutputTokens)

    /* Debug
    console.log(`${fnName}: estimated costInCents: ${estimatedCostInCents} ` +
                `based on input tokens: ` +
                `${messagesResults.estimatedInputTokens} and output tokens: ` +
                `${messagesResults.estimatedOutputTokens}`) */

    // Is there quota available for this user?
    const isQuotaAvailable = await
            resourceQuotasService.isQuotaAvailable(
              prisma,
              userProfile.id,
              SereneCoreServerTypes.credits,
              estimatedCostInCents)

    if (isQuotaAvailable === false) {

      return {
        status: false,
        message: `Insufficient quota, please buy or upgrade your subscription`,
        isRateLimited: null
      }
    }

    // Send messages by provider
    const results = await
            llmUtilsService.sendChatMessages(
              prisma,
              llmTech,
              agentUser,
              systemPrompt,
              messagesResults.messages,
              jsonMode)

    // Post-proc for non-null results
    if (results != null) {

      // Calc cost
      const costInCents =
              chatMessageService.calcCostInCents(
                llmTech,
                'text',
                results.inputTokens,
                results.outputTokens)

      /* Debug
      console.log(
        `${fnName}: costInCents: ${estimatedCostInCents} based on input ` +
        `tokens: ${results.inputTokens} and output tokens: ` +
        `${results.outputTokens}`) */

      // Create ChatMessageCreated
      await chatMessageCreatedModel.create(
              prisma,
              agentUser.userProfileId,
              chatSession.instanceId,
              llmTech.id,
              true,  // sentByAi
              results.inputTokens,
              results.outputTokens,
              costInCents)

      // Inc used quota
      await resourceQuotasMutateService.incQuotaUsage(
              prisma,
              chatSession.createdById,
              SereneCoreServerTypes.credits,
              costInCents)
    }

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
      llmTechId: llmTech.id,
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
