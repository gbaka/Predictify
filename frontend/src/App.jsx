import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Wiki from "./pages/Wiki";
import Home from "./pages/Home";
import Forecast from "./pages/Forecasting";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/forecast" element={<Forecast />} />
        </Routes>
      </Header>
      <Footer />
    </Router>
  );
}

export default App;
