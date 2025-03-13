import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AddCategory } from "./components/AddCategory";
import { CategoryDetails } from "./screens/CategoryDetails";
import { NotFound } from "./screens/NotFound";
import { AddTransaction } from "./screens/AddTransaction";
import { Categories } from "./screens/Categories";
import { Login } from "./screens/Login";
import { RequireToken } from "./components/RequireToken";
import { SignUp } from "./screens/SignUp";
import { Settings } from "./screens/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RequireToken />}>
          <Route path="/" element={<AddTransaction />} />
        </Route>

        <Route element={<RequireToken />}>
          <Route path="/add-category" element={<AddCategory />} />
        </Route>

        <Route element={<RequireToken />}>
          <Route path="/categories" element={<Categories />} />
        </Route>

        <Route element={<RequireToken />}>
          <Route
            path="/categoties/:categoryId/add-transaction"
            element={<AddTransaction />}
          />
        </Route>

        <Route element={<RequireToken />}>
          <Route path="/categories/:categoryId" element={<CategoryDetails />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
