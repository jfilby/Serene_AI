import { prisma } from '@/db'
import { ResourceQuotasQueryService } from '../../../services/quotas/query-service'
import { ResourceQuotaUsageModel } from '../../../models/quotas/resource-quota-usage-model'
import { ResourceQuotaTotalModel } from '../../../models/quotas/resource-quota-total-model'
import { UsersService } from '../../../services/users/service'

// Models
const resourceQuotaTotalModel = new ResourceQuotaTotalModel()
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

  // Debug
  const fnName = 'getResourceQuotaUsageByAdmin()'

  console.log(`${fnName}: args: ` + JSON.stringify(args))

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

  // Day (default to today)
  var day: Date

  if (args.day != null) {
    day = new Date(args.day)
  } else {
    day = new Date()
  }

  // Queries
  const quota = await
          resourceQuotaTotalModel.sum(
            prisma,
            args.userProfileId,
            args.resouce,
            day,       // fromDay
            day)       // toDay

  const usage = await
          resourceQuotaUsageModel.sum(
            prisma,
            args.userProfileId,
            args.resource,
            day,       // fromDay
            day)       // toDay

  // Return
  return {
    userProfileId: args.userProfileId,
    resource: args.resource,
    day: day,
    quota: quota,
    usage: usage
  }
}
