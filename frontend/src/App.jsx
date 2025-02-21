import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Wiki from "./pages/Wiki";
import Home from "./pages/Home";
import Forecast from "./pages/Forecasting";

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
    </Router>
  );
}

export default App;
