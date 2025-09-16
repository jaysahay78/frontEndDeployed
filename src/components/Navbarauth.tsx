'use client';

import { useContext, useEffect, useState } from "react";
import Logo from "@/assets/logosaas.png";
import Image from "next/image";
import MenuIcon from "@/assets/menu.svg";
import { useRouter } from "next/navigation";
import { doLogout, getCurrentUserDetail, isLoggedIn } from "@/app/(auth)";
import UserContext from "@/context/UserContext";
import { User } from "@/utils/user-service";
import Link from "next/link";

const Navbar = () => {

  const userContextData=useContext(UserContext);

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const[login, setLogin] = useState(false);
  useEffect(()=>{
    setLogin(isLoggedIn());
    setUser(getCurrentUserDetail());
  }, [login])

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout=()=>{
    doLogout(() => {
      setLogin(false);
      userContextData?.setUser({
        id: 0,
        name: "",
        email: "",
        about: "",
        roles: [],
      })
      localStorage.removeItem(`write-count-${user?.id}`);
      localStorage.removeItem(`write-limit-hit-${user?.id}`);
      router.push("/login"); // Redirect to login after logout
      });
    };

  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="py-5 px-20">
        <div className="flex items-center justify-between">
          <Image src={Logo} alt="Logo" height={40} width={40} />
          <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-violet-800 bg-clip-text absolute left-[130px]">BlogApp</span>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <MenuIcon className="w-4 h-4" />
          </button>

          {/* Navigation Menu */}
          <nav
            className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent flex-col md:flex-row md:flex items-center md:gap-6 transition-all duration-300 ${
              menuOpen ? "flex" : "hidden"
            }`}
          >
            <Link href="/" className="block md:inline-block px-4 py-2 hover:text-gray-400 hover:scale-125 transition-all ease-in-out">Explore</Link>
            <Link href="/about" className="block md:inline-block px-4 py-2 hover:text-gray-400 hover:scale-125 transition-all ease-in-out">About</Link>
            <Link href="/feed" className="block md:inline-block px-4 py-2 hover:text-gray-400 hover:scale-125 transition-all ease-in-out">Home</Link>
            <Link href="/help" className="block md:inline-block px-4 py-2 hover:text-gray-400 hover:scale-125 transition-all ease-in-out">Help</Link>

            <div className="lg:hidden w-full">
              <a href="/user/dashboard" className="flex w-auto px-4 py-2 gap-6 items-center text-black bg-white justify-center">
                My Profile
              </a>
              <button
                className="flex w-auto px-4 py-2 gap-6 items-center text-black bg-white justify-center"
                onClick={()=>router.push("/user/payment")}
              >
                Pricing
              </button>
              <button
                className="flex w-auto px-4 py-2 gap-6 items-center text-black bg-white justify-center"
                onClick={handleLogout}
              >
                Logout
              </button>
              
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative hidden md:block ml-4">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center"
              >
                <span className="text-black font-bold">{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-30">
                  <button
                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                    onClick={() => router.push("/user/dashboard")}
                  >
                    My Profile
                  </button>
                  <button
                className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                onClick={()=>router.push("/user/payment")}
              >
                Pricing
              </button>
              <button
                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
              </div>
            
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;