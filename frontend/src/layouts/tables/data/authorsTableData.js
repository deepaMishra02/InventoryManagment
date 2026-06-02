import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function data(
  products = [],
  onEdit = () => {},
  onDelete = () => {}
) {
  return {
    columns: [
      {
        Header: "SKU",
        accessor: "sku",
        Cell: ({ value }) => (
          <MDTypography variant="caption" fontWeight="medium">
            {value}
          </MDTypography>
        ),
      },

      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value }) => (
          <MDTypography variant="caption" fontWeight="medium">
            {value}
          </MDTypography>
        ),
      },

      {
        Header: "Unit Price",
        accessor: "unitPrice",
        align: "center",
        Cell: ({ value }) => (
          <MDTypography variant="caption" fontWeight="medium">
            ₹{value}
          </MDTypography>
        ),
      },

      {
        Header: "Stock",
        accessor: "stock",
        align: "center",
        Cell: ({ value }) => (
          <MDTypography
            variant="caption"
            color={value <= 5 ? "error" : "success"}
            fontWeight="medium"
          >
            {value}
          </MDTypography>
        ),
      },

      {
        Header: "Action",
        accessor: "product",
        align: "center",
        Cell: ({ value }) => (
          <MDBox display="flex" justifyContent="center" gap={2}>
            <FaEdit
              style={{
                cursor: "pointer",
                color: "#1976d2",
              }}
              onClick={() => onEdit(value)}
            />

            <FaTrash
              style={{
                cursor: "pointer",
                color: "#d32f2f",
              }}
              onClick={() => onDelete(value.id)}
            />
          </MDBox>
        ),
      },
    ],

    rows: products.map((product) => ({
      sku: product.sku,
      name: product.name,
      unitPrice: product.unit_price,
      stock: product.quantity,
      product,
    })),
  };
}