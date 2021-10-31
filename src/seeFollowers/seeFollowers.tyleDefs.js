import { gql } from 'apollo-server-core';

export default gql`
  type SeeFollowersResult {
    ok: Boolean!
    erro: String
    followers: [User]
    totalPages: Int
  }
  type Query {
    seeFollowers(username: String!, page: Int!): SeeFollowersResult!
  }
`;
