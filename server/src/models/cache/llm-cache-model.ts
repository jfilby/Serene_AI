export class LlmCacheModel {

  // Consts
  clName = 'LlmCacheModel'

  // Code
  async create(
          prisma: any,
          techId: string,
          key: string,
          stringValue: string | null,
          stringValues: string[],
          jsonValue: any | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.llmCache.create({
        data: {
          techId: techId,
          key: key,
          stringValue: stringValue,
          stringValues: stringValues,
          jsonValue: jsonValue
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

  async getByTechIdAndKey(
          prisma: any,
          techId: string,
          key: string) {

    // Debug
    const fnName = `${this.clName}.getByTechIdAndKey()`

    // console.log(`${fnName}: starting..`)

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
          prisma: any,
          id: string,
          techId: string | undefined,
          key: string,
          stringValue: string | null | undefined,
          stringValues: string[] | undefined,
          jsonValue: any) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Create record
    try {
      return await prisma.llmCache.update({
        data: {
          techId: techId,
          key: key,
          stringValue: stringValue,
          stringValues: stringValues,
          jsonValue: jsonValue
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
               techId: string | undefined,
               key: string,
               stringValue: string | null | undefined,
               stringValues: string[] | undefined,
               jsonValue: any) {

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

      if (stringValue === undefined) {
        console.error(`${fnName}: id is null and stringValue is undefined`)
        throw 'Prisma error'
      }

      if (stringValues === undefined) {
        console.error(`${fnName}: id is null and stringValues is undefined`)
        throw 'Prisma error'
      }

      if (jsonValue === undefined) {
        console.error(`${fnName}: id is null and jsonValue is undefined`)
        throw 'Prisma error'
      }

      return await
               this.create(
                 prisma,
                 techId,
                 key,
                 stringValue,
                 stringValues,
                 jsonValue)
    } else {

      // Update
      // console.log(`${fnName}: update..`)

      return await
               this.update(
                 prisma,
                 id,
                 techId,
                 key,
                 stringValue,
                 stringValues,
                 jsonValue)
    }
  }
}
