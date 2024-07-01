import { UserTypes } from '../../types/user-types'

export class UserProfileModel {

  // Consts
  clName = 'UserProfileModel'

  // Code
  async create(prisma: any,
               userId: string | undefined,
               isAdmin: boolean) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.userProfile.create({
        data: {
          userId: userId,
          isAdmin: isAdmin
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getById(prisma: any,
                id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`
  
    // Get record
    try {
      return await prisma.userProfile.findUnique({
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
  }

  async getByUserId(
          prisma: any,
          userId: string) {

    // Debug
    const fnName = `${this.clName}.getByUserId()`
  
    // Get record
    try {
      return await prisma.userProfile.findFirst({
        where: {
          userId: userId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async setOwnerType(
          prisma: any,
          userProfile: any) {

    // Debug
    const fnName = `${this.clName}.setOwnerType()`

    console.log(`${fnName}: starting with userProfile: ` +
                JSON.stringify(userProfile))

    // Return immediately if ownerType is set
    if (userProfile.ownerType != null) {

      return {
        status: true,
        userProfile: userProfile
      }
    }

    // Set to human ownerType if the userId field is set
    var ownerType: string = ''

    if (userProfile.ownerType == null) {

      ownerType = UserTypes.humanRoleOwnerType
    }

    // Update record
    userProfile = await prisma.userProfile.update({
      data: {
        ownerType: ownerType
      },
      where: {
        id: userProfile.id
      }
    })

    // Return
    return {
      status: true,
      userProfile: userProfile
    }
  }
}
