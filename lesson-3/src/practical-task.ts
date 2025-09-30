// Payment types enum
enum PaymentMethod {
    CASH = 'cash',
    CREDIT_CARD = 'credit_card',
    PAYPAL = 'paypal'
}

// Interface for order details
interface OrderDetails {
    orderId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    date: Date;
}

// Function to display payment details based on payment method
function displayPaymentDetails(order: OrderDetails): void {
    const { orderId, amount, paymentMethod, date } = order;
    
    console.log(`Order ID: ${orderId}`);
    console.log(`Amount: $${amount.toFixed(2)}`);
    console.log(`Date: ${date.toLocaleDateString()}`);
    
    switch (paymentMethod) {
        case PaymentMethod.CASH:
            console.log('Payment Method: Cash');
            console.log('Please prepare exact amount for payment upon delivery');
            console.log('------------------------------------------------------');
            break;
        case PaymentMethod.CREDIT_CARD:
            console.log('Payment Method: Credit Card');
            console.log('Payment processed through secure payment gateway');
            console.log('------------------------------------------------------');
            break;
        case PaymentMethod.PAYPAL:
            console.log('Payment Method: PayPal');
            console.log('Payment processed through PayPal services');
            console.log('------------------------------------------------------');
            break;
    }
}

// Interface for payment statistics
interface PaymentStatistics {
    [PaymentMethod.CASH]: number;
    [PaymentMethod.CREDIT_CARD]: number;
    [PaymentMethod.PAYPAL]: number;
}

// Function to calculate payment statistics from orders
function getPaymentStatistics(orders: OrderDetails[]): PaymentStatistics {
    const statistics: PaymentStatistics = {
        [PaymentMethod.CASH]: 0,
        [PaymentMethod.CREDIT_CARD]: 0,
        [PaymentMethod.PAYPAL]: 0
    };

    orders.forEach(order => {
        statistics[order.paymentMethod]++;
    });

    return statistics;
}

// Example usage:
const sampleOrder1: OrderDetails = {
    orderId: "1",
    amount: 99.99,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    date: new Date()
};

const sampleOrder2: OrderDetails = {
    orderId: "2",
    amount: 99.99,
    paymentMethod: PaymentMethod.CASH,
    date: new Date()
};

const sampleOrder3: OrderDetails = {
    orderId: "3",
    amount: 99.99,
    paymentMethod: PaymentMethod.PAYPAL,
    date: new Date()
};

const sampleOrder4: OrderDetails = {
    orderId: "4",
    amount: 99.99,
    paymentMethod: PaymentMethod.PAYPAL,
    date: new Date()
};


displayPaymentDetails(sampleOrder1);
displayPaymentDetails(sampleOrder2);
displayPaymentDetails(sampleOrder3);
displayPaymentDetails(sampleOrder4);

// Combine all orders into one array for statistics
const allOrders: OrderDetails[] = [
    sampleOrder1,
    sampleOrder2,
    sampleOrder3,
    sampleOrder4
];

// Get and display payment statistics for all orders
const statistics = getPaymentStatistics(allOrders);
console.log('\nPayment Statistics:');
console.log(`Credit Card: ${statistics[PaymentMethod.CREDIT_CARD]}`);
console.log(`PayPal: ${statistics[PaymentMethod.PAYPAL]}`);
console.log(`Cash: ${statistics[PaymentMethod.CASH]}`);