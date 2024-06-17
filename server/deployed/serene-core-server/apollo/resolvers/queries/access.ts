import { prisma } from '@/db'
import { AccessService } from '../../../services/access/service'

const accessService = new AccessService()

export async function isAdminUser(parent, args, context, info) {

  return accessService.isAdminUser(
           prisma,
           args.userProfileId)
}
