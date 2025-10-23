export class QuotaService {

  async getCurrentSubscriptionPayment(
          prisma: PrismaClient,
          userId: string) {

    // Get payments up until the for the last 31 days
    const userQuotas = await prisma.subscriptionPayment.aggregate({
      _sum: {
        price: true
      },
      where: {
        created: 'now() - 31d',
        userId: userId
      }
    })

    // Return
    return userQuotas._sum.price
  }

  async getCurrentSubscriptionPaymentDetails(
          prisma: PrismaClient,
          userId: string) {

    // Get payments up until the for the last 31 days
    return await prisma.subscriptionPayment.findMany({
      where: {
        created: 'now() - 31d',
        userId: userId
      }
    })
  }

  async getCurrentUsage(prisma: PrismaClient,
                        userId: string) {

    // Get usage for the last 31 days
    const userQuotas = await prisma.userQuota.aggregate({
      _sum: {
        usage: true
      },
      where: {
        created: 'now() - 31d',
        userId: userId
      }
    })

    // Return
    return userQuotas._sum.usage
  }

  async getCurrentUsageDetails(prisma: PrismaClient,
                               userId: string) {

    // Get usage for the last 31 days
    return await prisma.userQuota.findMany({
      where: {
        created: 'now() - 31d',
        userId: userId
      }
    })
  }
}
