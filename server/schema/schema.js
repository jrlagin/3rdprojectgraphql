// const Project = require('../models/Project');
// const Client = require('../models/Client');

//Client Type
const {clients, projects, accounts} = require('../sampleData.js');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList
 
} = require('graphql');

//account type
const AccountType = new GraphQLObjectType({
  name: 'Account',
  fields:() => ({
      id: {type: GraphQLID},
      access: {type: GraphQLString},
      account: {type: GraphQLString},
     
  })
});
  
//client type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields:() => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString}
    })
});

//Project type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields:() => ({
      id: {type: GraphQLID},
      name: {type: GraphQLString},
      description: {type: GraphQLString},
      phone: {type: GraphQLString},
      status: {type: GraphQLString},
      email:{type: GraphQLString},
      client:{
         type:ClientType,
         resolve(parent, args){
          return clients.find(client => client.id === parent.clientId)
           //return clients.find(client => client.email === parent.email)
         }
      }
  })
});

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: {
       accounts:
                {
                type: new GraphQLList(ProjectType),
                resolve(parent, args) {
                return accounts
                },
                },
        projects:
                {
                type: new GraphQLList(ProjectType),
                resolve(parent, args) {
                return projects
                },
        },
        project: 
                {
                type: ProjectType,
                args:{id: {type: GraphQLID}},
                resolve(parent, args) {
                //return Client.findById(args.id);
                return projects.find(project => project.id === args.id);
                },
        },
        clients:{
                type: new GraphQLList(ClientType),
                 resolve(parent, args) {
                 return clients
                },
                },
        client: {
                type: ClientType,
                args:{id: {type: GraphQLID}},
                resolve(parent, args) {
                 //return Client.findById(args.id);
                 return clients.find(client => client.id === args.id);
                },
                },

        }
    });


    
// Mutations
 

module.exports = new GraphQLSchema({
  query: RootQuery,
  //mutation,
});
