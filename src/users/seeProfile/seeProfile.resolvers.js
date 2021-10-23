import client from '../../client';
import { protectedResolver } from '../users.utils';

export default {
  Query: {
    // seeProfile: protectedResolver((_, { username }) => {
    // return client.user.findUnique({where: { username }})
    // }),
    seeProfile: (_, { username }) => {
      return client.user.findUnique({ where: { username } });
    },
  },
};
