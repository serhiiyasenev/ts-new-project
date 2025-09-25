// Product interface to define product properties
interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
}

// Cart item interface to handle products in shopping cart
interface CartItem {
    product: Product;
    quantity: number;
}

type Category = 'Fruit' | 'Vegetable' | 'Dairy' | 'Bakery' | 'Meat' | 'Beverage';

// GroceryStore class to manage products and cart
class GroceryStore {
    private products: Product[] = [];
    private cart: CartItem[] = [];

    constructor() {
        // Initialize with some sample products
        this.products = [
            { id: 1, name: 'Apple', price: 0.5, category: 'Fruit', inStock: true },
            { id: 2, name: 'Bread', price: 2.0, category: 'Bakery', inStock: true },
            { id: 3, name: 'Milk', price: 3.0, category: 'Dairy', inStock: true }
        ];
    }

    addToCart(productId: number, quantity: number = 1): void {
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.inStock) {
            throw new Error('Product not available');
        }

        const existingItem = this.cart.find(item => item.product.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({ product, quantity });
        }
    }

    removeFromCart(productId: number): void {
        this.cart = this.cart.filter(item => item.product.id !== productId);
    }

    getCartTotalPrice(): number {
        return this.cart.reduce((total, item) => 
            total + (item.product.price * item.quantity), 0);
    }

    getProducts(): Product[] {
        return this.products;
    }

    getCartItems(): CartItem[] {
        return this.cart;
    }
}

function filterProductsByCategory(store: GroceryStore, category: Category): Product[] {
    return store.getProducts().filter(product => product.category === category);
}

function removeProductFromCart(store: GroceryStore, productId: number): void {
    store.removeFromCart(productId);
}

console.log('------------------------------------------------------');
const store = new GroceryStore();
store.addToCart(1, 3);
store.addToCart(2, 2);
store.addToCart(3, 1);
console.log('Cart Total:', store.getCartTotalPrice());
console.log('Cart Items:', store.getCartItems());
console.log('filterProductsByCategory Fruits:', filterProductsByCategory(store, 'Fruit'));
console.log('------------------------------------------------------');
removeProductFromCart(store, 2);
console.log('Cart Total after removal:', store.getCartTotalPrice());
console.log('Cart Items after removal:', store.getCartItems());
console.log('------------------------------------------------------');