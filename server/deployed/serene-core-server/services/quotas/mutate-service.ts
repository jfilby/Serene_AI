import { PrismaClient } from '@prisma/client'
import { ResourceQuotaUsageModel } from '../../models/quotas/resource-quota-usage-model'

// Models
const resourceQuotaUsageModel = new ResourceQuotaUsageModel()

// Class
export class ResourceQuotasMutateService {

  // Consts
  clName = 'ResourceQuotasMutateService'

  // Code
  async incQuotaUsage(
          prisma: PrismaClient,
          userProfileId: string,
          resource: string,
          amount: number) {

    // Debug
    const fnName = `${this.clName}.incQuotaUsage()`

    // Validate
    if (amount == null ||
        Number.isNaN(amount)) {

      throw `${fnName}: amount is ${JSON.stringify(amount)}`
    }

    // Get today's date
    const day = new Date()

    // Set to midnight
    day.setHours(0, 0, 0, 0)

    // Try to get any existing record
    const resourceQuotaUsage = await
            resourceQuotaUsageModel.getByUserProfileIdAndResourceAndDay(
              prisma,
              userProfileId,
              resource,
              day)

    // Add the existing quota amount
    if (resourceQuotaUsage != null) {

      if (resourceQuotaUsage.usage != null) {
        amount += resourceQuotaUsage.usage
      }
    }

    // Upsert the new record
    await resourceQuotaUsage.upsert(
            prisma,
            undefined,  // id
            userProfileId,
            resource,
            day,
            amount)
  }
}
