import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Page from './component/page';
import Solver from './component/solver';
import SentimentAnalysis from './component/sentiment-analysis';


function App() {
  return (
    <div className="App">
      <Page/>

      <BrowserRouter>
          <Routes>
              <Route path="/">
                  <Route path="caesar-solver" element={<Solver/>}/>
                  <Route path="sentiment-analysis" element={<SentimentAnalysis/>}/>
              </Route>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
