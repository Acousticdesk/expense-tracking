import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { postTransactions } from "@/lib/services/transactions.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layout } from "@/components/Layout";
import { Container } from "@/components/Container";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { AddTransactionCategoryPicker } from "@/components/AddTransactionCategoryPicker";
import { AddTransactionDatePicker } from "@/components/AddTransactionDatePicker";
import { AddQuickTransactionTitlePicker } from "@/components/AddQuickTransactionTitlePicker";

const formSchema = z.object({
  title: z.string().optional(),
  amount: z.string(),
  category_id: z.union([z.string(), z.number()]).optional(),
  timestamp: z.number(),
});

export function AddTransaction() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // todo akicha: this validation should be a part of the categories service
  const _categoryId = isNaN(Number(categoryId))
    ? undefined
    : Number(categoryId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "",
      timestamp: Date.now(),
    },
  });

  const categoryIdFormValue = form.watch("category_id");
  const selectedCategoryId = _categoryId || categoryIdFormValue;

  async function _handleSubmit() {
    const values = form.getValues();

    if (!selectedCategoryId) {
      console.log(
        "No category selected for the transaction. Aborting adding the transaction.",
      );
      return;
    }

    try {
      await postTransactions(selectedCategoryId, values);
      navigate("/");
    } catch (error) {
      console.error(error);

      toast(
        "Oops... Something went wrong while adding the transaction. Please try again later.",
      );
    }

    toast("Transaction added successfully.");
    form.reset();
  }

  return (
    <Layout>
      <Container className="flex-auto">
        <div className="py-4">
          <p className="text-xl">Add Transaction</p>

          <Form {...form}>
            <form
              className="flex flex-col gap-y-8 mt-4"
              onSubmit={form.handleSubmit(_handleSubmit)}
            >
              <FormField
                name="category_id"
                defaultValue={_categoryId}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <AddTransactionCategoryPicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-y-2">
                <FormField
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} className="text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedCategoryId ? (
                  <FormField
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <AddQuickTransactionTitlePicker
                            {...field}
                            categoryId={Number(selectedCategoryId)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}
              </div>

              <FormField
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" className="text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="timestamp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <AddTransactionDatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Add Transaction</Button>
            </form>
          </Form>
        </div>
      </Container>
    </Layout>
  );
}
