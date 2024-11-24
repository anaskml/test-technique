const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "productsDB";

let db;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connexion à MongoDB réussie");
    db = client.db(DB_NAME);

    app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Erreur de connexion à MongoDB :", err));

// CRUD Routes

// 1. Récupérer tous les produits
app.get("/products", async (req, res) => {
  try {
    const products = await db.collection("products").find().toArray();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des produits" });
  }
});

// 2. Ajouter un produit
app.post("/products", async (req, res) => {
  const product = req.body;
  try {
    const result = await db.collection("products").insertOne(product);
    res.status(201).json({ message: "Produit ajouté", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout du produit" });
  }
});

// 3. Mettre à jour un produit
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;
  try {
    const result = await db
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedProduct });
    if (result.matchedCount > 0) {
      res.status(200).json({ message: "Produit mis à jour" });
    } else {
      res.status(404).json({ error: "Produit non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du produit" });
  }
});

// 4. Supprimer un produit
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Produit supprimé" });
    } else {
      res.status(404).json({ error: "Produit non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du produit" });
  }
});
