import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { useGpa } from '../../context/GpaContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const FutureSemestersPage: React.FC = () => {
  const navigate = useNavigate();
  const { completedSemesters, setFutureSemestersCount } = useGpa();
  const [semestersCount, setSemestersCount] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // If no semesters are available, redirect to the semesters count page
  if (completedSemesters.length === 0) {
    navigate('/semesters');
    return null;
  }
  
  const maxRemainingCount = 8 - completedSemesters.length;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const count = parseInt(semestersCount);
    
    if (isNaN(count) || count <= 0) {
      setError('Please enter a valid number greater than 0');
      return;
    }
    
    if (count > maxRemainingCount) {
      setError(`Maximum number of remaining semesters should be ${maxRemainingCount}`);
      return;
    }
    
    setFutureSemestersCount(count);
    navigate('/future-courses');
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
          <Calendar className="h-10 w-10" />
        </div>
      </div>
      
      <Card className="animate-fadeIn">
        <CardHeader>
          <CardTitle>Remaining Semesters</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent>
            <p className="text-gray-600 mb-4">
              To provide detailed analysis for your future semesters, please enter how many semesters you have remaining.
            </p>
            
            <Input
              type="number"
              min={1}
              max={maxRemainingCount}
              value={semestersCount}
              onChange={(e) => {
                setSemestersCount(e.target.value);
                setError('');
              }}
              label={`Enter number of remaining semesters (max: ${maxRemainingCount})`}
              placeholder={`e.g., ${maxRemainingCount}`}
              error={error}
              required
              className="mt-2"
            />
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button 
              type="submit"
              className="flex items-center"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default FutureSemestersPage;