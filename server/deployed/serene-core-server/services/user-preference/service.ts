export class UserPreferenceService {

  zipCountries = [ 'Philippines',
                   'United States' ]

  async createIfNotExists(
          prisma: any,
          userProfileId: string,
          category: string,
          key: string,
          value: string | null | undefined,
          values: string[] | null | undefined) {

    // console.log('createIfNotExists()')

    // Find if exists
    var userPreference: any = null

    try {
      userPreference = await prisma.userPreference.findFirst({
        where: {
          userProfileId: userProfileId,
          category: category,
          key: key
        }
      })
    } catch(NotFound) {}

    if (userPreference != null) {
      return
    }

    // Values that could be null must be undefined (Prisma rule)
    var createValue = value
    var createValues = values

    if (createValue == null) {
      createValue = undefined
    }

    if (createValues == null) {
      createValues = undefined
    }

    // Create (doesn't exist yet)
    await prisma.userPreference.create({
      data: {
        userProfileId: userProfileId,
        category: category,
        key: key,
        value: createValue,
        values: createValues
      }
    })
  }

  async delete(
          prisma: any,
          userProfileId: string,
          category: string,
          key: string) {

    await prisma.userPreference.delete({
      where: {
        userProfileId: userProfileId,
        category: category,
        key: key
      }
    })
  }

  async getUserPreferences(
          prisma: any,
          userProfileId: string,
          category: string,
          keys: string[]) {

    // Get user preferences
    var userPreferences: any[] = []

    if (keys != null) {
      try {
        userPreferences = await prisma.userPreference.findMany({
          where: {
            userProfileId: userProfileId,
            category: category,
            key: {
              in: keys
            }
          }
        })
      } catch(NotFound) {}
    } else {
      try {
        userPreferences = await prisma.userPreference.findMany({
          where: {
            userProfileId: userProfileId,
            category: category
          }
        })
      } catch(NotFound) {}
    }

    // Return
    return userPreferences
  }

  async upsert(
          prisma: any,
          userProfileId: string,
          category: string,
          key: string,
          value: string | null,
          values: string[] | null) {

    var valueData: any = null
    var valuesData: any = []

    if (value != null) {
      valueData = value
    }

    if (values != null) {
      valuesData = values
    }

    // Get existing record if it exists
    var userPreference: any = null

    try {
      userPreference = await prisma.userPreference.findFirst({
        where: {
          userProfileId: userProfileId,
          category: category,
          key: key
        }
      })
    } catch (NotFound) { }

    if (userPreference == null) {
      await prisma.userPreference.create({
        data: {
          userProfileId: userProfileId,
          category: category,
          key: key,
          value: valueData,
          values: valuesData
        }
      })
    } else {
      await prisma.userPreference.update({
        data: {
          value: valueData,
          values: valuesData
        },
        where: {
          id: userPreference.id
        }
      })
    }

    return true
  }

}
