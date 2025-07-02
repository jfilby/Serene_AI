import { CustomError } from '@/serene-core-server/types/errors'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { SereneAiServerOnlyTypes } from '../../types/server-only-types'
import { ChatSessionModel } from '../../models/chat/chat-session-model'
import { ChatSettingsModel } from '../../models/chat/chat-settings-model'
import { AgentsService } from '../agents/agents-service'
import { ChatService } from './chat-service'
import { LlmUtilsService } from './utils-service'

// Models
const chatSessionModel = new ChatSessionModel()
const chatSettingsModel = new ChatSettingsModel()
const techModel = new TechModel()

// Services
const agentsService = new AgentsService()
const chatService = new ChatService()
const llmUtilsService = new LlmUtilsService()

// Class
export class AgentLlmService {

  // Consts
  clName = 'AgentLlmService'

  // Code
  async agentSingleShotLlmRequest(
          prisma: any,
          tech: any,
          userProfileId: string,
          instanceId: string | null,
          chatSettingsName: string,
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
        techModel.getByVariantName(
          prisma,
          process.env.DEFAULT_LLM_VARIANT as string)
    }

    // Get or create agent
    const agentUser = await
            agentsService.getOrCreate(
              prisma,
              agentUniqueRefId,
              agentName,
              agentRole,
              null)

    // Get ChatSettings
    const chatSettings = await
            chatSettingsModel.getByName(
              prisma,
              chatSettingsName)

    if (chatSettings == null) {
      throw new CustomError(`${fnName}: chatSettings == null for ` +
                            chatSettingsName)
    }

    // Create a ChatSession
    const chatSession = await
            chatSessionModel.create(
              prisma,
              undefined,  // id
              chatSettings.id,
              instanceId,
              SereneAiServerOnlyTypes.activeStatus,
              false,      // isEncryptedAtRest
              null,       // name
              null,       // externalIntegration
              null,       // externalId
              userProfileId)  // createdById

    // Build the messages
    const inputMessagesWithRoles = await
            llmUtilsService.buildMessagesWithRolesForSinglePrompt(
              prisma,
              undefined,  // tech
              prompt)

    // Make the LLM request
    const chatCompletionResults = await
            chatService.llmRequest(
              prisma,
              tech.id,    // llmTechId
              chatSession,
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
