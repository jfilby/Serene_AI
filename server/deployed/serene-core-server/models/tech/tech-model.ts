import { CustomError } from '../../types/errors'

export class TechModel {

  // Consts
  clName = 'TechModel'

  // Code
  async create(
          prisma: any,
          variantName: string,
          resource: string,
          pricingTier: string,
          isDefaultProvider: boolean,
          isEnabled: boolean,
          isAdminOnly: boolean) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.tech.create({
        data: {
          variantName: variantName,
          resource: resource,
          pricingTier: pricingTier,
          isDefaultProvider: isDefaultProvider,
          isEnabled: isEnabled,
          isAdminOnly: isAdminOnly
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async filter(
          prisma: any,
          resource: string,
          isEnabled: boolean | undefined,
          isAdminOnly: boolean | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // console.log(`${fnName}: starting..`)

    // Query
    var tech: any = null

    try {
      tech = await prisma.tech.findMany({
        where: {
          resource: resource,
          isEnabled: isEnabled,
          isAdminOnly: isAdminOnly
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
    return tech
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
    var tech: any = null

    try {
      tech = await prisma.tech.findUnique({
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
    return tech
  }

  async getDefaultProvider(
          prisma: any,
          resource: string) {

    // Debug
    const fnName = `${this.clName}.getByKey()`

    // console.log(`${fnName}: starting..`)

    // Query
    var tech: any = null

    try {
      tech = await prisma.tech.findFirst({
        where: {
          isDefaultProvider: true,
          resource: resource
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return tech
  }

  async getByVariantName(
          prisma: any,
          variantName: string) {

    // Debug
    const fnName = `${this.clName}.getByVariantName()`

    // console.log(`${fnName}: variantName: ${variantName}`)

    // Validate
    if (variantName == null) {
      console.error(`${fnName}: id is null and variantName is null`)
      throw 'Prisma error'
    }

    // Query
    var tech: any = null

    try {
      tech = await prisma.tech.findFirst({
        where: {
          variantName: variantName
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // console.log(`${fnName}: tech: ${JSON.stringify(tech)}`)

    // Return
    return tech
  }

  async update(
          prisma: any,
          id: string,
          variantName: string | undefined,
          resource: string | undefined,
          pricingTier: string | undefined,
          isDefaultProvider: boolean | undefined,
          isEnabled: boolean | undefined,
          isAdminOnly: boolean | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Create record
    try {
      return await prisma.tech.update({
        data: {
          variantName: variantName,
          resource: resource,
          pricingTier: pricingTier,
          isDefaultProvider: isDefaultProvider,
          isEnabled: isEnabled,
          isAdminOnly: isAdminOnly
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
               variantName: string | undefined,
               resource: string | undefined,
               pricingTier: string | undefined,
               isDefaultProvider: boolean | undefined,
               isEnabled: boolean | undefined,
               isAdminOnly: boolean | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, try to get by variantName
    if (id == null &&
        variantName != null) {

      const tech = await
              this.getByVariantName(
                prisma,
                variantName)

      if (tech != null) {
        id = tech.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (variantName == null) {
        console.error(`${fnName}: id is null and variantName is null`)
        throw 'Prisma error'
      }

      if (resource == null) {
        console.error(`${fnName}: id is null and resource is null`)
        throw 'Prisma error'
      }

      if (pricingTier == null) {
        console.error(`${fnName}: id is null and pricingTier is null`)
        throw 'Prisma error'
      }

      if (isDefaultProvider == null) {
        console.error(`${fnName}: id is null and isDefaultProvider is null`)
        throw 'Prisma error'
      }

      if (isEnabled == null) {
        console.error(`${fnName}: id is null and isEnabled is null`)
        throw 'Prisma error'
      }

      if (isAdminOnly == null) {
        console.error(`${fnName}: id is null and isAdminOnly is null`)
        throw 'Prisma error'
      }

      // Create
      // console.log(`${fnName}: create..`)

      return await
               this.create(
                 prisma,
                 variantName,
                 resource,
                 pricingTier,
                 isDefaultProvider,
                 isEnabled,
                 isAdminOnly)
    } else {

      // Update
      // console.log(`${fnName}: update..`)

      return await
               this.update(
                 prisma,
                 id,
                 variantName,
                 resource,
                 pricingTier,
                 isDefaultProvider,
                 isEnabled,
                 isAdminOnly)
    }
  }
}
