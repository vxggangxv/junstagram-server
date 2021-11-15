require('dotenv').config();
import http from 'http';
import express from 'express';
import logger from 'morgan';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import {
  graphqlUploadExpress, // A Koa implementation is also exported.
} from 'graphql-upload';
import schema from 'schema';
import { getUser } from './users/users.utils';

const PORT = process.env.PORT;

async function startApolloServer(typeDefs, resolvers) {
  // app -> httpServer -> applyMiddleware
  const app = express();

  app.use('/uploads', express.static('uploads'));
  app.use(logger('dev'));
  app.use(graphqlUploadExpress());

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
    context: async ({ req }) => {
      // console.log('req.headers.token', req.headers.token);
      if (!!req) {
        return {
          loggedInUser: await getUser(req.headers.token),
        };
      }
    },
  });
  await server.start();
  server.applyMiddleware({ app });
  // server.applyMiddleware({ app, path: '/' });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

  // server.graphqlPath: /graphql
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startApolloServer();
