import { BrowserRouter, Route, Routes } from "react-router-dom";
import Customer from "../pages/Customer";


const AppRouter = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Customer />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AppRouter;
