const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        console.log('user');
        console.log(context.user);
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('savedBooks');

        console.log('userData');
        console.log(userData);
        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      return User.find().select('-__v -password').populate('savedBooks');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('savedBooks');
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    // save a book to a user's `savedBooks`
    saveBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookId } },
          { new: true }
        ).populate('savedBooks');

        console.log('updatedUser');
        console.log(updatedUser);
        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    // remove a book from `savedBooks`
    removeBook: async (parent, { user, params }, context) => {
      if (context.user) {
        console.log('user');
        console.log(context.user);
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: params.bookId } } },
          { new: true }
        ).populate('savedBooks');

        if (!updatedUser) {
          throw new AuthenticationError("Couldn't find user with this id!");
        }

        console.log('updatedUser');
        console.log(updatedUser);
        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
