import { ApiUsageBaseService } from 'serene-core-server'
import { PrismaClient } from '@/prisma/client.js'
import { SereneAiServerOnlyTypes } from '../../types/server-only-types.js'

export class ApolloIoApiUsageService {

  // Consts
  clName = 'ApolloIoApiUsageService'

  // Services
  apiUsageBaseService = new ApiUsageBaseService()

  // Code
  async isRateLimited(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.isRateLimited()`

    // Use the Apollo.io API variant name
    return this.apiUsageBaseService.isRateLimited(
             prisma,
             SereneAiServerOnlyTypes.apolloIoApi)
  }
}
