import { CustomError } from '../../types/errors'

export class TechProviderModel {

  // Consts
  clName = 'TechProviderModel'

  // Code
  async create(
          prisma: any,
          status: string,
          name: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.techProvider.create({
        data: {
          status: status,
          name: name
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async filter(
          prisma: any,
          status: string | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // console.log(`${fnName}: starting..`)

    // Query
    var techProvider: any = null

    try {
      techProvider = await prisma.techProvider.findMany({
        where: {
          status: status
        },
        orderBy: [
          {
            variantName: 'asc'
          }
        ]
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return techProvider
  }

  async getById(prisma: any,
                id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Validate
    if (id == null) {
      throw new CustomError(`${fnName}: id == null`)
    }

    // Query
    var techProvider: any = null

    try {
      techProvider = await prisma.techProvider.findUnique({
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
    return techProvider
  }

  async getByName(
          prisma: any,
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByName()`

    // console.log(`${fnName}: name: ${name}`)

    // Validate
    if (name == null) {
      console.error(`${fnName}: id is null and name is null`)
      throw 'Prisma error'
    }

    // Query
    var techProvider: any = null

    try {
      techProvider = await prisma.techProvider.findFirst({
        where: {
          name: name
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // console.log(`${fnName}: techProvider: ${JSON.stringify(techProvider)}`)

    // Return
    return techProvider
  }

  async update(
          prisma: any,
          id: string,
          status: string | undefined,
          name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Create record
    try {
      return await prisma.techProvider.update({
        data: {
          status: status,
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

  async upsert(prisma: any,
               id: string | undefined,
               status: string | undefined,
               name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, try to get by name
    if (id == null &&
        name != null) {

      const techProvider = await
              this.getByName(
                prisma,
                name)

      if (techProvider != null) {
        id = techProvider.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      // Create
      // console.log(`${fnName}: create..`)

      return await
               this.create(
                 prisma,
                 status,
                 name)
    } else {

      // Update
      // console.log(`${fnName}: update..`)

      return await
               this.update(
                 prisma,
                 id,
                 status,
                 name)
    }
  }
}
