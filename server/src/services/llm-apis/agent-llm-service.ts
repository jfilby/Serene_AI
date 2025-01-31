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
          agentName: string,
          agentRole: string,
          prompt: string,
          jsonMode: boolean,
          tryGetFromCache: boolean = false) {

    // Single-shot agent LLM request

    // Debug
    const fnName = `${this.clName}.agentSingleShotLlmRequest()`

    // Get or create agent
    const agent = await
            this.agentsService.getOrCreate(
              prisma,
              agentName,
              agentRole)

    // Get LLM tech
    const chatSettingsResults = await
            this.llmUtilsService.getOrCreateChatSettings(
              prisma,
              null,       // baseChatSettingsId
              agent.userProfileId,
              jsonMode,
              null,       // prompt
              true)       // getTech

    const tech = chatSettingsResults.tech

    // Build the messages
    const inputMessagesWithRoles = await
            this.llmUtilsService.buildMessagesWithRolesForSinglePrompt(
              prisma,
              undefined,  // tech
              agent.userProfileId,
              jsonMode,
              prompt)

    // Make the LLM request
    const chatCompletionResults = await
            this.chatService.llmRequest(
              prisma,
              tech.id,    // llmTechId
              undefined,  // userProfileId
              agent,
              inputMessagesWithRoles,
              undefined,  // systemPrompt
              jsonMode,
              tryGetFromCache)

    // Validate
    if (chatCompletionResults.messages == null) {
      throw new CustomError(`${fnName}: no messages`)
    }

    if (jsonMode === true &&
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
