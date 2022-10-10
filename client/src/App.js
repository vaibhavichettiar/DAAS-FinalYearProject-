import './App.css';
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Login, Register } from './components/Login/index';
import Dashboard from './components/Dashboard/dashboard';

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
