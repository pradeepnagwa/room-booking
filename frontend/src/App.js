import React from 'react';
import RoomList from './pages/room-list';
import RoomBook from './pages/book';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<RoomList />} />
        <Route path="/book/:id" element={<RoomBook />} />
      </Routes>
    </Router>
  );
}

export default App;
