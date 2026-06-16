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
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import { createProduct,updateProduct } from "api/products";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import borders from "assets/theme/base/borders";

function Tables() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    try {
      const response = await getProducts();

      console.log("Products API Response:", response);

      setProducts(response.data || []);
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
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
                pt={3}
                px={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDBox display="flex" flexDirection="column">
                  <MDTypography variant="h6" color="dark" fontWeight="bold">
                    All Products
                  </MDTypography>
                  <MDTypography variant="button" color="secondary" fontWeight="regular">
                    See all details of Products
                  </MDTypography>
                </MDBox>

                <Tooltip title="Add New Product">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleOpenModal}
                    sx={{
                      minWidth: 0,
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      borders: 2,
                      p: 0,
                      "&:hover": {
                        backgroundColor: "#222",
                        color: "white !important",
                      },
                    }}
                  >
                    <Icon sx={{ fontWeight: "bold", fontSize: "1.4rem" }}>add</Icon>
                  </Button>
                </Tooltip>
              </MDBox>
              
              <MDBox>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries={true}
                  noEndBorder
                  canSearch
                  loading={loading}
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
