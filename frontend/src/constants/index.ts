import { Home, ShoppingBag, Package, Heart, LayoutDashboard, Wheat, DollarSign, Users } from 'lucide-react';

export const NAVIGATION_ITEMS = {
  customer: [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/products', icon: ShoppingBag },
    { label: 'Orders', href: '/orders', icon: Package },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
  ],
  farmer: [
    { label: 'Dashboard', href: '/farmer/dashboard', icon: LayoutDashboard },
    { label: 'My Crops', href: '/farmer/crops', icon: Wheat },
    { label: 'Orders', href: '/farmer/orders', icon: Package },
    { label: 'Payments', href: '/farmer/payments', icon: DollarSign },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Products', href: '/admin/products', icon: ShoppingBag },
    { label: 'Orders', href: '/admin/orders', icon: Package },
  ],
  warehouse: [
    { label: 'Dashboard', href: '/warehouse', icon: LayoutDashboard },
    { label: 'Inventory', href: '/warehouse/inventory', icon: Package },
    { label: 'Procurement', href: '/procurement', icon: ShoppingBag },
  ]
};

export const CATEGORIES = [
  { id: '1', name: 'Vegetables', slug: 'vegetables', icon: 'Leaf' },
  { id: '2', name: 'Fruits', slug: 'fruits', icon: 'Apple' },
  { id: '3', name: 'Dairy', slug: 'dairy', icon: 'Milk' },
  { id: '4', name: 'Grains & Pulses', slug: 'grains-pulses', icon: 'Wheat' },
  { id: '5', name: 'Cooking Essentials', slug: 'cooking-essentials', icon: 'Droplet' },
  { id: '6', name: 'Organic', slug: 'organic', icon: 'Sprout' },
];

export const QUALITY_GRADES = ['Premium', 'Standard', 'Value'];

export const ORDER_STATUSES = ['placed', 'confirmed', 'picking', 'packed', 'delivery', 'delivered', 'cancelled'];

export const INDIAN_CITIES = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

export const UNITS = ['kg', 'g', 'L', 'ml', 'piece', 'bunch', 'box', 'quintal'];
