
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import { getChartData } from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import { useEffect, useState } from "react";
import { getDashboardSummary } from "api/dashboard";

function Dashboard() {
  const [chartData, setChartData] = useState(null);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const sales = chartData?.sales;

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      const summary = await getDashboardSummary();

      setDashboardSummary(summary);

      const charts = getChartData(summary);
      setChartData(charts);
    };
    setLoading(true);
    try{
      fetchDashboardSummary();
    }
    catch (error){
      console.error(error);
    }
    finally{
      setLoading(false);
    }
    
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Total Products"
                count={dashboardSummary?.total_products ?? 0}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Total customers"
                count={dashboardSummary?.total_customers ?? 0}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Total orders"
                count={dashboardSummary?.total_orders ?? 0}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Low stock products"
                count={dashboardSummary?.low_stock_count ?? 0}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={7}>
              <Projects
                lowStockProducts={dashboardSummary?.low_stock_products || []}
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={5}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Last 7 Days Orders"
                  date="updated 4 min ago"
                  chart={sales || { labels: [], datasets: { label: "", data: [] } }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
