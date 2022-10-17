import './App.css';
import Instructions from './files/Instructions';
import Words from './files/Words';
import Record from './files/Record';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <h1>Hear My Sign</h1>

      <Router>
        <Routes>
          <Route exact path='/' element={<Instructions />} />
          <Route path="/select_word" element={<Words />} />
          <Route path="/record" element={<Record />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
