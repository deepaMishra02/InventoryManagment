import { API } from "api/main";


export const getOrders = async () => {
  const response = await API.get(`/orders`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await API.post("/orders", orderData);
  return response.data;
};

export const updateOrder = async (orderId, updatedData) => {
  const response = await API.put(`/orders/${orderId}`, updatedData);
  return response.data;
};

