import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "sonner";
import { Container } from "./Container";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div>
      <header className="border-b border-b-slate-950 pb-2">
        <Container>
          <p className="text-2xl">
            <Link to="/">Expense Tracking</Link>
          </p>
        </Container>
      </header>

      {children}

      <Toaster />
    </div>
  );
}