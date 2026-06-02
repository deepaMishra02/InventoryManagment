import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function data(
  customers = [],
  onEdit = () => {},
  onDelete = () => {}
) {
  return {
    columns: [
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
        Header: "E-mail",
        accessor: "email",
        Cell: ({ value }) => (
          <MDTypography variant="caption" fontWeight="medium">
            {value}
          </MDTypography>
        ),
      },

      {
        Header: "Phone",
        accessor: "phone",
        Cell: ({ value }) => (
          <MDTypography variant="caption" fontWeight="medium">
            {value}
          </MDTypography>
        ),
      },

      {
        Header: "Address",
        accessor: "address",
        Cell: ({ value }) => (
          <MDTypography variant="caption" fontWeight="medium">
            {value}
          </MDTypography>
        ),
      },

      {
        Header: "Action",
        accessor: "customer",
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

    rows: customers.map((customer) => ({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      customer,
    })),
  };
}