import { prisma } from '@/db'
import { UserPreferenceService } from '../../../services/user-preference/service'

const userPreferenceService = new UserPreferenceService()

export async function upsertUserPreference(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // console.log('userById..')

  try {
    return await
             userPreferenceService.upsert(
               prisma,
               args.userProfileId,
               args.category,
               args.key,
               args.value,
               args.values)
  } catch(error) {
    console.error(`upsertUserPreference: ${error}`)
  }
}
