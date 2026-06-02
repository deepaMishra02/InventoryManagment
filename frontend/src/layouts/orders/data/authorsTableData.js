import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function data(
  orders = [],
  onStatusChange = () => {},
  onViewItems = () => {}
) {
  return {
    columns: [
      {
        Header: "Order ID",
        accessor: "id",
      },
      {
        Header: "Customer Name",
        accessor: "customer_name",
      },
      {
        Header: "Total Amount",
        accessor: "total_amount",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Items",
        accessor: "items",
      },
    ],

    rows: orders.map((order) => ({
      id: (
        <MDTypography variant="caption">
          #{order.id}
        </MDTypography>
      ),

      customer_name: (
        <MDTypography variant="caption">
          {order.customer_name}
        </MDTypography>
      ),

      total_amount: (
        <MDTypography variant="caption">
          ₹{order.total_amount}
        </MDTypography>
      ),

      status: (
        <Select
          size="small"
          value={order.status}
          onChange={(e) =>
            onStatusChange(order.id, e.target.value)
          }
        >
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="PROCESSING">Processing</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
          <MenuItem value="CANCELLED">Cancelled</MenuItem>
        </Select>
      ),

      items: (
        <VisibilityIcon
          style={{
            cursor: "pointer",
            color: "#1976d2",
          }}
          onClick={() => onViewItems(order)}
        />
      ),
    })),
  };
}