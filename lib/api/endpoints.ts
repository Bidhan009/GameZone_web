
export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        WHOAMI: '/api/auth/whoami',
        LOGOUT: '/api/auth/logout',
        UPDATEPROFILE: '/api/auth/update-profile',
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    },
    PRODUCT: {
        CREATE: '/api/products',
        GET_ALL: '/api/products',
        GET_ONE: (productId: string) => `/api/products/${productId}`,
    },
    CART: {
        GET: '/api/cart',
        ADD: '/api/cart',
        UPDATE: '/api/cart',
        REMOVE: (productId: string) => `/api/cart/${productId}`,
        CLEAR: '/api/cart',
    },
    ADMIN: {
        USER: {
            CREATE: '/api/admin/users',
            GET_ALL: '/api/admin/users',
            GET_ONE: (userId: string) => `/api/admin/users/${userId}`,
            UPDATE: (userId: string) => `/api/admin/users/${userId}`,
            DELETE: (userId: string) => `/api/admin/users/${userId}`,
        },
        PRODUCT: {
            CREATE: '/api/admin/products',
            GET_ALL: '/api/admin/products',
            GET_ONE: (productId: string) => `/api/admin/products/${productId}`,
            UPDATE: (productId: string) => `/api/admin/products/${productId}`,
            DELETE: (productId: string) => `/api/admin/products/${productId}`,
        }
    }
}