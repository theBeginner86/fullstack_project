import React, { useState, useRef, useEffect } from "react";

const AccordionButton = ({ title, items, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const accordionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accordionRef.current && !accordionRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={accordionRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: '#4b5563',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {title}
        <span style={{ marginLeft: '0.5rem' }}>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          backgroundColor: 'white',
          borderRadius: '0.25rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginTop: '0.5rem',
        }}>
          {items.map((item, index) => (
            <a
              key={index}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onItemClick(item);
                setIsOpen(false);
              }}
              style={{
                display: 'block',
                padding: '0.5rem 1rem',
                color: '#1f2937',
                textDecoration: 'none',
              }}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Navbar({ logoPath, onStudentClick }) {
  const menuItems = ['Students', 'Projects', 'Mentors', 'Enterprise'];

  const handleItemClick = (item) => {
    if (item === 'Students') {
      onStudentClick();
    }
   
  };

  return (
    <nav className="navbar">
      <img src={logoPath} alt="Your Company" style={{ height: '2rem' }} />
      <AccordionButton title="Menu" items={menuItems} onItemClick={handleItemClick} />
    </nav>
  );
}
