import { ChatMessageModel } from './chat-message-model'
import { ChatParticipantModel } from './chat-participant-model'

const { v4: uuidv4 } = require('uuid')

export class ChatSessionModel {

  // Consts
  clName = 'ChatSessionModel'

  newStatus = 'N'

  // Models
  chatParticipantModel = new ChatParticipantModel()

  // Code
  async create(prisma: any,
               id: string | undefined,
               chatSettingsId: string,
               status: string,
               isEncryptedAtRest: boolean,
               name: string | null,
               createdById: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Generate a token
    const token = uuidv4()

    // Create record
    try {
      return await prisma.chatSession.create({
        data: {
          id: id,
          chatSettingsId: chatSettingsId,
          status: status,
          isEncryptedAtRest: isEncryptedAtRest,
          token: token,
          name: name,
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

    // Delete chat session
    try {
      return await prisma.chatSession.delete({
        where: {
          id: id
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteByIdCascade(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.deleteByIdCascade()`

    // Delete chat messages (code copied directly from chat-message-model.ts
    // to avoid setting the encryption key via the constructor).
    try {
      await prisma.chatMessage.deleteMany({
        where: {
          chatSessionId: id
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }

    // Delete chat participants
    await this.chatParticipantModel.deleteByChatSessionId(
            prisma,
            id)

    // Delete chat session
    await this.deleteById(
            prisma,
            id)
  }

  async filter(
          prisma: any,
          status: string | undefined,
          isEncryptedAtRest: boolean | undefined,
          createdById: string) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query records
    try {
      return await prisma.chatSession.findMany({
        where: {
          status: status,
          isEncryptedAtRest: isEncryptedAtRest,
          createdById: createdById
        },
        orderBy: [
          {
            created: 'desc'
          }
        ]
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async getById(prisma: any,
                id: string,
                includeChatSettings: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query record
    var chatSession: any = undefined

    try {
      chatSession = await prisma.chatSession.findUnique({
        include: {
          chatSettings: includeChatSettings
        },
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
    return chatSession
  }

  async getNewStatusOver3DaysOld(prisma: any) {

    // Debug
    const fnName = `${this.clName}.getNewStatusOver3DaysOld()`

    // Days ago
    const day = 1000 * 60 * 60 * 24
    const days3 = day * 3
    const days3AgoDate = new Date(new Date().getTime() - days3)

    // Query records
    try {
      return await prisma.chatSession.findMany({
        where: {
          status: this.newStatus,
          created: {
            lt: days3AgoDate
          }
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async update(prisma: any,
               id: string,
               chatSettingsId: string | undefined,
               status: string | undefined,
               isEncryptedAtRest: boolean | undefined,
               name: string | null | undefined,
               createdById: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.chatSession.update({
        data: {
          chatSettingsId: chatSettingsId,
          status: status,
          isEncryptedAtRest: isEncryptedAtRest,
          name: name,
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
               id: string,
               chatSettingsId: string | undefined,
               status: string | undefined,
               isEncryptedAtRest: boolean | undefined,
               name: string | null | undefined,
               createdById: string) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If the id is specified, try to get it
    if (id != null) {

      const chatSession = await
              this.getById(
                prisma,
                id)

      if (chatSession != null) {
        id = chatSession.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (chatSettingsId == null) {
        console.error(`${fnName}: id is null and chatSettingsId is null`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (name === undefined) {
        console.error(`${fnName}: id is null and name is undefined`)
        throw 'Prisma error'
      }

      if (isEncryptedAtRest == null) {
        console.error(`${fnName}: id is null and isEncryptedAtRest is null`)
        throw 'Prisma error'
      }

      // Create
      return await this.create(
                     prisma,
                     undefined,  // id
                     chatSettingsId,
                     status,
                     isEncryptedAtRest,
                     name,
                     createdById)
    } else {

      // Update
      return await this.update(
                     prisma,
                     id,
                     chatSettingsId,
                     status,
                     isEncryptedAtRest,
                     name,
                     createdById)
    }
  }
}
