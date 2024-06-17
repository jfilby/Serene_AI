import { ServerOnlyTypes } from '../../types/server-only-types'
import { ApiUsageBaseService } from './api-usage-base-service'

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
