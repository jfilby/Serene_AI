import { prisma } from '@/db'
import { ResourceQuotasQueryService } from '../../../services/quotas/query-service'
import { ResourceQuotaUsageModel } from '../../../models/quotas/resource-quota-usage-model'
import { UsersService } from '../../../services/users/service'

// Models
const resourceQuotaUsageModel = new ResourceQuotaUsageModel()

// Services
const resourceQuotasService = new ResourceQuotasQueryService()
const usersService = new UsersService()

// Code
export async function getCurrentResourceQuotaUsage(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = 'getCurrentResourceQuotaUsage()'

  // console.log(`${fnName}: args: ${JSON.stringify(args)}`)

  try {
    return await resourceQuotasService.getQuotaUsage(
                   prisma,
                   args.userProfileId,
                   args.resource,
                   new Date(),  // fromDay
                   new Date)    // toDay
  } catch(error) {
    console.error(`getSubscriptions(): error: ${error}`)
  }
}

export async function getResourceQuotaUsageByAdmin(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

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
      args.viewUserProfileId,
      args.resource,
      args.day,       // fromDay
      args.day)       // toDay
}
