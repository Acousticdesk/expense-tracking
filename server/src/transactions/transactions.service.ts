export interface Transaction {
    id: number;
    title: string;
    amount: number;
    timestamp: string;
}

export function getTransactionId(transaction: Transaction) {
    return transaction.id;
}