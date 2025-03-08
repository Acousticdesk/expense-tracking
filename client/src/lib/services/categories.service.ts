export interface Category {
  id: number;
  title: string;
}

interface FetchCategoriesResponse {
  categories: Category[];
}

interface PostCategoriesPayload {
  title?: string;
}

export async function fetchCategories() {
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`).then(
    (res) => res.json(),
  ) as Promise<FetchCategoriesResponse>;
}

export function getCategoryId(category: Category) {
  return category.id;
}

export function getCategoryTitle(category: Category) {
  return category.title;
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to add category");
  }

  return response.json() as Promise<Category>;
}
