import { API } from "api/main";


export const getProducts = async () => {
  const response = await API.get("/products");
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await API.post("/products", productData);
  return response.data;
};

export const updateProduct = async (productId, updatedData) => {
  const response = await API.put(`/products/${productId}`, updatedData);
  return response.data;
};

export const deleteProducts = async (productId) => {
  const response = await API.delete(`/products/${productId}`);
  return response.data;
};
