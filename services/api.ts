// services/api.ts
import { toast } from 'sonner';

// Types
export type Product = {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    price: number;
    regular_price: number;
    sale_price: number;
    on_sale: boolean;
    rating: number;
    stock_status: 'instock' | 'outofstock' | 'onbackorder';
    categories: {
        id: number;
        name: string;
        slug: string;
    }[];
    images: {
        id: number;
        src: string;
        alt: string;
    }[];
    attributes: {
        id: number;
        name: string;
        options: string[];
    }[];
};

export type Category = {
    id: number;
    name: string;
    slug: string;
    count: number;
    image?: {
        id: number;
        src: string;
        alt?: string;
    };
};

// WooCommerce API class
export class WooCommerceAPI {
    private baseUrl = 'https://cwpteam.ntplstaging.com/Ragu/gr/wp-json/wc/v3';
    private consumerKey = 'ck_25a8e42e323ca3a4c33ecd4f874da839a31003cc';
    private consumerSecret = 'cs_62eb78db76686cc76d86f4665167ce756c95db98';

private async fetchWithAuth(endpoint: string, params: Record<string, any> = {}) {
    try {
        // Add per_page=100 by default to fetch all products
        if (!params.per_page) params.per_page = 100;

        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) query.append(key, String(value));
        });

        const url = `${this.baseUrl}${endpoint}?${query.toString()}`;

        const response = await fetch(url, {
            headers: {
                Authorization:
                    "Basic " + Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString("base64"),
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return (await response.json()) as any;
    } catch (error) {
        console.error('WooCommerce API error:', error);
        toast.error('Failed to fetch data from WooCommerce');
        return null;
    }
}


    // Get all products with optional filters
    async getProducts(filters: Record<string, any> = {}): Promise<Product[]> {
        const data = await this.fetchWithAuth('/products', filters);
        return data || [];
    }

    // Get single product by ID
    async getProduct(id: number): Promise<Product | null> {
        const data = await this.fetchWithAuth(`/products/${id}`);
        return data || null;
    }

    // Get all categories
    async getCategories(): Promise<Category[]> {
        const data = await this.fetchWithAuth('/products/categories');
        if (!data) return [];

        return data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            count: cat.count,
            image: cat.image ? { id: cat.image.id, src: cat.image.src, alt: cat.image.alt } : undefined
        }));
    }

    // Get featured products
    async getFeaturedProducts(): Promise<Product[]> {
        const data = await this.fetchWithAuth('/products', { featured: true });
        return data || [];
    }
}

// Singleton instance
export const wooCommerceAPI = new WooCommerceAPI();

// export class WooCommerceAPI {
//   private async fetchAPI(endpoint: string, params: Record<string, any> = {}) {
//     const query = new URLSearchParams(params).toString();
//     const res = await fetch(`/api/products${endpoint}${query ? `?${query}` : ""}`);
//     if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
//     return res.json();
//   }

//   getProducts(filters: Record<string, any> = {}) {
//     return this.fetchAPI("", filters); // → /api/products
//   }

//   getProduct(id: number) {
//     return this.fetchAPI(`/${id}`); // → /api/products/:id
//   }

//   getCategories() {
//     return this.fetchAPI("/categories"); // → /api/products/categories
//   }

//   getFeaturedProducts() {
//     return this.fetchAPI("", { featured: true }); // → /api/products?featured=true
//   }
// }

// export const wooCommerceAPI = new WooCommerceAPI();

