const express = require("express");
const next = require("next");
require('dotenv').config()


const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({dir: "", dev });
const handle = app.getRequestHandler();

const {MongoClient, ObjectId} = require('mongodb');
const dbURI = process.env.MONGO_URI
const mongoClient = new MongoClient(dbURI)
let mysecretsantaDb;

app
  .prepare()
  .then(() => {
    const server = express();
    const api = require("./routes/api.js");


    server.use(express.static(__dirname + '../../public'));
    server.use(express.static( "img" ) );
    server.use(express.json())
    server.use("/api", api(server));

    server.get("*", (req, res) => {
      return handle(req, res);
    });

   
    async function run(){
        await mongoClient.connect();
        console.log('\nConnessione a MongoDB avvenuta con successo');
        server.listen(PORT, err => {
            if (err) throw err;
            console.log(`Server listening on port: ${PORT}`);
          });
        // chefhub = mongoClient.db('chefhub');
        
        // return chefhub
    }
    run().catch(err => console.log('errore connsessione '+ err))
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
