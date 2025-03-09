import { Categories } from "@/components/Categories";
import { Layout, Container } from "lucide-react";

export function Home() {
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