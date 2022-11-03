 const Project = require('../models/Project');
const Client = require('../models/Client');

//Client Type
const {clients, projects, accounts} = require('../sampleData.js');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull

 
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
        phone: {type: GraphQLString},
       account:{
          type:AccountType,
          resolve(parent, args){
            return accounts.find(account => account.id === parent.id)
          }
        } 
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
           //return clients.find(client => client.id === parent.clientId)
           return Client.findById(parent.clientId);
         }
      }
  })
});

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: {
       accounts:
                {
                type: new GraphQLList(AccountType),
                resolve(parent, args) {
                return accounts
                },
                },
        projects:
                {
                type: new GraphQLList(ProjectType),
                resolve(parent, args) {
                // return projects
                 return Project.find();
                },
        },
        project: 
                {
                type: ProjectType,
                args:{id: {type: GraphQLID}},
                resolve(parent, args) {
                //return projects.find(project => project.id === args.id);
                return Project.findById(args.id);
                },
        },
        clients:{
                type: new GraphQLList(ClientType),
                 resolve(parent, args) {
                 //return clients
                 return Client.find();
                },
                },
        client: {
                type: ClientType,
                args:{id: {type: GraphQLID}},
                resolve(parent, args) {
                 //return clients.find(client => client.id === args.id);
                return Client.findById(args.id); 
                },
                },
           }
});



    
// Mutations
    
// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
       // Add a client
       addClient: {
        type: ClientType,
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          email: { type: GraphQLNonNull(GraphQLString) },
          phone: { type: GraphQLNonNull(GraphQLString) },
        },
        resolve(parent, args) {
          const client = new Client({
            name: args.name,
            email: args.email,
            phone: args.phone,
          });
  
          return client.save();
        },
      },
  }
})


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
