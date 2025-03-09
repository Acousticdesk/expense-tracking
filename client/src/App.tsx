import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AddCategory } from "./components/AddCategory";
import { CategoryDetails } from "./screens/CategoryDetails";
import { NotFound } from "./screens/NotFound";
import { AddTransaction } from "./screens/AddTransaction";
import { Categories } from "./screens/Categories";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddTransaction />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/categories" element={<Categories />} />
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
