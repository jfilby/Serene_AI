const { GoogleGenerativeAI } = require('@google/generative-ai')
import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { SereneCoreServerTypes } from '@/serene-core-server/types/user-types'
import { TechProviderApiKeyModel } from '@/serene-core-server/models/tech/tech-provider-api-key-model'
import { TechProviderModel } from '@/serene-core-server/models/tech/tech-provider-model'
import { FeatureFlags } from '../../../types/feature-flags'
import { AiTechDefs } from '../../../types/tech-defs'
import { SereneAiServerOnlyTypes } from '../../../types/server-only-types'
import { EstimateGeminiTokensService } from './estimate-tokens-service'

// Interfaces
interface ChatCompletion {
  messages: any[]
  inputTokens: number
  outputTokens: number
}

// Gemini clients
const geminiAiClients = new Map<string, typeof GoogleGenerativeAI>()

// Models
const techProviderModel = new TechProviderModel()
const techProviderApiKeyModel = new TechProviderApiKeyModel()

// Services
const estimateGeminiTokensService = new EstimateGeminiTokensService()

// Class
export class GoogleGeminiLlmService {

  // Consts
  clName = 'GoogleGeminiLlmService'

  okMsg = 'ok'

  /* apiVersionByModelName = {
    [AiTechDefs.googleGeminiV1ProModelName]: 'v1',
    [AiTechDefs.googleGeminiV1pt5ProModelName]: 'v1beta'
  } */

  // Code
  convertGeminiChatCompletionResults(
    completion: ChatCompletion,
    model: string,
    tech: any) {

    // Debug
    const fnName = `${this.clName}.convertGeminiChatCompletionResults()`

    // Return
    return {
      status: true,
      message: undefined,
      messages: completion.messages,
      model: model,
      actualTech: tech,
      inputTokens: completion.inputTokens,
      outputTokens: completion.outputTokens,
      // createdPgCacheEdge: undefined
    }
  }

  convertToGeminiInputMessages(messagesWithRoles: any[]) {

    // Debug
    const fnName = `${this.clName}.convertToGeminiInputMessages()`

    // console.log(`${fnName}: messagesWithRoles: ` +
    //             JSON.stringify(messagesWithRoles))

    // Convert messages
    var messages: any[] = []

    for (const message of messagesWithRoles) {

      // Get input text
      var text = ''

      for (const part of message.parts) {

        if (text.length > 0) {
          text += '\n'
        }

        if (part.text == null) {
          throw new CustomError(
                      `${fnName}: part.text == null from message: ` +
                      JSON.stringify(message))
        }

        text += part.text
      }

      // Add message
      messages.push({
        role: message.role,
        parts: [ { text: text } ]
      })
    }

    // Debug
    // console.log(`${fnName}: messages: ` +
    //             JSON.stringify(messages))

    // Return
    return messages
  }

  private async getChatCompletions(
                  prisma: PrismaClient,
                  tech: any,
                  model: string,
                  messagesWithRoles: any[],
                  jsonMode: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getChatCompletions()`

    // console.log(`${fnName}: starting with messagesWithRoles: ` +
    //             JSON.stringify(messagesWithRoles))

    // console.log(`${fnName}: starting with model: ` + JSON.stringify(model))

    // Get/create the Gemini AI client
    const geminiAiClient = await
            this.getOrCreateClient(
              prisma,
              tech)

    /* List models (for debugging only)
    const models = await
            this.genAI.listModels()

    console.log(`${fnName}: starting with models: ` +
                JSON.stringify(models)) */

    // Convert to Gemini format
    messagesWithRoles = this.convertToGeminiInputMessages(messagesWithRoles)

    // console.log(`${fnName}: got messagesWithRoles`)

    // Get the apiVersion
    // const apiVersion = this.apiVersionByModelName[model]

    // console.log(`${fnName}: apiVersion: ${JSON.stringify(apiVersion)}`)

    // Get the model
    var generativeModel: any = undefined

    if (tech.pricingTier === SereneCoreServerTypes.free) {

      generativeModel =
        geminiAiClient.getGenerativeModel(
          { model: model },
          { apiVersion: 'v1beta' })

    } else if (tech.pricingTier === SereneCoreServerTypes.paid) {

      generativeModel =
        geminiAiClient.getGenerativeModel(
          { model: model },
          { apiVersion: 'v1beta' })

    } else {
      throw new CustomError(`${fnName}: unhandled pricingTier: ` +
                            `${tech.pricingTier}`)
    }

    // Get history: remove the latest message
    // Note: slice()'s end is exclusive of that index position
    const history = messagesWithRoles.slice(0, messagesWithRoles.length - 1)

    // console.log(`${fnName} history: ${JSON.stringify(history)}`)

    // Start chat
    var generationConfig: any = undefined

    if (jsonMode === true) {
      generationConfig = {
        response_mime_type: `application/json`
      }
    }

    const chat = generativeModel.startChat({
      history: history,
      generationConfig: generationConfig
      /* generationConfig: {
        // maxOutputTokens: 100,
      }, */
    })

    // Send latest message
    // console.log(`${fnName}: calling chat.sendMessage()..`)

    const latestMsg =
            messagesWithRoles[messagesWithRoles.length - 1].parts[0].text

    // Verify latestMsg
    if (latestMsg == null) {
      throw new CustomError(`${fnName}: latestMsg == null`)
    }

    // Send message
    var result: any = undefined

    result = await
      chat.sendMessage(
        latestMsg)

    const response = await result.response
    const text = response.text()

    // Debug
    // console.log(`${fnName} response.text(): ${text}`)

    // Determine token usage
    var inputTokens: number = 0
    var outputTokens: number = 0

    if (result.usageMetadata != null) {

      inputTokens = result.usageMetadata.promptTokenCount,
      outputTokens = result.usageMetadata.candidatesTokenCount

    } else {

      inputTokens =
        estimateGeminiTokensService.estimateInputTokens(messagesWithRoles)

      outputTokens = estimateGeminiTokensService.estimateOutputTokens([text])
    }

    // Return
    return {
      messages: [text],
      inputTokens: inputTokens,
      outputTokens: outputTokens
    }
  }

  async getOrCreateClient(
          prisma: PrismaClient,
          tech: any) {

    // Debug
    const fnName = `${this.clName}.getOrCreateClient()`

    // Validate the pricingTier
    if (tech.pricingTier == null) {
      throw new CustomError(
                  `${fnName}: pricingTier not set for Tech.id: ${tech.id}`)
    }

    // Define the cached client key by free/paid
    const clientKey = tech.pricingTier

    // Get by techProviderId
    if (geminiAiClients.has(clientKey)) {
      return geminiAiClients.get(clientKey)
    }

    // Get the TechProvider
    const techProvider = await
            techProviderModel.getById(
              prisma,
              tech.techProviderId)

    // Get an API key
    const techProviderApiKeys = await
            techProviderApiKeyModel.filter(
              prisma,
              techProvider.id,
              SereneCoreServerTypes.activeStatus,
              undefined,  // accountEmail
              tech.pricingTier)

    // Found at least one?
    if (techProviderApiKeys.length === 0) {
      throw new CustomError(`${fnName}: no API keys for ${techProvider.name}`)
    }

    // Create a new client
    const googleGenerateAi =
            new GoogleGenerativeAI(techProviderApiKeys[0].apiKey)

    // Save
    geminiAiClients.set(
      clientKey,
      googleGenerateAi)

    // Return
    return googleGenerateAi
  }

  prepareMessages(
    llmTech: any,
    name: string,
    role: string,
    systemPrompt: string | undefined,
    messages: any[],
    anonymize: boolean) {

    // Debug
    const fnName = `${this.clName}.prepareMessages()`

    // console.log(`${fnName}: messages: ${JSON.stringify(messages)}`)

    // Create messagesWithRoles
    var messagesWithRoles: any[] = []

    // Set the role with a system message
    if (role != null) {

      // If the role isn't anonymous, start with a name
      var systemAndRolePrompt: string

      if (anonymize === false) {
        systemAndRolePrompt = `You are ${name}, a ${role}.`
      } else {
        systemAndRolePrompt = `You are a ${role}.`
      }

      if (systemPrompt != null) {
        systemAndRolePrompt += '\n' + systemPrompt
      }

      // Add messages
      // Gemini doesn't have the system role
      messagesWithRoles.push({
        role: SereneAiServerOnlyTypes.geminiUserMessageRole,
        parts: [{type: '', text: systemAndRolePrompt}]
      })

      messagesWithRoles.push({
        role: SereneAiServerOnlyTypes.geminiModelMessageRole,
        parts: [{type: '', text: this.okMsg}]
      })
    }

    // Inform messages set the context
    var previousRole = ''

    for (const message of messages) {

      // Test
      // console.log(`${fnName}: message: ${JSON.stringify(message)}`)

      // Fill in a model response if none found
      if (previousRole === SereneAiServerOnlyTypes.geminiUserMessageRole &&
          message.role === SereneAiServerOnlyTypes.geminiUserMessageRole) {

        messagesWithRoles.push({
          role: SereneAiServerOnlyTypes.geminiModelMessageRole,
          parts: [{type: '', text: this.okMsg}]
        })
      }

      // Add message
      messagesWithRoles.push({
        role: message.role,
        parts: message.parts
      })

      // Set previousRole
      previousRole = message.role
    }

    // console.log(`${fnName}: messagesWithRoles: ` +
    //             JSON.stringify(messagesWithRoles))

    // Estimate the input and output tokens
    const estimatedInputTokens =
            estimateGeminiTokensService.estimateInputTokens(messagesWithRoles)

    const estimatedOutputTokens =
            estimateGeminiTokensService.estimatedOutputTokens

    // Variant name: may have to determine this based on input tokens and the
    // estimated output tokens.
    const variantName = llmTech.variantName

    // Return
    return {
      messages: messagesWithRoles,
      variantName: variantName,
      estimatedInputTokens: estimatedInputTokens,
      estimatedOutputTokens: estimatedOutputTokens
    }
  }

  async sendChatMessages(
          prisma: PrismaClient,
          tech: any,
          messagesWithRoles: any[],
          jsonMode: boolean = false) {

    // Debug
    const fnName = `${this.clName}.sendChatMessages()`

    console.log(`${fnName}: starting with variant: ${tech.variantName} ` +
                `model: ${tech.model}`)

    // Return early if external APIs not enabled
    if (FeatureFlags.externalApis === false) {
      console.warn(`${fnName}: external APIs not enabled, returning..`)
      return undefined
    }

    // Debug
    // console.log(`${fnName}: calling this.client.getChatCompletions ` +
    //             `with model: ${model} messagesWithRoles: ` +
    //             `${JSON.stringify(messagesWithRoles)}`)

    // ChatCompletion request
    //
    // Note: if this fails with no error then check the expected way to call
    //       the version of the NPM for this API.
    const completion = await
            this.getChatCompletions(
              prisma,
              tech,
              tech.model,
              messagesWithRoles,
              jsonMode)

    // Log
    // console.log(`${fnName}: completion: ${JSON.stringify(completion)}`)

    // Validate the results
    if (completion == null) {

      console.error(`${fnName}: Google Gemini call failed`)

      throw `Completion isn't set`
    }

    // Parse the results
    // TODO: is a special conversion function required? Maybe one that calls
    // convertOpenAiResults? Need inputTokens and outputTokens.
    const chatCompletionResults =
            this.convertGeminiChatCompletionResults(
              completion,
              tech.model,
              tech)

    // Cache the results

    // Return results
    return chatCompletionResults
  }
}
