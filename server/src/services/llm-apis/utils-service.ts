import { CustomError } from '@/serene-core-server/types/errors'
import { AiTechDefs } from '../../types/tech-defs'
import { GoogleGeminiLlmService } from './google-gemini/llm-api'
import { GoogleGeminiLlmUtilsService } from './google-gemini/utils'
import { OpenAIGenericLlmService } from './openai/llm-generic-service'
import { OpenAiLlmService } from './openai/llm-service'
import { OpenAiLlmUtilsService } from './openai/utils'

export class LlmUtilsService {

  // Consts
  clName = 'LlmUtilsService'

  // Services
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

  buildMessagesWithRolesForSinglePrompt(
    tech: any,
    prompt: string) {

    // Debug
    const fnName = `${this.clName}.buildMessagesWithRolesForSinglePrompt()`

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

  async prepareAndSendChatMessages(
          tech: any,
          agent: any,
          systemPrompt: string | undefined,
          messagesWithRoles: any[],
          jsonMode: boolean) {

    // Debug
    const fnName = `${this.clName}.buildMessagesWithRolesForSinglePrompt()`

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
