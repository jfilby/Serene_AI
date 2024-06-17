import { getCookie, setCookie } from 'cookies-next'
import { getOrCreateSignedOutUserMutation, getOrCreateUserByEmailMutation, verifySignedInUserProfileIdQuery } from '../../apollo/users'
import { getSession } from 'next-auth/react'

export class UsersService {

  // Consts
  clName = 'UsersService'
  signedInCookieName = 'signedInUserUq'
  signedOutCookieName = 'signedOutUserUq'

  // Code
  formatCreateBlankUser(json: JSON) {
    console.log('formatCreateBlankUser: ' + JSON.stringify(json))

    const userRecord = json['createBlankUser']

    if (!userRecord) {
      return null
    }

    var user = {
      'id': userRecord
    }

    return user
  }

  formatUserById(json: JSON) {
    console.log('formatUserById: ' + JSON.stringify(json))

    const userRecord = json['userById']

    if (!userRecord) {
      return null
    }

    var user = {
      'id': userRecord.id
    }

    return user
  }

  async getSignedInOrOutUserIdFromCookie(
    { req, res },
    apolloClient) {

    const session = await getSession({req: req})

    if (session) {
      return this.getUserIdFromCookieAndVerify(
               {req: req, res: res},
               apolloClient)
    } else {
      return this.getSignedOutUserIdFromCookie({req: req, res: res})
    }
  }

  getSignedOutUserIdFromCookie({ req, res }) {

    const signedOutIdValue =
            getCookie(this.signedOutCookieName,
            { req, res })

    console.log(`getSignedOutUserIdFromCookie(): signedOutIdValue: ${signedOutIdValue}`)

    var id

    if (signedOutIdValue == null) {
      return null
    } else {
      id = signedOutIdValue
      return id
    }
  }

  async getUserIdFromCookieAndVerify(
          { req, res },
          apolloClient) {

    // Get signed-in userId
    const idValue =
            getCookie(
              this.signedInCookieName,
              { req, res })

    console.log(`getUserIdFromCookieAndVerify: idValue: ${idValue}`)

    var userProfileId

    if (idValue == null) {
      return null
    } else {
      userProfileId = idValue
    }

    // Verify that the signed-in userId exists

    // GraphQL get or create user
    var results: any = null

    await apolloClient.query({
      query: verifySignedInUserProfileIdQuery,
      variables: {
        userProfileId: userProfileId
      }
    }).then(result => results = result)
      .catch(error => {
        console.log(`error.networkError: ${JSON.stringify(error.networkError)}`)
      })

    // For now, if the userId isn't found in the DB, return null.
    // TODO: return an error message, that the user should clear the browser
    //       cache and retry.
    if (results != null) {
      if (results.data['verifySignedInUserProfileId']) {
        if (results.data['verifySignedInUserProfileId'] === false) {
          return null
        }
      } else {
        return null
      }
    } else {
      return null
    }

    // Return
    return userProfileId
  }

  async getOrCreateUser(
          { req, res },
          session: any,
          apolloClient: any,
          defaultUserPreferences: any) {

    // Debug
    const fnName = `${this.clName}.getOrCreateUser()`

    // Cookie values
    var signedInId: string = ''
    var signedOutId: string = ''

    if (session) {

      signedInId = await
        this.getUserIdFromCookieAndVerify(
          { req, res },
          apolloClient)

    } else {
      signedOutId = this.getSignedOutUserIdFromCookie({ req, res })
    }

    // Signed-out get/create user
    const originalSignedOutId = signedOutId

    if (session) {

      console.log(`${fnName}: hasSession: ${!!session} email: ${session.user.email}`)

      // GraphQL call to get or create user
      var results: any = null

      await apolloClient.mutate({
        mutation: getOrCreateUserByEmailMutation,
        variables: {
          email: session.user.email,
          defaultUserPreferences: JSON.stringify(defaultUserPreferences)
        }
      }).then(result => results = result)
        .catch(error => {
          console.log(`${fnName}: error: ${error}`)
          console.log(`${fnName}: error.networkError: ${JSON.stringify(error.networkError)}`)
        })

      console.log(`${fnName}: results: ${JSON.stringify(results)}`)

      const newSignedInUserProfile = results.data['getOrCreateUserByEmail']

      // Update with newly created userProfile record
      if (signedInId !== newSignedInUserProfile.id) {
          signedInId = newSignedInUserProfile.id

        // console.log('getOrCreateUser: calling setSignedInUserCookie..')
        this.setSignedInUserCookie(
          {req, res},
          newSignedInUserProfile.id)
      }

      // Return
      return newSignedInUserProfile
    }

    // No session available (signed-out)
    // If not signed-in/out user cookie
    if (originalSignedOutId !== signedOutId) {
      this.setSignedOutUserCookie({req, res}, signedOutId)
    }

    // GraphQL call to get or create userProfile for signed-out user
    // If a signedOutId exists, but the record doesn't, the DB's signed out
    // userProfiles could have been cleaned.
    var results: any = null

    await apolloClient.mutate({
      mutation: getOrCreateSignedOutUserMutation,
      variables: {
        signedOutId: signedOutId,
        defaultUserPreferences: JSON.stringify(defaultUserPreferences)
      }
    }).then(result => results = result)
      .catch(error => {
        console.log(`${fnName}: error: ${error}`)
        console.log(`${fnName}: error.networkError: ${JSON.stringify(error.networkError)}`)
      })

    console.log(`${fnName}: results: ${JSON.stringify(results)}`)

    var signedOutUserProfile: any

    const signedOutUser = results.data['getOrCreateSignedOutUser']

    if (signedOutUser) {
      signedOutUserProfile = signedOutUser
      signedOutId = signedOutUserProfile.id
    }

    // Create cookie for signed-out id
    this.setSignedOutUserCookie({req, res}, signedOutId)

    // Return
    console.log(`${fnName}: returning signed-out user id: ${signedOutId}`)

    return signedOutUserProfile
  }

  setSignedInUserCookie({ req, res }, id: string) {

    // Set userUq in cookie
    setCookie(
      this.signedInCookieName,
      id,
      { req,
        res,
        maxAge: 60 * 60 * 24 * 30 }) // 30 days
  }

  setSignedOutUserCookie({ req, res }, id: string) {

    // Set signedOutUserUq in cookie
    setCookie(
      this.signedOutCookieName,
      id,
      { req,
        res,
        maxAge: 60 * 60 * 24 * 30 }) // 30 days
  }
}
