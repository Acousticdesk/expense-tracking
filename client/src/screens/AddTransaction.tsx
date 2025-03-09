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

const formSchema = z.object({
  title: z.string().optional(),
  amount: z.string(),
  category_id: z.union([z.string(), z.number()]),
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
  });

  async function _handleSubmit() {
    const values = form.getValues();
    const selectedCategoryId = _categoryId || values.category_id;

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
        <div className="py-2">
          <p className="text-xl">Add Transaction</p>

          <Form {...form}>
            <form
              className="flex flex-col gap-y-2 mt-2"
              onSubmit={form.handleSubmit(_handleSubmit)}
            >
              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <Button type="submit">Add Transaction</Button>
            </form>
          </Form>
        </div>
      </Container>
    </Layout>
  );
}
