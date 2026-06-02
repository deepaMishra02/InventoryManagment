export const getChartData = (dashboardData) => {
  const data = dashboardData; // ✅ IMPORTANT FIX
  console.log("Dashboard data received in getChartData:", dashboardData); // Debugging log
  const orders = data?.last_7_days_orders;

  return {
    sales: {
      labels: orders?.labels || [],
      datasets: {
        label: "Orders",
        data: orders?.values || [],
      },
    },
  };
};
