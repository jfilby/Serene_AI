import { UserPreferenceService } from '../../../services/user-preference/service'

// Services
const userPreferenceService = new UserPreferenceService()

// Factory of resolvers
export function sereneCoreUserPreferencesQueryResolvers() {
  return {
    Query: {
      getUserPreferences: async (
        parent: any,
        args: any,
        context: any,
        info: any
      ) => {
        console.log('getUserPreferences(): ' +
          `args.userProfileId: ${args.userProfileId} ` +
          `args.keys: ${args.keys}`)

        try {
          return await
            userPreferenceService.getUserPreferences(
              context.prisma,
              args.userProfileId,
              args.category,
              args.keys)
        } catch (error) {
          console.error(`getUserPreferences: ${error}`)
        }
      },
    },
  }
}
