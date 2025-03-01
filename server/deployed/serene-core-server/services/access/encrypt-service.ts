// Source: https://stackoverflow.com/a/66476430

import crypto, { BinaryLike, CipherGCMTypes, CipherKey } from 'crypto'
import { Buffer } from 'buffer'

export class Encrypter {

  // Consts
  clName = 'Encrypter'
  header = '!enc%'
  algorithm: CipherGCMTypes = 'aes-256-gcm'

  // Vars
  key: Buffer

  // Code
  constructor(encryptionKey: string | undefined) {

    // Debug
    const fnName = `${this.clName}.constructor()`

    // Validate
    if (encryptionKey == null) {

      throw new Error(`${fnName}: encryptionKey == null`)
    }

    // Set key
    this.key = crypto.scryptSync(encryptionKey, 'salt', 32)
  }

  encrypt(clearText: string) {

    // Get IV
    const iv: Buffer = crypto.randomBytes(16)

    // Get cipher
    const cipher =
            crypto.createCipheriv(
              this.algorithm,
              this.key as unknown as CipherKey,
              iv as unknown as BinaryLike)

    // Encrypt string
    const encrypted = cipher.update(clearText, 'utf8', 'hex') + cipher.final('hex')

    // Return final string with metadata
    return [
      this.header,
      this.algorithm,
      encrypted,
      iv.toString('hex'),
    ].join('|')
  }

  decrypt(encryptedText: string) {

    // Split string with metadata into separate vars
    const [header, algorithm, encrypted, iv] = encryptedText.split('|')

    // Validate
    if (header !== this.header) {
      throw new Error('Unexpected header, string is likely not encrypted')
    }

    if (algorithm !== this.algorithm) {
      throw new Error('Unexpected/invalid encryption algorithm')
    }

    if (!iv) {
      throw new Error('IV not found')
    }

    // Decipher encrypted string
    const decipher =
            crypto.createDecipheriv(
              this.algorithm,
              this.key as unknown as CipherKey,
              Buffer.from(iv, 'hex') as unknown as BinaryLike
    )

    // Return final decrypted string
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
  }
}
