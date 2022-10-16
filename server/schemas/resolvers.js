const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().select('-__v -password').populate('books');
    },
  },
};

module.exports = resolvers;
