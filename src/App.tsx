import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { CalculatorPage } from "./pages/CalculatorPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="calc/:slug" element={<CalculatorPage />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
