import {
  Category,
  fetchCategories,
  getCategoriesFromFetchCategoriesResponse,
  getCategoryCategoryColorHash,
  getCategoryId,
  getCategoryTitle,
} from "@/lib/services/categories.service";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CategoryColorTile } from "./CategoryColorsSelect";

interface AddTransactionCategoryPickerProps {
  value: Category["id"];
  onChange: (value: Category["id"]) => void;
}

// todo akicha: the user should be able to choose the top categories to be listed in this component
export function AddTransactionCategoryPicker({
  value,
  onChange,
}: AddTransactionCategoryPickerProps) {
  // todo akicha: this should be a separate hook to persist the queryKey
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useQuery(
    {
      queryKey: ["categories"],
      queryFn: fetchCategories,
    },
  );

  if (isCategoriesLoading) {
    return "Loading...";
  }

  if (!categoriesResponse) {
    return null;
  }

  const categories =
    getCategoriesFromFetchCategoriesResponse(categoriesResponse);

  if (!categories?.length) {
    return null;
  }

  return (
    <ul className="flex gap-4 flex-wrap">
      {categories.map((category) => (
        <li key={getCategoryId(category)} className="min-w-max">
          <button
            type="button"
            className={cn("py-1 px-2 rounded border border-gray-300 text-sm", {
              "bg-gray-300": getCategoryId(category) === value,
            })}
            onClick={() => onChange(getCategoryId(category))}
          >
            <div className="flex items-center gap-x-2">
              <CategoryColorTile colorHash={getCategoryCategoryColorHash(category)} />
              <p>{getCategoryTitle(category)}</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
