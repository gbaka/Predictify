import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Home, BookOpen, BarChart3 } from "lucide-react";

const navItems = [
  { name: "Главная", path: "/", icon: Home },
  { name: "Вики", path: "/wiki", icon: BookOpen },
  { name: "Прогнозирование", path: "/forecast", icon: BarChart3 },
];

function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-2xl font-bold tracking-wide"
    >
      <Link to="/">ForecastFlow</Link>
    </motion.div>
  );
}

function Navigation() {
  return (
    <nav className="hidden md:flex space-x-8 text-lg">
      {navItems.map(({ name, path, icon: Icon }) => (
        <Link key={path} to={path} className="hover:text-gray-400 transition font-semibold flex items-center space-x-2">
          <Icon size={20} />
          <span>{name}</span>
        </Link>
      ))}
    </nav>
  );
}

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

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
    <div className="hidden md:flex items-center relative max-w-[12rem] md:max-w-[14rem] lg:max-w-[16rem]">
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Поиск..."
        className="bg-gray-800 text-white rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 pr-14"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="absolute right-3 flex items-center space-x-2">
        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-md hidden md:inline">Ctrl + K</span>
        <Search className="text-gray-400 cursor-pointer" size={18} onClick={() => searchInputRef.current.focus()} />
      </div>
    </div>
  );
}

function BurgerMenu({ menuOpen, setMenuOpen }) {
  return (
    <div className="md:hidden">
      <button
        className="text-white hover:bg-gray-700 p-2 rounded-md"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
    </div>
  );
}

export default function Header({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-gray-900 text-white shadow-md fixed top-0 left-0 z-50 font-mono">
        {/* Контейнер с гарантированными отступами */}
        <div className="w-full flex items-center justify-between py-4 px-6 gap-6">
          {/* Логотип слева */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Навигация по центру */}
          <div className="hidden md:flex flex-grow justify-center">
            <Navigation />
          </div>

          {/* Поиск и бургер-меню справа */}
          <div className="flex items-center gap-4">
            <SearchBar />
            <BurgerMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          </div>
        </div>

        {/* Мобильное меню */}
        {menuOpen && (
          <div className="md:hidden bg-gray-800 py-2 px-4 absolute w-full">
            {navItems.map(({ name, path }) => (
              <Link
                key={path}
                to={path}
                className="block py-2 text-white hover:text-gray-400"
                onClick={() => setMenuOpen(false)}
              >
                {name}
              </Link>
            ))}
          </div>
        )}
      </header>
      <main className="pt-16">{children}</main>
    </>
  );
}