import {
  fetchTransactions,
  getTransactionAmount,
  getTransactionId,
  getTransactionsFromFetchTransactionsResponse,
  getTransactionTitle,
} from "@/lib/services/transactions.service";
import { useQuery } from "@tanstack/react-query";

export function Transactions() {
  const { data, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
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
        {transactions.map((transaction) => (
          <li key={getTransactionId(transaction)}>
            <p>{getTransactionTitle(transaction)}</p>
            <p>{getTransactionAmount(transaction)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
