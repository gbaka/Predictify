import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, BookOpen, BarChart3 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import LogoSvg from "../assets/logo4.svg?react";


const navItems = [
  { name: "Главная", path: "/", icon: Home },
  { name: "Вики", path: "/wiki", icon: BookOpen },
  { name: "Прогнозирование", path: "/forecast", icon: BarChart3 },
];

function Logo() {
  const { theme } = useTheme();

  return (
    <motion.div
  initial={{ opacity: 0, filter: "blur(10px)" }}
  animate={{ opacity: 1, filter: "blur(0px)" }}
  transition={{ duration: 0.7 }}
>
      <Link to="/" className="flex items-center">
        <div className="flex items-center space-x-2">
          <LogoSvg className="w-10 h-10 hover:scale-110 transition-all" />
          <span
            className={`text-2xl md:text-2xl font-extrabold transition-all ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Predictify
          </span>
        </div>
      </Link>
    </motion.div>
  );
}


  function Navigation() {
    const { theme } = useTheme();
  
    return (
      <nav className="hidden md:flex space-x-10 text-lg font-normal">
        {navItems.map(({ name, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`transition font-medium flex items-center space-x-2
              ${theme === "dark" ? "text-white hover:text-gray-400" : "text-gray-900 hover:text-gray-600"}`}
          >
            <Icon size={15} />
            <span>{name}</span>
          </Link>
        ))}
      </nav>
    );
  }
  
function SearchBar({ className = "", inputClassName = "" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`flex items-center relative w-full ${className}`}>
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Поиск..."
        className={`rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 pr-14
          ${theme === "dark" ? "bg-gray-800 text-white focus:ring-gray-600" : "bg-gray-100 text-black focus:ring-gray-400"} 
          ${inputClassName}`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="absolute right-3 flex items-center space-x-2">
        <AnimatePresence>
          {!searchQuery && (
            <motion.span
              key="ctrl-k"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`text-xs px-2 py-1 rounded-md 
                ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-gray-700"}`}
            >
              Ctrl + K
            </motion.span>
          )}
        </AnimatePresence>
        <Search
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} cursor-pointer`}
          size={18}
          onClick={() => searchInputRef.current.focus()}
        />
      </div>
    </div>
  );
}


function BurgerMenu({ menuOpen, setMenuOpen }) {
  const { theme } = useTheme();

  return (
    <div className="md:hidden">
      <button
        className={`p-2 rounded-md transition ${
          theme === "dark"
            ? "text-white hover:text-gray-400"
            : "text-gray-900 hover:text-gray-600"
        }`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <motion.div
          animate={menuOpen ? "open" : "closed"}
          variants={{
            open: { rotate: 90 },
            closed: { rotate: 0 },
          }}
          transition={{ duration: 0.2 }}
        >
          {menuOpen ? "✕" : "☰"}
        </motion.div>
      </button>
    </div>
  );
}

export default function Header({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <>
      <header className={`w-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} shadow-[0_2px_4px_-1px_rgba(0,0,0,0.1)] fixed top-0 left-0 z-50 font-mono`}>
        <div className="w-full flex items-center justify-between py-4 px-6 gap-6">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          <div className="hidden md:flex flex-grow justify-center">
            <Navigation />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <BurgerMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          </div>
        </div>

        <AnimatePresence>
  {menuOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`md:hidden py-2 absolute w-full shadow-[0_2px_4px_-1px_rgba(0,0,0,0.1)] ${
        theme === "dark" ? "bg-gray-700" : "bg-white border border-gray-300"
      }`}
    >
      {/* Поиск в бургер-меню */}
      <div className="px-4">
        <SearchBar
          className="mb-2 w-full"
          inputClassName={theme === "dark" ? "bg-gray-700" : "bg-gray-100 text-gray-900"}
        />
      </div>

      {/* Разделы меню */}
      <div className="px-4">
        {navItems.map(({ name, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`block py-2 pl-3 rounded-md transition font-mono mb-1 ${
                isActive
                  ? theme === "dark"
                    ? "font-bold bg-gray-600 text-white"
                    : "font-bold bg-gray-200 text-gray-900"
                  : theme === "dark"
                  ? "text-white hover:bg-gray-600 hover:text-gray-200"
                  : "text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </motion.div>
  )}
</AnimatePresence>
      </header>
      <main className="pt-16">{children}</main>
    </>
  );
}
