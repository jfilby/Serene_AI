import { createId } from '@paralleldrive/cuid2'
import { CustomError } from '@/serene-core-server/types/errors'

export class CachedEmbeddingModel {

  // Consts
  clName = 'CachedEmbeddingModel'

  vectorSize = 768

  // Code
  async create(
          prisma: any,
          text: string,
          embedding: any) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Get a CUID
    const id = createId()

    // Create record
    const results = await
      prisma.$executeRaw`INSERT INTO cached_embedding (id, text, embedding) VALUES (${id}, ${text}, ${embedding});`

    // console.log(`${fnName}: results: ` + JSON.stringify(results))

    if (results === 0) {
      console.warn(`${fnName}: row not created`)
    }
  }

  async getById(prisma: any,
                id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    const results = await prisma.$queryRaw`
        SELECT id, text, embedding::text
          FROM cached_embedding
         WHERE id = ${id}`

    if (results.length === 0) {
      return null
    }

    // Convert embedding to number[]
    const embeddingVector = JSON.parse(results[0].embedding)
    results.embedding = embeddingVector

    // Validate and return
    if (results.length === 1) {
      return results[0]
    } else if (results.length === 0) {
      return null
    }

    // Unexpected results count
    throw new CustomError(`${fnName}: results.length: ${results.length}`)
  }

  async getByText(
          prisma: any,
          text: string) {

    // Debug
    const fnName = `${this.clName}.getByText()`

    // console.log(`${fnName}: starting with text: ${text}`)

    // Query
    var results = await prisma.$queryRaw`
        SELECT id, text, embedding::text AS embedding
          FROM cached_embedding
         WHERE text = ${text}`

    if (results.length === 0) {
      return null
    }

    // Convert embedding to number[]
    const embeddingVector = JSON.parse(results[0].embedding)
    results.embedding = embeddingVector

    // Validate and return
    if (results.length === 1) {
      return results[0]
    }

    // Unexpected results count
    throw new CustomError(`${fnName}: results.length: ${results.length}`)
  }
}
