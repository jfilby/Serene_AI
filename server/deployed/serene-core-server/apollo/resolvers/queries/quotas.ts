import { prisma } from '@/db'
import { ResourceQuotaUsageModel } from '../../../models/quotas/resource-quota-usage-model'
import { UsersService } from '../../../services/users/service'

// Models
const resourceQuotaUsageModel = new ResourceQuotaUsageModel()

// Services
const resourceQuotasService = new ResourceQuotasQueryService()
const usersService = new UsersService()

// Code
export async function getCurrentResourceQuotaUsage(parent, args, context, info) {

  const fnName = 'getCurrentResourceQuotaUsage()'

  // console.log(`${fnName}: args: ${JSON.stringify(args)}`)

  try {
    return await quotasService.getQuotaUsage(
                   prisma,
                   args.userProfileId,
                   args.resource)
  } catch(error) {
    console.error(`getSubscriptions(): error: ${error}`)
  }
}

export async function getResourceQuotaUsageByAdmin(parent, args, context, info) {

  const fnName = 'getResourceQuotaUsageByAdmin()'

  // console.log(`${fnName}: args: ${JSON.stringify(args)}`)

  // Get userProfile
  const userProfile = await
          usersService.getById(
            prisma,
            args.userProfileId)

  // The user must be an admin
  if (userProfile.isAdmin === false) {

    return {
      status: false,
      message: `You aren't an admin user.`
    }
  }

  // Query
  return await
    resourceQuotaUsageModel.filter(
      prisma,
      args.resource,
      args.day,
      args.viewUserProfileId)
}
