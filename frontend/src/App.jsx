import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Roadmap from "./components/Roadmap";
import Services from "./components/Services";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { useEffect } from "react";
import GetStarted from "./pages/GetStarted";
import AddProduct from "./pages/AddProducts";
import ViewProducts from "./pages/ViewProduct";




const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") {
      navigate("/"); // Redirect to home page on refresh
    }
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Benefits />
              <Services />
              <Roadmap />
              <ButtonGradient />
            </>
          }
        />

        {/* <Route path="/" element={<Header />} /> */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/view-products" element={<ViewProducts />} />
        {/* Add other routes as needed */}
      </Routes>
      <Footer />
    </>
  );
};

export default App;
