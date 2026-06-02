import { API } from "api/main";


export const getCustomers = async () => {
  const response = await API.get("/customers");
  return response.data;
};

export const createCustomer = async (customerData) => {
  const response = await API.post("/customers", customerData);
  return response.data;
};

export const updateCustomer = async (customerId, updatedData) => {
  const response = await API.put(`/customers/${customerId}`, updatedData);
  return response.data;
};

export const deleteCustomer = async (customerId) => {
  const response = await API.delete(`/customers/${customerId}`);
  return response.data;
};
