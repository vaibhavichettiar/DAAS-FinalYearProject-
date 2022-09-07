import './App.css';
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import LandingComponent from './components/Landing/LandingComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<LandingComponent />}/>
      </Routes>
      </Router>
  );
}

export default App;
