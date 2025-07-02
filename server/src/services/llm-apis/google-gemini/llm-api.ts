const { GoogleGenerativeAI } = require('@google/generative-ai')
import { CustomError } from '@/serene-core-server/types/errors'
import { FeatureFlags } from '../../../types/feature-flags'
import { AiTechDefs } from '../../../types/tech-defs'
import { SereneAiServerOnlyTypes } from '../../../types/server-only-types'
import { EstimateTokensService } from '../estimate-tokens-service'

// Interfaces
interface ChatCompletion {
  messages: any[]
  inputTokens: number
  outputTokens: number
}

// Consts
const genAI = process.env.GOOGLE_GEMINI_API_KEY != null ?
        new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY) :
        undefined

// Services
const estimateTokensService = new EstimateTokensService()

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
                  model: string,
                  messagesWithRoles: any[],
                  jsonMode: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getChatCompletions()`

    console.log(`${fnName}: starting with messagesWithRoles: ` +
                JSON.stringify(messagesWithRoles))

    console.log(`${fnName}: starting with model: ` + JSON.stringify(model))

    /* List models (for debugging only)
    const models = await
            this.genAI.listModels()

    console.log(`${fnName}: starting with models: ` +
                JSON.stringify(models)) */

    // Convert to Gemini format
    messagesWithRoles = this.convertToGeminiInputMessages(messagesWithRoles)

    console.log(`${fnName}: got messagesWithRoles`)

    // Get the apiVersion
    // const apiVersion = this.apiVersionByModelName[model]

    // console.log(`${fnName}: apiVersion: ${JSON.stringify(apiVersion)}`)

    // Get the model
    const generativeModel =
            genAI.getGenerativeModel(
              { model: model },
              { apiVersion: 'v1beta' })

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
    console.log(`${fnName}: calling chat.sendMessage()..`)

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
        estimateTokensService.estimateInputTokens(messagesWithRoles)

      outputTokens = estimateTokensService.estimateOutputTokens([text])
    }

    // Return
    return {
      messages: [text],
      inputTokens: inputTokens,
      outputTokens: outputTokens
    }
  }

  prepareMessages(
    tech: any,
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
        estimateTokensService.estimateInputTokens(messagesWithRoles)

    const estimatedOutputTokens = estimateTokensService.estimatedOutputTokens

    // Variant name: may have to determine this based on input tokens and the
    // estimated output tokens.
    const variantName = tech.variantName

    // Return
    return {
      messages: messagesWithRoles,
      variantName: variantName,
      estimatedInputTokens: estimatedInputTokens,
      estimatedOutputTokens: estimatedOutputTokens
    }
  }

  async sendChatMessages(
          tech: any,
          messagesWithRoles: any[],
          jsonMode: boolean = false) {

    // Debug
    const fnName = `${this.clName}.sendChatMessages()`

    console.log(`${fnName}: starting with variant: ${tech.variantName}`)

    // Verify that the variant has a model name
    if (!AiTechDefs.variantToModelNames.hasOwnProperty(tech.variantName)) {

      const message =
              `Variant ${tech.variantName} has no corresponding model name`

      console.error(`${fnName}: ${message}`)

      throw new CustomError(message)
    }

    // Get the variant's model name
    const model = AiTechDefs.variantToModelNames[tech.variantName]

    console.log(`${fnName}: getting variant's model name: ${model}`)

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
              model,
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
              model,
              tech)

    // Cache the results

    // Return results
    return chatCompletionResults
  }
}
