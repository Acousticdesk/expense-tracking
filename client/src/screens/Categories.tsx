import { ChevronLeft, ChevronRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { getAddCategoryRoute, getCategoryDetailsRoute } from "@/lib/routes";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CategoryColorTile } from "../components/CategoryColorsSelect";
import { useState } from "react";
import { startOfMonth, endOfMonth, addMonths, format } from "date-fns";
import {
  fetchTransactions,
  getCategorySplitCategoryTitle,
  getTotalFromFetchTransactionsResponse,
  getCategoriesSplitFromFetchTransactionsResponse,
  getCategorySplitCategoryId,
  getCategorySplitCategorySum,
  getCategorySplitCategoryColorHash,
} from "@/lib/services/transactions.service";

const CURRENCY = "CAD";

// todo akicha: mostl likely, this screen will be called Expenses
export function Categories() {
  const [selectedMonth, setSelectedMonth] = useState(0);

  const dateRange = [
    startOfMonth(addMonths(new Date(), selectedMonth)).getTime(),
    endOfMonth(addMonths(new Date(), selectedMonth)).getTime(),
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", dateRange[0], dateRange[1]],
    queryFn: () =>
      fetchTransactions({ startDate: dateRange[0], endDate: dateRange[1] }),
  });

  const total = data ? getTotalFromFetchTransactionsResponse(data) : undefined;
  const categoriesSplit = data
    ? getCategoriesSplitFromFetchTransactionsResponse(data)
    : undefined;

  return (
    <Layout>
      <Container className="flex-auto">
        <div className="py-2">
          <div className="flex items-center justify-between">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => setSelectedMonth((state) => state - 1)}
            >
              <ChevronLeft />
            </Button>
            <p className="text-sm">
              {format(addMonths(new Date(), selectedMonth), "LLLL y")}
            </p>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => setSelectedMonth((state) => state + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
          <div className="mt-4">
            <div>
              <section>
                <p className="text-xl">Expenses</p>
                {/* todo akicha: provide a way to select currency */}
                <p className="text-sm mt-2">
                  {total ? `${total} ${CURRENCY}` : "No expenses yet"}
                </p>
              </section>

              <section className="mt-4">
                <p className="text-xl">Categories</p>

                <ul className="mt-4 flex flex-col gap-y-4">
                  {isLoading ? (
                    <li>
                      <p className="text=sm">Loading...</p>
                    </li>
                  ) : null}
                  {!isLoading && !categoriesSplit?.length ? (
                    <li>
                      <p className="text-sm">
                        It looks like you don't have any categories yet
                      </p>
                    </li>
                  ) : null}
                  {categoriesSplit?.length
                    ? categoriesSplit.map((categorySplit) => (
                        <li key={getCategorySplitCategoryTitle(categorySplit)}>
                          <Link
                            className="flex items-center gap-x-2 text-sm justify-between relative"
                            to={getCategoryDetailsRoute(
                              getCategorySplitCategoryId(categorySplit),
                            )}
                          >
                            <span
                              className="absolute left-0 inset-y-0 opacity-15"
                              style={{
                                backgroundColor:
                                  getCategorySplitCategoryColorHash(
                                    categorySplit,
                                  ),
                                width: total
                                  ? `${(getCategorySplitCategorySum(categorySplit) / total) * 100}%`
                                  : "0px",
                              }}
                            ></span>
                            <span className="flex items-center gap-x-2">
                              <CategoryColorTile
                                colorHash={getCategorySplitCategoryColorHash(
                                  categorySplit,
                                )}
                              />
                              {getCategorySplitCategoryTitle(categorySplit)}
                            </span>
                            <span>
                              {getCategorySplitCategorySum(categorySplit)}{" "}
                              {CURRENCY}
                            </span>
                          </Link>
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
          </div>
        </div>
      </Container>
    </Layout>
  );
}
