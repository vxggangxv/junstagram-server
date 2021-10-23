import client from 'client';
import bcrypt from 'bcrypt';

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
        // console.log('error', error);
        return {
          ok: false,
          error: `Can't create account.`,
        };
      }
    },
  },
};