import { Category } from "./categories.service";

interface Transaction {
  id: number;
  title: string;
  amount: number;
}

interface FetchTransactionsResponse {
  transactions: Transaction[];
}

interface PostTransactionsPayload {
  title?: string;
  amount: string;
}

export async function fetchTransactions(categoryId: Category["id"]) {
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/categories/${categoryId}/transactions`).then(
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

export function getTransactionsFromFetchTransactionsResponse(
  response: FetchTransactionsResponse,
) {
  return response.transactions;
}

export async function postTransactions(payload: PostTransactionsPayload) {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/transactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to add transaction");
  }

  return response.json() as Promise<Transaction>;
}
