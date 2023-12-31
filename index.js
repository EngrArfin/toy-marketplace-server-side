const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
console.log(process.env.TOY_PASS)

const uri = `mongodb+srv://${process.env.TOY_USER}:${process.env.TOY_PASS}@cluster0.xu7sm0d.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection

    const serviceCollection = client.db('toyMarket').collection('services');
    const bookingCollection = client.db('toyMarket').collection('toying');
    const toyingCollection = client.db('toyMarket').collection('toy');
    
    app.get('/services', async(req, res) =>{
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    
    app.get('/services/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new Object(id)}

      const options = {
        projection: { title: 1, price: 1, service_id: 1, img: 1},
      };

      const result = await serviceCollection.findOne(query, options);
      res.send(result);

    })

    //toying

    app.get('/toying', async(req, res) =>{
      
      const result = await bookingCollection.find().toArray();
      res.send(result);
    })
    app.post('/toying', async(req, res) =>{
      const toying = req.body;
      console.log(toying);
      const result = await bookingCollection.insertOne(toying);
      res.send(result)

    })

    /* toy */
    app.get('/toy', async(req, res) =>{
      
      const result = await toyingCollection.find().toArray();
      res.send(result);
    })
    app.post('/toy', async(req, res) =>{
      const toy = req.body;
      console.log(toy);
      const result = await toyingCollection.insertOne(toy);
      res.send(result)

    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Toy is running')

})

app.listen(port, () =>{
    console.log(`Kid Toy server is running ${port}`)

})