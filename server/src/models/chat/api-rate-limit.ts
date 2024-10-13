export class ApiRateLimitModel {

  // Consts
  clName = 'ApiRateLimitModel'

  // Code
  async create(prisma: any,
               id: string | undefined,
               techId: string,
               ratePerMinute: number) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.apiRateLimit.create({
        data: {
          id: id,
          techId: techId,
          ratePerMinute: ratePerMinute
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
    var apiRateLimit: any = undefined

    try {
      apiRateLimit = await
        prisma.apiRateLimit.findUnique({
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
    return apiRateLimit
  }

  async getByTechId(
          prisma: any,
          techId: string) {

    // Debug
    const fnName = `${this.clName}.getByTechId()`

    // Validate
    if (techId == null) {
      console.error(`${fnName}: id is null and techId is null`)
      throw 'Prisma error'
    }

    // Query record
    var apiRateLimit: any = undefined

    try {
      apiRateLimit = await
        prisma.apiRateLimit.findFirst({
          where: {
            techId: techId
          }
        })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)

      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return OK
    return apiRateLimit
  }

  async update(prisma: any,
               id: string,
               techId: string,
               ratePerMinute: number) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.apiRateLimit.update({
        data: {
          techId: techId,
          ratePerMinute: ratePerMinute
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
               techId: string,
               ratePerMinute: number) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If the id is specified, try to get it
    if (id != null) {

      const apiRateLimit = await
              this.getById(
                prisma,
                id)

      if (apiRateLimit != null) {
        id = apiRateLimit.id
      }
    }

    // Try to get by unique key
    if (id == null) {

      const apiRateLimit = await
              this.getByTechId(
                prisma,
                techId)

      if (apiRateLimit != null) {
        id = apiRateLimit.id
      }
    }

    // Upsert
    if (id == null) {

      return await this.create(
                     prisma,
                     id,
                     techId,
                     ratePerMinute)
    } else {

      return await this.update(
                     prisma,
                     id,
                     techId,
                     ratePerMinute)
    }
  }
}
