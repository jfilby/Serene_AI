import { ApiUsageBaseService } from '@/serene-core-server/services/api-usage/api-usage-base-service'
import { ServerOnlyTypes } from '../../types/server-only-types'

export class ApolloIoApiUsageService {

  // Consts
  clName = 'ApolloIoApiUsageService'

  // Services
  apiUsageBaseService = new ApiUsageBaseService()

  // Code
  async isRateLimited(prisma: any) {

    // Debug
    const fnName = `${this.clName}.isRateLimited()`

    // Use the Apollo.io API variant name
    return this.apiUsageBaseService.isRateLimited(
             prisma,
             ServerOnlyTypes.apolloIoApi)
  }
}
