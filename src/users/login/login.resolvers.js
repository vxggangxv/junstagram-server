import client from '../../client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      // find user
      const user = await client.user.findUnique({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: 'User not found.',
        };
      }
      // check password
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: 'Incorrect Password.',
        };
      }
      // issue a token and send it to the user
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: '7d',
      });
      return {
        ok: true,
        token,
      };
    },
  },
};
