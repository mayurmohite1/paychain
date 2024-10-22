import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Roadmap from "./components/Roadmap";
import Services from "./components/Services";
import { Routes, Route, useLocation } from "react-router-dom";
import {LoginForm} from "./components/LoginForm";
import {RegisterForm} from "./components/RegisterForm";
import { useEffect } from "react";
const App = () => {
  const location = useLocation();

  // Scroll to the top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Benefits />
        <Services />
        <Roadmap />
        <Footer />
        {/* Only show the landing page components when not on login/register pages */}
        {/* {location.pathname !== "/login" && location.pathname !== "/register" && (
          <>
            <Hero />
            <Benefits />
            <Collaboration />
            <Services />
            <Pricing />
            <Roadmap />
            <Footer />
            <ButtonGradient />
          </>
        )} */}
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Benefits />
              <Services />
              <Roadmap />
              <Footer />
            </>
          }
        />

        {/* <Route path="/" element={<Header />} /> */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        {/* Add other routes as needed */}
      </Routes>

      <ButtonGradient />
    </>
  );
};

export default App;
