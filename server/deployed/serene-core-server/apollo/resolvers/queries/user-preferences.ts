import { prisma } from '@/db'
import { UserPreferenceService } from '../../../services/user-preference/service'

const userPreferenceService = new UserPreferenceService()

export async function getUserPreferences(parent, args, context, info) {
  console.log('getUserPreferences(): ' +
              `args.userProfileId: ${args.userProfileId} ` +
              `args.keys: ${args.keys}`)

  try {
    return await
            userPreferenceService.getUserPreferences(
              prisma,
              args.userProfileId,
              args.category,
              args.keys)
  } catch(error) {
    console.error(`getUserPreferences: ${error}`)
  }
}
