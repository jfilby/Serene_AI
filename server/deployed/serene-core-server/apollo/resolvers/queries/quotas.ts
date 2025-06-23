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
  const activeQuotas = await
          resourceQuotaTotalModel.filter(
            prisma,
            args.userProfileId,
            args.resouce,
            day)

  // Create a list of ranges
  const activeRanges = activeQuotas.map((q: any) => ({
    from: new Date(q.fromDay),
    to: new Date(q.toDay)
  }))

  // Get total quota
  var totalQuota = activeQuotas.reduce(
    (sum: number, q: any) => sum + (q.quota ?? 0), 0)

  // Get where ranges start and end
  const rangeStart = new Date(
          Math.min(...activeRanges.map((r: any) => r.from.getTime())))

  const rangeEnd = new Date(
          Math.max(...activeRanges.map((r: any) => r.to.getTime())))

  // Get usage records
  const usages = await
          resourceQuotaUsageModel.filter(
            prisma,
            args.userProfileId,
            args.resource,
            rangeStart,     // fromDay
            rangeEnd)       // toDay

  // Filter usages
  var totalUsage = usages.reduce((sum: number, usage: any) => {

    const usedOn = new Date(usage.usageDay)
    const inAnyRange = activeRanges.some((r: any) =>
      usedOn >= r.from && usedOn <= r.to
    )
    return inAnyRange ? sum + usage.amount : sum
  }, 0)

  // Adjust credit quota and usage from cents
  totalQuota = totalQuota / 100
  totalUsage = totalUsage / 100

  // Return
  return {
    userProfileId: args.userProfileId,
    resource: args.resource,
    day: day.toISOString(),
    quota: totalQuota,
    usage: totalUsage
  }
}
