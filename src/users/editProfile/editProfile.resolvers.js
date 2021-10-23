import client from '../../client';
import jwt from 'jsonwebtoken';
import { protectedResolver } from '../users.utils';

export default {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        { firstName, lastName, username, email, password: newPassword },
        { loggedInUser }
      ) => {
        try {
          // console.log(firstName, lastName, username, email, password);
          // verify token
          // const { id } = await jwt.verify(token, process.env.SECRET_KEY);
          // if (!loggedInUser) {
          //   return {
          //     ok: false,
          //     error: '401',
          //   };
          // }
          // password convert uglyPassword
          let uglyPassword = null;
          if (newPassword) {
            uglyPassword = await bcrypt.hash(newPassword, 10);
          }
          // update with user.id(token.id)
          const updatedUser = await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              firstName,
              lastName,
              username,
              email,
              ...(uglyPassword && { password: uglyPassword }),
            },
          });
          if (updatedUser.id) {
            return {
              ok: true,
            };
          } else {
            return { ok: false, error: 'Could not update profile.' };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
          };
        }
      }
    ),
  },
};
