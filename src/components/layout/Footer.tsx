import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 py-4 px-6 border-t">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} GPAlytics | AI-Powered CGPA Assistant
        </p>
        <p className="text-xs mt-1">
          Designed to help you achieve your academic goals
        </p>
      </div>
    </footer>
  );
};

export default Footer;