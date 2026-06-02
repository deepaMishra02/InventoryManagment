// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useEffect, useState } from "react";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { getProducts } from "api/products";
import { deleteProducts } from "api/products";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

import { createProduct,updateProduct } from "api/products";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";

function Tables() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();

      console.log("Products API Response:", response);

      setProducts(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };
  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      unit_price: product.unit_price || "",
      quantity: product.quantity || "",
    });

    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProducts(id);

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );

      setSnackbar({
          open: true,
          message: "Product deleted successfully",
          severity: "success",
        });
    } catch (error) {
      console.error(error);
      setSnackbar({
          open: true,
          message: "Failed to delete product",
          severity: "error",
        });
    }
  };

  const { columns, rows } = authorsTableData(products,handleEdit,handleDelete);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    unit_price: "",
    quantity: "",
  });
  const handleOpenModal = () => {
    setFormData({
      name: "",
      unit_price: "",
      quantity: "",
    });

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    try {

      if (editingProduct) {

        await updateProduct(editingProduct.id, {
          name: formData.name,
          unit_price: Number(formData.unit_price),
          quantity: Number(formData.quantity),
        });

        setSnackbar({
          open: true,
          message: "Product updated successfully",
          severity: "success",
        });

      } else {

        await createProduct({
          name: formData.name,
          unit_price: Number(formData.unit_price),
          quantity: Number(formData.quantity),
        });

        setSnackbar({
          open: true,
          message: "Product created successfully",
          severity: "success",
        });
      }

      handleCloseModal();
      fetchProducts();

    } catch (error) {
      console.error(error);

      setSnackbar({
        open: true,
        message: editingProduct
          ? "Failed to update product"
          : "Failed to create product",
        severity: "error",
      });
    }
  };
  return (
    <>
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>

      <DialogContent>

        <TextField
          fullWidth
          margin="normal"
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Unit Price"
          name="unit_price"
          type="number"
          value={formData.unit_price}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseModal}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{ backgroundColor: "#1976d2", color: "#fff" }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  All Products
                </MDTypography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleOpenModal}
                  sx={{ ml: "auto", display: "block" }}
                >
                  New Product
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                  canSearch
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleSnackbarClose}
        severity={snackbar.severity}
      >
        {snackbar.message}
      </MuiAlert>
    </Snackbar>
    </>
  );
}

export default Tables;
