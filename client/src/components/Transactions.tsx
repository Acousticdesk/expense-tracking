import {
  fetchTransactions,
  getTransactionAmount,
  getTransactionId,
  getTransactionsFromFetchTransactionsResponse,
  getTransactionTitle,
} from "@/lib/services/transactions.service";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { getAddTransactionRoute } from "@/lib/routes";

export function Transactions() {
  const { categoryId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () =>
      isNaN(Number(categoryId))
        ? undefined
        : fetchTransactions(Number(categoryId)),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return null;
  }

  const transactions = getTransactionsFromFetchTransactionsResponse(data);

  return (
    <div>
      <p className="text-xl">Transactions</p>
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
          <Link to={getAddTransactionRoute()}>
            <Button>Add Transaction</Button>
          </Link>
        </li>
      </ul>
    </div>
  );
}
