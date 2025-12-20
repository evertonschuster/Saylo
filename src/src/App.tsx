import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Lesson from './pages/Lesson';

export  function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lesson/:id" element={<Lesson />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App
