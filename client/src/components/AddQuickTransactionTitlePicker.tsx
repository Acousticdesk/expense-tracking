import {
  Category,
  fetchQuickTransactions,
  getQuickTransactionId,
  getQuickTransactionsFromFetchQuickTransactionsResponse,
  getQuickTransactionTitle,
} from "@/lib/services/categories.service";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface AddQuickTransactionTitlePickerProps {
  value: string;
  categoryId: Category["id"];
  onChange: (value: string) => void;
}

export function AddQuickTransactionTitlePicker({
  value,
  onChange,
  categoryId,
}: AddQuickTransactionTitlePickerProps) {
  const { data: quickTransactionsData, isLoading: isQuickTransacionsLoading } =
    useQuery({
      queryKey: ["quick-transacrtions", categoryId],
      queryFn: () => fetchQuickTransactions(categoryId),
      placeholderData: (prevData) => prevData
    });

  if (isQuickTransacionsLoading) {
    return <p className="text-sm">Loading...</p>;
  }

  if (!quickTransactionsData) {
    return null;
  }

  const quickTransactions =
    getQuickTransactionsFromFetchQuickTransactionsResponse(
      quickTransactionsData,
    );

  if (!quickTransactions?.length) {
    return null;
  }

  return (
    <ul className="flex gap-4 flex-wrap">
      {quickTransactions.map((quickTransaction) => (
        <li key={getQuickTransactionId(quickTransaction)} className="min-w-max">
          <button
            type="button"
            className={cn("py-1 px-2 rounded border border-gray-300 text-sm", {
              "bg-gray-300":
                getQuickTransactionTitle(quickTransaction) === value,
            })}
            onClick={() => onChange(getQuickTransactionTitle(quickTransaction))}
          >
            <p>{getQuickTransactionTitle(quickTransaction)}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
