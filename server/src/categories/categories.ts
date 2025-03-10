export interface Category {
    id: number;
    title: string;
    user_id: number;
}

export function getCategoryId(category: Category) {
    return category.id;
}

export function getCategoryUserId(category: Category) {
    return category.user_id;
}