import client from '../../client';
import jwt from 'jsonwebtoken';
import { protectedResolver } from '../users.utils';
import { createWriteStream } from 'fs';

export default {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          firstName,
          lastName,
          username,
          email,
          password: newPassword,
          bio,
          avatar,
        },
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
          // avatar url
          let avatarUrl = null;
          if (avatar) {
            // avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
            const { filename, createReadStream } = await avatar;
            const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
            const readStream = createReadStream();
            const writeStream = createWriteStream(
              process.cwd() + '/uploads/' + newFilename
            );
            readStream.pipe(writeStream);
            avatarUrl = `http://localhost:4000/uploads/${newFilename}`;
          }
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
              bio,
              ...(uglyPassword && { password: uglyPassword }),
              ...(avatarUrl && { avatar: avatarUrl }),
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
