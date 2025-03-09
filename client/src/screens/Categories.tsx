import { Categories as CategoriesComponent } from "@/components/Categories";
import { Layout } from "@/components/Layout";
import { Container } from "@/components/Container";

export function Categories() {
  return (
    <Layout>
      <Container className="flex-auto">
        <div className="py-2">
          <CategoriesComponent />
        </div>
      </Container>
    </Layout>
  );
}