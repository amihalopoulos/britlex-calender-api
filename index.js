import mongodb from "mongodb"
import express from "express";
import expressGraphQL from "express-graphql";
import bodyParser from "body-parser";
import cors from "cors";
import routes from './routes'

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(routes.router)
app.get('/', (req, res) => res.send('Hello World with Express'));

app.listen(port, function () {
  console.log("Running on port " + port);
  // const MongoClient = mongodb.MongoClient;

  // const uri = "mongodb+srv://alexei:barrydog123@myfirstcluster-rucno.mongodb.net/test?retryWrites=true"
  // MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
  //    if(err) {
  //         console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
  //    }
  //    console.log('Connected...');
  //    const collection = client.db("calendar").collection("dates");
  //    // perform actions on the collection object
  //    // client.close();
  // });
});