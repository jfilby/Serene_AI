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
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
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
    } catch(error) {
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
    } catch(error) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async update(prisma: any,
               id: string,
               name: string) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.user.update({
        data: {
          name: name
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
}
