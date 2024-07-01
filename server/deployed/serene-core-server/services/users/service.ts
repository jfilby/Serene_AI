import { UserProfileModel } from '../../models/users/user-profile-model'
import { UserModel } from '../../models/users/user-model'
import { UserPreferenceService } from '../user-preference/service'

export class UsersService {

  // Consts
  clName = 'UsersService'

  // Models
  userModel = new UserModel()
  userProfileModel = new UserProfileModel()

  // Services
  userPreferenceService = new UserPreferenceService()

  // Code
  async createBlankUser(prisma: any) {

    // console.log('UsersService.createBlankUser(): start')

    return await this.userProfileModel.create(
                   prisma,
                   undefined,  // userId
                   false)      // isAdmin
  }

  async createDefaultUserPreferences(
          prisma: any,
          userProfileId: string,
          defaultUserPreferences: string) {

    // console.log('createDefaultUserPreferences()')

    if (defaultUserPreferences == null ||
        defaultUserPreferences === '') {
      return
    }

    const jsonArray: any[] = JSON.parse(defaultUserPreferences)

    for (const json of jsonArray) {
      await this.userPreferenceService.createIfNotExists(
              prisma,
              userProfileId,
              json.category,
              json.key,
              json.value,
              null)
    }
  }

  async createUserByEmail(
          prisma: any,
          email: string) {

    var user: any
    var userProfile: any

    await prisma.$transaction(async (transactionPrisma: any) => {

      user = await
        this.userModel.create(
          transactionPrisma,
          email,
          undefined)  // name

      userProfile = await
        this.userProfileModel.create(
          transactionPrisma,
          user.id,
          false)  // isAdmin
    })

    return userProfile.id
  }

  async getById(prisma: any,
                userProfileId: string) {

    return await this.userProfileModel.getById(
             prisma,
             userProfileId)
  }

  async getUserByUserProfileId(
          prisma: any,
          userProfileId: string) {

    // Get userProfile record
    const userProfile = await
            this.getById(
              prisma,
              userProfileId)

    // Get user record
    if (userProfile.userId == null) {
      return null
    } else {
      return await this.userModel.getById(
                     prisma,
                     userProfile.userId)
    }
  }

  async getOrCreateSignedOutUser(
          prisma: any,
          signedOutId: string,
          defaultUserPreferences: string) {

    // Debug
    const fnName = `${this.clName}.getOrCreateSignedOutUser()`

    // User id exists, use it
    var userProfile: any = null

    var signedOutUserProfile = {
      id: signedOutId
    }

    if (signedOutId != null) {
      // console.log(`${fnName}: getting user..`)

      userProfile = await
        this.getById(
          prisma,
          signedOutId)

      if (userProfile) {
        if (userProfile.id) {
          signedOutUserProfile = userProfile
        }
      }
    }

    if (userProfile == null) {

      // Create user record
      // console.log(`${fnName}: creating user..`)

      const userProfile = await this.createBlankUser(prisma)

      // console.log(`${fnName}: userProfileId: ${userProfile.id}`)

      signedOutUserProfile = userProfile
      signedOutId = userProfile.id
    }

    // Create default user preferences
    await this.createDefaultUserPreferences(
            prisma,
            signedOutId,
            defaultUserPreferences)

    // Return signedOutId
    return signedOutUserProfile
  }

  async getOrCreateUserByEmail(
          prisma: any,
          email: string,
          defaultUserPreferences: string) {

    // Debug
    const fnName = `${this.clName}.getOrCreateUserByEmail()`

    // console.log(`UsersService.getOrCreateUserByEmail(): email: ${email}`)

    // Get/create user record
    var signedInUser = await
          this.userModel.getByEmail(
            prisma,
            email)

    if (signedInUser == null) {

      signedInUser = await
        this.userModel.create(
          prisma,
          email,
          undefined)  // name
    }

    // Get/create userProfile record
    // console.log(`UsersService.getOrCreateUserByEmail(): get userProfile ` +
    //             `records where signedInUser.id = ${signedInUser.id}`)

    var signedInUserProfile = await
          this.userProfileModel.getByUserId(
            prisma,
            signedInUser.id)

    console.log(`signedInUserProfile: ${signedInUserProfile}`)

    if (signedInUserProfile == null) {

      // Create userProfile record
      signedInUserProfile = await
        this.userProfileModel.create(
          prisma,
          signedInUser.id,  // userId
          false)            // isAdmin
    }

    // Create default user preferences
    await this.createDefaultUserPreferences(
            prisma,
            signedInUserProfile.id,
            defaultUserPreferences)

    return signedInUserProfile
  }

  async getUserProfileByEmail(
          prisma: any,
          email: string) {

    // console.log(`UsersService.getUserProfileByEmail(): emailLower: ${emailLower}`)

    const user = await
            this.userModel.getByEmail(
              prisma,
              email)

    if (user == null) {
      return null
    } else {
      return await this.userProfileModel.getByUserId(
                     prisma,
                     user.id)
    }
  }

  async verifyHumanUserProfile(
          prisma: any,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.verifyHumanUserProfile()`

    // Get UserProfile record
    const userProfile = await
            this.getById(
              prisma,
              userProfileId)

    // Verify human roleOwnerType, or set if none
    if (userProfile.roleOwnerType == null) {

      await this.userProfileModel.setOwnerType(
              prisma,
              userProfile)
    }
  }

  async verifySignedInUserProfileId(
          prisma: any,
          userProfileId: string) {

    const userProfile = await
            this.userProfileModel.getById(
              prisma,
              userProfileId)

    if (userProfile == null) {
      return false
    } else {
      return true
    }
  }
}
