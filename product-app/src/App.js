import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

const App = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "",
    price: "",
    rating: "",
    warranty_years: "",
    available: true,
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // Récupérer les produits
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Erreur lors de la récupération des produits :", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la récupération des produits.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Ajouter un produit
  const addProduct = async () => {
    try {
      await axios.post("http://localhost:3000/products", newProduct);
      fetchProducts();
      setSnackbar({
        open: true,
        message: "Produit ajouté avec succès.",
        severity: "success",
      });
      setNewProduct({
        name: "",
        type: "",
        price: "",
        rating: "",
        warranty_years: "",
        available: true,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit :", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de l'ajout du produit.",
        severity: "error",
      });
    }
  };

  // Supprimer un produit
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      fetchProducts();
      setSnackbar({
        open: true,
        message: "Produit supprimé avec succès.",
        severity: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression du produit.",
        severity: "error",
      });
    }
  };

  // Ouvrir la popup d'édition
  const openEditDialog = (product) => {
    setCurrentProduct(product);
    setOpen(true);
  };

  // Mettre à jour un produit
  const updateProduct = async () => {
    try {
      await axios.put(
        `http://localhost:3000/products/${currentProduct._id}`,
        currentProduct
      );
      fetchProducts();
      setOpen(false);
      setSnackbar({
        open: true,
        message: "Produit mis à jour avec succès.",
        severity: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit :", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la mise à jour du produit.",
        severity: "error",
      });
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ textAlign: "center", marginTop: 4 }}>
        Liste des Produits
      </Typography>

      {/* Formulaire d'ajout */}
      <Box sx={{ marginBottom: 4, textAlign: "center" }}>
        <Typography variant="h6">Ajouter un nouveau produit</Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="Nom"
              variant="outlined"
              fullWidth
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Type"
              variant="outlined"
              fullWidth
              value={newProduct.type}
              onChange={(e) =>
                setNewProduct({ ...newProduct, type: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Prix"
              variant="outlined"
              type="number"
              fullWidth
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              sx={{ height: "100%" }}
              onClick={addProduct}
            >
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Liste des produits */}
      {loading ? (
        <CircularProgress
          sx={{ display: "block", margin: "0 auto", marginTop: 4 }}
        />
      ) : (
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {product.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prix: ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Garantie: {product.warranty_years} ans
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Évaluation: {product.rating} étoiles
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Disponibilité:{" "}
                    {product.available ? "Disponible" : "Non disponible"}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    padding: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => openEditDialog(product)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Supprimer
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Popup d'édition */}
      {currentProduct && (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Modifier le produit</DialogTitle>
          <DialogContent>
            <TextField
              label="Nom"
              variant="outlined"
              fullWidth
              value={currentProduct.name}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, name: e.target.value })
              }
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Type"
              variant="outlined"
              fullWidth
              value={currentProduct.type}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, type: e.target.value })
              }
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Prix"
              variant="outlined"
              fullWidth
              type="number"
              value={currentProduct.price}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, price: e.target.value })
              }
              sx={{ marginBottom: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Annuler
            </Button>
            <Button onClick={updateProduct} color="primary">
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
