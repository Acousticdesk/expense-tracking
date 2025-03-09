import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AddCategory } from "./components/AddCategory";
import { Home } from "./screens/Home";
import { CategoryDetails } from "./screens/CategoryDetails";
import { NotFound } from "./screens/NotFound";
import { AddTransaction } from "./screens/AddTransaction";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route
          path="/categoties/:categoryId/add-transaction"
          element={<AddTransaction />}
        />
        <Route path="/categories/:categoryId" element={<CategoryDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
