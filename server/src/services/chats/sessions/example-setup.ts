import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { CommonTypes } from '../../../types/types'
import { AiTechDefs } from '../../../types/tech-defs'
import { AgentModel } from '../../../models/agents/agent-model'
import { ChatSettingsModel } from '../../../models/chat/chat-settings-model'

export class ExampleChatSessionSetupService {

  // Consts
  clName = 'ExampleChatSessionSetupService'

  // Models
  agentModel = new AgentModel()
  chatSettingsModel = new ChatSettingsModel()
  techModel = new TechModel()

  // Code
  async exampleSettings(
          prisma: any,
          userProfileId: string) {

    // Upsert an example agent
    const agent = await
            this.agentModel.upsert(
              prisma,
              undefined,  // id
              'Test agent',
              'Generalist',
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
              false,                // pinned
              'Test chat setting',  // name
              tech.id,
              agent.id,
              'Talk about anything tech related',
              userProfileId)
  }
}
