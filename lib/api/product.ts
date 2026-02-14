import axios from "./axios";
import { API } from "./endpoints";

export const createProduct = async (formData: FormData) => {
    try {
        // Extract FormData values
        const name = formData.get('name') as string;
        const priceStr = formData.get('price') as string;
        const stockStr = formData.get('stock') as string;
        const category = formData.get('category') as string;
        const description = formData.get('description') as string;
        const productImage = formData.get('productImage') as File;

        console.log("Original FormData:", { 
            price: priceStr, 
            stock: stockStr,
            priceType: typeof priceStr,
            stockType: typeof stockStr
        });

        // Convert and format properly
        const priceNum = parseFloat(priceStr);
        const stockNum = parseInt(stockStr);
        
        // Create properly formatted strings
        const formattedPrice = isNaN(priceNum) ? "0" : priceNum.toFixed(2);
        const formattedStock = isNaN(stockNum) ? "0" : stockNum.toString();
        
        // Replace FormData values
        formData.set('price', formattedPrice);
        formData.set('stock', formattedStock);

        console.log("Formatted FormData:", { 
            price: formData.get('price'), 
            stock: formData.get('stock'),
            priceType: typeof formData.get('price'),
            stockType: typeof formData.get('stock')
        });
        
        // Do NOT set Content-Type manually for FormData with axios, it kills the boundary
        const response = await axios.post(API.PRODUCT.CREATE, formData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Create product failed');
    }
}

export const getProducts = async () => {
    try {
        const response = await axios.get(API.PRODUCT.GET_ALL);
        // The backend returns { success: true, data: [...] }
        return (response.data as any).data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Get products failed');
    }
}
