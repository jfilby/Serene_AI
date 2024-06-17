export class UserGroupMemberModel {

  // Consts
  clName = 'UserGroupMemberModel'

  // Code
  async create(
          prisma: any,
          userGroupId: string,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.userGroupMember.create({
        data: {
          userGroupId: userGroupId,
          userProfileId: userProfileId
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async delete(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.delete()`

    // Delete record
    try {
      return await prisma.userGroupMember.delete({
        data: {
          id: id
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
    var userGroupMember: any = null

    try {
      userGroupMember = await prisma.userGroupMember.findUnique({
        where: {
          id: id
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return userGroupMember
  }

  async getByUniqueKey(
          prisma: any,
          userGroupId: string,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Query
    var userGroupMember: any = null

    try {
      userGroupMember = await prisma.userGroupMember.findFirst({
        where: {
          userGroupId: userGroupId,
          userProfileId: userProfileId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return userGroupMember
  }
}
