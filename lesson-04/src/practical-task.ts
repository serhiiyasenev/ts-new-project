type TransactionType = "debit" | "credit" | "refund";

interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    createdAt: Date;
}

type TransactionData = Omit<Transaction, 'id' | 'createdAt'>;
type SummaryItem = {count: number, totalAmount: number};
type TransactionSummary = Record<TransactionType, SummaryItem>;

const transactions: Transaction[] = [
    { id: 't1', type: 'debit', amount: 150, createdAt: new Date('2024-10-01') },
    { id: 't2', type: 'credit', amount: 200, createdAt: new Date('2024-10-02') },
    { id: 't3', type: 'refund', amount: 50, createdAt: new Date('2024-10-03') },
    { id: 't4', type: 'debit', amount: 100, createdAt: new Date('2024-10-04') },
    { id: 't5', type: 'credit', amount: 300, createdAt: new Date('2024-10-05') },
];

