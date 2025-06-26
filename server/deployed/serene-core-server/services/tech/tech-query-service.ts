import { PrismaClient } from '@prisma/client'
import { TechModel } from '../../models/tech/tech-model'
import { SereneCoreServerTypes } from '../../types/user-types'

// Models
const techModel = new TechModel()

// Class
export class TechQueryService {

  // Consts
  clName = 'TechQueryService'

  // Code
  async getTech(
          prisma: PrismaClient,
          userProfile: any,
          resource: string) {

    // Filter
    var techs = await
          techModel.filter(
            prisma,
            resource)

    // Remove free tech if not an admin
    if (userProfile.isAdmin === false) {

      techs =
        techs.filter(tech => tech.pricingTier !== SereneCoreServerTypes.free)
    }

    // Return
    return {
      status: true,
      techs: techs
    }
  }
}
