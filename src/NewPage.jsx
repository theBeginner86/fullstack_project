import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import App from './App';

const NavbarWrapper = ({ logoPath }) => {
  const navigate = useNavigate();

  const handleStudentClick = () => {
    navigate('/stud');
  };

  return <Navbar logoPath={logoPath} onStudentClick={handleStudentClick} />;
};

const NewPage = () => {
  const logoPath = '/path/to/your/logo.png'; 

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavbarWrapper logoPath={logoPath} />
        <div className="container" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/stud" element={<App />} />
            <Route path="/" element={<div>Welcome to the home page</div>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default NewPage;