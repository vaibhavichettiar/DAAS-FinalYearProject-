import './App.scss';
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import { Login,Register } from './components/Login/index';
import Home from './components/Home/home';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/register" element={<Register/>}/>
          <Route path="/home" element={<Home/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
