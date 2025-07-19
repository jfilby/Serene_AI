import { PrismaClient } from '@prisma/client'
import { OpenAiLlmService } from './llm-service'

// Services
const openAiLlmService = new OpenAiLlmService()

// Class
export class OpenAiEmbeddingsService {

  // Consts
  clName = 'OpenAiEmbeddingsService'

  // Code
  async requestEmbedding(
          prisma: PrismaClient,
          tech: any,
          text: string) {

    // Debug
    const fnName = `${this.clName}.requestEmbedding()`

    // Get an OpenAI client
    const openAi = await
            openAiLlmService.getOrCreateClient(
              prisma,
              tech)

    // Make request
    const embedding = await openAi?.embeddings.create({
      model: tech.model,
      input: text,
      encoding_format: 'float'
    })

    // Validate
    if (embedding == null) {

      return {
        status: false,
        message: `embedding == null`
      }
    }

    // Debug
    // console.log(`${fnName}: embedding: ` + JSON.stringify(embedding))

    // Return
    return {
      status: true,
      embedding: embedding
    }
  }
}
