// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create typeDefs
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
  }

  type Book {
    authors: String
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type Query {
    users: [User]
    user(username: String!): User
    books: [Book]
    book(bookId: String!): Book
  }
`;

// export the typeDefs
module.exports = typeDefs;
