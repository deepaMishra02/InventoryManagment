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
import { getCustomers } from "api/customers";
import { deleteCustomer } from "api/customers";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

import { createCustomer,updateCustomer } from "api/customers";
// Data
import authorsTableData from "layouts/customers/data/authorsTableData";

function Customers() {
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
      const response = await getCustomers();

      console.log("Customers API Response:", response);

      setProducts(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };
  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      email: product.email || "",
      phone: product.phone || "",
      address: product.address || "",
    });

    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    try {
      await deleteCustomer(id);

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );

      setSnackbar({
          open: true,
          message: "Customer deleted successfully",
          severity: "success",
        });
    } catch (error) {
      console.error(error);
      setSnackbar({
          open: true,
          message: "Failed to delete customer",
          severity: "error",
        });
    }
  };

  const { columns, rows } = authorsTableData(products,handleEdit,handleDelete);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const handleOpenModal = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
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
    // Check duplicate email
    const emailExists = products.some(
      (customer) =>
        customer.email?.toLowerCase() === formData.email.toLowerCase() &&
        customer.id !== editingProduct?.id
    );

    if (emailExists) {
      setSnackbar({
        open: true,
        message: "Email already exists",
        severity: "error",
      });
      return;
    }

    if (editingProduct) {
      await updateCustomer(editingProduct.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });

      setSnackbar({
        open: true,
        message: "Customer updated successfully",
        severity: "success",
      });
    } else {
      await createCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });

      setSnackbar({
        open: true,
        message: "Customer created successfully",
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
        ? "Failed to update customer"
        : "Failed to create customer",
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
      <DialogTitle>{editingProduct ? "Edit Customer" : "Add New Customer"}</DialogTitle>

      <DialogContent>

        <TextField
          fullWidth
          margin="normal"
          label="Customer Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="E-mail"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Phone Number"
          name="phone"
          type="number"
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Address"
          name="address"
          type="text"
          value={formData.address}
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
                  All Customers
                </MDTypography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleOpenModal}
                  sx={{ ml: "auto", display: "block" }}
                >
                  New Customer
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

export default Customers;
