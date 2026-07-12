import { Config } from 'ziggy-js';

export interface Role {
    id: number;
    name: 'super_admin' | 'warehouse_admin' | 'branch_admin' | 'manager';
    display_name: string;
    description?: string;
}

export interface Branch {
    id: number;
    name: string;
    city: string;
    address: string;
    phone: string;
    email?: string;
    is_active: boolean;
    users_count?: number;
    total_stock?: number;
    created_at?: string;
    updated_at?: string;
}

export interface CentralInventory {
    id: number;
    product_id: number;
    quantity: number;
    product?: Product;
}

export interface BranchInventory {
    id: number;
    branch_id: number;
    product_id: number;
    current_stock: number;
    minimum_stock: number;
    reserved_stock: number;
    branch?: Branch;
    product?: Product;
}

export interface Product {
    id: number;
    sku: string;
    barcode: string;
    name: string;
    brand: string;
    category: 'frame' | 'lens' | 'accessory' | 'package';
    frame_type?: 'full_frame' | 'half_frame' | 'rimless';
    frame_color?: string;
    lens_type?: 'single_vision' | 'bifocal' | 'progressive' | 'photochromic';
    selling_price: number;
    cost_price: number;
    formatted_selling_price?: string;
    formatted_cost_price?: string;
    description?: string;
    image_path?: string;
    is_active: boolean;
    central_inventory?: CentralInventory;
    branch_inventories?: BranchInventory[];
    total_stock?: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role_id?: number;
    branch_id?: number;
    is_active?: boolean;
    role?: Role;
    branch?: Branch;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    flash?: {
        success?: string;
        error?: string;
    };
};
