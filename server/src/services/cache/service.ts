import { blake3 } from '@noble/hashes/blake3'
import { PrismaClient } from '@prisma/client'
import { LlmCacheModel } from '../../models/cache/llm-cache-model'

// Types
export interface LlmGetInterface {
  cacheKey: string
  llmCache: any
}

// Models
const llmCacheModel = new LlmCacheModel()

// Class
export class LlmCacheService {

  // Consts
  clName = 'LlmCacheService'

  // Code
  async tryGet(
          prisma: PrismaClient,
          llmTechId: string,
          messagesWithRoles: any[]): Promise<LlmGetInterface> {

      // Blake3 hash
    const cacheKey =
            blake3(
              JSON.stringify(messagesWithRoles).toLowerCase()).toString()

    // Try to get an LlmCache
    const llmCache = await
            llmCacheModel.getByTechIdAndKey(
              prisma,
              llmTechId,
              cacheKey)

    // Return
    return {
      cacheKey: cacheKey,
      llmCache: llmCache
    }
  }

  async save(
          prisma: PrismaClient,
          llmTechId: string,
          cacheKey: string,
          message: any,
          messages: any) {

    llmCacheModel.upsert(
      prisma,
      undefined,  // id
      llmTechId,
      cacheKey!,
      message ?? null,   // message
      messages ?? null)  // messages
  }
}
