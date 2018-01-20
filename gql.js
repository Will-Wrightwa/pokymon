import { GraphQLServer } from 'graphql-yoga';
// import { Database, aql } from 'arangojs';
import { get, mapValues, isArray, reject, times } from 'lodash';
import rp from 'request-promise';
import faker from 'faker';

const POKEAPI_ROOT = 'http://pokeapi.co/api/v2/';

import { Database, aql } from 'arangojs';


const jq = require('node-jq');

const typeDefs = /* GraphQL */`
    type Query {
      hello(name: String): String!
      pokemonById(id: Int!): Pokemon
    }
    type Pokemon {
      id: Int!
      name: String!
      # weight: Int!
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
      pokemonById: async (_, { id }) => {
        console.log(id);
        const str = await rp(`${POKEAPI_ROOT}pokemon/${id}`);
        // console.log(str);
        const obj = await jq.run('.', str, { input: 'string', output: 'json' });
        // console.log(obj);
        console.log(obj.name);
        return obj;
      },
    },
    // Task: {
    //   id: id_,
    //   text: () => faker.random.words(),
    //   isComplete: () => faker.random.boolean(),
    //   parent: () => (faker.random.arrayElement([null, {}])),
    //   children: () => times(faker.random.arrayElement([0, 0, 1, 1, 1, 2, 2, 3]), () => ({})),
    // },
    Pokemon: {
      name: obj =>
        // console.log(obj);
        obj.name
      ,
    },

  };
  return res;
};

async function run() {


  const resolvers = getResolvers();
  const server = new GraphQLServer({ typeDefs, resolvers });
  server.start(() => console.log('Server is running on localhost:4000'));
}
run();
