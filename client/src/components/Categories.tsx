import { getAddCategoryRoute, getCategoryDetailsRoute } from "@/lib/routes";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { CategoryColorTile } from "./CategoryColorsSelect";
import { useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import {
  fetchTransactions,
  getCategorySplitCategoryTitle,
  getTotalFromFetchTransactionsResponse,
  getCategoriesSplitFromFetchTransactionsResponse,
  getCategorySplitCategoryId,
  getCategorySplitCategorySum,
} from "@/lib/services/transactions.service";

const CURRENCY = "CAD";

// todo akicha: most likely, we need to call this component expenses
export function Categories() {
  const [dateRange] = useState([
    startOfMonth(new Date()).getTime(),
    endOfMonth(new Date()).getTime(),
  ]);

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", dateRange[0], dateRange[1]],
    queryFn: () =>
      fetchTransactions({ startDate: dateRange[0], endDate: dateRange[1] }),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return null;
  }

  const total = getTotalFromFetchTransactionsResponse(data);
  const categoriesSplit = getCategoriesSplitFromFetchTransactionsResponse(data);

  return (
    <div>
      <section>
        <p className="text-xl">Expenses</p>
        {/* todo akicha: provide a way to select currency */}
        <p className="text-sm mt-2">{total} {CURRENCY}</p>
      </section>

      <section className="mt-4">
        <p className="text-xl">Categories</p>

        <ul className="mt-4 flex flex-col gap-y-2">
          {!categoriesSplit.length ? (
            <li>
              <p>It looks like you don't have any categories yet</p>
            </li>
          ) : null}
          {categoriesSplit.length
            ? categoriesSplit.map((categorySplit) => (
                <li key={getCategorySplitCategoryTitle(categorySplit)}>
                  <p>
                    <Link
                      className="flex items-center gap-x-2 text-sm justify-between"
                      to={getCategoryDetailsRoute(
                        getCategorySplitCategoryId(categorySplit),
                      )}
                    >
                      <span className="flex items-center gap-x-2">
                        {/* todo akicha: provide the actual color of the category here */}
                        <CategoryColorTile />
                        {getCategorySplitCategoryTitle(categorySplit)}
                      </span>
                      <span>{getCategorySplitCategorySum(categorySplit)} {CURRENCY}</span>
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
