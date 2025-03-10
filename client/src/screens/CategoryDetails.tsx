import { Transactions } from "@/components/Transactions";
import { Layout } from "@/components/Layout";
import { Container } from "@/components/Container";

export function CategoryDetails() {
  return (
    <Layout>
      <Container className="flex-auto">
        <div className="py-2">
          <Transactions />
        </div>
      </Container>
    </Layout>
  );
}