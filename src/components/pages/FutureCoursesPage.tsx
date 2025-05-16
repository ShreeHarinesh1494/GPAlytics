import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, PlusCircle, MinusCircle } from 'lucide-react';
import { useGpa } from '../../context/GpaContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const FutureCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { futureSemesters, updateFutureSemesterCourseCount, updateCourse, runDetailedAnalysis } = useGpa();
  const [courseCountErrors, setCourseCountErrors] = useState<Record<number, string>>({});
  const [expandedSemesters, setExpandedSemesters] = useState<Record<number, boolean>>({});
  
  // If no future semesters are available, redirect
  if (futureSemesters.length === 0) {
    navigate('/future-semesters');
    return null;
  }
  
  const toggleSemesterExpansion = (semesterId: number) => {
    setExpandedSemesters(prev => ({
      ...prev,
      [semesterId]: !prev[semesterId]
    }));
  };
  
  const handleCourseCountChange = (semesterId: number, value: string) => {
    const count = parseInt(value);
    
    if (value === '') {
      setCourseCountErrors(prev => ({ ...prev, [semesterId]: '' }));
      return;
    }
    
    if (isNaN(count) || count < 1) {
      setCourseCountErrors(prev => ({ ...prev, [semesterId]: 'Please enter a valid number greater than 0' }));
      return;
    }
    
    if (count > 10) { // Limit the maximum number of courses
      setCourseCountErrors(prev => ({ ...prev, [semesterId]: 'Maximum 10 courses allowed per semester' }));
      return;
    }
    
    setCourseCountErrors(prev => ({ ...prev, [semesterId]: '' }));
    updateFutureSemesterCourseCount(semesterId, count);
    // Auto-expand the semester when courses are added
    setExpandedSemesters(prev => ({ ...prev, [semesterId]: true }));
  };
  
  const handleCourseNameChange = (semesterId: number, courseId: string, value: string) => {
    updateCourse(semesterId, courseId, 'name', value);
  };
  
  const handleCourseCreditsChange = (semesterId: number, courseId: string, value: string) => {
    const credits = parseInt(value);
    if (!isNaN(credits) && credits > 0) {
      updateCourse(semesterId, courseId, 'credits', credits);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all semesters have courses
    const isValid = futureSemesters.every(semester => semester.courses.length > 0);
    
    if (!isValid) {
      alert('Please enter courses for all semesters.');
      return;
    }
    
    runDetailedAnalysis();
    navigate('/detailed-analysis');
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <BookOpen className="mr-2 h-6 w-6 text-blue-600" />
        Enter Future Course Details
      </h2>
      
      <form onSubmit={handleSubmit}>
        {futureSemesters.map((semester) => (
          <Card key={semester.id} className="mb-6 animate-fadeIn">
            <CardHeader 
              className={`cursor-pointer transition-colors ${
                expandedSemesters[semester.id] ? 'bg-blue-50' : ''
              }`}
              onClick={() => toggleSemesterExpansion(semester.id)}
            >
              <CardTitle className="flex justify-between items-center">
                <span>Semester {semester.id}</span>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  className="p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSemesterExpansion(semester.id);
                  }}
                >
                  {expandedSemesters[semester.id] ? (
                    <MinusCircle className="h-5 w-5 text-blue-600" />
                  ) : (
                    <PlusCircle className="h-5 w-5 text-blue-600" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4">
                <Input
                  type="number"
                  min={1}
                  max={10}
                  label="Number of courses in this semester"
                  placeholder="e.g., 6"
                  value={semester.courseCount || ''}
                  onChange={(e) => handleCourseCountChange(semester.id, e.target.value)}
                  error={courseCountErrors[semester.id]}
                />
              </div>
              
              {expandedSemesters[semester.id] && semester.courses.length > 0 && (
                <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                  {semester.courses.map((course) => (
                    <div key={course.id} className="grid grid-cols-3 gap-4 animate-fadeIn">
                      <div className="col-span-2">
                        <Input
                          label={`Course ${course.id.split('-').pop()}`}
                          placeholder="Course name"
                          value={course.name}
                          onChange={(e) => handleCourseNameChange(semester.id, course.id, e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          label="Credits"
                          placeholder="e.g., 3"
                          value={course.credits || ''}
                          onChange={(e) => handleCourseCreditsChange(semester.id, course.id, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        <div className="flex justify-end mt-6">
          <Button 
            type="submit"
            className="flex items-center"
          >
            Generate Detailed Analysis
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FutureCoursesPage;