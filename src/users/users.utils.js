import client from '../client';
import jwt from 'jsonwebtoken';

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export function protectedResolver(ourResolver) {
  return function (root, args, context, info) {
    console.log('context', context);
    if (!context.loggedInUser) {
      return {
        ok: false,
        error: 'Please log in to perform this action.',
      };
    }

    return ourResolver(root, args, context, info);
  };
}
