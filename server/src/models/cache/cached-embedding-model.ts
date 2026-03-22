import { CustomError } from 'serene-core-server'
import { createId } from '@paralleldrive/cuid2'
import { PrismaClient } from '@/prisma/client.js'

type CachedEmbeddingInternalRecord = {
  id: string
  text: string
  embedding: string
}

type CachedEmbeddingRecord = {
  id: string
  text: string
  embedding: number[]
}

export class CachedEmbeddingModel {

  // Consts
  clName = 'CachedEmbeddingModel'

  // Code
  async create(
    prisma: PrismaClient,
    text: string,
    embedding: any) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Get vector for use in raw query
    const vectorLiteral = `'[${embedding.join(',')}]'`

    // Get a CUID
    const id = createId()

    // Create record
    const results = await
      prisma.$executeRawUnsafe(
        `INSERT INTO cached_embedding (id, text, embedding) VALUES ($1, $2, ${vectorLiteral}::vector);`,
        id,
        text)

    // console.log(`${fnName}: results: ` + JSON.stringify(results))

    if (results === 0) {
      console.warn(`${fnName}: row not created`)
    }
  }

  async getById(
    prisma: PrismaClient,
    id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    const results = await prisma.$queryRaw<CachedEmbeddingInternalRecord[]>`
        SELECT id, text, embedding::text
          FROM cached_embedding
         WHERE id = ${id}`

    // Validate
    if (results == null) {
      throw new CustomError(`${fnName}: results == null`)
    }

    if (results.length === 0) {
      return null
    }

    // Convert embedding to number[]
    const embeddingVector = JSON.parse(results[0].embedding) as number[]

    // New record
    const record: CachedEmbeddingRecord = {
      id: results[0].id,
      text: results[0].text,
      embedding: embeddingVector
    }

    // Return
    return record
  }

  async getByText(
    prisma: PrismaClient,
    text: string) {

    // Debug
    const fnName = `${this.clName}.getByText()`

    // console.log(`${fnName}: starting with text: ${text}`)

    // Query
    var results = await prisma.$queryRaw<CachedEmbeddingInternalRecord[]>`
        SELECT id, text, embedding::text AS embedding
          FROM cached_embedding
         WHERE text = ${text}`

    // Validate
    if (results == null) {
      throw new CustomError(`${fnName}: results == null`)
    }

    if (results.length === 0) {
      return null
    }

    // Convert embedding to number[]
    const embeddingVector = JSON.parse(results[0].embedding) as number[]

    // New record
    const record: CachedEmbeddingRecord = {
      id: results[0].id,
      text: results[0].text,
      embedding: embeddingVector
    }

    // Return
    return record
  }
}
