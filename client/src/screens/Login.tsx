import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";

const formSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

export function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function _handleSubmit() {}

  return (
    <div>
      <Header />
      <Container className="py-2">
        <p className="text-xl font-semibold">Login</p>

        <Form {...form}>
          <form
            className="flex flex-col gap-y-4 mt-4"
            onSubmit={form.handleSubmit(_handleSubmit)}
          >
            <FormField
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Login</Button>
          </form>
          <p className="text-sm mt-4">
            No account? <Link className="text-blue-600" to="/sign-up">Sign Up</Link>
          </p>
        </Form>
      </Container>
    </div>
  );
}
