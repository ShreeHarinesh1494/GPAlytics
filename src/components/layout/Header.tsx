import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { useGpa } from '../../context/GpaContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetData } = useGpa();
  
  const isHomePage = location.pathname === '/semesters';
  
  const handleRestart = () => {
    if (window.confirm('This will reset all your data. Are you sure?')) {
      resetData();
      navigate('/semesters');
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="flex items-center mr-2">
            <BarChart3 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight ml-2">
            GPAlytics
            <span className="hidden sm:inline text-sm font-normal ml-2 text-blue-200">
              Smarter Ways to Your CGPA Goals
            </span>
          </h1>
        </div>
        
        {!isHomePage && (
          <Button
            variant="ghost"
            onClick={handleRestart}
            className="text-white hover:bg-blue-800"
          >
            Restart
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;