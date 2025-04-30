import OpenAI from 'openai'
import { CustomError } from '@/serene-core-server/types/errors'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { AiTechDefs } from '../../../types/tech-defs'
import { FeatureFlags } from '../../../types/feature-flags'
import { OpenAIGenericLlmService } from './llm-generic-service'

export class OpenAiLlmService {

  // Consts
  clName = 'OpenAiLlmService'

  openAiName = 'OpenAI'

  // Model names from: https://openai.com/pricing
  gpt3pt5Turbo = 'gpt-3.5-turbo'
  gpt4 = 'gpt-4'
  gpt4Turbo = 'gpt-4-1106-preview'

  // Vars
  openAi: any

  // Models
  techModel = new TechModel()

  // Services
  openAIGenericLlmService = new OpenAIGenericLlmService()

  // Code
  constructor() {

    // Debug
    const fnName = `${this.clName}.constructor()`

    /* console.log(`${fnName}: ` +
                `apiKey: ` + JSON.stringify(process.env.NEXT_PUBLIC_OPENAI_API_KEY) +
                ` baseURL: ` + JSON.stringify(process.env.NEXT_PUBLIC_OPENAI_BASE_URL)) */

    // Validate apiKey
    if (process.env.NEXT_PUBLIC_OPENAI_API_KEY == null) {
      console.warn(`${fnName}: apiKey isn't set`)
      return
    }

    // Init
    this.openAi = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      baseURL: process.env.NEXT_PUBLIC_OPENAI_BASE_URL
    })
  }

  async sendChatMessages(
          tech: any,
          messagesWithRoles: any[],
          jsonMode: boolean = false) {

    // Debug
    const fnName = `${this.clName}.sendChatMessages()`

    // console.log(`${fnName}: starting with variant: ${tech.variantName}`)

    // Validate
    if (this.openAi == null) {

      const message = `${fnName}: this.openAi == null`

      console.error(message)
      throw new CustomError(message)
    }

    // Verify that the variant has a model name
    if (!AiTechDefs.variantToModelNames.hasOwnProperty(tech.variantName)) {

      const message =
              `Variant ${tech.variantName} has no corresponding model name`

      console.error(`${fnName}: ${message}`)

      throw new CustomError(message)
    }

    // Get the variant's model name
    const model = AiTechDefs.variantToModelNames[tech.variantName]

    // Ignore jsonMode?
    if (jsonMode === true &&
        AiTechDefs.variantNamesToIgnoreJsonMode[tech.variantName] === true) {

      jsonMode = false
    }

    // console.log(`${fnName}: getting variant's model name: ${model}`)

    // Return early if external APIs not enabled
    if (FeatureFlags.externalApis === false) {
      console.warn(`${fnName}: external APIs not enabled, returning..`)
      return undefined
    }

    // Debug
    // console.log(`${fnName}: calling this.openAiApi.createChatCompletion ` +
    //             `with model: ${model} messagesWithRoles: ` +
    //             `${JSON.stringify(messagesWithRoles)}`)

    // Set Completions options
    var completionsOptions: any = {
          model: model,
          messages: messagesWithRoles
        }

    if (jsonMode === true) {
      completionsOptions.response_format={ "type": "json_object" }
    }

    // ChatCompletion request
    //
    // Note: if this fails with no error then check the expected way to call
    //       the version of the NPM for this API.
    var completion: any = null

    await this.openAi.chat.completions.create(completionsOptions)
    .then((res: any) => {
      /* console.log(`${fnName}: got response:`)
      console.log(`${fnName}: ` + JSON.stringify(res))
      console.log(`${fnName}: got result choice 0 message content:`)

      if (res.choices != null) {
        if (res.choices.length > 0) {
          console.log(res.choices[0].message.content)
        }
      } */

      completion = res
    })
    .catch((error: any) => {

      const errorStr = JSON.stringify(error)
      console.error(`${fnName}: error: ${errorStr}`)

      console.log(`${fnName}: error: ${errorStr}`)

      if (error instanceof OpenAI.APIError) {

        console.log(`${fnName}: status: ${error.status}`)
        console.log(`${fnName}: name: ${error.name}`)
        console.log(`${fnName}: headers: ${JSON.stringify(error.headers)}`)

        throw new CustomError(`${fnName}: OpenAI API error: ${errorStr}`)
      } else {
        throw new CustomError(`${fnName}: error: ${errorStr}`)
      }
    })

    // Log
    // console.log(`${fnName}: completion: ${JSON.stringify(completion)}`)

    // Validate the results
    if (completion == null) {

      const message = `${fnName}: OpenAI call failed: completion == null`
      console.error(message)
      throw new CustomError(message)
    }

    // Parse the results
    // TODO: is a special conversion function required? Maybe one that calls
    // convertOpenAiResults? Need inputTokens and outputTokens.
    const chatCompletionResults =
            this.openAIGenericLlmService.convertOpenAiChatCompletionResults(
              completion)

    // Cache the results

    // Return results
    return chatCompletionResults
  }

  async upsertLlmChatTech(
          prisma: any,
          requestTech: any,
          modelName: string) {

    // The requestTech is what the request was made with. If the actual model
    // used by the API call differs, then upsert a new Tech entry.

    // Debug
    const fnName = `${this.clName}.upsertLlmChatTech()`

    // Formulate variantName
    const variantName = `${AiTechDefs.chatGptProvider}: ${modelName}`

    // Upsert
    const actualTech = await
            this.techModel.upsert(
              prisma,
              undefined,  // id
              false,      // isDefaultProvider
              variantName,
              AiTechDefs.llms)

    // Return
    return actualTech
  }
}
