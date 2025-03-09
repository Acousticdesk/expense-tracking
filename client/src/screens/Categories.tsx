import { ChevronLeft, ChevronRight } from "lucide-react";
import { Categories as CategoriesComponent } from "@/components/Categories";
import { Layout } from "@/components/Layout";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";

// todo akicha: mostl likely, this screen will be called Expenses
export function Categories() {
  return (
    <Layout>
      <Container className="flex-auto">
        <div className="py-2">
          <div className="flex items-center justify-between">
            <Button size="icon" variant="secondary">
              <ChevronLeft />
            </Button>
            <p className="text-sm">March</p>
            <Button size="icon" variant="secondary">
              <ChevronRight />
            </Button>
          </div>
          <div className="mt-4">
            <CategoriesComponent />
          </div>
        </div>
      </Container>
    </Layout>
  );
}