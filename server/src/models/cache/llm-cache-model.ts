import { PrismaClient } from '@prisma/client'

export class LlmCacheModel {

  // Consts
  clName = 'LlmCacheModel'

  // Code
  async create(
          prisma: PrismaClient,
          techId: string,
          key: string,
          message: string | null,
          messages: any | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.llmCache.create({
        data: {
          techId: techId,
          key: key,
          message: message,
          messages: messages
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteByTechIdAndKey(
          prisma: PrismaClient,
          techId: string,
          key: string) {

    // Debug
    const fnName = `${this.clName}.deleteByTechIdAndKey()`

    // Validate
    if (techId == null) {
      console.error(`${fnName}: techId is null`)
      throw 'Prisma error'
    }

    if (key == null) {
      console.error(`${fnName}: key is null`)
      throw 'Prisma error'
    }

    // Query
    try {
      await prisma.llmCache.delete({
        where: {
          techId: techId,
          key: key
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async getById(prisma: PrismaClient,
                id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`


    // Validate
    if (id == null) {
      console.error(`${fnName}: id is null`)
      throw 'Prisma error'
    }

    // Query
    var llmCache: any = null

    try {
      llmCache = await prisma.llmCache.findUnique({
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

    // Return
    return llmCache
  }

  async getByTechIdAndKey(
          prisma: PrismaClient,
          techId: string,
          key: string) {

    // Debug
    const fnName = `${this.clName}.getByTechIdAndKey()`

    // console.log(`${fnName}: starting..`)

    // Validate
    if (techId == null) {
      console.error(`${fnName}: id is null and techId is null`)
      throw 'Prisma error'
    }

    if (key == null) {
      console.error(`${fnName}: id is null and key is null`)
      throw 'Prisma error'
    }

    // Query
    var llmCache: any = null

    try {
      llmCache = await prisma.llmCache.findFirst({
        where: {
          techId: techId,
          key: key
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    // console.log(`${fnName}: returning..`)

    return llmCache
  }

  async update(
          prisma: PrismaClient,
          id: string,
          techId: string | undefined,
          key: string,
          message: string | null | undefined,
          messages: any | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Create record
    try {
      return await prisma.llmCache.update({
        data: {
          techId: techId,
          key: key,
          message: message,
          messages: messages
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

  async upsert(prisma: PrismaClient,
               id: string | undefined,
               techId: string | undefined,
               key: string,
               message: string | null | undefined,
               messages: any | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Try to get by key if id not specified
    if (id == null &&
        techId != null &&
        key != null) {

      const llmCache = await
              this.getByTechIdAndKey(
                prisma,
                techId,
                key)

      if (llmCache != null) {
        id = llmCache.id
      }
    }

    // Upsert
    if (id == null) {

      // Create
      // console.log(`${fnName}: create..`)

      // Validate for create (mainly for type validation of the create call)
      if (techId == null) {
        console.error(`${fnName}: id is null and techId is null`)
        throw 'Prisma error'
      }

      if (message === undefined) {
        console.error(`${fnName}: id is null and message is undefined`)
        throw 'Prisma error'
      }

      if (messages === undefined) {
        console.error(`${fnName}: id is null and messages is undefined`)
        throw 'Prisma error'
      }

      return await
               this.create(
                 prisma,
                 techId,
                 key,
                 message,
                 messages)
    } else {

      // Update
      // console.log(`${fnName}: update..`)

      return await
               this.update(
                 prisma,
                 id,
                 techId,
                 key,
                 message,
                 messages)
    }
  }
}
