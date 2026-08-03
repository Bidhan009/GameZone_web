import { promises } from 'dns';
import axios from './axios';
import { API } from './endpoints';
// import { Order } from './admin/order';


export interface CreateOrderItem {
    product: string; 
    quantity: number; 
    price : number;
}

export interface OrderItem {
    product: { _id: string; name: string; imageUrl: string; price: number; }
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    user: { _id: string; fullName: string; email: string; }  // Add this
    items: OrderItem[];
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}
// }
// export interface IPopulatedOrderItem {
//   product: {
//     _id: string;
//     name: string;
//     imageUrl: string;
//     price: number;
//   };
//   quantity: number;
//   price: number;
// }

// export interface IPopulatedOrder {
//   _id: string;
//   user: {
//     _id: string;
//     fullName: string;
//     email: string;
//   };
//   items: IPopulatedOrderItem[];
//   totalAmount: number;
//   status: string;
//   createdAt: string;
// }

// export const createOrder = async (items: CreateOrderItem[], totalAmount : number) =>{
//     try {
//         const response = await axios.post(API.ORDER.CREATE, {items, totalAmount});
//         return response.data; 
//     }catch (error: any){
//         throw new Error(error.response?.data?.message || error.message || 'Failed to place order');
//     }
// };

// export const getOrders = async(): Promise<Order[]> => {
//     try {
//         const response = await axios.get(API.ORDER.GET_ALL);
//         return response.data.data;
//     }catch(error:any){
//         throw new Error(error.response?.data?.message || error.message || 'Failed to get orders');
//     }
// };

// export const getOrderById = async(orderId: string) : Promise<Order> =>{
//     try {
//         const response = await axios.get(API.ORDER.GET_ONE(orderId));
//         return response.data.data;
//     }catch(error: any){
//         throw new Error(error.response?.data?.message || error.message || 'Failed to get order');
//     }
// }

export const cancelOrder = async (orderId: string) =>{
    try {
        const response = await axios.delete(`${API.ORDER.GET_ALL}/${orderId}`);
        return response.data; 
    }catch (error: any){
        throw new Error(error.response?.data?.message || error.message || 'Failed to cancel order');
    }
};

export const createOrder = async (payload: any) => {
  try {
    const response = await axios.post(API.ORDER.CREATE, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to place order');
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get<{ data: Order[] }>(API.ORDER.GET_ALL); 
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch orders');
  }
};

// Update the signature to accept two arguments
// use this one if it doesn't work
// export const createOrder = async (orderItems: any, totalPrice: number) => {
//   try {
//     // You'll likely still want to send them as one object to your API
//     const response = await axios.post(API.ORDER.CREATE, { orderItems, totalPrice });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || error.message || 'Failed to place order');
//   }
// };