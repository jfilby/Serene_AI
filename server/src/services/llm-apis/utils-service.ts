import { CustomError } from '@/serene-core-server/types/errors'
import { AiTechDefs } from '../../types/tech-defs'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { CommonTypes } from '../../types/types'
import { ChatSettingsModel } from '../../models/chat/chat-settings-model'
import { AgentsService } from '../agents/agents-service'
import { GoogleGeminiLlmService } from './google-gemini/llm-api'
import { GoogleGeminiLlmUtilsService } from './google-gemini/utils'
import { OpenAIGenericLlmService } from './openai/llm-generic-service'
import { OpenAiLlmService } from './openai/llm-service'
import { OpenAiLlmUtilsService } from './openai/utils'

export class LlmUtilsService {

  // Consts
  clName = 'LlmUtilsService'

  // Models
  chatSettingsModel = new ChatSettingsModel()
  techModel = new TechModel()

  // Services
  agentsService = new AgentsService()
  googleGeminiLlmService = new GoogleGeminiLlmService()
  googleGeminiLlmUtilsService = new GoogleGeminiLlmUtilsService()
  openAIGenericLlmService = new OpenAIGenericLlmService()
  openAiLlmService = new OpenAiLlmService()
  openAiLlmUtilsService = new OpenAiLlmUtilsService()

  // Code
  buildMessagesWithRoles(
    tech: any,
    chatMessages: any[],
    fromContents: any,
    userChatParticipantIds: string[],
    agentChatParticipantIds: string[]) {

    // Debug
    const fnName = `${this.clName}.buildMessagesWithRoles()`

    // Get tech provider
    const provider = AiTechDefs.variantToProviders[tech.variantName]

    // Route to appropriate LLM utils
    switch (provider) {

      case AiTechDefs.chatGptProvider: {
        return this.openAiLlmUtilsService.buildMessagesWithRoles(
                 chatMessages,
                 fromContents,
                 userChatParticipantIds,
                 agentChatParticipantIds)
      }

      case AiTechDefs.googleGeminiProvider: {
        return this.googleGeminiLlmUtilsService.buildMessagesWithRoles(
                 chatMessages,
                 fromContents,
                 userChatParticipantIds,
                 agentChatParticipantIds)
      }

      default: {
        throw new CustomError(`${fnName}: unhandled provider: ${provider} ` +
                              `for variant: ${tech.variantName}`)
      }
    }
  }

  async buildMessagesWithRolesForSinglePrompt(
          prisma: any,
          tech: any,
          userProfileId: string,
          prompt: string) {

    // Debug
    const fnName = `${this.clName}.buildMessagesWithRolesForSinglePrompt()`

    // Get default/override tech if not specified
    if (tech == null) {

      const chatSettingsResults = await
              this.getOrCreateChatSettings(
                prisma,
                undefined,  // baseChatSettingsId
                userProfileId,
                undefined,  // no need to store the prompt in chatSettings
                true)       // getTech

      tech = chatSettingsResults.tech
    }

    // Get tech provider
    const provider = AiTechDefs.variantToProviders[tech.variantName]

    // Route to appropriate LLM utils
    switch (provider) {

      case AiTechDefs.chatGptProvider: {
        return this.openAiLlmUtilsService.buildMessagesWithRolesForSinglePrompt(
                 prompt)
      }

      case AiTechDefs.googleGeminiProvider: {
        return this.googleGeminiLlmUtilsService.buildMessagesWithRolesForSinglePrompt(
                 prompt)
      }

      default: {
        throw new CustomError(`${fnName}: unhandled provider: ${provider} ` +
                              `for variant: ${tech.variantName}`)
      }
    }
  }


  async getOrCreateChatSettings(
          prisma: any,
          baseChatSettingsId: string | undefined,
          userProfileId: string,
          prompt: string | undefined,
          getTech: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getOrCreateChatSettings()`

    // If no baseChatSettingsId is specified, then get the default
    var chatSettings
    var baseChatSettings
    var defaultBaseChatSettingsId: string | undefined = ''

    if (baseChatSettingsId == null) {

      const baseChatSettingsMany = await
              this.chatSettingsModel.getByBaseChatSettingsId(
                prisma,
                null)

      if (baseChatSettingsMany.length > 0) {
        baseChatSettings = baseChatSettingsMany[0]
        baseChatSettingsId = baseChatSettings.id
        defaultBaseChatSettingsId = baseChatSettingsId
      }
    }

    // If a prompt is specified, then create a ChatSettings record
    var chatSettings = baseChatSettings

    if (prompt != null) {

      // Get base ChatSettings record
      if (baseChatSettingsId != null &&
          baseChatSettingsId !== defaultBaseChatSettingsId) {

        baseChatSettings = await
          this.chatSettingsModel.getById(
            prisma,
            baseChatSettingsId)
      }

      // Validation
      if (baseChatSettings == null) {
        throw new CustomError(`${fnName}: baseChatSettings == null`)
      }
    }

    // Get tech
    const tech = await
            this.getTech(
              prisma,
              baseChatSettings)

    // Create new ChatSettings record
    if (baseChatSettings != null &&
        prompt != null) {

      chatSettings = await
        this.chatSettingsModel.create(
          prisma,
          baseChatSettingsId,
          CommonTypes.activeStatus,
          false,      // pinned
          undefined,  // name
          tech.id,    // baseChatSettings.llmTechId,
          baseChatSettings.agentId,
          prompt,
          userProfileId)
    }

    // Return
    return {
      chatSettings: chatSettings,
      tech: tech
    }
  }

  async getTech(
          prisma: any,
          baseChatSettings: any) {

    // Debug
    const fnName = `${this.clName}.getTech()`
    // Var
    var tech: any

    // Is a default LLM provider specified in the env file?
    if (process.env.NEXT_PUBLIC_OVERRIDE_LLM_VARIANT != null &&
        process.env.NEXT_PUBLIC_OVERRIDE_LLM_VARIANT !== '') {

      // Debug
      console.log(`${fnName}: getting variant (by env file): ` +
                  process.env.NEXT_PUBLIC_OVERRIDE_LLM_VARIANT)

      // Get variant by name
      tech = await
        this.techModel.getByVariantName(
          prisma,
          process.env.NEXT_PUBLIC_OVERRIDE_LLM_VARIANT)

      if (tech == null) {
        const message =
                `${fnName}: tech not found for NEXT_PUBLIC_OVERRIDE_LLM_VARIANT: ` +
                JSON.stringify(process.env.NEXT_PUBLIC_OVERRIDE_LLM_VARIANT)

        console.error(message)
        throw new CustomError(message)
      } else {
        baseChatSettings.llmTechId = tech.id
      }

      // Debug
      console.log(`${fnName}: baseChatSettings.llmTechId: ` +
                  JSON.stringify(baseChatSettings.llmTechId))
    }

    // Get tech
    if (tech == null) {

      tech = await
        this.techModel.getById(
          prisma,
          baseChatSettings.llmTechId)
    }

    return tech
  }

  async prepareAndSendChatMessages(
          prisma: any,
          tech: any,
          agent: any,
          systemPrompt: string | undefined,
          messagesWithRoles: any[],
          jsonMode: boolean) {

    // Debug
    const fnName = `${this.clName}.prepareAndSendChatMessages()`

    // Get tech provider
    const provider = AiTechDefs.variantToProviders[tech.variantName]

    // Route to appropriate LLM utils
    switch (provider) {

      case AiTechDefs.chatGptProvider: {

        // Prepare messages
        const prepareMessagesResults =
                this.openAIGenericLlmService.prepareMessages(
                  prisma,
                  tech,
                  agent.name,
                  agent.role,
                  systemPrompt,
                  messagesWithRoles,
                  false)  // anonymize

        // Gemini LLM request
        return await this.openAiLlmService.sendChatMessages(
                       tech,
                       prepareMessagesResults.messages,
                       jsonMode)
      }

      case AiTechDefs.googleGeminiProvider: {

        // Prepare messages
        const prepareMessagesResults =
                this.googleGeminiLlmService.prepareMessages(
                  tech,
                  agent.name,
                  agent.role,
                  systemPrompt,
                  messagesWithRoles,
                  false)  // anonymize

        // Gemini LLM request
        return await this.googleGeminiLlmService.sendChatMessages(
                       tech,
                       prepareMessagesResults.messages,
                       jsonMode)
      }

      default: {
        throw new CustomError(`${fnName}: unhandled provider: ${provider} ` +
                              `for variant: ${tech.variantName}`)
      }
    }
  }
}
