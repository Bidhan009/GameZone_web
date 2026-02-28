import axios from '../axios'
import { API } from '../endpoints'

export interface AdminOrderItem {
    product: {
        _id: string;
        name: string;
        imageUrl: string;
        price: number;
        category: string;
    };
    quantity: number;
    price: number;
}

export interface AdminOrder {
    _id: string;
    user: {
        _id: string;
        fullName: string;
        email: string;
        phone?: string;
    };
    items: AdminOrderItem[];
    totalAmount: number;
    shippingAddress: {
        street: string;
        city: string;
        zipCode: string;
    };
    status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface OrderStats {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    paidOrders: number;
    shippedOrders: number;
    completedOrders: number;
    cancelledOrders: number;
}

export const getAllAdminOrders = async (status?: string, sortBy?: string) => {
    try {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (sortBy) params.append('sortBy', sortBy);

        const response = await axios.get(API.ADMIN.ORDER.GET_ALL, { params });
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch orders');
    }
};

export const getAdminOrderById = async (orderId: string) => {
    try {
        const response = await axios.get(API.ADMIN.ORDER.GET_ONE(orderId));
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch order');
    }
};

export const getOrderStats = async () => {
    try {
        const response = await axios.get(`${API.ADMIN.ORDER.GET_ALL}/stats`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch order stats');
    }
};

//Added code
export const updateAdminOrderStatus = async (
    orderId: string,
    status: AdminOrder["status"]
): Promise<AdminOrder> => {
    try {
        const response = await axios.put<{ success: boolean; data: AdminOrder }>(
            API.ADMIN.ORDER.UPDATE_STATUS(orderId),
            { status }
        );

        return response.data.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Failed to update order status"
        );
    }
};