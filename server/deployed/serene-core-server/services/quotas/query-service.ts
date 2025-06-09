import { SubscriptionModel } from '../../models/subscriptions/subscription-model'
import { SubscriptionPlanDetailModel } from '../../models/subscriptions/subscription-plan-detail-model'
import { SubscriptionPlanModel } from '../../models/subscriptions/subscription-plan-model'
import { LemonSqueezyApiKeyService } from '../lemonsqueezy/events/api-key-service'
import { SubscriptionPlansService } from '../subscriptions/subscription-plans-service'

export class ResourceQuotasQueryService {

  // Consts
  clName = 'ResourceQuotasQueryService'

  // Types (common values)
  payment = 'payment'
  paymentReversal = 'payment_reversal'
  refund = 'refund'

  // Status (common values)
  success = 'success'

  // Models
  subscriptionModel = new SubscriptionModel()
  subscriptionPlanDetailModel = new SubscriptionPlanDetailModel()
  subscriptionPlanModel = new SubscriptionPlanModel()

  // Services
  lemonSqueezyApiKeyService = new LemonSqueezyApiKeyService()
  subscriptionPlansService = new SubscriptionPlansService()

  // Functions
  async getCurrentTotalQuota(
          prisma: any,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getCurrentTotalQuota()`

    // Get subscriptions with plans
    const subscriptions = await
            this.subscriptionModel.getByUserProfileId(
              prisma,
              userProfileId,
              new Date())

    var quotaProportion: number = 0.0

    for (const subscription of subscriptions) {

      if (subscription.status === this.subscriptionModel.activeStatus) {

        const subscriptionPlans = await
                this.subscriptionPlanModel.getByIdSubscriptionId(
                  prisma,
                  subscription.id)

        for (const subscriptionPlan of subscriptionPlans) {

          const subscriptionPlanDetail = await
                  this.subscriptionPlanDetailModel.getByPlanNameAndKey(
                    prisma,
                    subscriptionPlan.name,                          // planName
                    this.subscriptionPlansService.quotaProportion)  // key

          if (subscriptionPlanDetail != null) {
            if (subscriptionPlanDetail.floatValue > quotaProportion) {
              quotaProportion = subscriptionPlanDetail.floatValue
            }
          }
        }
      }
    }

    // Get test mode
    const testMode = this.lemonSqueezyApiKeyService.getTestMode()

    // Date: 31 days ago
    var daysAgo31 = new Date()
    daysAgo31.setDate(daysAgo31.getDate() - 31)

    // Get all subscription payments for the last 31 days. Don't include any
    // payments for which reversals exist. Order by amount desc.
    console.log(`${fnName}: calling ` +
                'get subscription payments for the last 31 days..')

    const paymentTransactions = await prisma.paymentTransaction.findMany({
      where: {
        testMode: testMode,
        transactionType: this.payment,
        status: this.success,
        userProfileId: userProfileId,
        createdAt: {
          gte: daysAgo31
        }
      },
      orderBy: [
        {
          total: 'desc'
        }
      ]
    })

    // Return the largest subscription payment.
    // Get all refunds and reversals.
    var amounts: number[] = []

    for (const paymentTransaction of paymentTransactions) {

      // Get all refunds and reversals for the transaction
      const negatePaymentTransactions = await prisma.paymentTransaction.aggregate({
        _sum: {
          total: true
        },
        where: {
          transactionType: {
            in: [ this.paymentReversal,
                  this.refund ]
          },
          referenceTransactionId: paymentTransaction.id
        }
      })

      amounts.push(paymentTransaction.total -= negatePaymentTransactions._sum.total)
    }

    if (amounts.length > 0) {
      console.log(`${fnName}: calc & return amount..`)

      amounts.sort(function(a, b) { return a - b })
      return amounts[0] * quotaProportion
    }

    // None found
    console.log(`${fnName}: return 0.0 (not found)..`)

    return 0.0
  }

  async getQuotaUsage(
          prisma,
          userProfileId: string,
          resource: string) {

    // Debug
    const fnName = `${this.clName}.getQuotaUsage()`

    console.log(`${fnName}: for userProfileId: ${userProfileId}`)

    // Date: 31 days ago
    var daysAgo31 = new Date()
    daysAgo31.setDate(daysAgo31.getDate() - 31)

    console.log(`${fnName}: daysAgo31: ${JSON.stringify(daysAgo31)}`)

    // Get quota usage over the last 31 days
    var usage = 0

    try {
      const resourceQuotaUsages = await prisma.resourceQuotaUsage.aggregate({
        _sum: {
          usage: true
        },
        where: {
          userProfileId: userProfileId,
          resource: resource,
          day: {
            gte: daysAgo31
          }
        }
      })

      // Get and return amount
      usage = resourceQuotaUsages._sum.usage

    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw `Prisma error`
    }

    console.log(`${fnName}: returning: ${usage}`)

    return usage
  }

  async isQuotaAvailable(
          prisma: any,
          userProfileId: string,
          resource: string,
          amount: number) {

    // Get total quota
    const totalQuota = await
            this.getCurrentTotalQuota(
              prisma,
              userProfileId)

    // If totalQuota is null, then there was no subscription to work with
    if (totalQuota === null) {
      return false
    }

    // Get current quota usage
    const usedQuota = await
            this.getQuotaUsage(
              prisma,
              userProfileId,
              resource)

    // Is there enough quota?
    if (usedQuota + amount > totalQuota) {
      return false
    }

    return true
  }
}
