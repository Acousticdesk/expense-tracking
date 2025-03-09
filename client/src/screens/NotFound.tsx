import { Container } from "../components/Container";
import { Layout } from "../components/Layout";

export function NotFound() {
  return (
    <Layout>
      <Container className="flex-auto">Sorry, we couldn&apos;t find that 🫣</Container>
    </Layout>
  );
}