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
            stockType: typeof stockStr,
            productImage: productImage,
            productImageType: typeof productImage,
            productImageName: productImage?.name,
            productImageSize: productImage?.size
        });

        // Convert to actual numbers
        const priceNum = parseFloat(priceStr);
        const stockNum = parseInt(stockStr);
        
        console.log("Converted numbers:", { 
            price: priceNum, 
            stock: stockNum,
            priceType: typeof priceNum,
            stockType: typeof stockNum
        });

        // Always use FormData for consistency (backend expects FormData for file uploads)
        const newFormData = new FormData();
        newFormData.append('name', name);
        newFormData.append('price', priceNum.toString());
        newFormData.append('category', category);
        newFormData.append('stock', stockNum.toString());
        newFormData.append('description', description);

        // Add file if it exists and is valid
        if (productImage && productImage instanceof File && productImage.size > 0) {
            newFormData.append('productImage', productImage);
            console.log("Adding file to FormData:", productImage.name);
        } else {
            console.log("No valid file found, sending without image");
        }

        console.log("Final FormData being sent:", { 
            name: newFormData.get('name'), 
            price: newFormData.get('price'), 
            stock: newFormData.get('stock'),
            hasFile: newFormData.has('productImage'),
            fileName: (newFormData.get('productImage') as File)?.name
        });
        
        // Always send as FormData - backend multer middleware will handle it
        const response = await axios.post(API.PRODUCT.CREATE, newFormData, {
            headers: {
                // Don't set Content-Type - let axios set it automatically for FormData
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Create product failed');
    }
}

export const getProducts = async () => {
    try {
        const response = await axios.get(API.PRODUCT.GET_ALL);
        const result = response.data as any;
        
        // Add base URL to image paths if they exist
        if (result.success && result.data) {
            result.data = result.data.map((product: any) => ({
                ...product,
                imageUrl: product.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}${product.imageUrl}` : null,
                fullImageUrl: product.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}${product.imageUrl}` : null
            }));
        }
        
        return result.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Get products failed');
    }
}
