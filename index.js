const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

// Middleware
const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wfxhs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("Camping-Crew");
    const usePlansCollection = database.collection("All Plans");
    const useActivitiesCollection = database.collection("Activities");
    const useBookedCollection = database.collection("Bookinginfo");
    const useOffersCollection = database.collection("Offers");

    // ------------------- For Plans-----------------------
    // Get All Planes
    app.get("/all-plans", async (req, res) => {
      const plans = await usePlansCollection.find({}).toArray();
      res.send(plans);
    });

    // // Plan DETAILS
    app.get("/plan-details/:id", async (req, res) => {
      const ID = req.params.id;
      const plan = { _id: ObjectId(ID) };
      const PlanDetails = await usePlansCollection.findOne(plan);
      res.send(PlanDetails);
    });

    //POST Data
    app.post("/add-plans", async (req, res) => {
      const planData = await usePlansCollection.insertOne(req.body);
      res.json(planData);
    });

    // ------------------- For Activites-----------------------
    // Get All Planes
    app.get("/all-activities", async (req, res) => {
      const activities = await useActivitiesCollection.find({}).toArray();
      res.send(activities);
    });

    // ------------------- For Booking-----------------------

    app.get("/all-bookings", async (req, res) => {
      const bookings = await useBookedCollection.find({}).toArray();
      res.send(bookings);
    });

    //POST Data
    app.post("/add-booking", async (req, res) => {
      const planData = await useBookedCollection.insertOne(req.body);
      res.json(planData);
    });

    // For finding all booking objects according to plan id
    app.get("/booking-details/:id", async (req, res) => {
      const planId = req.params.id;
      const allbooking = { package_id: ObjectId(planId) };
      const PlanUsers = await useBookedCollection.find(allbooking).toArray();
      res.send(PlanUsers);
    });

    // DELETE a Booking
    app.delete("/remove-booking/:id", async (req, res) => {
      const bookingId = req.params.id;
      const bookedplan = { _id: ObjectId(bookingId) };
      const result = await useBookedCollection.deleteOne(bookedplan);
      console.log("Delete User", result);
      res.json(result);
    });

    // Update
    app.put("/booking/update/:id", async (req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: req.body.status,
        },
      };
      const result = await useBookedCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // ------------------- For Offers-----------------------
    // Get All Offers
    app.get("/all-offers", async (req, res) => {
      const offers = await useOffersCollection.find({}).toArray();
      res.send(offers);
    });


    // ------------------- For Activities-----------------------
    // Get All Activities
    app.get("/all-activities", async (req, res) => {
      const activities = await useOffersCollection.find({}).toArray();
      res.send(activities);
    });

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Camping Crew Server is Running");
});

app.listen(port, () => {
  console.log('Running Camping Crew Server on Port ', port);
});
