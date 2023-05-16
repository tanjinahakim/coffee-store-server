
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.80g5an4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    
     const database = client.db("coffeeDB");
    const coffeeCollection = database.collection("coffee");
      // read data
    app.get('/coffee',async(req,res)=>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    // send data
    app.post('/coffee',async(req,res)=>{
      const addCoffee =req.body;
      const result = await coffeeCollection.insertOne(addCoffee);
      console.log(addCoffee)
      res.send(result)
    })

    // delete data
    app.delete('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })
    // update data
    app.get('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    })
    app.put('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const filter ={_id: new ObjectId(id)}
      const options ={upsert:true}
      const updatedCoffee = req.body
      const update = {
        $set:{
          name:updatedCoffee.name,
          chef:updatedCoffee.chef,
          supplier:updatedCoffee.supplier,
          taste:updatedCoffee.taste,
          category:updatedCoffee.category,
          details:updatedCoffee.details,
          photo:updatedCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter,update,options)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('COFFEE STORE SERVER IS RUNNING')
  })
  
  app.listen(port, () => {
    console.log(`COFFEE STORE SERVER IS RUNNING ON PORT ${port}`)
  })