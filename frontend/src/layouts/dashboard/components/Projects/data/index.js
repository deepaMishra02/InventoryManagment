import MDTypography from "components/MDTypography";

export default function data(lowStockProducts = []) {
  return {
    columns: [
      { Header: "SKU", accessor: "sku", align: "left" },
      { Header: "Name", accessor: "name", align: "left" },
      { Header: "Quantity", accessor: "quantity", align: "center" },
      { Header: "Price", accessor: "price", align: "center" },
    ],

    rows: lowStockProducts.map((product) => ({
      sku: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {product.sku}
        </MDTypography>
      ),

      name: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {product.name}
        </MDTypography>
      ),

      quantity: (
        <MDTypography
          variant="caption"
          color={product.quantity <= 2 ? "error" : "warning"}
          fontWeight="medium"
        >
          {product.quantity}
        </MDTypography>
      ),

      price: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          ₹{product.price || 0}
        </MDTypography>
      ),
    })),
  };
}