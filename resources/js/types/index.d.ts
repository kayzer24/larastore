import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;

    [key: string]: unknown;
    totalQuantity: number;
    totalPrice: number;
    miniCartItems: CartItem[];
    csrf_token: string;
    error:string;
    success:{
        message: string,
        time: number
    };
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    csrf_token: string;
    error:string;
    success:{
        message: string,
        time: number
    };
    auth: {
        user: User;
    };
    ziggy: Config & {location: string}
    totalQuantity: number;
    totalPrice: number;
    miniCartItems: CartItem[];
}

export type CartItem = {
    id: number,
    product_id: number;
    title: string;
    slug: string;
    price: number;
    quantity: number;
    option_ids: Record<string, number>;
    options: VariationTypeOption[];
    image: string;
};

export type GroupedCartItems = {
    user: User;
    items: CartItem[];
    totalPrice: number;
    totalQuantity: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;

    [key: string]: unknown; // This allows for additional properties...
}

export type Product = {
    id: number;
    title: string;
    slug: string;
    price: number;
    quantity: number;
    image: string;
    images: Image[];
    short_description: string;
    description: string;
    user: {
        id: number;
        name: string;
    };
    department: {
        id: number;
        name: string;
    };
    variationTypes: VariationType[];
    variations: Array[{
        id: number;
        variation_type_option_ids: number[];
        quantity: number;
        price: number;
    }];
};

export type PaginationProps<T> = {
    data: Array<T>;
};

export type Image = {
    id: number;
    thumb: string;
    small: string;
    large: string;
};

export type VariationTypeOption = {
    id: number;
    name: string;
    images: Image[];
    type: VariationType;
};

export type VariationType = {
    id: number;
    name: string;
    type: 'Select' | 'Radio' | 'Image';
    options: VariationTypeOption[];
};


export type OrderItem = {
    id: number;
    quantity: number;
    price: number;
    variation_type_option_ids: number[];
    product: {
        id: number;
        title: string;
        slug: string;
        description: string;
        image: string;
    };
};

export type Order = {
    id: number;
    total_price: number;
    status: string;
    create_at: string;
    vendorUser: {
        id: string,
        name: string;
        email: string;
        store_name: string;
        store_address: string;
    };
    orderItems: OrderItem[];
};
