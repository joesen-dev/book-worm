// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create typeDefs
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    description: String!
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input SavedBookInput {
    authors: [String!]
    description: String!
    title: String
    bookId: String
    image: String
    link: String
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    savedBooks: [Book]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: SavedBookInput): User!
    removeBook(bookId: String!): User
    DeleteObject(className: String!, Id: ID!): User
  }
`;

// mutation DeleteObject {
//   deleteUser(className: String!, objectId: ID!): User
// }

// export the typeDefs
module.exports = typeDefs;
