const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const toy = require('./data/actionfigure.json');
const membership = require('./data/Membership.json');

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('marveltoy store API is running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/toy', (req,res) => {
    res.send(toy);
})

app.get('/toy/:id', (req,res) => {
    const id = req.params.id;
    const selectedToy = toy.find(toyfigure => toyfigure.id === id);
    res.send(selectedToy);
})

app.get('/membership', (req,res) => {
    res.send(membership);
})

app.get('/membership/:id', (req,res) => {
    const id = req.params.id;
    const seletedMembership = membership.find(cardtype => cardtype.id === id);
    res.send(seletedMembership);
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t79plj2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // Connect to toy-marketplace db and collection called 'toycollection'
    const userCollection = client.db('toy-marketplace').collection('toycollection');

    app.post('/addtoy', async (req,res) => {
        const result = await userCollection.insertOne(req.body);
        res.send(result);
    })


    app.get('/addtoy', async(req,res) => {
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });

    app.get('/addtoy/email/:selleremail', async(req,res) => {
        const sellerEmail = req.params.selleremail;
        // const query = {selleremail: sellerEmail };
        const user = await userCollection.find({ selleremail: sellerEmail }).toArray();
        res.send(user);
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