import { gql } from 'apollo-server-core';
import { loadFilesSync, mergeTypeDefs, mergeResolvers } from 'graphql-tools';
import { GraphQLUpload } from 'graphql-upload';

const loadedTypeDefs = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);

const etcTypeDefs = gql`
  scalar Upload
`;
const etcResolvers = {
  Upload: GraphQLUpload,
};

export const typeDefs = mergeTypeDefs([...loadedTypeDefs, etcTypeDefs]);
export const resolvers = mergeResolvers([...loadedResolvers, etcResolvers]);
