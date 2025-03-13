import { axios } from "../axios";
import { addAuthorizationHeader } from "./auth.service";
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

export async function fetchTransactionsPerCategory(
  categoryId?: Category["id"],
) {
  const searchParams = new URLSearchParams();
  const _categoryId = categoryId || "all";

  const response = await axios.get<FetchTransactionsPerCategoryResponse>(
    `/categories/${_categoryId}/transactions?${searchParams}`,
    { headers: addAuthorizationHeader({}) },
  );

  return response.data;
}

interface CategorySplit {
  category_title: string;
  category_id: number;
  category_color_hash?: string;
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

  const response = await axios.get<FetchTransactionsResponse>(
    `/transactions?${searchParams}`,
    {
      headers: addAuthorizationHeader({}),
    },
  );

  return response.data;
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
  const response = await axios.post<Transaction>(
    `/categories/${categoryId}/transactions`,
    payload,
    {
      headers: addAuthorizationHeader({
        "Content-Type": "application/json",
      }),
    },
  );

  return response.data;
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

export function getCategorySplitCategoryColorHash(
  categorySplit: CategorySplit,
) {
  return categorySplit.category_color_hash;
}
