import {
  fetchTransactionsPerCategory,
  getTransactionAmount,
  getTransactionId,
  getTransactionsFromFetchTransactionsPerCategoryResponse,
  getTransactionTitle,
} from "@/lib/services/transactions.service";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { getAddTransactionRoute } from "@/lib/routes";
import {
  fetchCategoryById,
  getCategoryCategoryColorHash,
  getCategoryTitle,
} from "@/lib/services/categories.service";
import { CategoryColorTile } from "./CategoryColorsSelect";

export function Transactions() {
  const { categoryId } = useParams();

  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery(
    {
      queryKey: ["transactions"],
      queryFn: () =>
        // todo akicha: this validation should be a part of the categories service
        isNaN(Number(categoryId))
          ? fetchTransactionsPerCategory()
          : fetchTransactionsPerCategory(Number(categoryId)),
    },
  );

  const { data: category, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () =>
      !isNaN(Number(categoryId))
        ? fetchCategoryById(Number(categoryId))
        : undefined,
  });

  if (isTransactionsLoading || isCategoriesLoading) {
    return <p>Loading...</p>;
  }

  if (!transactionsData) {
    return null;
  }

  const transactions =
    getTransactionsFromFetchTransactionsPerCategoryResponse(transactionsData);

  return (
    <div>
      <div className="flex items-center gap-x-2">
        {category ? (
          <CategoryColorTile
            colorHash={getCategoryCategoryColorHash(category)}
          />
        ) : null}
        
        <p className="text-xl">
          {category ? getCategoryTitle(category) : "Untitled Category"}
        </p>
      </div>
      <ul className="mt-2 flex flex-col gap-y-2">
        {!transactions.length ? (
          <li>
            <p>It looks like you don't have any transactions yet</p>
          </li>
        ) : null}
        {transactions.map((transaction) => (
          <li key={getTransactionId(transaction)}>
            <p>{getTransactionTitle(transaction)}</p>
            <p>{getTransactionAmount(transaction)}</p>
          </li>
        ))}
        <li>
          <Link to={getAddTransactionRoute(categoryId as string)}>
            <Button>Add Transaction</Button>
          </Link>
        </li>
      </ul>
    </div>
  );
}
