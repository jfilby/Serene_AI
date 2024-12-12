export class ExternalUserModel {

  // Consts
  clName = 'ExternalUserModel'

  // Code
  async create(
          prisma: any,
          userProfileId: string,
          externalUserId: string,
          externalSystem: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.externalUser.create({
        data: {
          userProfileId: userProfileId,
          externalUserId: externalUserId,
          externalSystem: externalSystem
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

    // Delete
    try {
      return await prisma.externalUser.delete({
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
  }

  async filter(
          prisma: any,
          userProfileId: string | undefined,
          externalUserId: string | undefined,
          externalSystem: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.externalUser.findMany({
        where: {
          userProfileId: userProfileId,
          externalUserId: externalUserId,
          externalSystem: externalSystem
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var externalUser: any = null

    try {
      externalUser = await prisma.externalUser.findUnique({
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
    return externalUser
  }

  async getByUniqueKey(
          prisma: any,
          externalUserId: string,
          externalSystem: string | null) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Query
    var externalUser: any = null

    // Try with versionBranchId first
    try {
      externalUser = await prisma.externalUser.findFirst({
        where: {
          externalUserId: externalUserId,
          externalSystem: externalSystem
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
    // Return
    return externalUser
  }

  async update(
          prisma: any,
          id: string,
          userProfileId: string | undefined,
          externalUserId: string | undefined,
          externalSystem: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.externalUser.update({
        data: {
          userProfileId: userProfileId,
          externalUserId: externalUserId,
          externalSystem: externalSystem
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
               userProfileId: string | undefined,
               externalUserId: string | undefined,
               externalSystem: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        externalUserId != null &&
        externalSystem != null) {

      const externalUser = await
              this.getByUniqueKey(
                prisma,
                externalUserId,
                externalSystem)

      if (externalUser != null) {
        id = externalUser.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (userProfileId == null) {
        console.error(`${fnName}: id is null and userProfileId is null`)
        throw 'Prisma error'
      }

      if (externalUserId == null) {
        console.error(`${fnName}: id is null and externalUserId is null`)
        throw 'Prisma error'
      }

      if (externalSystem == null) {
        console.error(`${fnName}: id is null and externalSystem is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 userProfileId,
                 externalUserId,
                 externalSystem)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 userProfileId,
                 externalUserId,
                 externalSystem)
    }
  }
}
