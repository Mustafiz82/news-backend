import express from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb+srv://mustafiz8260_db_user:RWCBRiuk5DDJlZsd@cluster0.8cgcn6i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Cached Mongo connection (for Vercel serverless)
let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

async function getDB() {
  const client = await clientPromise;
  return client.db("newsDB");
}

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ News API running successfully on Vercel!");
});

// =========================
// 📰 NEWS ROUTES
// =========================

// ✅ CREATE NEWS
app.post("/news", async (req, res) => {
  const db = await getDB();
  const NewsCollection = db.collection("newsCollection");
  const newsData = req.body;
  if (!newsData || Object.keys(newsData).length === 0) {
    return res.status(400).send({ message: "Request body is empty" });
  }

  const doc = {
    ...newsData,
    views: newsData.views || 0,
    isFeatured: newsData.isFeatured || false,
    createdAt: newsData.createdAt ? new Date(newsData.createdAt) : new Date(),
  };

  const result = await NewsCollection.insertOne(doc);
  res.send(result);
});

// ✅ GET ALL NEWS (with pagination + category filter)
app.get("/news", async (req, res) => {
  const db = await getDB();
  const NewsCollection = db.collection("newsCollection");
  const { category, page = 1, limit = 10 } = req.query;
  const filter = category ? { category } : {};
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await NewsCollection.countDocuments(filter);

  const result = await NewsCollection.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .toArray();

  res.send({
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    data: result,
  });
});

// ✅ GET SINGLE NEWS + AUTO-INCREMENT VIEWS
app.get("/news/:id", async (req, res) => {
  const db = await getDB();
  const NewsCollection = db.collection("newsCollection");
  const id = req.params.id;

  try {
    const news = await NewsCollection.findOne({ _id: new ObjectId(id) });
    if (!news) return res.status(404).send({ message: "News not found" });

    await NewsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    );

    res.send(news);
  } catch (error) {
    res.status(400).send({ message: "Invalid ID format" });
  }
});

// ✅ UPDATE NEWS
app.put("/news/:id", async (req, res) => {
  const db = await getDB();
  const NewsCollection = db.collection("newsCollection");
  const id = req.params.id;
  const updatedData = req.body;

  try {
    const result = await NewsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    if (result.matchedCount === 0)
      return res.status(404).send({ message: "News not found" });
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: "Invalid ID format" });
  }
});

// ✅ DELETE NEWS
app.delete("/news/:id", async (req, res) => {
  const db = await getDB();
  const NewsCollection = db.collection("newsCollection");
  const id = req.params.id;

  try {
    const result = await NewsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0)
      return res.status(404).send({ message: "News not found" });
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: "Invalid ID format" });
  }
});

// =========================
// 🗂️ CATEGORY ROUTES
// =========================

app.post("/categories", async (req, res) => {
  const db = await getDB();
  const CategoryCollection = db.collection("categoriesCollection");
  const categoryData = req.body;
  if (!categoryData || !categoryData.name) {
    return res.status(400).send({ message: "Category name is required" });
  }
  const result = await CategoryCollection.insertOne({
    ...categoryData,
    createdAt: new Date(),
  });
  res.send(result);
});

app.get("/categories", async (req, res) => {
  const db = await getDB();
  const CategoryCollection = db.collection("categoriesCollection");
  const result = await CategoryCollection.find({})
    .sort({ createdAt: -1 })
    .toArray();
  res.send(result);
});

// =========================
// ⭐ SPECIAL NEWS ROUTES
// =========================

// ✅ Featured News
app.get("/news/featured", async (req, res) => {
  const db = await getDB();
  const NewsCollection = db.collection("newsCollection");
  const result = await NewsCollection.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();
  res.send(result);
});

// ✅ Latest News
app.get("/news/latest", async (req, res) => {
  const db = await getDB();
  const NewsCollection = db.collection("newsCollection");
  const result = await NewsCollection.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();
  res.send(result);
});

// ✅ Trending News
app.get("/news/trending", async (req, res) => {
  const db = await getDB();
  const NewsCollection = db.collection("newsCollection");
  const result = await NewsCollection.find({})
    .sort({ views: -1 })
    .limit(10)
    .toArray();
  res.send(result);
});

// ✅ Export app for Vercel serverless
export default app;
