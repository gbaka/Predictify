import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, BookOpen, BarChart3 } from "lucide-react";
import LogoSvg from "../assets/logo4.svg?react";

const navItems = [
  { name: "Главная", path: "/", icon: Home },
  { name: "Вики", path: "/wiki", icon: BookOpen },
  { name: "Прогнозирование", path: "/forecast", icon: BarChart3 },
];

// function Logo() {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex items-center space-x-2"
//       >
//          {/* Здесь можно изменить размер */}
//         <Link to="/" className="text-2xl font-semibold tracking-wide text-white">
//           Predictify
//         </Link>
//       </motion.div>
//     );
//   }

function Logo() {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2"
      >
        <Link to="/" className="flex items-center">
          <div className="flex items-center space-x-2">
            <LogoSvg className="w-10 h-10 hover:scale-110 transition-all" />
            <span className="text-2xl md:text-2xl  font-extrabold text-white transition-all">
              Predictify
            </span>
          </div>
        </Link>
      </motion.div>
    );
  }

function Navigation() {
  return (
    <nav className="hidden md:flex space-x-10 text-lg font-normal">
  {navItems.map(({ name, path, icon: Icon }) => (
    <Link key={path} to={path} className="hover:text-gray-400 transition font-medium flex items-center space-x-2">
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
        className={`bg-gray-600 text-white rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 pr-14 ${inputClassName}`}
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
              className="bg-gray-500 text-gray-300 text-xs px-2 py-1 rounded-md"
            >
              Ctrl + K
            </motion.span>
          )}
        </AnimatePresence>
        <Search className="text-gray-400 cursor-pointer" size={18} onClick={() => searchInputRef.current.focus()} />
      </div>
    </div>
  );
}

function BurgerMenu({ menuOpen, setMenuOpen }) {
  return (
    <div className="md:hidden">
      <button
        className="text-white hover:text-gray-400 p-2 rounded-md"
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

  return (
    <>
      <header className="w-full bg-gray-800 text-white shadow-md fixed top-0 left-0 z-50 font-mono">
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
              className="md:hidden bg-gray-700 py-2 absolute w-full"
            >
              {/* Поиск в бургер-меню */}
              <div className="px-4">
                <SearchBar className="mb-2 w-full" inputClassName="bg-gray-600" />
              </div>

              {/* Разделы меню с небольшим отступом */}
              <div className="px-4">
                {navItems.map(({ name, path }) => {
                  const isActive = location.pathname === path;
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={`block py-2 pl-3 rounded-md transition font-mono mb-1 ${
                        isActive
                          ? "font-bold bg-gray-600 text-white"
                          : "text-white hover:bg-gray-600 hover:text-gray-300"
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
