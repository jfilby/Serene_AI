import { CustomError } from '@/serene-core-server/types/errors'

export class ChatMessageCreatedModel {

  // Consts
  clName = 'ChatMessageCreatedModel'

  // Code
  async countMessages(
          prisma: any,
          userProfileId: string,
          startDate: Date,
          sentByAi: boolean) {

    // Debug
    const fnName = `${this.clName}.countMessages()`

    // Query
    const count = await prisma.chatMessageCreated.count({
      where: {
        userProfileId: userProfileId,
        sentByAi: sentByAi,
        created: {
          gte: startDate,
        },
      },
    })

    // Return
    return count
  }

  async create(prisma: any,
               userProfileId: string,
               sentByAi: boolean) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Validate
    if (userProfileId == null) {
      throw new CustomError(`${fnName}: userProfileId == null`)
    }

    // Create record
    try {
      return await prisma.chatMessageCreated.create({
        data: {
          userProfileId: userProfileId,
          sentByAi: sentByAi
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }
}
