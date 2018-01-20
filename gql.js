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
      task(seed: Int!) : Task
    }
    type Mutation {
      addTask(text: String!, parent: String): Task
    }
    # type User {
    #   id: ID
    #   name: String!
    #   work: [Work]
    # }
    type Task {
      id: ID
      text: String!
      isComplete: Boolean!
      parent: Task
      children: [Task]
    }
  `;


const id_ = () => faker.random.alphaNumeric(7);

const getResolvers = (db) => {

  const res = {
    Query: {
      hello: (_, { name }) => `Hello ${name || 'World'}`,
      task: (_, { id }) => { db.tasks.document(id); },
    },
    Mutation: {
      addTask: async (_, { text, parent = null }) => {
        console.log('autenticating...');
        console.log('saving...');
        const task = await db.collection('tasks').save({ text });
        console.log(task);
        console.log('saved??');
        if (!!parent && task) {
          const child = task._id;
          const parentId = `tasks/${parent}`;
          console.log(`adding edge from ${parentId} to ${child}`);
          const edge = await db.collection('taskEdges').save({ _from: parentId, _to: child });
          console.log(edge);
          console.log('sived edge?');
        }
        return task;
      },
    },
    Task: {
      id: id_,
      text: () => faker.random.words(),
      isComplete: () => faker.random.boolean(),
      parent: () => (faker.random.arrayElement([null, {}])),
      children: () => times(faker.random.arrayElement([0, 0, 1, 1, 1, 2, 2, 3]), () => ({})),
    },

  };


  return res;
};

async function run() {

  const db = new Database();
  db.useDatabase('todos');
  db.useBasicAuth('root', '');

  const resolvers = getResolvers(db);
  const server = new GraphQLServer({ typeDefs, resolvers });
  server.start(() => console.log('Server is running on localhost:4000'));
}
run();
