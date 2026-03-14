import { PrismaClient } from '@/prisma/client'
import { CustomError } from 'serene-core-server'
import { ChatSettingsModel, TechModel } from 'serene-core-server'
import { AgentUserModel } from '../../../models/agents/agent-user-model'
import { SereneCoreServerTypes } from 'serene-core-server'

export class ExampleChatSessionSetupService {

  // Consts
  clName = 'ExampleChatSessionSetupService'

  // Models
  agentUserModel = new AgentUserModel()
  chatSettingsModel = new ChatSettingsModel()
  techModel = new TechModel()

  // Code
  async exampleSettings(
          prisma: PrismaClient,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.exampleSettings()`

    // Upsert an example agent
    const agentUser = await
            this.agentUserModel.upsert(
              prisma,
              undefined,                     // id
              'Serene AI|example settings',  // uniqueRefId
              'Test agent',
              'Generalist',
              10,                            // maxPrevMessages
              'Talk about AI')

    // Validate
    if (agentUser == null) {
      throw new CustomError(`${fnName}: agentUser == null`)
    }

    // Upsert ChatSetting record
    const chatSetting = await
            this.chatSettingsModel.upsert(
              prisma,
              undefined,            // id
              undefined,            // baseChatSettingsId
              SereneCoreServerTypes.activeStatus,
              false,                // isEncryptedAtRest
              false,                // isJsonMode
              false,                // isPinned
              'Test chat setting',  // name
              agentUser.id,
              'Talk about anything tech related',
              null,                 // appCustom
              userProfileId)
  }
}
