require('dotenv').config();
import http from 'http';
import express from 'express';
import logger from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { typeDefs, resolvers } from './schema';
import { getUser } from './users/users.utils';

const PORT = process.env.PORT;

async function startApolloServer(typeDefs, resolvers) {
  // app -> httpServer -> applyMiddleware
  const app = express();

  app.use('/uploads', express.static('uploads'));
  // server.applyMiddleware({ app, path: '/' });
  // app.use(logger('dev'));

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
      };
    },
  });
  await server.start();
  server.applyMiddleware({ app });

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startApolloServer(typeDefs, resolvers);
