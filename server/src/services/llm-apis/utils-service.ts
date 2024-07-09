import { CustomError } from '@/serene-core-server/types/errors'
import { AiTechDefs } from '../../types/tech-defs'
import { GoogleGeminiLlmUtilsService } from './google-gemini/utils'
import { OpenAiLlmUtilsService } from './openai/utils'

export class LlmUtilsService {

  // Consts
  clName = 'LlmUtilsService'

  // Services
  googleGeminiLlmUtilsService = new GoogleGeminiLlmUtilsService()
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
}
