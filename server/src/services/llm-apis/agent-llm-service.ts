import { CustomError } from '@/serene-core-server/types/errors'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { ChatSettingsModel } from '../../models/chat/chat-settings-model'
import { AgentsService } from '../agents/agents-service'
import { ChatService } from './chat-service'
import { LlmUtilsService } from './utils-service'

export class AgentLlmService {

  // Consts
  clName = 'AgentLlmService'

  // Models
  chatSettingsModel = new ChatSettingsModel()
  techModel = new TechModel()

  // Services
  agentsService = new AgentsService()
  chatService = new ChatService()
  llmUtilsService = new LlmUtilsService()

  // Code
  async agentSingleShotLlmRequest(
          prisma: any,
          tech: any,
          agentUniqueRefId: string | null,
          agentName: string,
          agentRole: string,
          prompt: string,
          isEncryptedAtRest: boolean,
          isJsonMode: boolean,
          tryGetFromCache: boolean = false) {

    // Single-shot agent LLM request

    // Debug
    const fnName = `${this.clName}.agentSingleShotLlmRequest()`

    // Get default/override tech if not specified
    if (tech == null) {

      tech = await
        this.techModel.getByVariantName(
          prisma,
          process.env.NEXT_PUBLIC_DEFAULT_LLM_VARIANT as string)
    }

    // Get or create agent
    const agentUser = await
            this.agentsService.getOrCreate(
              prisma,
              agentUniqueRefId,
              agentName,
              agentRole,
              null)

    // Build the messages
    const inputMessagesWithRoles = await
            this.llmUtilsService.buildMessagesWithRolesForSinglePrompt(
              prisma,
              undefined,  // tech
              prompt)

    // Make the LLM request
    const chatCompletionResults = await
            this.chatService.llmRequest(
              prisma,
              tech.id,    // llmTechId
              undefined,  // userProfile
              agentUser,
              inputMessagesWithRoles,
              undefined,  // systemPrompt
              isJsonMode,
              tryGetFromCache)

    // Validate
    if (chatCompletionResults.messages == null) {
      throw new CustomError(`${fnName}: no messages`)
    }

    if (isJsonMode === true &&
        chatCompletionResults.json == null) {

      throw new CustomError(`${fnName}: expected json`)
    }

    return {
      llmTechId: chatCompletionResults.llmTechId,
      cacheKey: chatCompletionResults.cacheKey,
      message: chatCompletionResults.message,
      messages: chatCompletionResults.messages,
      json: chatCompletionResults.json,
      fromCache: chatCompletionResults.fromCache
    }
  }
}
