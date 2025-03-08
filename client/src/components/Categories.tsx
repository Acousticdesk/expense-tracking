import { getAddCategoryRoute, getCategoryDetailsRoute } from "@/lib/routes";
import {
  fetchCategories,
  getCategoryId,
  getCategoriesFromFetchCategoriesResponse,
  getCategoryTitle,
} from "@/lib/services/categories.service";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

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
      <p className="text-xl">Categories</p>

      <ul className="mt-2 flex flex-col gap-y-2">
        {!categories.length ? (
          <li>
            <p>It looks like you don't have any categories yet</p>
          </li>
        ) : null}
        {categories.length
          ? categories.map((category) => (
              <li key={getCategoryId(category)}>
                <p>
                  <Link to={getCategoryDetailsRoute(getCategoryId(category))}>
                    {getCategoryTitle(category)}
                  </Link>
                </p>
              </li>
            ))
          : null}
        <li>
          <Link to={getAddCategoryRoute()}>
            <Button>Add Category</Button>
          </Link>
        </li>
      </ul>
    </div>
  );
}
