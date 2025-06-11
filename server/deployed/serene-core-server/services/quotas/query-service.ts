import { PrismaClient } from '@prisma/client'
import { ResourceQuotaTotalModel } from '../../models/quotas/resource-quota-total-model'
import { ResourceQuotaUsageModel } from '../../models/quotas/resource-quota-usage-model'

// Model
const resourceQuotaTotalModel = new ResourceQuotaTotalModel()
const resourceQuotaUsageModel = new ResourceQuotaUsageModel()

// Class
export class ResourceQuotasQueryService {

  // Consts
  clName = 'ResourceQuotasQueryService'

  // Functions
  async getCurrentTotalQuota(
          prisma: PrismaClient,
          userProfileId: string,
          resource: string,
          day: Date) {

    // Debug
    const fnName = `${this.clName}.getCurrentTotalQuota()`

    // Get from ResourceQuotaTotal
    const resourceQuotaTotals = await
            resourceQuotaTotalModel.filter(
              prisma,
              userProfileId,
              resource,
              day,
              day)

    var totalQuota = 0.0

    for (const resourceQuotaTotal of resourceQuotaTotals) {

      totalQuota += resourceQuotaTotal.quota
    }

    // Return
    return totalQuota
  }

  async getQuotaUsage(
          prisma: PrismaClient,
          userProfileId: string,
          resource: string,
          fromDay: Date,
          toDay: Date) {

    // Debug
    const fnName = `${this.clName}.getQuotaUsage()`

    console.log(`${fnName}: for userProfileId: ${userProfileId}`)

    // Get from ResourceQuotaUsage
    const resourceQuotaUsages = await
            resourceQuotaUsageModel.filter(
              prisma,
              userProfileId,
              resource,
              fromDay,
              toDay)

    var usage = 0.0

    for (const resourceQuotaUsage of resourceQuotaUsages) {
      
      usage += resourceQuotaUsage.usage
    }

    // Return
    return usage
  }

  async isQuotaAvailable(
          prisma: PrismaClient,
          userProfileId: string,
          resource: string,
          amount: number) {

    // Get today's date
    const today = new Date()

    // Get total quota
    const totalQuota = await
            this.getCurrentTotalQuota(
              prisma,
              userProfileId,
              resource,
              today)

    // If totalQuota is null, then there was no subscription to work with
    if (totalQuota === null) {
      return false
    }

    // Get current quota usage
    const usedQuota = await
            this.getQuotaUsage(
              prisma,
              userProfileId,
              resource,
              today,
              today)

    // Is there enough quota?
    if (usedQuota + amount > totalQuota) {
      return false
    }

    return true
  }
}
