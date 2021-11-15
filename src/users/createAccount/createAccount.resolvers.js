import client from 'client';
import bcrypt from 'bcrypt';
import pubsub from 'pubSub';
import { USER_CREATED } from 'constants';

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
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
        if (existingUser) {
          throw new Error('This username/password is already taken.');
        }
        // hash password
        const uglyPassword = await bcrypt.hash(password, 10);
        // console.log(uglyPassword);
        // save and return the user
        const user = await client.user.create({
          data: {
            firstName,
            lastName,
            username,
            email,
            password: uglyPassword,
          },
        });

        pubsub.publish(USER_CREATED, { userCreated: { ...user } });

        return {
          ok: true,
        };
      } catch (error) {
        // console.log('error', error);
        return {
          ok: false,
          error: `Can't create account.`,
        };
      }
    },
  },
};
