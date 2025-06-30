import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import FullPage from './FullPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import RedirectSite from './redirect';
import BubbleSortCanvas from './SecondPage/canvas'
import QuickSortCanvas from './SecondPage/quickSort';
import SortingAlgsPage from './SecondPage/sortingAlgs';

/*
To Do - 
  TopBar - 
    Fix reload bug with active item
  Banner -
    Write About Me Section
    Setup Extra Info Section
    Figure out banner design
  Portfolio - `
    Add Projects
    Add Skills
    Setup Experience Section
    Add More Games
      Game Ideas - 
        Chess
        BlackJack
        Connect 4 -- DONE
        Roulette
        Snake -- Done
        Pong
        RPS
*/
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  
  <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <FullPage />
        
        }>
          
        
          
        </Route>
        <Route path="/sortingVisualizer" element={<SortingAlgsPage />} />
        <Route path="/gamePage" element={<RedirectSite />} />
      </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
