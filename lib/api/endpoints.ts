
export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        WHOAMI: '/api/auth/whoami',
        LOGOUT: '/api/auth/logout',
        UPDATEPROFILE: '/api/auth/update-profile',
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
        MFA_SETUP: "/auth/mfa/setup",
        MFA_CONFIRM: "/auth/mfa/confirm",
        MFA_VERIFY_LOGIN: "/auth/mfa/verify-login",
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
    // Add to API object:
    ORDER: {
    CREATE: '/api/orders',
    GET_ALL: '/api/orders',
    GET_ONE: (orderId: string) => `/api/orders/${orderId}`,
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
        },
        ORDER: {
            GET_ALL: '/api/admin/orders', 
            GET_ONE: (orderId: string) => `/api/admin/orders/${orderId}`, 
            UPDATE_STATUS: (orderId: string) => `/api/admin/orders/${orderId}`,
        },
    }
}