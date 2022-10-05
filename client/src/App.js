import './App.scss';
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import { Login, Register } from './components/Login/index';
import { Dashboard } from './components/Dashboard/index';

function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
