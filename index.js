const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
// middleware
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://popx-website-by-shahbaz.netlify.app",
  ],
  Credential: true,
};
app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxshq.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );

    // creatingcollection
    const userCollection = client.db("popx").collection("users");
    // storing userdata to mongodb
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const query = { email: newUser?.email };
      const isExist = await userCollection.findOne(query);
      if (isExist) {
        res.send({ message: "user Exist" });
      }
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });
    // getting user data
    app.get("/user/:email", async (req, res) => {
      const query = { email: req?.params?.email };
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("popx server is running");
});

app.listen(port, () => {
  console.log(`popx-server is running on port ${port}`);
});
