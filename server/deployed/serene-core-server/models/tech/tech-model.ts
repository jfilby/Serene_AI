import { CustomError } from '../../types/errors'

export class TechModel {

  // Consts
  clName = 'TechModel'

  // Code
  async create(
          prisma: any,
          isDefaultProvider: boolean,
          variantName: string,
          provides: string,
          pricingTier: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.tech.create({
        data: {
          isDefaultProvider: isDefaultProvider,
          variantName: variantName,
          provides: provides,
          pricingTier: pricingTier
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
          provides: string) {

    // Debug
    const fnName = `${this.clName}.getByKey()`

    // console.log(`${fnName}: starting..`)

    // Query
    var tech: any = null

    try {
      tech = await prisma.tech.findFirst({
        where: {
          isDefaultProvider: true,
          provides: provides
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
          isDefaultProvider: boolean | undefined,
          variantName: string | undefined,
          provides: string | undefined,
          pricingTier: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Create record
    try {
      return await prisma.tech.update({
        data: {
          isDefaultProvider: isDefaultProvider,
          variantName: variantName,
          provides: provides,
          pricingTier: pricingTier
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
               isDefaultProvider: boolean | undefined,
               variantName: string | undefined,
               provides: string | undefined,
               pricingTier: string | undefined) {

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
      if (isDefaultProvider == null) {
        console.error(`${fnName}: id is null and isDefaultProvider is null`)
        throw 'Prisma error'
      }

      if (variantName == null) {
        console.error(`${fnName}: id is null and variantName is null`)
        throw 'Prisma error'
      }

      if (provides == null) {
        console.error(`${fnName}: id is null and provides is null`)
        throw 'Prisma error'
      }

      if (pricingTier == null) {
        console.error(`${fnName}: id is null and pricingTier is null`)
        throw 'Prisma error'
      }

      // Create
      // console.log(`${fnName}: create..`)

      return await
               this.create(
                 prisma,
                 isDefaultProvider,
                 variantName,
                 provides,
                 pricingTier)
    } else {

      // Update
      // console.log(`${fnName}: update..`)

      return await
               this.update(
                 prisma,
                 id,
                 isDefaultProvider,
                 variantName,
                 provides,
                 pricingTier)
    }
  }
}
