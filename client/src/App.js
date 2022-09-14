import './App.scss';
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import { Login,Register } from './components/Login/index';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
