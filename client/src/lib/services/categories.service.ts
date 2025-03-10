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
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`, {
    headers: addAuthorizationHeader({}),
  }).then((res) => res.json()) as Promise<FetchCategoriesResponse>;
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
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/categories`,
    {
      method: "POST",
      headers: addAuthorizationHeader({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to add category");
  }

  return response.json() as Promise<Category>;
}

export async function fetchCategoryColors() {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/categories/colors`,
    {
      headers: addAuthorizationHeader({}),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch category colors");
  }

  return response.json() as Promise<FetchCategoryColorsResponse>;
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
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/categories/${categoryId}`, {
    headers: addAuthorizationHeader({}),
  }).then((res) => res.json()) as Promise<Category>;
}
