import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "sonner";
import { HandCoins } from "lucide-react";
import { Container } from "./Container";
import { TabBar } from "./TabBar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col">
      <header className="border-b border-b-slate-950 pb-2 flex-shrink-0">
        <Container>
          <div className="flex items-center gap-x-2">
            <HandCoins />
            <Link className="text-md" to="/">
              Expense Tracking
            </Link>
          </div>
        </Container>
      </header>

      {children}

      <TabBar />
      <Toaster />
    </div>
  );
}
