import { AgentUserModel } from '../../models/agents/agent-user-model'

export class AgentsService {

  // Consts
  clName = 'AgentsService'

  // Models
  agentUserModel = new AgentUserModel()

  // Code
  async getOrCreate(
          prisma: any,
          uniqueRefId: string | null,
          name: string,
          role: string) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Try to get the agent record
    var agentUser: any

    if (uniqueRefId != null) {

      agentUser = await
        this.agentUserModel.getByUniqueRefId(
          prisma,
          uniqueRefId)

      if (agentUser != null) {
        return agentUser
      }
    }

    // Create agent and userProfile records
    agentUser = await
      this.agentUserModel.create(
        prisma,
        uniqueRefId,
        name,
        role,
        null)  // defaultPrompt

    // Return agent and userProfile records
    return agentUser
  }
}
