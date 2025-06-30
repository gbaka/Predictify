import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/shared/ScrollToTop";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Wiki from "./pages/Wiki";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import Help from "./pages/Help";
import Forecast from "./pages/Forecasting";


/**
 * Основной компонент приложения.
 * Оборачивает пути к страницам в React Router.
 */
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
