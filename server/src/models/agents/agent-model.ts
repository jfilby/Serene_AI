import { UserTypes } from '@/serene-core-server/types/user-types'

export class AgentModel {

  // Consts
  clName = 'AgentModel'

  // Code
  async create(
          prisma: any,
          name: string,
          role: string,
          defaultPrompt: string | undefined) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create UserProfile record
    console.log(`${fnName}: creating userProfile record..`)

    var userProfile: any = null

    try {
      userProfile = await prisma.userProfile.create({
        data: {
          isAdmin: false,
          ownerType: UserTypes.botRoleOwnerType,
          roles: [role],
          defaultPrompt: defaultPrompt
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
    }

    // Create and return Agent record
    console.log(`${fnName}: creating agent record..`)

    try {
      return await prisma.agent.create({
        data: {
          userProfileId: userProfile.id,
          name: name,
          role: role
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
    }
  }

  async getById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`
  
    // Get record
    try {
      return await prisma.agent.findUnique({
        where: {
          id: id
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async getByName(
          prisma: any,
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByName()`
  
    // Get Agent record
    try {
      return await prisma.agent.findUnique({
        where: {
          name: name
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async getByUserProfileId(
          prisma: any,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getByUserProfileId()`

    console.log(`${fnName}: userProfileId: ${userProfileId}`)

    // Query
    try {
      return await prisma.agent.findUnique({
        where: {
          userProfileId: userProfileId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.log(`${fnName}: error: ${error}`)
      }
    }
  }

  async update(prisma: any,
               id: string,
               name: string,
               role: string,
               defaultPrompt: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    console.log(`${fnName}: creating agent record..`)

    try {
      return await prisma.agent.update({
        data: {
          name: name,
          role: role,
          defaultPrompt: defaultPrompt
        },
        where: {
          id: id
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
    }
  }

  async upsert(prisma: any,
               id: string | undefined,
               name: string,
               role: string,
               defaultPrompt: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Try to get by name
    if (id == null) {

      const agent = await
              this.getByName(
                prisma,
                name)

      if (agent != null) {
        id = agent.id
      }
    }

    if (id == null) {
      return await this.create(
                     prisma,
                     name,
                     role,
                     defaultPrompt)
    } else {
      return await this.update(
                     prisma,
                     id,
                     name,
                     role,
                     defaultPrompt)
    }
  }
}
