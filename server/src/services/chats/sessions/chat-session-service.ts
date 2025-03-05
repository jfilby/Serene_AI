import { CustomError } from '@/serene-core-server/types/errors'
import { UserTypes } from '@/serene-core-server/types/user-types'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { UsersService } from '@/serene-core-server/services/users/service'
import { CommonTypes } from '../../../types/types'
import { AgentModel } from '../../../models/agents/agent-model'
import { ChatMessageModel } from '../../../models/chat/chat-message-model'
import { ChatParticipantModel } from '../../../models/chat/chat-participant-model'
import { ChatSessionModel } from '../../../models/chat/chat-session-model'
import { ChatSettingsModel } from '../../../models/chat/chat-settings-model'
import { AgentsService } from '../../agents/agents-service'
import { ChatService } from '../../llm-apis/chat-service'
import { LlmUtilsService } from '../../llm-apis/utils-service'

export class ChatSessionService {

  // Consts
  clName = 'ChatSessionService'

  systemPromptPostfix =
    `Keep your answers concise and inline with the objective.\n`

  // Models
  agentModel = new AgentModel()
  chatMessageModel
  chatParticipantModel = new ChatParticipantModel()
  chatSessionModel = new ChatSessionModel()
  chatSettingsModel = new ChatSettingsModel()
  techModel = new TechModel()

  // Services
  agentsService = new AgentsService()
  chatService = new ChatService()
  llmUtilsService = new LlmUtilsService()
  usersService = new UsersService()

  // Code
  constructor(encryptionKey: string | undefined) {

    this.chatMessageModel = new ChatMessageModel(encryptionKey)
  }

  async createChatSession(
          prisma: any,
          baseChatSettingsId: string | null,
          userProfileId: string,
          encryptedAtRest: boolean,
          jsonMode: boolean | null,
          prompt: string | null,
          name: string | null) {

    // Debug
    const fnName = `${this.clName}.createChatSession()`

    console.log(`${fnName}: starting with userProfileId: ${userProfileId}`)

    const chatSettingsResults = await
            this.llmUtilsService.getOrCreateChatSettings(
              prisma,
              baseChatSettingsId,
              userProfileId,
              encryptedAtRest,
              jsonMode,
              prompt)

    // Verify that chatSettingsId is set
    if (chatSettingsResults.chatSettings == null) {
      throw new CustomError(`${fnName}: chatSettingsResults.chatSettings == null`)
    }

    var chatSettings = chatSettingsResults.chatSettings

    // Create ChatSession
    // Start in new status, only active once there are messages
    var chatSession = await
          this.chatSessionModel.create(
            prisma,
            undefined,  // id,
            chatSettings.id,
            CommonTypes.newStatus,
            encryptedAtRest,
            name,
            userProfileId)

    // Get Agent
    const agent = await
            this.agentModel.getById(
              prisma,
              chatSettings.agentId)

    // Add ChatParticipants
    var chatParticipants: any[] = []

    // console.log(`${fnName}: agent: ${JSON.stringify(agent)}`)

    if (agent == null) {
      throw new CustomError(`${fnName}: agent == null`)
    }

    // Create agent ChatParticipant
    const agentChatParticipant = await
            this.chatParticipantModel.upsert(
              prisma,
              undefined,  // id
              chatSession.id,
              agent.userProfileId)

    chatParticipants.push(agentChatParticipant)

    // Ensure ownerType is set for user
    await this.usersService.verifyHumanUserProfile(
            prisma,
            userProfileId)

    // Create user ChatParticipant
    const userChatParticipant = await
            this.chatParticipantModel.upsert(
              prisma,
              undefined,  // id
              chatSession.id,
              userProfileId)

    chatParticipants.push(userChatParticipant)

    chatSession.chatParticipants = chatParticipants

    // console.log(`${fnName}: chatParticipants: ` +
    //             JSON.stringify(chatParticipants))

    // Return
    return {
      chatSession: chatSession,
      tech: chatSettingsResults.tech
    }
  }

  async enrichWithChatParticipantNames(
          prisma: any,
          chatSession: any) {

    // Debug
    const fnName = `${this.clName}.enrichWithChatParticipantNames()`

    // Iterate ChatParticipants
    for (var i = 0; i < chatSession.chatParticipants.length; i++) {

      const userProfileId = chatSession.chatParticipants[i].userProfileId

      chatSession.chatParticipants[i].name = await
        this.getChatParticipantName(
          prisma,
          userProfileId)
    }

    // Return
    return chatSession
  }

  async getAgentInfo(
          prisma: any,
          chatSessionId: string) {

    // Get the chatParticipant record of the bot
    const toChatParticipant = await
            this.chatParticipantModel.getByChatSessionIdAndOwnerType(
              prisma,
              chatSessionId,
              UserTypes.botRoleOwnerType)

    // Get the userProfileId of the bot
    const toUserProfile = await
            this.usersService.getById(
              prisma,
              toChatParticipant.userProfileId)

    // Get agent name
    const agent = await
            this.agentModel.getByUserProfileId(
              prisma,
              toUserProfile.id)

    // Return
    return {
      toChatParticipant: toChatParticipant,
      toUserProfile: toUserProfile,
      agent: agent
    }
  }

  async getChatMessages(
          prisma: any,
          chatSessionId: string,
          userProfileId: string,
          lastMessageId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.getChatMessages()`

    console.log(`${fnName}: starting with chatSessionId: ` +
                JSON.stringify(chatSessionId))

    // Get ChatSession record
    const chatSession = await
            this.chatSessionModel.getById(
              prisma,
              chatSessionId)

    // Get messages
    var chatMessages = await
          this.chatMessageModel.getByChatSessionId(
            prisma,
            chatSession)

    // Enrich with names
    var chatParticipantCache = new Map<string, any>()

    for (var i = 0; i < chatMessages.length; i++) {

      // Get ChatParticipant
      const chatParticipantId = chatMessages[i].fromChatParticipantId
      var chatParticipant: any = undefined

      if (chatParticipantCache.has(chatParticipantId)) {
        chatParticipant = chatParticipantCache.get(chatParticipantId)

      } else {
        chatParticipant = await
          this.chatParticipantModel.getById(
            prisma,
            chatParticipantId)

        chatParticipant.name = await
          this.getChatParticipantName(
            prisma,
            chatParticipant.userProfileId)

        chatParticipantCache.set(
          chatParticipantId,
          chatParticipant)
      }

      // Set name in ChatMessage
      chatMessages[i].name = chatParticipant.name
    }

    // Return
    console.log(`${fnName}: returning..`)

    return {
      status: true,
      chatMessages: chatMessages
    }
  }

  async getChatParticipantName(
          prisma: any,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getChatParticipantName()`

    // Get UserProfile record
    const userProfile = await
            this.usersService.getById(
              prisma,
              userProfileId)

    switch (userProfile.ownerType) {

      case UserTypes.botRoleOwnerType: {
        const agent = await
                this.agentModel.getByUserProfileId(
                  prisma,
                  userProfileId)

        return agent.name
      }

      case UserTypes.humanRoleOwnerType: {
        const user = await
                this.usersService.getUserByUserProfileId(
                  prisma,
                  userProfileId)

        if (user != null) {
          if (user.name !== null) {
            return user.name
          }
        }

        // No name found
        return `User`
      }

      default: {
        throw new CustomError(`${fnName}: unhandled ownerType in ` +
                              `userProfile: ` + JSON.stringify(userProfile))
      }
    }
  }

  async getChatParticipants(
          prisma: any,
          chatSessionId: string,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getChatParticipants()`

    ;
  }

  async getChatSessionById(
          prisma: any,
          chatSessionId: string,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getChatSession()`

    // console.log(`${fnName}: starting with chatSessionId: ` +
    //             JSON.stringify(chatSessionId))

    // Get chatSession
    var chatSession = await
          this.chatSessionModel.getById(
            prisma,
            chatSessionId)

    if (chatSession.createdById !== userProfileId) {

      throw new CustomError(`You aren't authorized to retrieve this chat ` +
                            `session`)
    }

    // Get participants
    chatSession.chatParticipants = await
      this.chatParticipantModel.getByChatSessionId(
        prisma,
        chatSession.id)

    // Return
    return {
      status: true,
      chatSession: chatSession
    }
  }

  async getChatSessions(
          prisma: any,
          status: string,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getChatSessions()`

    // Validate
    if (userProfileId == null) {
      throw new CustomError(`${fnName}: userProfileId == null`)
    }

    // Get records
    var chatSessions = await
          this.chatSessionModel.filter(
            prisma,
            status,
            undefined,  // isEncryptedAtRest,
            userProfileId)

      // Prep chat sessions for return
      chatSessions = await
        this.prepChatSessionsForReturn(
          prisma,
          chatSessions)

      // Return
      return chatSessions
    }

  async getOrCreateChatSession(
          prisma: any,
          chatSessionId: string,
          baseChatSettingsId: string | null,
          userProfileId: string,
          encryptedAtRest: boolean,
          jsonMode: boolean | null,
          prompt: string | null,
          name: string | null,
          createIfNotExists: boolean = true) {

    // Debug
    const fnName = `${this.clName}.getOrCreateChatSession()`

    // console.log(`${fnName}: starting with userProfileId: ${userProfileId}`)

    // LLM tech
    var tech

    // Try to get the chat session
    var chatSession = await
          this.chatSessionModel.getById(
            prisma,
            chatSessionId)

    // console.log(`${fnName}: chatSession: ${JSON.stringify(chatSession)}`)

    if (chatSession == null) {

      // Create a chatSession
      chatSession = await
        this.createChatSession(
          prisma,
          baseChatSettingsId,
          userProfileId,
          encryptedAtRest,
          jsonMode,
          prompt,
          name)

      tech = chatSession.tech
    } else {
      const chatSettings = await
              this.chatSettingsModel.getById(
                prisma,
                chatSession.chatSettingsId)

      tech = await
        this.techModel.getById(
          prisma,
          chatSettings.llmTechId)
    }

    // Verify
    if (chatSession.createdById !== userProfileId) {

      return {
        status: false,
        message: `You're not authorized to view this chat`
      }
    }

    // Verify chatParticipants
    if (chatSession.chatParticipants.length === 0) {

      throw new CustomError(`${fnName}: chatSession.chatParticipants.length === 0`)
    }

    // Add ChatParticipant names
    // console.log(`${fnName}: calling this.enrichWithChatParticipantNames()..`)

    chatSession = await
      this.enrichWithChatParticipantNames(
        prisma,
        chatSession)

    return {
      status: true,
      chatSession: chatSession
    }
  }

  async prepChatSessionsForReturn(
          prisma: any,
          chatSessions: any[]) {

    // Check if any chatSessions have a null/blank name, if not return
    var hasNullOrBlankName = false

    for (const chatSession of chatSessions) {
      if (chatSession.name == null ||
          chatSession.name.trim() === '') {

        hasNullOrBlankName = true
        break
      }
    }

    if (hasNullOrBlankName === false) {
      return chatSessions
    }

    // Get first message as name, if name not specified
    var updatedChatSessions: any[] = []

    for (var chatSession of chatSessions) {

      if (chatSession.name == null ||
          chatSession.name.trim() === '') {

        const chatMessage = await
                this.chatMessageModel.getFirst(
                  prisma,
                  chatSession)

        // Get message text
        var firstMessageText: string | undefined

        for (const message of JSON.parse(chatMessage.message)) {

          if (message.type === '') {
            firstMessageText = message.text
            break
          }
        }

        // Update chatMessage.name
        chatSession = await
          this.chatSessionModel.update(
            prisma,
            chatSession.id,
            undefined,  // chatSettingsId
            undefined,  // status
            undefined,  // isEncryptedAtRest
            firstMessageText,
            undefined)  // createdById
      }

      // Add the chatSession, which may have been updated
      updatedChatSessions.push(chatSession)
    }

    // Return
    return updatedChatSessions
  }

  async runSessionTurn(
          prisma: any,
          chatSessionId: string,
          fromChatParticipantId: string,
          fromUserProfileId: string,
          fromName: string,
          fromContents: any) {

    // Debug
    const fnName = `${this.clName}.runSessionTurn()`

    console.log(`${fnName}: starting with chatSessionId ` +
                JSON.stringify(chatSessionId))

    // Get ChatSession
    const chatSession = await
            this.chatSessionModel.getById(
              prisma,
              chatSessionId,
              true)  // includeChatSettings

    // Debug
    // console.log(`${fnName}: chatSession: ` + JSON.stringify(chatSession))

    const agentInfo = await
            this.getAgentInfo(
              prisma,
              chatSessionId)

    // Get chat messages
    const chatMessages = await
            this.chatMessageModel.getByChatSessionId(
              prisma,
              chatSession)

    // Get Tech
    const llmTech = await
            this.techModel.getById(
              prisma,
              chatSession.chatSettings.llmTechId)

    // Build messagesWithRoles
    const messagesWithRoles =
            this.llmUtilsService.buildMessagesWithRoles(
              llmTech,
              chatMessages,
              fromContents,
              [fromChatParticipantId],
              [agentInfo.toChatParticipant.id])

    // Call Gemini
    const chatCompletionResults = await
            this.chatService.llmRequest(
              prisma,
              chatSession.chatSettings.llmTechId,
              fromUserProfileId,
              agentInfo.agent,
              messagesWithRoles,
              chatSession.chatSettings.prompt,
              chatSession.chatSettings.isJsonMode)

    // Debug
    // console.log(`${fnName}: chatCompletionResults: ` +
    //             JSON.stringify(chatCompletionResults))

    // Return
    return {
      isRateLimited: false,
      waitSeconds: 0,
      chatSession: chatSession,
      fromChatParticipantId: fromChatParticipantId,
      fromContents: fromContents,
      toChatParticipantId: agentInfo.toChatParticipant.id,
      toUserProfileId: agentInfo.toUserProfile.id,
      toName: agentInfo.agent.name,
      toContents: chatCompletionResults.messages,
      toJson: chatCompletionResults.json
    }
  }

  async saveMessages(
          prisma: any,
          chatSession: any,
          sessionTurnData: any) {

    // Debug
    const fnName = `${this.clName}.saveMessages()`

    console.log(`${fnName}: sessionTurnData: ` +
                JSON.stringify(sessionTurnData))

    // Switch that status from N (new) to A (active)
    if (chatSession.status === CommonTypes.newStatus) {

      chatSession = await
        this.chatSessionModel.update(
          prisma,
          chatSession.id,
          undefined,  // chatSettingsId
          CommonTypes.activeStatus,
          undefined,  // isEncryptedAtRest
          undefined,  // name
          undefined)  // createdById
    }

    // Save from message
    const userChatMessage = await
            this.chatMessageModel.create(
              prisma,
              undefined,  // id
              chatSession,
              sessionTurnData.fromChatParticipantId,
              sessionTurnData.toChatParticipantId,
              false,      // sentByAi
              JSON.stringify(sessionTurnData.fromContents))

    // Save to message
    const aiReplyChatMessage = await
            this.chatMessageModel.create(
              prisma,
              undefined,  // id
              chatSession,
              sessionTurnData.toChatParticipantId,
              sessionTurnData.fromChatParticipantId,
              true,       // sentByAi
              JSON.stringify(sessionTurnData.toContents))

    // Return
    return {
      status: true,
      userChatMessage: userChatMessage,
      aiReplyChatMessage: aiReplyChatMessage
    }
  }
}
