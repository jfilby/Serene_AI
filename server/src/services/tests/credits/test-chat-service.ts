// TODO:
// 1. Implement a test mode for LLM calls so that they don't induce actual
//    costs. Possibly create an interface for optional parameters.
// 2. Create an interface for the fields returned from an LLM request.

import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { AiTechDefs } from '../../../types/tech-defs'
import { SereneAiServerOnlyTypes } from '../../../types/server-only-types'
import { ChatSessionModel } from '../../../models/chat/chat-session-model'
import { ChatSettingsModel } from '../../../models/chat/chat-settings-model'
import { ChatService } from '../../llm-apis/chat-service'
import { ChatMessageService } from '../../chats/messages/service'

export class TestLlmService {

  // Test classes aren't typically called, thus the class instances used are
  // within the class.

  // Models
  chatSessionModel = new ChatSessionModel()
  chatSettingsModel = new ChatSettingsModel()
  techModel = new TechModel()

  // Services
  chatService = new ChatService()
  chatMessageService = new ChatMessageService(undefined)

  // Consts
  clName = 'TestLlmService'

  // Code
  async createTestChatSession(
          prisma: PrismaClient,
          userProfileId: string,
          instanceId: string | null) {

    // Debug
    const fnName = `${this.clName}.createTestChatSession()`

    // Get ChatSettings
    const chatSettingsName = SereneAiServerOnlyTypes.defaultChatSettingsName

    const chatSettings = await
            this.chatSettingsModel.getByName(
              prisma,
              chatSettingsName)

    if (chatSettings == null) {
      throw new CustomError(`${fnName}: chatSettings == null for ` +
                            chatSettingsName)
    }

    // Create a ChatSession
    const chatSession = await
            this.chatSessionModel.create(
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

    // Return
    return chatSession
  }

  async test(
          prisma: PrismaClient,
          adminUserProfile: any,
          regularTestUserProfile: any) {

    // Define the test messages
    const messagesWithRoles: any[] = []

    // Free LLM test
    await this.testFree(
            prisma,
            adminUserProfile,
            regularTestUserProfile,
            messagesWithRoles)

    // Paid LLM test
    await this.testPaid(
            prisma,
            adminUserProfile,
            regularTestUserProfile,
            messagesWithRoles)

    // Return
    return {
      status: true
    }
  }

  async testFree(
          prisma: PrismaClient,
          adminUserProfile: any,
          regularTestUserProfile: any,
          messagesWithRoles: any[]) {

    // Get a free LLM variant
    const variantName = AiTechDefs.googleGeminiV2FlashFree

    // Load the tech record
    const llmTech = await
            this.techModel.getByVariantName(
              prisma,
              variantName)

    // Call a free LLM variant in test mode with the admin user
    const adminUserChatSession = await
            this.createTestChatSession(
              prisma,
              adminUserProfile.id,
              null)  // instanceId

    await this.chatService.llmRequest(
            prisma,
            llmTech.id,
            adminUserChatSession,
            adminUserProfile,
            undefined,  // agentUser
            messagesWithRoles)

    // Call a free LLM variant in test mode with the test user
    const regularTestUserChatSession = await
            this.createTestChatSession(
              prisma,
              adminUserProfile.id,
              null)  // instanceId

    await this.chatService.llmRequest(
            prisma,
            llmTech.id,
            regularTestUserChatSession,
            regularTestUserProfile,
            undefined,  // agentUser
            messagesWithRoles)
  }

  async testPaid(
          prisma: PrismaClient,
          adminUserProfile: any,
          regularTestUserProfile: any,
          messagesWithRoles: any[]) {

    // Get a paid LLM variant
    const variantName = AiTechDefs.googleGeminiV2Flash

    // Load the tech record
    const llmTech = await
            this.techModel.getByVariantName(
              prisma,
              variantName)

    // Call a paid LLM variant in test mode with the admin user
    const adminUserChatSession = await
            this.createTestChatSession(
              prisma,
              adminUserProfile.id,
              null)  // instanceId

    await this.chatService.llmRequest(
            prisma,
            llmTech.id,
            adminUserChatSession,
            adminUserProfile,
            undefined,  // agentUser
            messagesWithRoles)

    // Call a paid LLM variant in test mode with the test user
    const regularTestUserChatSession = await
            this.createTestChatSession(
              prisma,
              adminUserProfile.id,
              null)  // instanceId

    await this.chatService.llmRequest(
            prisma,
            llmTech.id,
            regularTestUserChatSession,
            regularTestUserProfile,
            undefined,  // agentUser
            messagesWithRoles)
  }
}
