export class ChatSettingsModel {

  // Consts
  clName = 'ChatSettingsModel'

  // Code
  async create(prisma: any,
               baseChatSettingsId: string | null,
               status: string,
               isEncryptedAtRest: boolean,
               isJsonMode: boolean,
               isPinned: boolean,
               name: string | null,
               llmTechId: string,
               agentUserId: string,
               prompt: string | null,
               createdById: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    console.log(`${fnName}: starting..`)

    // Create record
    try {
      return await prisma.chatSettings.create({
        data: {
          baseChatSettingsId: baseChatSettingsId,
          status: status,
          isEncryptedAtRest: isEncryptedAtRest,
          isJsonMode: isJsonMode,
          isPinned: isPinned,
          name: name,
          llmTechId: llmTechId,
          agentUserId: agentUserId,
          prompt: prompt,
          createdById: createdById
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.deleteById()`

    // Delete records
    try {
      await prisma.chatSettings.deleteMany({
        where: {
          id: id
        }
      })
    } catch(error: any) {
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

    // Validate
    if (name == null) {
      console.error(`${fnName}: id is null and name is null`)
      throw 'Prisma error'
    }

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

  async getByBaseChatSettingsId(
          prisma: any,
          baseChatSettingsId: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.getByBaseChatSettingsId()`

    // Query records
    try {
      return await prisma.chatSettings.findMany({
        where: {
          baseChatSettingsId: baseChatSettingsId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getUnused(prisma: any) {

    // Debug
    const fnName = `${this.clName}.getByBaseChatSettingsId()`

    // Query records
    try {
      return await prisma.chatSettings.findMany({
        where: {
          pinned: false,
          ofChatSessions: {
            none: {}
          }
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async update(prisma: any,
               id: string,
               baseChatSettingsId: string | null | undefined,
               status: string | undefined,
               isEncryptedAtRest: boolean | undefined,
               isJsonMode: boolean | undefined,
               isPinned: boolean | undefined,
               name: string | null | undefined,
               llmTechId: string | undefined,
               agentUserId: string | undefined,
               prompt: string | null | undefined,
               createdById: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.chatSettings.update({
        data: {
          baseChatSettings: baseChatSettingsId != null ? {
            connect: {
              id: baseChatSettingsId
            }
          } : undefined,
          status: status,
          isEncryptedAtRest: isEncryptedAtRest,
          isJsonMode: isJsonMode,
          isPinned: isPinned,
          name: name,
          llmTech: llmTechId != null ? {
            connect: {
              id: llmTechId
            }
          } : undefined,
          agentUser: agentUserId != null ? {
            connect: {
              id: agentUserId
            }
          } : undefined,
          prompt: prompt,
          createdByUserProfile: createdById != null ? {
            connect: {
              id: createdById
            }
          } : undefined
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
               baseChatSettingsId: string | null | undefined,
               status: string | undefined,
               isEncryptedAtRest: boolean | undefined,
               isJsonMode: boolean | undefined,
               isPinned: boolean | undefined,
               name: string | null | undefined,
               llmTechId: string | undefined,
               agentUserId: string | undefined,
               prompt: string | null | undefined,
               createdById: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // Get by name if id not specified
    if (id == null &&
        name != null) {

      const chatSettings = await
              this.getByName(
                prisma,
                name)

      if (chatSettings != null) {
        id = chatSettings.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (baseChatSettingsId === undefined) {
        console.error(`${fnName}: id is null and baseChatSettingsId is undefined`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (isEncryptedAtRest == null) {
        console.error(`${fnName}: id is null and isEncryptedAtRest is null`)
        throw 'Prisma error'
      }

      if (isJsonMode == null) {
        console.error(`${fnName}: id is null and isJsonMode is null`)
        throw 'Prisma error'
      }

      if (isPinned == null) {
        console.error(`${fnName}: id is null and isPinned is null`)
        throw 'Prisma error'
      }

      if (name === undefined) {
        console.error(`${fnName}: id is null and name is undefined`)
        throw 'Prisma error'
      }

      if (llmTechId == null) {
        console.error(`${fnName}: id is null and llmTechId is null`)
        throw 'Prisma error'
      }

      if (agentUserId == null) {
        console.error(`${fnName}: id is null and agentUserId is null`)
        throw 'Prisma error'
      }

      if (prompt === undefined) {
        console.error(`${fnName}: id is null and prompt is undefined`)
        throw 'Prisma error'
      }

      if (createdById == null) {
        console.error(`${fnName}: id is null and createdById is null`)
        throw 'Prisma error'
      }

      return await this.create(
                     prisma,
                     baseChatSettingsId,
                     status,
                     isEncryptedAtRest,
                     isJsonMode,
                     isPinned,
                     name,
                     llmTechId,
                     agentUserId,
                     prompt,
                     createdById)
    } else {

      return await this.update(
                     prisma,
                     id,
                     baseChatSettingsId,
                     status,
                     isEncryptedAtRest,
                     isJsonMode,
                     isPinned,
                     name,
                     llmTechId,
                     agentUserId,
                     prompt,
                     createdById)
    }
  }
}
