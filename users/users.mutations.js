import client from '../client';
import bcrypt from 'bcrypt';

export default {
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
        if (existingUser) return;
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
