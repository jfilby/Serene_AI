export class ResourceQuotaUsageModel {

  // Consts
  clName = 'ResourceQuotaUsageModel'

  // Code
  async create(prisma: any,
               userProfileId: string,
               resource: string,
               day: Date,
               usage: number) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Create
    try {
      return await prisma.resourceQuotaUsage.create({
        data: {
          userProfileId: userProfileId,
          resource: resource,
          day: day,
          usage: usage
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async filter(prisma: any,
               userProfileId: string,
               resource: string,
               day: Date) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.resourceQuotaUsage.findMany({
        where: {
          userProfileId: userProfileId,
          resource: resource,
          day: day
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw `Prisma error`
    }
  }

  async getByUserProfileIdAndResourceAndDay(
          prisma: any,
          userProfileId: string,
          resource: string,
          day: Date) {

    // Debug
    const fnName = `${this.clName}.getByUserProfileIdAndResourceAndDay()`

    // Query
    try {
      return await prisma.resourceQuotaUsage.findFirst({
        where: {
          userProfileId: userProfileId,
          resource: resource,
          day: day
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw `Prisma error`
    }
  }

  async update(prisma: any,
               id: string,
               userProfileId: string,
               resource: string,
               day: Date,
               usage: number) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Create
    try {
      return await prisma.resourceQuotaUsage.update({
        data: {
          userProfileId: userProfileId,
          resource: resource,
          day: day,
          usage: usage
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
               userProfileId: string,
               resource: string,
               day: Date,
               usage: number) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Validate
    if (usage == null ||
        Number.isNaN(usage)) {

      throw `${fnName}: usage is ${JSON.stringify(usage)}`
    }

    // Get by userProfileId and day if id is null
    if (id == null) {

      const resourceQuotaUsage = await
              this.getByUserProfileIdAndResourceAndDay(
                prisma,
                userProfileId,
                resource,
                day)

      if (resourceQuotaUsage != null) {
        id = resourceQuotaUsage.id
      }
    }

    // Upsert
    if (id == null) {
      return await this.create(
                     prisma,
                     userProfileId,
                     resource,
                     day,
                     usage)
    } else {
      return await this.update(
                     prisma,
                     id,
                     userProfileId,
                     resource,
                     day,
                     usage)
    }
  }
}
