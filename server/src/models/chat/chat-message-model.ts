import { Encrypter } from '@/serene-core-server/services/access/encrypt-service'
import { CustomError } from '@/serene-core-server/types/errors'

export class ChatMessageModel {

  // Consts
  clName = 'ChatMessageModel'

  msPerMinute = 60000

  // Services
  encrypter

  // Code
  constructor(encryptionKey: string | undefined) {

    this.encrypter = new Encrypter(encryptionKey)
  }

  async create(prisma: any,
               id: string | undefined,
               chatSession: any,
               fromChatParticipantId: string,
               toChatParticipantId: string,
               sentByAi: boolean,
               message: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Validate
    if (chatSession == null) {

      throw new CustomError(`${fnName}: chatMessage == null`)
    }

    // Encrypt the message if required
    if (chatSession.isEncryptedAtRest === true) {

      message = this.encrypter.encrypt(message)
    }

    // Create record
    try {
      return await prisma.chatMessage.create({
        data: {
          id: id,
          chatSessionId: chatSession.id,
          fromChatParticipantId: fromChatParticipantId,
          toChatParticipantId: toChatParticipantId,
          sentByAi: sentByAi,
          message: message
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteByChatSessionId(
          prisma: any,
          chatSessionId: string) {

    // Debug
    const fnName = `${this.clName}.deleteByChatSessionId()`

    // Delete records
    try {
      await prisma.chatMessage.deleteMany({
        where: {
          chatSessionId: chatSessionId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getById(prisma: any,
                id: string,
                chatSession: any) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Validate
    if (chatSession == null) {

      throw new CustomError(`${fnName}: chatMessage == null`)
    }

    // Query record
    var chatMessage: any = undefined

    try {
      chatMessage = await prisma.chatMessage.findUnique({
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

    // Decrypt message if required
    if (chatSession.isEncryptedAtRest === true) {

      chatMessage.message = this.encrypter.decrypt(chatMessage.message)
    }

    // Return OK
    return chatMessage
  }

  async getByChatSessionId(
          prisma: any,
          chatSession: any) {

    // Debug
    const fnName = `${this.clName}.getByChatSessionId()`

    // Validate
    if (chatSession == null) {
      console.error(`${fnName}: chatSessionId == null`)
      throw 'Prisma error'
    }

    if (chatSession.id == null) {
      console.error(`${fnName}: chatSession.id == null`)
      throw 'Prisma error'
    }

    // Query records
    var chatMessages: any[] = []

    try {
      chatMessages = await prisma.chatMessage.findMany({
        where: {
          chatSessionId: chatSession.id
        },
        orderBy: [
          {
            created: 'asc'
          }
        ]
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }

    // Decrypts message if required
    if (chatSession.isEncryptedAtRest === true) {

      for (const chatMessage of chatMessages) {

        chatMessage.message = this.encrypter.decrypt(chatMessage.message)
      }
    }

    // Return
    return chatMessages
  }

  async getByLastMessageId(
          prisma: any,
          chatSession: any,
          lastMessageId: string) {

    // Debug
    const fnName = `${this.clName}.getByLastMessageId()`

    // Validate
    if (chatSession == null) {

      throw new CustomError(`${fnName}: chatMessage == null`)
    }

    // Get the last message if specified
    var lastMessageCreated = new Date()

    if (lastMessageId != null) {

      const lastMessage = await
              this.getById(
                prisma,
                lastMessageId,
                chatSession)

      if (lastMessage != null) {
        lastMessageCreated = lastMessage.created
      }
    }

    // Query records
    var chatMessages: any[] = []

    try {
      chatMessages = await prisma.chatMessage.findMany({
        where: {
          chatSessionId: chatSession.id,
          created: {
            gt: lastMessageCreated
          }
        },
        orderBy: [
          {
            created: 'asc'
          }
        ]
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Decrypts message if required
    if (chatSession.isEncryptedAtRest === true) {

      for (const chatMessage of chatMessages) {

        chatMessage.message = this.encrypter.decrypt(chatMessage.message)
      }
    }

    // Return
    return chatMessages
  }

  async getEarliestUnread(
          prisma: any,
          chatSession: any) {

    // Debug
    const fnName = `${this.clName}.getEarliestUnread()`

    // Validate
    if (chatSession == null) {

      throw new CustomError(`${fnName}: chatMessage == null`)
    }

    // Query record
    var chatMessage: any = undefined

    try {
      chatMessage = await prisma.chatMessage.findFirst({
        where: {
          chatSessionId: chatSession.id,
          sent: true
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

    // Decrypt message if required
    if (chatSession.isEncryptedAtRest === true) {

      chatMessage.message = this.encrypter.decrypt(chatMessage.message)
    }

    // Return OK
    return chatMessage
  }

  async getFirst(
          prisma: any,
          chatSession: any) {

    // Debug
    const fnName = `${this.clName}.getFirst()`

    // Validate
    if (chatSession == null) {

      throw new CustomError(`${fnName}: chatMessage == null`)
    }

    // Query record
    var chatMessage: any = undefined

    try {
      chatMessage = await prisma.chatMessage.findFirst({
        where: {
          chatSessionId: chatSession.id
        },
        orderBy: [
          {
            created: 'asc'
          }
        ]
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Decrypt message if required
    if (chatSession.isEncryptedAtRest === true) {

      chatMessage.message = this.encrypter.decrypt(chatMessage.message)
    }

    // Return OK
    return chatMessage
  }

  async getLast(
          prisma: any,
          chatSession: any) {

    // Debug
    const fnName = `${this.clName}.getLast()`

    // Validate
    if (chatSession == null) {

      throw new CustomError(`${fnName}: chatMessage == null`)
    }

    // Query record
    var chatMessage: any = undefined

    try {
      chatMessage = await prisma.chatMessage.findFirst({
        where: {
          chatSessionId: chatSession.id
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

    // Decrypt message if required
    if (chatSession.isEncryptedAtRest === true) {

      chatMessage.message = this.encrypter.decrypt(chatMessage.message)
    }

    // Return OK
    return chatMessage
  }

  async update(prisma: any,
               id: string,
               chatSession: any,
               fromChatParticipantId: string,
               toChatParticipantId: string,
               sentByAi: boolean,
               message: string) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Validate
    if (chatSession == null) {

      throw new CustomError(`${fnName}: chatMessage == null`)
    }

    // Encrypt the message if required
    if (message != null &&
        chatSession.isEncryptedAtRest === true) {

      message = this.encrypter.encrypt(message)
    }

    // Create record
    try {
      return await prisma.chatMessage.update({
        data: {
          chatSessionId: chatSession.id,
          fromChatParticipantId: fromChatParticipantId,
          toChatParticipantId: toChatParticipantId,
          sentByAi: sentByAi,
          message: message
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
               chatSession: any,
               fromChatParticipantId: string,
               toChatParticipantId: string,
               sentByAi: boolean,
               message: string) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If the id is specified, try to get it
    if (id != null) {

      const chatMessage = await
              this.getById(
                prisma,
                id,
                chatSession)

      if (chatMessage != null) {
        id = chatMessage.id
      }
    }

    // Upsert
    if (id == null) {

      return await this.create(
                     prisma,
                     id,
                     chatSession,
                     fromChatParticipantId,
                     toChatParticipantId,
                     sentByAi,
                     message)
    } else {

      return await this.update(
                     prisma,
                     id,
                     chatSession,
                     fromChatParticipantId,
                     toChatParticipantId,
                     sentByAi,
                     message)
    }
  }
}
