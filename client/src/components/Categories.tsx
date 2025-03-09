import { getAddCategoryRoute, getCategoryDetailsRoute } from "@/lib/routes";
import {
  fetchCategories,
  getCategoryId,
  getCategoriesFromFetchCategoriesResponse,
  getCategoryTitle,
  getCategoryCategoryColorHash,
} from "@/lib/services/categories.service";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { CategoryColorTile } from "./CategoryColorsSelect";

// todo akicha: most likely, we need to call this component expenses
export function Categories() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return null;
  }

  const categories = getCategoriesFromFetchCategoriesResponse(data);

  return (
    <div>
      <section>
        <p className="text-xl">Expenses</p>
        <p className="text-sm mt-2">1150 CAD</p>
      </section>

      <section className="mt-4">
        <p className="text-xl">Categories</p>

        <ul className="mt-4 flex flex-col gap-y-2">
          {!categories.length ? (
            <li>
              <p>It looks like you don't have any categories yet</p>
            </li>
          ) : null}
          {categories.length
            ? categories.map((category) => (
                <li key={getCategoryId(category)}>
                  <p>
                    <Link
                      className="flex items-center gap-x-2 text-sm"
                      to={getCategoryDetailsRoute(getCategoryId(category))}
                    >
                      <CategoryColorTile
                        colorHash={getCategoryCategoryColorHash(category)}
                      />
                      {getCategoryTitle(category)}
                    </Link>
                  </p>
                </li>
              ))
            : null}
          <li className="mt-2">
            <Link to={getAddCategoryRoute()}>
              <Button>Add Category</Button>
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
