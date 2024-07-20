export class ChatMessageModel {

  // Consts
  clName = 'ChatMessageModel'

  msPerMinute = 60000

  // Code
  async create(prisma: any,
               id: string | undefined,
               chatSessionId: string,
               fromChatParticipantId: string,
               toChatParticipantId: string,
               sentByAi: boolean,
               message: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.chatMessage.create({
        data: {
          id: id,
          chatSessionId: chatSessionId,
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
                id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

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

    // Return OK
    return chatMessage
  }

  async getByChatSessionId(
          prisma: any,
          chatSessionId: string) {

    // Debug
    const fnName = `${this.clName}.getByChatSessionId()`

    // Query records
    try {
      return await prisma.chatMessage.findMany({
        where: {
          chatSessionId: chatSessionId
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
  }

  async getByLastMessageId(
          prisma: any,
          chatSessionId: string,
          lastMessageId: string) {

    // Debug
    const fnName = `${this.clName}.getByLastMessageId()`

    // Get the last message if specified
    var lastMessageCreated = new Date()

    if (lastMessageId != null) {

      const lastMessage = await
              this.getById(
                prisma,
                lastMessageId)

      if (lastMessage != null) {
        lastMessageCreated = lastMessage.created
      }
    }

    // Query records
    try {
      return await prisma.chatMessage.findMany({
        where: {
          chatSessionId: chatSessionId,
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
  }

  async getEarliestUnread(
          prisma: any,
          chatSessionId: string) {

    const fnName = `${this.clName}.getEarliestUnread()`

    // Query record
    var chatMessage: any = undefined

    try {
      chatMessage = await prisma.chatMessage.findFirst({
        where: {
          chatSessionId: chatSessionId,
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

    // Return OK
    return chatMessage
  }

  async getFirst(
          prisma: any,
          chatSessionId: string) {

    const fnName = `${this.clName}.getFirst()`

    // Query record
    var chatMessage: any = undefined

    try {
      chatMessage = await prisma.chatMessage.findFirst({
        where: {
          chatSessionId: chatSessionId
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

    // Return OK
    return chatMessage
  }

  async getLast(
          prisma: any,
          chatSessionId: string) {

    const fnName = `${this.clName}.getLast()`

    // Query record
    var chatMessage: any = undefined

    try {
      chatMessage = await prisma.chatMessage.findFirst({
        where: {
          chatSessionId: chatSessionId
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

    // Return OK
    return chatMessage
  }

  async update(prisma: any,
               id: string,
               chatSessionId: string,
               fromChatParticipantId: string,
               toChatParticipantId: string,
               sentByAi: boolean,
               message: string) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Create record
    try {
      return await prisma.chatMessage.update({
        data: {
          chatSessionId: chatSessionId,
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
               chatSessionId: string,
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
                id)

      if (chatMessage != null) {
        id = chatMessage.id
      }
    }

    // Upsert
    if (id == null) {

      return await this.create(
                     prisma,
                     id,
                     chatSessionId,
                     fromChatParticipantId,
                     toChatParticipantId,
                     sentByAi,
                     message)
    } else {

      return await this.update(
                     prisma,
                     id,
                     chatSessionId,
                     fromChatParticipantId,
                     toChatParticipantId,
                     sentByAi,
                     message)
    }
  }
}
