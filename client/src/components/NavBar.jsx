import React, { useState, useRef, useEffect } from "react";
import { MenuOutlined } from "@ant-design/icons";
import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is imported
import "./NavBar.css";

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
    <div ref={accordionRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-700 text-white py-2 px-4 rounded flex items-center"
      >
        {title}
        <span className="ml-2">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 bg-white rounded shadow-md mt-2 z-[1001]">
          {items.map((item, index) => (
            <a
              key={index}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onItemClick(item);
                setIsOpen(false);
              }}
              className="block py-2 px-4 text-gray-800 hover:bg-gray-200"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Navbar({ logoPath, onMenuClick }) {
  const menuItems = ['Students', 'Mentors', 'Projects', 'Enterprises'];

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 navbar-z-index">
      <img src={logoPath} alt="Your Company" className="h-8" />
      <AccordionButton title={<MenuOutlined />} items={menuItems} onItemClick={onMenuClick} />
    </nav>
  );
}
