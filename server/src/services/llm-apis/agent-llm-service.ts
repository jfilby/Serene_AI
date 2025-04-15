import { CustomError } from '@/serene-core-server/types/errors'
import { ChatSettingsModel } from '../../models/chat/chat-settings-model'
import { AgentsService } from '../agents/agents-service'
import { ChatService } from './chat-service'
import { LlmUtilsService } from './utils-service'

export class AgentLlmService {

  // Consts
  clName = 'AgentLlmService'

  // Models
  chatSettingsModel = new ChatSettingsModel()

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
              undefined,  // tech
              prompt)

    // Make the LLM request
    const chatCompletionResults = await
            this.chatService.llmRequest(
              prisma,
              tech.id,    // llmTechId
              undefined,  // userProfileId
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
