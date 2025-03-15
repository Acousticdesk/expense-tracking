import { axios } from "../axios";
import { addAuthorizationHeader } from "./auth.service";

export interface Category {
  id: number;
  title: string;
  color_hash?: string;
  color_id?: number;
}

interface FetchCategoriesResponse {
  categories: Category[];
}

interface CategoryColor {
  id: number;
  hash: string;
  name?: string;
}

interface FetchCategoryColorsResponse {
  colors: CategoryColor[];
}

interface PostCategoriesPayload {
  title?: string;
}

export async function fetchCategories() {
  const { data } = await axios.get<FetchCategoriesResponse>(`/categories`);

  return data;
}

export function getCategoryId(category: Category) {
  return category.id;
}

export function getCategoryTitle(category: Category) {
  return category.title;
}

export function getCategoryCategoryColorHash(category: Category) {
  return category.color_hash;
}

export function getCategoryCategoryColorId(category: Category) {
  return category.color_id;
}

export function getCategoriesFromFetchCategoriesResponse(
  response: FetchCategoriesResponse,
) {
  return response.categories;
}

export async function postCategories(payload: PostCategoriesPayload) {
  const { data } = await axios.post<Category>(`/categories`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
}

export async function fetchCategoryColors() {
  const { data } = await axios.get<FetchCategoryColorsResponse>(
    `/categories/colors`,
    {
      headers: addAuthorizationHeader({}),
    },
  );

  return data;
}

export function getCategoryColorsFromFetchCategoryColorsResponse(
  response: FetchCategoryColorsResponse,
) {
  return response.colors;
}

export function getCategoryColorHash(categoryColor: CategoryColor) {
  return categoryColor.hash;
}

export function getCategoryColorName(categoryColor: CategoryColor) {
  return categoryColor.name;
}

export function getCategoryColorId(categoryColor: CategoryColor) {
  return categoryColor.id;
}

export async function fetchCategoryById(categoryId: Category["id"]) {
  const { data } = await axios.get<Category>(`/categories/${categoryId}`);

  return data;
}

interface QuickTransaction {
  category_id: number;
  title: string;
  id: number;
}

interface FetchQuickTransactionsResponse {
  quickTransactions: QuickTransaction[];
}

export async function fetchQuickTransactions(categoryId: Category["id"]) {
  const { data } = await axios.get(
    `/categories/${categoryId}/quick-transactions`,
  );

  return data;
}

export function getQuickTransactionsFromFetchQuickTransactionsResponse(
  response: FetchQuickTransactionsResponse,
) {
  return response.quickTransactions;
}

export function getQuickTransactionId(quickTransaction: QuickTransaction) {
  return quickTransaction.id;
}

export function getQuickTransactionTitle(quickTransaction: QuickTransaction) {
  return quickTransaction.title;
}
