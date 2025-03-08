import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Link,
  useParams,
} from "react-router-dom";
import { Container } from "./components/Container";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { postTransactions } from "./lib/services/transactions.service";
import { Categories } from "./components/Categories";
import { Transactions } from "./components/Transactions";
import { postCategories } from "./lib/services/categories.service";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <header className="border-b border-b-slate-950 pb-2">
        <Container>
          <p className="text-2xl">
            <Link to="/">Expense Tracking</Link>
          </p>
        </Container>
      </header>

      {children}

      <Toaster />
    </div>
  );
}

function Home() {
  return (
    <Layout>
      <Container>
        <div className="py-2">
          <Categories />
        </div>
      </Container>
    </Layout>
  );
}

function CategoryDetails() {
  return (
    <Layout>
      <Container>
        <div className="py-2">
          <Transactions />
        </div>
      </Container>
    </Layout>
  );
}

function NotFound() {
  return (
    <Layout>
      <Container>Sorry, we couldn&apos;t find that 🫣</Container>
    </Layout>
  );
}

const addCategoryFormSchema = z.object({
  title: z.string().optional(),
});

function AddCategory() {
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

              <Button type="submit">Add Category</Button>
            </form>
          </Form>
        </div>
      </Container>
    </Layout>
  );
}

const formSchema = z.object({
  title: z.string().optional(),
  amount: z.string(),
});

function AddTransaction() {
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
    if (!_categoryId) {
      return;
    }

    try {
      await postTransactions(_categoryId, form.getValues());
      navigate("/");
    } catch (error) {
      console.error(error);

      toast(
        "Oops... Something went wrong while adding the transaction. Please try again later.",
      );
    }
  }

  return (
    <Layout>
      <Container>
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
                      <Input {...field} type="tel" />
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route
          path="/categoties/:categoryId/add-transaction"
          element={<AddTransaction />}
        />
        <Route path="/categories/:categoryId" element={<CategoryDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
