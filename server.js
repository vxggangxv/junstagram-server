require('dotenv').config();
import { ApolloServer } from 'apollo-server';
import { gql } from 'apollo-server';
import client from './client';
import bcrypt from 'bcrypt';
import schema from './schema';
// import typeDefs from './users/users.typeDefs';
// import resolvers from './users/users.mutations';

const PORT = process.env.PORT;
// const client = new PrismaClient();

const typeDefs = gql`
  type User {
    id: String!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }
  type Mutation {
    createAccount(
      firstName: String!
      lastName: String
      username: String!
      email: String!
      password: String!
    ): User
  }
  type Query {
    seeProfile(username: String!): User
  }
`;

const resolvers = {
  Query: {
    seeProfile: (_, { username }) => {},
  },
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        console.log('createAccount');
        // check if username or email are already on DB.
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        console.log(existingUser);
        const uglyPassword = await bcrypt.hash(password, 10);
        console.log(uglyPassword);
        return client.user.create({
          data: {
            firstName,
            lastName,
            username,
            email,
            password: uglyPassword,
          },
        });
        // hash password
        // save and return the user
      } catch (error) {
        console.log('error', error);
      }
    },
  },
};

const server = new ApolloServer({
  schema,
  // typeDefs,
  // resolvers,
});

server
  .listen(PORT)
  .then(() => console.log(`Server is running on http://localhost:${PORT}/`));
