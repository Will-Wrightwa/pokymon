import { GraphQLServer } from 'graphql-yoga';
// import { Database, aql } from 'arangojs';
import { get, mapValues, isArray, reject, times } from 'lodash';
import rp from 'request-promise';
import faker from 'faker';


import { Database, aql } from 'arangojs';


const jq = require('node-jq');

const typeDefs = /* GraphQL */`
    type Query {
      hello(name: String): String!
    }
    # type User {
    #   id: ID
    #   name: String!
    #   work: [Work]
    # }
  `;


const id_ = () => faker.random.alphaNumeric(7);

const getResolvers = () => {

  const res = {
    Query: {
      hello: (_, { name }) => `Hello ${name || 'World'}`,
    },
    // Task: {
    //   id: id_,
    //   text: () => faker.random.words(),
    //   isComplete: () => faker.random.boolean(),
    //   parent: () => (faker.random.arrayElement([null, {}])),
    //   children: () => times(faker.random.arrayElement([0, 0, 1, 1, 1, 2, 2, 3]), () => ({})),
    // },

  };


  return res;
};

async function run() {

  const resolvers = getResolvers();
  const server = new GraphQLServer({ typeDefs, resolvers });
  server.start(() => console.log('Server is running on localhost:4000'));
}
run();
