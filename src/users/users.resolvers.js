import { USER_CREATED } from 'constants';
import pubsub from 'pubSub';

export default {
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator([USER_CREATED]),
    },
  },
};
