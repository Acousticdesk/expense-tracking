import { postCategories } from "@/lib/services/categories.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "@/components/Container";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "./ui/form";
import { Input } from "./ui/input";
import { CategoryColorsSelect } from "./CategoryColorsSelect";

const addCategoryFormSchema = z.object({
  title: z.string().optional(),
});

export function AddCategory() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof addCategoryFormSchema>>({
    resolver: zodResolver(addCategoryFormSchema),
  });

  async function _handleSubmit() {
    try {
      await postCategories(form.getValues());
      navigate("/");
    } catch (error) {
      console.error(error);

      toast(
        "Oops... Something went wrong while adding the category. Please try again later.",
      );
    }
  }

  return (
    <Layout>
      <Container>
        <div className="py-2">
          <p className="text-xl">Add Category</p>

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
                name="color_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Color</FormLabel>
                    <FormControl>
                      <CategoryColorsSelect {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Add Category</Button>
            </form>
          </Form>
        </div>
      </Container>
    </Layout>
  );
}
