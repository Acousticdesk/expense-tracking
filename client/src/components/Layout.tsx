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
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-b-slate-950 py-2 flex-shrink-0">
        <Container>
          <Link className="text-md flex items-center gap-x-2" to="/">
            <HandCoins />
            Expense Tracking
          </Link>
        </Container>
      </header>

      {children}

      <TabBar />
      <Toaster />
    </div>
  );
}
