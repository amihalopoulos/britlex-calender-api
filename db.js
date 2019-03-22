import mongodb from "mongodb"
const MongoClient = mongodb.MongoClient;
const config = require('./config.json');

function connectAndQuery(cb) {
  MongoClient.connect(config.dbUri, { useNewUrlParser: true }, (err, client) => {
     if(err) {
          console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
     }
     console.log('Connected...');
     Promise.resolve( cb(err, client) )
     .then( () => {
      console.log('closing connection...')
      client.close();
     })
     // db = client;
     // collection = client.db("calendar").collection("dates");
     
     // let results = collection.find({"id": ObjectId(dateId)}).toArray((error, documents) => {
     //  if (err) throw error;
      
     //  res.status(200).send(documents)
     //  client.close();
    // });
  });
}

exports.connectAndQuery = connectAndQuery