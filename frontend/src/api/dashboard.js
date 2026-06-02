import { API } from "api/main";

export const getDashboardSummary = async () => {
  const res = await API.get("/dashboard/summary");
  return res.data.data;
};
