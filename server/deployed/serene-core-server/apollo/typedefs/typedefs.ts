export const typeDefs = `#graphql

  type UserPreference {
    category: String!
    key: String!
    value: String
    values: [String]
  }

  type StatusAndMessage {
    status: Boolean!
    message: String
  }

  type UserProfile {
    id: String!
    userId: String
    isAdmin: Boolean!
  }

  type VerifiedAndMessage {
    verified: Boolean!
    message: String
  }

  type Query {

    # Profile
    validateProfileCompleted(
      forAction: String!,
      userProfileId: String!): StatusAndMessage!

    # Users
    isAdminUser(userProfileId: String!): StatusAndMessage!
    userById(userProfileId: String!): UserProfile
    verifySignedInUserProfileId(userProfileId: String!): Boolean

    # User preferences
    getUserPreferences(
      userProfileId: String!,
      category: String!,
      keys: [String]): [UserPreference]
  }

  type Mutation {

    # Mailing lists
    mailingListSignup(
      mailingListName: String!,
      email: String!,
      firstName: String): VerifiedAndMessage!

    # Users
    createBlankUser: UserProfile!
    createUserByEmail(email: String!): UserProfile!
    deactivateUserProfileCurrentIFile(id: String!): Boolean
    getOrCreateSignedOutUser(
      signedOutId: String,
      defaultUserPreferences: String): UserProfile!
    getOrCreateUserByEmail(
      email: String!,
      defaultUserPreferences: String): UserProfile!

    # User preferences
    upsertUserPreference(
      userProfileId: String!,
      category: String!,
      key: String!,
      value: String,
      values: [String]): Boolean
  }

`
