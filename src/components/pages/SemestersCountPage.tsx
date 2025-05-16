import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, School, Target, Brain, BarChart2 } from 'lucide-react';
import { useGpa } from '../../context/GpaContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const SemestersCountPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCompletedSemestersCount } = useGpa();
  const [semestersCount, setSemestersCount] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const count = parseInt(semestersCount);
    
    if (isNaN(count) || count <= 0) {
      setError('Please enter a valid number greater than 0');
      return;
    }
    
    if (count > 8) {
      setError('Maximum number of semesters should be 8');
      return;
    }
    
    setCompletedSemestersCount(count);
    navigate('/gpa-entry');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex justify-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
            <Brain className="h-8 w-8" />
          </div>
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
            <BarChart2 className="h-8 w-8" />
          </div>
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-700">
            <Target className="h-8 w-8" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to GPAlytics
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your AI-Powered CGPA Assistant
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Smart Analysis
              </h3>
              <p className="text-gray-600">
                Get AI-powered insights and personalized recommendations for improving your academic performance
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <BarChart2 className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Visual Tracking
              </h3>
              <p className="text-gray-600">
                Track your progress with interactive charts and visualize your path to academic success
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Goal Setting
              </h3>
              <p className="text-gray-600">
                Set and achieve your target CGPA with detailed strategies and semester-wise planning
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="animate-fadeIn">
        <CardHeader>
          <CardTitle className="flex items-center">
            <School className="mr-2 h-5 w-5" />
            Let's Start Your Analysis
          </CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent>
            <p className="text-gray-600 mb-4">
              To begin analyzing your academic performance, please enter how many semesters you have completed so far.
            </p>
            
            <Input
              type="number"
              min={1}
              max={8}
              value={semestersCount}
              onChange={(e) => {
                setSemestersCount(e.target.value);
                setError('');
              }}
              label="Enter number of completed semesters (max: 8)"
              placeholder="e.g., 4"
              error={error}
              required
              className="mt-2"
            />
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button type="submit">
              Start Analysis
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SemestersCountPage;