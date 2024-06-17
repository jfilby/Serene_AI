export class LlmCacheModel {

  // Consts
  clName = 'LlmCacheModel'

  // Code
  async create(
          prisma: any,
          key: string,
          value: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.llmCache.create({
        data: {
          key: key,
          value: value
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

  async getByKey(
          prisma: any,
          key: string) {

    // Debug
    const fnName = `${this.clName}.getByKey()`

    console.log(`${fnName}: starting..`)

    // Query
    var llmCache: any = null

    try {
      llmCache = await prisma.llmCache.findFirst({
        where: {
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
    console.log(`${fnName}: returning..`)

    return llmCache
  }

  async update(
          prisma: any,
          id: string,
          key: string,
          value: string) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Create record
    try {
      return await prisma.llmCache.update({
        data: {
          key: key,
          value: value
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
               key: string,
               value: string) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Try to get by key if id not specified
    if (id == null) {

      const llmCache = await
              this.getByKey(
                prisma,
                key)

      if (llmCache != null) {
        id = llmCache.id
      }
    }

    // Upsert
    if (id == null) {

      // Create
      // console.log(`${fnName}: create..`)

      return await
               this.create(
                 prisma,
                 key,
                 value)
    } else {

      // Update
      // console.log(`${fnName}: update..`)

      return await
               this.update(
                 prisma,
                 id,
                 key,
                 value)
    }
  }
}
