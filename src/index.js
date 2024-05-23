require("dotenv").config();
const express = require("express");
// const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const { createHandler } = require("graphql-http/lib/use/express");
const { ruruHTML } = require("ruru/server");
const path = require("path");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { loadSchemaSync } = require("@graphql-tools/load");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");

const { limiter } = require("./middlewares/rateLimiter.js");

const app = express();

app.use(helmet());

app.use(express.json()); // application/json
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());
app.use(cors());
// app.options("*", cors());

app.use(limiter);

const typeDefs = loadSchemaSync("./**/**/**/*.graphql", {
  loaders: [new GraphQLFileLoader()],
});
const resolverFiles = loadFilesSync(
  path.join(__dirname, "./**/**/**/*.resolver.*")
);
const resolvers = mergeResolvers(resolverFiles);

const schema = makeExecutableSchema({ typeDefs, resolvers });

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: resolvers,
  })
);

// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// ----------- Starting to use express-middleware----------
// To use ES6 module, run - npm pkg set type="module"
// const { expressMiddleware } = require('@apollo/server/express4');
// const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
// const express = require('express');
// const http = require('http');
// const cors = require('cors');

// Required logic for integrating with Express
// const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
// const httpServer = http.createServer(app);
// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
// });
// Ensure we wait for our server to start
// await server.start();
// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
// app.use(
//   '/',
//   cors(),
//   // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
//   bodyParser.json({ limit: '50mb' }),
//   // expressMiddleware accepts the same arguments:
//   // an Apollo Server instance and optional configuration options
//   expressMiddleware(server, {
//     context: async ({ req }) => ({ token: req.headers.token }),
//   }),
// );
// Modified server startup
// await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
// ----------- Ending to use express-middleware----------

// Create and use the GraphQL handler.
// app.all(
//   "/graphql",
//   createHandler({
//     schema: schema,
//     rootValue: resolvers,
//   })
// );

// interface MyContext {
//   token?: String;
// }

// const server = new ApolloServer<MyContext>({ schema, resolvers });

// // creates an Express app, then uses the Apollo instance as middleware and
// // prepares our application to handle incoming requests
// startStandaloneServer(server, {
//   // Your async context function should async and
//   // return an object
//   context: async ({ req, res }) => ({
//     token: req.headers.authorization || "",
//   }),
//   listen: { port: 8080 },
// }).then(({ url }) => {
//   console.log(`Server ready at ${url}`);
// });

