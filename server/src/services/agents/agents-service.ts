import { AgentModel } from '../../models/agents/agent-model'

export class AgentsService {

  // Consts
  clName = 'AgentsService'

  // Models
  agentModel = new AgentModel()

  // Code
  async getOrCreate(
          prisma: any,
          name: string,
          role: string) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Try to get the agent record
    var agent = await
          this.agentModel.getByName(
            prisma,
            name)

    if (agent != null) {
      return agent
    }

    // Create agent and userProfile records
    agent = await
      this.agentModel.create(
        prisma,
        name,
        role,
        undefined)  // defaultPrompt

    // Return agent and userProfile records
    return agent
  }
}
