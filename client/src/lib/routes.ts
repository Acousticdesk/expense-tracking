export function getCategoryDetailsRoute(categoryId: number | string) {
  return `/categories/${categoryId}`;
}

export function getAddCategoryRoute() {
  return `/add-category`;
}

export function getAddTransactionRoute(categoryId: number | string) {
  return `/categoties/${categoryId}/add-transaction`;
}
