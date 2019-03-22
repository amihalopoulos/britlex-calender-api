import mongodb from "mongodb"
import express from "express";

const ObjectId = mongodb.ObjectID;
// import bodyParser from "body-parser";
// import cors from "cors";

const MongoClient = mongodb.MongoClient;
let collection, db;
const uri = "mongodb+srv://alexei:barrydog123@myfirstcluster-rucno.mongodb.net/test?retryWrites=true"

const router = new express.Router();
router.get('/dates/:dateId', getDate)
router.get('/dates', getDates)
router.post('/dates', postDate)
router.put('/dates/:dateId', approveDate)
router.delete('/dates/:dateId', deleteDate)
// { 

// }

function postDate(req, res){
  try {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
       if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       console.log('Connected...');
       db = client;
       collection = client.db("calendar").collection("dates");

       let dateDoc = {
        "id": new ObjectId(),
        "start": "2017-12-18 09:30:00",
        "end": "2017-12-19 23:30:00",
        "email": "email",
        "name": "name",
        "notes": "notes",
        "approved": false,
        "timestamp": "2017-12-19 23:30:00"
       }
       
       // perform actions on the collection object
       collection.insertOne(dateDoc)
       
       client.close();
       res.status(200).send(dateDoc)
    });

  } catch (e) {
    print(e)
    res.status(500).send(["Not Added"])
  }
}

function getDate(req, res) {
  try {
    let dateId = req.params.dateId;
    if (!dateId) {
      res.status(400).send("Date not found")
    } else {
      MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
         if(err) {
              console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
         }
         console.log('Connected...');
         db = client;
         collection = client.db("calendar").collection("dates");
         
         let results = collection.find({"id": ObjectId(dateId)}).toArray((error, documents) => {
          if (err) throw error;
          
          res.status(200).send(documents)
          client.close();
        });
      });
    }
  } catch (e) {
    print(e)
    res.status(500).send("Not found")
  }
}

function getDates(req, res) {
  try {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
       if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       console.log('Connected...');
       db = client;
       collection = client.db("calendar").collection("dates");
       
       let results = collection.find({}).toArray((error, documents) => {
          if (err) throw error;
          
          res.status(200).send(documents)
        });
       
       client.close();
    });

  } catch (e) {
    print(e)
    res.status(500).send("Not found")
  }
}

function approveDate(req, res){
  try {
    let dateId = req.params.dateId;
    let dateKey = req.body.dateKey;

    if (!dateId || dateKey !== "ImTheMasterKey") {
      res.status(400).send("Date not found")
    } else {
      MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
         if(err) {
              console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
         }
         console.log('Connected...');
         db = client;
         collection = client.db("calendar").collection("dates");
         
         let result = collection.updateOne( {"id": ObjectId(dateId)}, { $set: {"approved": true} } );
         
         client.close();
         res.status(200).send(result)
      });
    }
  } catch(e) {
    res.status(400).send("Error: Date not found")
  }
}

function deleteDate(req, res){
  try {
    let dateId = req.params.dateId;

    if (!dateId) {
      res.status(400).send("Date not found")
    } else {
      MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
         if(err) {
              console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
         }
         console.log('Connected...');
         db = client;
         collection = client.db("calendar").collection("dates");
         
         let result = collection.deleteOne( {"id": ObjectId(dateId)}, (err, db) => {
          if (err) throw err;
          console.log('deleted')
          client.close();
          res.status(200).send('deleted')
         });
        
      });
    }
  } catch(e) {
    res.status(400).send("Error: Date not found")
  }
}

exports.router = router;