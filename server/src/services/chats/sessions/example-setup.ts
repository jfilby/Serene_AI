import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { CommonTypes } from '../../../types/types'
import { AiTechDefs } from '../../../types/tech-defs'
import { AgentUserModel } from '../../../models/agents/agent-user-model'
import { ChatSettingsModel } from '../../../models/chat/chat-settings-model'

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

    // Get the default Tech
    const tech = await
            this.techModel.getDefaultProvider(
              prisma,
              AiTechDefs.llms)

    // Upsert ChatSetting record
    const chatSetting = await
            this.chatSettingsModel.upsert(
              prisma,
              undefined,            // id
              undefined,            // baseChatSettingsId
              CommonTypes.activeStatus,
              false,                // isEncryptedAtRest
              false,                // isJsonMode
              false,                // isPinned
              'Test chat setting',  // name
              tech.id,
              agentUser.id,
              'Talk about anything tech related',
              userProfileId)
  }
}
