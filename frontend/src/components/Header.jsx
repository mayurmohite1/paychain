import { useLocation, Link } from "react-router-dom";
import { enablePageScroll } from "scroll-lock";
import { paychain } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Header = () => {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  // console.log("User in Header:", user); // ✅ Debugging to check user object



  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const location = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);


  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };





  return (
    <div className="fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm">
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="block w-[12rem] xl:mr-8" href="/">
          <img src={paychain} width={200} height={40} alt="Paychain" />
        </a>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8  lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          {location.pathname === "/get-started" ? (
            // Show only "+ Button" when on /get-started

            <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
              <appkit-button />
            </div>
          ) : (
            // Show regular navigation menu on other routes
            <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  onClick={handleClick}
                  className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                    item.url === location.hash
                      ? "z-2 lg:text-n-1"
                      : "lg:text-n-1/50"
                  } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* If logged in, show Username & Logout */}
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-white">
              {user.role} <br />({user.username})
            </span>
            <Button onClick={handleLogout} className="lg:flex text-red ">
              Logout
            </Button>
          </div>
        ) : (
          <>
            {/* ✅ Show Register & Login for guests */}
            <Link
              to="/register"
              className="hidden mr-8 text-n-1/50 hover:text-n-1 lg:block"
            >
              New account
            </Link>
            <Link to="/login">
              <Button className="hidden lg:flex">Sign in</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );

};

export default Header;


