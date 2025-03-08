export interface Category {
    id: number;
    title: string;
}

export function getCategoryId(category: Category) {
    return category.id;
}