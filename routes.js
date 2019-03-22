import mongodb from "mongodb"
import express from "express";
import dbs from './db.js'

const ObjectId = mongodb.ObjectID;
// import bodyParser from "body-parser";
// import cors from "cors";

const MongoClient = mongodb.MongoClient;

const uri = "mongodb+srv://alexei:barrydog123@myfirstcluster-rucno.mongodb.net/test?retryWrites=true"

const router = new express.Router();
router.get('/dates/:dateId', getDate)
router.get('/dates', getDates)
router.post('/dates', postDate)
router.put('/dates/:dateId', approveDate)
router.delete('/dates/:dateId', deleteDate)

function postDate(req, res){
  try {
    dbs.connectAndQuery( (err, client) => {
      if(err) {
          res.status(500).send('Error connecting to database')
      }
      let collection = client.db("calendar").collection("dates");

      let dateDoc = {
       "id": new ObjectId(),
       "start": req.body.start,
       "end": req.body.end,
       "email": req.body.email,
       "name": req.body.name,
       "notes": req.body.notes,
       "approved": false,
       "timestamp": req.body.timestamp
      }

      collection.insertOne(dateDoc)
      res.status(200).send(dateDoc)

    })
  } catch (e) {
    console.log(e)
    res.status(500).send(["Not Added"])
  }
}

function getDate(req, res) {
  try {
    let dateId = req.params.dateId;
    if (!dateId) {
      res.status(400).send("Date not found")
    } else {
      dbs.connectAndQuery( (err, client) => {
        if(err) {
            res.status(500).send('Error connecting to database')
        }

        let results = client.db("calendar").collection("dates").find({"id": ObjectId(dateId)}).toArray((error, documents) => {
          if (err) throw error;
          res.status(200).send(documents)
        })
      })
    }
  } catch (e) {
    console.log(e)
    res.status(500).send("Not found")
  }
}

function getDates(req, res) {
  try {
    dbs.connectAndQuery( (err, client) => {
      if(err) {
          res.status(500).send('Error connecting to database')
      }

      let results = client.db("calendar").collection("dates").find({}).toArray((error, documents) => {
        if (err) throw error;
        res.status(200).send(documents)
      })
    })

  } catch (e) {
    console.log(e)
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
      dbs.connectAndQuery( (err, client) => {
        if(err) {
            res.status(500).send('Error connecting to database')
        }

        client.db("calendar").collection("dates").updateOne( {"id": ObjectId(dateId)}, { $set: {"approved": true} }, (err, result) => {
          if (err) throw error;
          res.status(200).send(result)
        });
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
      dbs.connectAndQuery( (err, client) => {
        if(err) {
            res.status(500).send('Error connecting to database')
        }

        client.db("calendar").collection("dates").deleteOne( {"id": ObjectId(dateId)}, (err, result) => {
          if (err) throw err;
          console.log('deleted')
          res.status(200).send('deleted')
        });
      });

    }
  } catch(e) {
    res.status(400).send("Error: Date not found")
  }
}

exports.router = router;