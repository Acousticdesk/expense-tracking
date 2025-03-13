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
import {
  getAccessToken,
  getTokenFromPostLoginResponse,
  postLogin,
  postRegister,
  setAccessToken,
} from "@/lib/services/auth.service";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";

const formSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

export function SignUp() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function _handleSubmit() {
    const values = form.getValues();

    try {
      await postRegister(values);
      const response = await postLogin(values);
      const token = getTokenFromPostLoginResponse(response);
      setAccessToken(token);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast("Something went wrong. Please try again later.");
    }

    form.reset();
  }

  const token = getAccessToken();

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Header />
      <Container className="py-2">
        <p className="text-xl font-semibold">Create Account</p>

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
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create Account</Button>
          </form>
        </Form>
      </Container>
    </div>
  );
}
