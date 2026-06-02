// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { getOrders } from "api/orders";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

import { createOrder,updateOrder } from "api/orders";
import { getCustomers } from "api/customers";
import { getProducts } from "api/products";
// Data
import authorsTableData from "layouts/orders/data/authorsTableData";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
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
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [orderForm, setOrderForm] = useState({
    customer_id: "",
    items: [
      {
        product_id: "",
        quantity: 1,
      },
    ],
  });
  

  const fetchDropdownData = async () => {
    try {
      const customerRes = await getCustomers();
      const productRes = await getProducts();

      setCustomers(customerRes.data || []);
      setProducts(productRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDropdownData();
  }, []);

    const addItemRow = () => {
    setOrderForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product_id: "",
          quantity: 1,
        },
      ],
    }));
  };
  const removeItemRow = (index) => {
    setOrderForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };
  const handleProductChange = (
    index,
    field,
    value
  ) => {
    const items = [...orderForm.items];

    items[index][field] = value;

    setOrderForm({
      ...orderForm,
      items,
    });
  };
  const fetchOrders = async () => {
    try {
      const response = await getOrders();

      console.log("Orders API Response:", response);

      setOrders(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrder(orderId, {
        status,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      );

      setSnackbar({
        open: true,
        message: "Order status updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setSnackbar({
        open: true,
        message: "Failed to update order status",
        severity: "error",
      });
    }
  };
  const handleViewItems = (order) => {
    console.log("Order clicked:", order);

    setSelectedOrder(order);
    setOpenItemsModal(true);
  };
  const handleEdit = (order,value) => {
    setSelectedOrder(order);
    console.log("Edit requested for order:", selectedOrder, "with new status:", value);
    handleStatusChange(value);
  };
  const { columns, rows } = authorsTableData(
    orders,
    handleStatusChange,
    handleViewItems
  );
  const [openItemsModal, setOpenItemsModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const handleOpenModal = () => {
    setOrderForm({
      customer_id: "",
      items: [
        {
          product_id: "",
          quantity: 1,
        },
      ],
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
  const handleCreateOrder = async () => {
    try {
      await createOrder(orderForm);

      setSnackbar({
        open: true,
        message: "Order created successfully",
        severity: "success",
      });

      setOpenModal(false);

      fetchOrders();
    } catch (error) {
      console.error(error);

      setSnackbar({
        open: true,
        message: "Failed to create order",
        severity: "error",
      });
    }
  };
  return (
    <>
    <Dialog
      open={openModal}
      onClose={() => setOpenModal(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Create Order
      </DialogTitle>

      <DialogContent>

        <TextField
          select
          fullWidth
          margin="normal"
          label="Customer"
          value={orderForm.customer_id}
          onChange={(e) =>
            setOrderForm({
              ...orderForm,
              customer_id: e.target.value,
            })
          }
        >
          {customers.map((customer) => (
            <MenuItem
              key={customer.id}
              value={customer.id}
            >
              {customer.name}
            </MenuItem>
          ))}
        </TextField>

        {orderForm.items.map((item, index) => (
          <Grid
            container
            spacing={2}
            key={index}
            sx={{ mt: 1 }}
          >
            <Grid item xs={7}>
              <TextField
                select
                fullWidth
                label="Product"
                value={item.product_id}
                onChange={(e) =>
                  handleProductChange(
                    index,
                    "product_id",
                    e.target.value
                  )
                }
              >
                {products.map((product) => (
                  <MenuItem
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={3}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleProductChange(
                    index,
                    "quantity",
                    Number(e.target.value)
                  )
                }
              />
            </Grid>

            <Grid item xs={2}>
              <IconButton
                color="error"
                onClick={() =>
                  removeItemRow(index)
                }
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={addItemRow}
          sx={{ mt: 2 }}
        >
          Add Product
        </Button>

      </DialogContent>

      <DialogActions>
        <Button
          onClick={() =>
            setOpenModal(false)
          }
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleCreateOrder}
          style={{ backgroundColor: "#1976d2", color: "#fff" }}
        >
          Create Order
        </Button>
      </DialogActions>
    </Dialog>
    <Dialog
      open={openItemsModal}
      onClose={() => setOpenItemsModal(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Order #{selectedOrder?.id} Items
      </DialogTitle>

      <DialogContent>
        {selectedOrder?.items?.length ? (
          selectedOrder.items.map((item) => (
            <MDBox
              key={item.id}
              mb={2}
              p={2}
              border="1px solid #ddd"
              borderRadius="8px"
            >
              <MDTypography>
                Product: {item.product_name}
              </MDTypography>

              <MDTypography>
                Quantity: {item.quantity}
              </MDTypography>

              <MDTypography>
                Unit Price: ₹{item.unit_price}
              </MDTypography>

              <MDTypography>
                Subtotal: ₹{item.subtotal}
              </MDTypography>
            </MDBox>
          ))
        ) : (
          <MDTypography>
            No items found
          </MDTypography>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setOpenItemsModal(false)}
        >
          Close
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
                  All Orders
                </MDTypography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleOpenModal}
                  sx={{ ml: "auto", display: "block" }}
                >
                  New Order
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

export default Orders;
