import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { SereneCoreServerTypes } from '@/serene-core-server/types/user-types'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { ResourceQuotasQueryService } from '@/serene-core-server/services/quotas/query-service'
import { AiTechDefs } from '../../../types/tech-defs'
import { SereneAiServerOnlyTypes } from '../../../types/server-only-types'
import { ChatSessionModel } from '../../../models/chat/chat-session-model'
import { ChatSettingsModel } from '../../../models/chat/chat-settings-model'
import { AgentsService } from '../../agents/agents-service'
import { ChatService } from '../../llm-apis/chat-service'
import { ChatMessageService } from '../../chats/messages/service'

export class TestLlmService {

  // Consts
  clName = 'TestLlmService'

  agentUniqueRefId = `Serene AI|Test agent`
  agentName = `Test agent`
  agentRole = 'Testing'

  // Test classes aren't typically called, thus the class instances used are
  // within the class.

  // Models
  chatSessionModel = new ChatSessionModel()
  chatSettingsModel = new ChatSettingsModel()
  techModel = new TechModel()

  // Services
  agentsService = new AgentsService()
  chatService = new ChatService()
  chatMessageService = new ChatMessageService(process.env.NEXT_PUBLIC_DB_ENCRYPT_SECRET)
  resourceQuotasQueryService = new ResourceQuotasQueryService()

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

    // Debug
    const fnName = `${this.clName}.testFree()`

    // Get a free LLM variant
    const variantName = AiTechDefs.googleGeminiV2FlashFree

    // Load the tech record
    const llmTech = await
            this.techModel.getByVariantName(
              prisma,
              variantName)

    if (llmTech == null) {
      throw new CustomError(`${fnName}: llmTech == null for variantName: ` +
                            variantName)
    }

    // Get or create agent
    const agentUser = await
            this.agentsService.getOrCreate(
              prisma,
              this.agentUniqueRefId,
              this.agentName,
              this.agentRole,
              null)

    // Get pre credits and usage
    const adminUserQuotaAndUsage1 = await
            this.resourceQuotasQueryService.getQuotaAndUsage(
              prisma,
              adminUserProfile.id,
              SereneCoreServerTypes.credits,
              new Date())

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
            agentUser,
            messagesWithRoles)

    // Get post credits and usage
    const adminUserQuotaAndUsage2 = await
            this.resourceQuotasQueryService.getQuotaAndUsage(
              prisma,
              adminUserProfile.id,
              SereneCoreServerTypes.credits,
              new Date())

    // Validate admin user usage had no inc
    if (adminUserQuotaAndUsage1.usage !== adminUserQuotaAndUsage2.usage) {

      throw new CustomError(
                  `${fnName}: admin user/free: pre usage: ` +
                  `${adminUserQuotaAndUsage1.usage} ` +
                  `!= post usage: ${adminUserQuotaAndUsage2.usage}`)
    }

    // Get pre credits and usage
    const regularTestUserQuotaAndUsage1 = await
            this.resourceQuotasQueryService.getQuotaAndUsage(
              prisma,
              regularTestUserProfile.id,
              SereneCoreServerTypes.credits,
              new Date())

    // Call a free LLM variant in test mode with the test user
    const regularTestUserChatSession = await
            this.createTestChatSession(
              prisma,
              regularTestUserProfile.id,
              null)  // instanceId

    await this.chatService.llmRequest(
            prisma,
            llmTech.id,
            regularTestUserChatSession,
            regularTestUserProfile,
            agentUser,
            messagesWithRoles)

    // Get post credits and usage
    const regularTestUserQuotaAndUsage2 = await
            this.resourceQuotasQueryService.getQuotaAndUsage(
              prisma,
              adminUserProfile.id,
              SereneCoreServerTypes.credits,
              new Date())

    // Validate regular test user usage had no inc
    if (regularTestUserQuotaAndUsage1.usage !==
        regularTestUserQuotaAndUsage2.usage) {

      throw new CustomError(
                  `${fnName}: regular test user/free: pre usage: ` +
                  `${regularTestUserQuotaAndUsage1.usage} ` +
                  `!= post usage: ${regularTestUserQuotaAndUsage2.usage}`)
    }
  }

  async testPaid(
          prisma: PrismaClient,
          adminUserProfile: any,
          regularTestUserProfile: any,
          messagesWithRoles: any[]) {

    // Debug
    const fnName = `${this.clName}.testPaid()`

    // Get a paid LLM variant
    const variantName = AiTechDefs.mockedLlm

    // Load the tech record
    const llmTech = await
            this.techModel.getByVariantName(
              prisma,
              variantName)

    if (llmTech == null) {
      throw new CustomError(`${fnName}: llmTech == null for variantName: ` +
                            variantName)
    }

    // Get or create agent
    const agentUser = await
            this.agentsService.getOrCreate(
              prisma,
              this.agentUniqueRefId,
              this.agentName,
              this.agentRole,
              null)

    // Get pre credits and usage
    const adminUserQuotaAndUsage1 = await
            this.resourceQuotasQueryService.getQuotaAndUsage(
              prisma,
              adminUserProfile.id,
              SereneCoreServerTypes.credits,
              new Date())

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
            agentUser,
            messagesWithRoles)

    // Get post credits and usage
    const adminUserQuotaAndUsage2 = await
            this.resourceQuotasQueryService.getQuotaAndUsage(
              prisma,
              adminUserProfile.id,
              SereneCoreServerTypes.credits,
              new Date())

    // Validate admin user usage had no inc
    if (adminUserQuotaAndUsage1.usage !== adminUserQuotaAndUsage2.usage) {

      throw new CustomError(
                  `${fnName}: admin user/paid: pre usage: ` +
                  `${adminUserQuotaAndUsage1.usage} ` +
                  `!= post usage: ${adminUserQuotaAndUsage2.usage}`)
    }

    // Call a paid LLM variant in test mode with the test user
    const regularTestUserChatSession = await
            this.createTestChatSession(
              prisma,
              adminUserProfile.id,
              null)  // instanceId

    // Get pre credits and usage
    const regularTestUserQuotaAndUsage1 = await
            this.resourceQuotasQueryService.getQuotaAndUsage(
              prisma,
              regularTestUserProfile.id,
              SereneCoreServerTypes.credits,
              new Date())

    await this.chatService.llmRequest(
            prisma,
            llmTech.id,
            regularTestUserChatSession,
            regularTestUserProfile,
            agentUser,
            messagesWithRoles)

    // Get post credits and usage
    const regularTestUserQuotaAndUsage2 = await
            this.resourceQuotasQueryService.getQuotaAndUsage(
              prisma,
              regularTestUserProfile.id,
              SereneCoreServerTypes.credits,
              new Date())

    // Validate regular test user usage had an inc
    if (regularTestUserQuotaAndUsage1.usage <=
        regularTestUserQuotaAndUsage2.usage) {

      throw new CustomError(
                  `${fnName}: regular test user/paid: pre usage: ` +
                  `${regularTestUserQuotaAndUsage1.usage} ` +
                  `<= post usage: ${regularTestUserQuotaAndUsage2.usage}`)
    }
  }
}
