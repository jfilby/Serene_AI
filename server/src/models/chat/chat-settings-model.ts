export class ChatSettingsModel {

  // Consts
  clName = 'ChatSettingsModel'

  // Code
  async create(prisma: any,
               status: string,
               name: string,
               llmTechId: string,
               agentId: string,
               prompt: string | undefined,
               createdById: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    console.log(`${fnName}: starting..`)

    // Create record
    try {
      return await prisma.chatSettings.create({
        data: {
          status: status,
          name: name,
          llmTechId: llmTechId,
          agentId: agentId,
          prompt: prompt,
          createdById: createdById
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getById(prisma: any,
                id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query record
    var chatSettings: any = undefined

    try {
      chatSettings = await prisma.chatSettings.findUnique({
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

    // Return OK
    return chatSettings
  }

  async getByName(
          prisma: any,
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByName()`

    // Query record
    var chatSettings: any = undefined

    try {
      chatSettings = await prisma.chatSettings.findUnique({
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

    // Return OK
    return chatSettings
  }

  async update(prisma: any,
               id: string,
               status: string | undefined,
               name: string | undefined,
               llmTechId: string | undefined,
               agentId: string | undefined,
               prompt: string | undefined,
               createdById: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.chatSettings.update({
        data: {
          status: status,
          name: name,
          llmTechId: llmTechId,
          agentId: agentId,
          prompt: prompt,
          createdById: createdById
        },
        where: {
          id: id
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async upsert(prisma: any,
               id: string | undefined,
               status: string | undefined,
               name: string | undefined,
               llmTechId: string | undefined,
               agentId: string | undefined,
               prompt: string | undefined,
               createdById: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (llmTechId == null) {
        console.error(`${fnName}: id is null and llmTechId is null`)
        throw 'Prisma error'
      }

      if (agentId == null) {
        console.error(`${fnName}: id is null and agentId is null`)
        throw 'Prisma error'
      }

      if (createdById == null) {
        console.error(`${fnName}: id is null and createdById is null`)
        throw 'Prisma error'
      }

      return await this.create(
                     prisma,
                     status,
                     name,
                     llmTechId,
                     agentId,
                     prompt,
                     createdById)
    } else {

      return await this.update(
                     prisma,
                     id,
                     status,
                     name,
                     llmTechId,
                     agentId,
                     prompt,
                     createdById)
    }
  }
}
