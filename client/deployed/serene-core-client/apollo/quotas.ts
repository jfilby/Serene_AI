import { gql } from '@apollo/client'

export const getResourceQuotaUsageByAdminQuery = gql`
  query getResourceQuotaUsageByAdmin(
          $userProfileId: String!,
          $resource: String!
          $day: String,
          $viewUserProfileId: String) {
    getResourceQuotaUsageByAdmin(
      userProfileId: $userProfileId,
      resource: $resource,
      day: $day,
      viewUserProfileId: $viewUserProfileId) {

      userProfileId
      resource
      day
      quota
      usage
    }
  }
`
