const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x2r2l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const toDoCollection = client.db("Youth-India-Foundation-E-School").collection("ToDoLists");

  app.post('/addToDo', (req, res) => {
    const toDo = req.body;
    toDoCollection.insertOne(toDo)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/toDos', (req, res) => {
    toDoCollection.find({})
      .toArray((err, result) => {
        res.send(result);
      })
  })

  app.patch('/updateTodo/:id', (req, res) => {
    const update = req.params.id
    console.log(req.body, req.params.id)
    toDoCollection.findOneAndUpdate({ _id: new ObjectId(req.params.id) },
      {
        $set: { toDo: req.body.toDo }
      })
      .then(() => {
        res.send({ success: true }); 
      })
  });

  app.delete('/deleteTodo/:id', (req, res) => {
    toDoCollection.deleteOne({ _id: new ObjectId(req.params.id) })
      .then(result => {
        console.log(result);
        res.send({ success: true });
      })
  })
});

app.listen(process.env.PORT || port);