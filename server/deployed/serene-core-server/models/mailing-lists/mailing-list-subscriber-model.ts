export class MailingListSubscriberModel {

  // Consts
  clName = 'MailingListSubscriberModel'

  // Code
  async create(
          prisma: any,
          mailingListId: string,
          email: string,
          firstName: string | undefined,
          verificationCode: string | undefined,
          verified: Date | undefined) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Validate
    if (mailingListId == null) {
      console.error(`${fnName}: mailingListId == null`)
      throw 'Validation error'
    }

    if (email == null) {
      console.error(`${fnName}: email == null`)
      throw 'Validation error'
    }

    // Create record
    try {
      return await prisma.mailingListSubscriber.create({
        data: {
          mailingListId: mailingListId,
          email: email,
          firstName: firstName,
          verificationCode: verificationCode,
          verified: verified
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var mailingListSubscriber: any = null

    try {
      mailingListSubscriber = await prisma.mailingListSubscriber.findUnique({
        where: {
          id: id
        }
      })
    } catch(error) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return mailingListSubscriber
  }

  async getByMailingListIdAndEmail(
          prisma: any,
          mailingListId: string,
          email: string) {

    // Debug
    const fnName = `${this.clName}.getByMailingListIdAndEmail()`

    // Validate
    if (name == null) {
      console.error(`${fnName}: name == null`)
      throw 'Validation error'
    }

    // Query
    var mailingListSubscriber: any = null

    try {
      mailingListSubscriber = await prisma.mailingListSubscriber.findFirst({
        where: {
          mailingListId: mailingListId,
          email: email
        }
      })
    } catch(error) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return mailingListSubscriber
  }

  async update(
          prisma: any,
          id: string,
          mailingListId: string,
          email: string,
          firstName: string | undefined,
          verificationCode: string | undefined,
          verified: Date | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.mailingListSubscriber.update({
        data: {
          mailingListId: mailingListId,
          email: email,
          firstName: firstName,
          verificationCode: verificationCode,
          verified: verified
        },
        where: {
          id: id
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${JSON.stringify(error)}`)
      throw 'Prisma error'
    }
  }

  async upsert(
          prisma: any,
          id: string,
          mailingListId: string,
          email: string,
          firstName: string | undefined,
          verificationCode: string | undefined,
          verified: Date | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Try to get an existing record
    if (mailingListId != null &&
        email != null) {

      const mailingListSubscriber = await
              this.getByMailingListIdAndEmail(
                prisma,
                mailingListId,
              email)

      if (mailingListSubscriber != null) {
        id = mailingListSubscriber.id
      }
    }

    if (id == null) {

      return await this.create(
                     prisma,
                     mailingListId,
                     email,
                     firstName,
                     verificationCode,
                     verified)
    } else {
      return await this.update(
                     prisma,
                     id,
                     mailingListId,
                     email,
                     firstName,
                     verificationCode,
                     verified)
    }
  }
}
