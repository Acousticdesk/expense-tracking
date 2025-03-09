import { Transactions } from "@/components/Transactions";
import { Layout, Container } from "lucide-react";

export function CategoryDetails() {
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