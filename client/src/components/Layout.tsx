import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "sonner";
import { HandCoins } from "lucide-react";
import { Container } from "./Container";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div>
      <header className="border-b border-b-slate-950 pb-2">
        <Container>
          <div className="flex items-center gap-x-2">
            <HandCoins />
            <Link className="text-md" to="/">Expense Tracking</Link>
          </div>
        </Container>
      </header>

      {children}

      <Toaster />
    </div>
  );
}