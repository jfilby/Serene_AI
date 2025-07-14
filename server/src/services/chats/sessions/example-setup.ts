import { ChatSettingsModel } from '@/serene-core-server/models/chat/chat-settings-model'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { AgentUserModel } from '../../../models/agents/agent-user-model'
import { SereneCoreServerTypes } from '@/serene-core-server/types/user-types'

export class ExampleChatSessionSetupService {

  // Consts
  clName = 'ExampleChatSessionSetupService'

  // Models
  agentUserModel = new AgentUserModel()
  chatSettingsModel = new ChatSettingsModel()
  techModel = new TechModel()

  // Code
  async exampleSettings(
          prisma: any,
          userProfileId: string) {

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
