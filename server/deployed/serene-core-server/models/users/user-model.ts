export class UserModel {

  // Consts
  clName = 'UserModel'

  // Code
  async create(prisma: any,
               email: string,
               name: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Format email
    const emailLower = email.toLocaleLowerCase().trim()

    // Create record
    try {
      return await prisma.user.create({
        data: {
          email: emailLower,
          name: name
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async filter(prisma: any) {

    // Debug
    const fnName = `${this.clName}.filter()`
  
    // Filter
    try {
      return await prisma.user.findMany({})
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async getByEmail(prisma: any,
                   email: string) {

    // Debug
    const fnName = `${this.clName}.getByEmail()`
  
    // Get formatted email for DB storage
    const emailLower = email.toLocaleLowerCase().trim()

    // Get record
    try {
      return await prisma.user.findUnique({
        where: {
          email: emailLower
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async getById(prisma: any,
                id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`
  
    // Get record
    try {
      return await prisma.user.findUnique({
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

  async update(prisma: any,
               id: string,
               email: string | undefined,
               name: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.user.update({
        data: {
          email: email,
          name: name
        },
        where: {
          id: id
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async upsert(prisma: any,
               id: string | undefined,
               email: string,
               name: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        email != null) {

      const user = await
              this.getByEmail(
                prisma,
                email)

      if (user != null) {
        id = user.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (email == null) {
        console.error(`${fnName}: id is null and email is null`)
        throw 'Prisma error'
      }

      if (name == undefined) {
        console.error(`${fnName}: id is null and name is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 email,
                 name)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 email,
                 name)
    }
  }
}
