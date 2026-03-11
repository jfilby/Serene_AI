import { UsersService } from '../../../services/users/service'

// Services
const usersService = new UsersService()

// Factory of resolvers
export function sereneCoreUsersQueryResolvers() {
  return {
    Query: {
      userById: async (
        parent: any,
        args: any,
        context: any,
        info: any
      ) => {
        return usersService.getById(
          context.prisma,
          args.userProfileId)
      },
      verifySignedInUserProfileId: async (
        parent: any,
        args: any,
        context: any,
        info: any
      ) => {
        return usersService.verifySignedInUserProfileId(
          context.prisma,
          args.userProfileId)
      },
    },
  }
}
