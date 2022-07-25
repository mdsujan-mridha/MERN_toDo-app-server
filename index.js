const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zlz6i.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

    try{
       await client.connect();
       const toDoItemsCollection = client.db("todoitems").collection("items");

       app.get('/items', async(req,res)=>{
            const query = {};
            const cursor = toDoItemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
       })

       app.post('/items', async(req,res)=>{
         
        const addItems = req.body;
        const result = await toDoItemsCollection.insertOne(addItems);
        res.send(result);

       });
       app.put('/items/:id' ,async(req, res)=>{
         const id = req.params.id;
         const updateItem = req.body;
         const filter = {_id:ObjectId(id)};
         const options = {upsert:true}
         const updateDoc = {
            $set:{
                items:updateItem.items
            }
         };
         const result = await toDoItemsCollection.updateOne(filter,updateDoc,options);
         res.send(result);

       });
       app.delete('/items/:id', async(req, res) =>{
         const id = req.params.id;
         const query = {_id:ObjectId(id)};
         const result  = await IDBTransaction.delete(query);
         res.send(result);
       });
    }


    finally{

    }
}

run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('server is connected')
  });
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });