const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const toy = require('./data/actionfigure.json');
const membership = require('./data/Membership.json');

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Toystore API is running');
})

app.listen(port, () => {
  console.log(`Toystore API is running on port: ${port}`);
})

app.get('/toy', (req, res) => {
  res.send(toy);
})

app.get('/toy/:id', (req, res) => {
  const id = req.params.id;
  const seletedToy = toy.find(toyfigure => toyfigure.id === id);
  res.send(seletedToy);
})

app.get('/membership', (req, res) => {
  res.send(membership);
})

app.get('/membership/:id', (req, res) => {
  const id = req.params.id;
  const seletedMembership = membership.find(cardtype => cardtype.id === id);
  res.send(seletedMembership);
})

const uri = "mongodb+srv://rafidahsan78:LVSTyChwUAxmXQAH@cluster0.t79plj2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    // const database = client.db("usersDB");
    // const userCollection = database.collection("users");
    const userCollection = client.db('toy-marketplace').collection('toycollection');


    // app.post('/users', async (req, res) => {
    //   const user = req.body;
    //   console.log('new user', user);
    //   const result = await userCollection.insertOne(user);
    //   res.send(result);
    // });

    app.post('/addtoy', async (req,res) => {
        const result = await userCollection.insertOne(req.body);
        res.send(result);
    })

    app.get('/addtoy', async(req,res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    const options = {
      // Sort returned documents in ascending order by title (A->Z)
      sort: { price: 1 },
    };

    const optionsDescending = {
      // Sort returned documents in ascending order by title (A->Z)
      sort: { price: -1 },
    };

    app.get('/addtoy/email/:selleremail', async(req,res) => {
      const sellerEmail = req.params.selleremail;
      // const query = {selleremail: sellerEmail };
      const user = await userCollection.find({ selleremail: sellerEmail }).toArray();
      res.send(user);
    })

    app.get('/addtoy/email/ascending/:selleremail', async(req,res) => {
      const sellerEmail = req.params.selleremail;
      // const query = {selleremail: sellerEmail };
      const user = await userCollection.find({ selleremail: sellerEmail },options).toArray();
      res.send(user);
    })

    app.get('/addtoy/email/descending/:selleremail', async(req,res) => {
      const sellerEmail = req.params.selleremail;
      // const query = {selleremail: sellerEmail };
      const user = await userCollection.find({ selleremail: sellerEmail },optionsDescending).toArray();
      res.send(user);
    })
    
    app.get('/addtoy/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const user = await userCollection.findOne(query);
      res.send(user);
    })

    app.put('/addtoy/:id', async(req,res) => {
      const id = req.params.id;
      const toy = req.body;
      console.log(toy); 
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedUser = {
        $set: {
            photo: toy.photo,
            toyname: toy.toyname2,
            sellername: toy.sellername,
            selleremail: toy.selleremail,
            subcategory: toy.subcategory,
            price: toy.price,
            quantity: toy.quantity,
            rating: toy.rating,
            description: toy.description
        }
      }
      const result = await userCollection.updateOne(filter, updatedUser, options);
      res.send(result);
   })

    app.delete('/addtoy/:id', async(req,res) => {
       const id = req.params.id;
       const query = {_id: new ObjectId(id)};
       const result = await userCollection.deleteOne(query);
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
