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
  const response = await axios.get<FetchCategoriesResponse>(`/categories`, {
    headers: addAuthorizationHeader({}),
  });

  return response.data;
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
  const response = await axios.post<Category>(`/categories`, payload, {
    headers: addAuthorizationHeader({
      "Content-Type": "application/json",
    }),
  });

  return response.data;
}

export async function fetchCategoryColors() {
  const response = await axios.get<FetchCategoryColorsResponse>(
    `/categories/colors`,
    {
      headers: addAuthorizationHeader({}),
    },
  );

  return response.data;
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
  const response = await axios.get<Category>(`/categories/${categoryId}`, {
    headers: addAuthorizationHeader({}),
  });

  return response.data;
}
