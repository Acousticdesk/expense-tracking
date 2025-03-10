import { Category } from "./categories.service";

interface Transaction {
  id: number;
  title: string;
  amount: number;
}

interface FetchTransactionsPerCategoryResponse {
  transactions: Transaction[];
}

interface PostTransactionsPayload {
  title?: string;
  amount: string;
}

export async function fetchTransactionsPerCategory(categoryId?: Category["id"]) {
  const searchParams = new URLSearchParams();
  const _categoryId = categoryId || "all";

  return fetch(
    `${import.meta.env.VITE_API_BASE_URL}/categories/${_categoryId}/transactions?${searchParams}`,
  ).then((res) => res.json()) as Promise<FetchTransactionsPerCategoryResponse>;
}

interface CategorySplit {
  category_title: string;
  category_id: number;
  sum: number;
}

interface FetchTransactionsResponse {
  total: number;
  categoriesSplit: CategorySplit[];
}

interface FetchTransactionsParams {
  startDate: number;
  endDate: number;
}

export async function fetchTransactions(params?: FetchTransactionsParams) {
  const searchParams = new URLSearchParams();

  if (params) {
    searchParams.set("start_date", String(params.startDate));
    searchParams.set("end_date", String(params.endDate));
  }

  return fetch(
    `${import.meta.env.VITE_API_BASE_URL}/transactions?${searchParams}`,
  ).then((res) => res.json()) as Promise<FetchTransactionsResponse>;
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

export function getTransactionsFromFetchTransactionsPerCategoryResponse(
  response: FetchTransactionsPerCategoryResponse,
) {
  return response.transactions;
}

export function getCategoriesSplitFromFetchTransactionsResponse(
  response: FetchTransactionsResponse,
) {
  return response.categoriesSplit;
}

export function getTotalFromFetchTransactionsResponse(
  response: FetchTransactionsResponse,
) {
  return response.total;
}

export async function postTransactions(
  categoryId: string | number,
  payload: PostTransactionsPayload,
) {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/categories/${categoryId}/transactions`,
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

export function getCategorySplitCategoryTitle(categorySplit: CategorySplit) {
  return categorySplit.category_title;
}

export function getCategorySplitCategoryId(categorySplit: CategorySplit) {
  return categorySplit.category_id;
}

export function getCategorySplitCategorySum(categorySplit: CategorySplit) {
  return categorySplit.sum;
}