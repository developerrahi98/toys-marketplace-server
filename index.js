const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("toys marketplace is running");
});


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ot7ey7w.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

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
    await client.connect();

    const toyCollection = client.db('toyDB').collection('toy');
    const singleToyCollection = client.db('toyDB').collection('singleToy');

    app.get('/singletoy', async (req, res) => {
      const result = await singleToyCollection.find().toArray();
      res.send(result);
    })
    app.get('/singleToy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await singleToyCollection.findOne(query);
      res.send(result);
    })

    app.get('/addToy', async(req,res)=>{
        const cursor = toyCollection.find();
        const result = await cursor.toArray();
        res.send(result); 
    })

    app.post('/addToy', async(req,res)=>{
        const newToy = req.body
        console.log(newToy);
        const result = await toyCollection.insertOne(newToy);
        res.send(result);

    })

    app.get('/addToy/:id', async(req, res)=>{
        const id = req.params.id
        const query ={_id : new ObjectId(id)}
        const result = await toyCollection.findOne(query);
        res.send(result);
    })

    app.put('/addToy/:id', async(req, res)=>{
        const id = req.params.id
        const filter ={_id : new ObjectId(id)}
        const options ={upsert : true}
        const updatedToy = req.body
        console.log(updatedToy);
        const toy = {
            $set:{
                name: updatedToy.name,
                url: updatedToy.url,
                category: updatedToy.category,
                price: updatedToy.price,
                ratings: updatedToy.ratings,
                quantity:updatedToy.quantity
            }
        }
        const result = await toyCollection.updateOne(filter, toy, options);
        res.send(result);
    })
    app.delete('/addToy/:id', async(req, res)=>{
        const id = req.params.id
        const query ={_id : new ObjectId(id)}
        const result = await toyCollection.deleteOne(query);
        res.send(result);
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


app.listen(port, () => {
  console.log(`toys marketpalace is running on port : ${port}`);
});
