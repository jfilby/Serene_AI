export class SystemPropertyModel {

  // Consts
  clName = 'SystemPropertyModel'

  // Code
  async create(
          prisma: any,
          key: string,
          value: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Validate
    if (key == null) {
      console.error(`${fnName}: key == null`)
      throw 'Validation error'
    }

    // Create record
    try {
      return await prisma.systemProperty.create({
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

  async getAll(prisma: any) {

    // Debug
    const fnName = `${this.clName}.getAll()`

    // Query
    try {
      return await prisma.systemProperty.findMany()
    } catch(error) {
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
    var systemProperty: any = null

    try {
      systemProperty = await prisma.systemProperty.findUnique({
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

    // Return
    return systemProperty
  }

  async getByKey(
          prisma: any,
          key: string) {

    // Debug
    const fnName = `${this.clName}.getByKey()`

    // Validate
    if (key == null) {
      console.error(`${fnName}: key == null`)
      throw 'Validation error'
    }

    // Query
    var systemProperty: any = null

    try {
      systemProperty = await prisma.systemProperty.findUnique({
        where: {
          key: key
        }
      })
    } catch(error) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return systemProperty
  }

  async update(
          prisma: any,
          id: string,
          key: string,
          value: string) {

    // Debug
    const fnName = `${this.clName}.update()`

    // console.log(`${fnName}: updating with key: ${key}`)

    // Validate
    if (key == null) {
      console.error(`${fnName}: key == null`)
      throw 'Validation error'
    }

    // Update record
    try {
      return await prisma.systemProperty.update({
        data: {
          key: key,
          value: value
        },
        where: {
          id: id
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${JSON.stringify(error)}`)
      throw 'Prisma error'
    }
  }

  async upsert(
          prisma: any,
          key: string,
          value: string) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Try to get an existing record
    const systemProperty = await
            this.getByKey(
              prisma,
              key)

    if (systemProperty == null) {

      return await this.create(
                     prisma,
                     key,
                     value)
    } else {
      return await this.update(
                     prisma,
                     systemProperty.id,
                     key,
                     value)
    }
  }
}
