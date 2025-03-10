import { HandCoins } from "lucide-react";
import { Container } from "./Container";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b border-b-slate-950 py-2 flex-shrink-0">
      <Container>
        <Link className="text-md flex items-center gap-x-2" to="/">
          <HandCoins />
          Expense Tracking
        </Link>
      </Container>
    </header>
  );
}
