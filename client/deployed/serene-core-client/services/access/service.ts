import { getCookie, setCookie } from 'cookies-next'
import { isAdminUserQuery } from '../../apollo/access'
import { UsersService } from '../users/user-service'

export class AccessService {

  // Consts
  clName = 'AccessService'
  accessCodeCookieName = 'inventai-access-code'

  // Services
  usersService = new UsersService()

  // Code
  formatValidateAdminUser(json: JSON) {

    if (!json.hasOwnProperty('isAdminUser')) {
      return { status: false,
               message: 'Invalid reply' }
    }

    const record = json['isAdminUser']

    if (!record.hasOwnProperty('status')) {
      return { status: false,
               message: 'Invalid reply' }
    }

    var results =
          { status: record['status'],
            message: null }

    if (record.hasOwnProperty('message')) {
      results.message = record['message']
    }

    return results
  }

  validateAccessCode(
    { req, res },
    accessCode: string) {

    // Fail if in production but ACCESS_CODE isn't defined
    if (process.env.NODE_ENV === 'production' &&
        !process.env.ACCESS_CODE) {
      return false
    }

    // Check cookie for saved verification
    const cookieAccessCode = getCookie(this.accessCodeCookieName, { req, res })

    if (cookieAccessCode) {
      if (cookieAccessCode === process.env.ACCESS_CODE) {
        // Return validated successfully
        return true
      }
    }

    // Check access in production
    if (process.env.NODE_ENV === 'production' &&
        process.env.ACCESS_CODE === accessCode) {

      // Save admin access to a cookie
      setCookie(
        this.accessCodeCookieName,
        accessCode,
        { req,
          res,
          maxAge: 60 * 60 * 24 * 30 }) // 30 days

      // Return validated successfully
      return true
    }

    // Otherwise fail for production, but pass for development
    if (process.env.NODE_ENV === 'production') {
      return false
    }

    return true
  }

  async validateUserIsAdmin(
          { req, res },
          apolloClient: any) {

    // Debug
    const fnName = `${this.clName}.validateUserIsAdmin`

    // Get signed-in user id
    const signedInId = await
            this.usersService.getUserIdFromCookieAndVerify(
              { req, res },
              apolloClient)

    if (signedInId == null ||
        signedInId === '') {
      return {
        status: false,
        message: 'No signed-in user id given'
      }
    }

    // console.log(`${fnName}: signedInId: ${signedInId}`)

    // Send a user is-admin query
    var validateUserData: any

    await apolloClient.query({
      query: isAdminUserQuery,
      variables: {
        userProfileId: signedInId
      }
    }).then(result => validateUserData = result)

    // console.log(`validateUserIsAdmin(): ${JSON.stringify(validateUserData)}`)

    return this.formatValidateAdminUser(validateUserData.data)
  }
}
