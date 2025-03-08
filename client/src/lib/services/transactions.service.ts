interface Transaction {
  id: number;
  title: string;
  amount: number;
}

interface FetchTransactionsResponse {
    transactions: Transaction[];
}

export async function fetchTransactions() {
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/transactions`).then(
    (res) => res.json(),
  ) as Promise<FetchTransactionsResponse>;
}

export function getTransactionId(transaction: Transaction) {
    return transaction.id;
}

export function getTransactionTitle(transaction: Transaction) {
    return transaction.title;
}

export function getTransactionAmount(transaction: Transaction) {
    return transaction.amount;
}

export function getTransactionsFromFetchTransactionsResponse(response: FetchTransactionsResponse) {
    return response.transactions;
}

