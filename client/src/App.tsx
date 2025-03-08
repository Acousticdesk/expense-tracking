import { Transactions } from "./components/Transactions";
import { Container } from "./components/Container";

function App() {
  return (
    <div>
      <header className="border-b border-b-slate-950 pb-2">
        <Container>
          <p className="text-2xl">Expense Tracking</p>
        </Container>
      </header>

      <Container>
        <div className="py-2">
          <Transactions />
        </div>
      </Container>
    </div>
  );
}

export default App;
