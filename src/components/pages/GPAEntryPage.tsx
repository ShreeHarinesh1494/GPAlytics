import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, BarChart2, Target } from 'lucide-react';
import { useGpa } from '../../context/GpaContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const GPAEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { completedSemesters, updateSemesterGpa, setTargetCgpa, runAnalysis } = useGpa();
  const [targetCgpaValue, setTargetCgpaValue] = useState<string>('');
  const [gpaValues, setGpaValues] = useState<Record<number, string>>(
    Object.fromEntries(completedSemesters.map(sem => [sem.id, sem.gpa === 0 ? '' : sem.gpa.toString()]))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (completedSemesters.length === 0) {
    navigate('/semesters');
    return null;
  }

  const validateGpa = (value: number): boolean => {
    return value >= 0 && value <= 10;
  };

  const handleGpaChange = (id: number, value: string) => {
    setGpaValues(prev => ({ ...prev, [id]: value }));

    if (value === '') {
      setErrors(prev => ({ ...prev, [`semester-${id}`]: '' }));
      updateSemesterGpa(id, NaN);
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setErrors(prev => ({ ...prev, [`semester-${id}`]: 'Please enter a valid number' }));
      return;
    }

    if (!validateGpa(numValue)) {
      setErrors(prev => ({ ...prev, [`semester-${id}`]: 'GPA must be between 0 and 10' }));
      return;
    }

    setErrors(prev => ({ ...prev, [`semester-${id}`]: '' }));
    updateSemesterGpa(id, numValue);
  };

  const handleTargetCgpaChange = (value: string) => {
    setTargetCgpaValue(value);

    if (value === '') {
      setErrors(prev => ({ ...prev, targetCgpa: '' }));
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setErrors(prev => ({ ...prev, targetCgpa: 'Please enter a valid number' }));
      return;
    }

    if (!validateGpa(numValue)) {
      setErrors(prev => ({ ...prev, targetCgpa: 'CGPA must be between 0 and 10' }));
      return;
    }

    setErrors(prev => ({ ...prev, targetCgpa: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hasInvalidGpa = completedSemesters.some(semester => {
      const value = gpaValues[semester.id];
      const numValue = parseFloat(value);
      return !value || isNaN(numValue) || !validateGpa(numValue);
    });

    if (hasInvalidGpa) {
      alert('Please enter valid GPAs for all semesters.');
      return;
    }

    const targetCgpaNum = parseFloat(targetCgpaValue);
    if (!targetCgpaValue || isNaN(targetCgpaNum) || !validateGpa(targetCgpaNum)) {
      setErrors(prev => ({ ...prev, targetCgpa: 'Please enter a valid target CGPA between 0 and 10' }));
      return;
    }

    setTargetCgpa(targetCgpaNum);
    runAnalysis();
    navigate('/analysis');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <BarChart2 className="mr-2 h-6 w-6 text-blue-600" />
        Enter Your GPA Information
      </h2>

      <Card className="mb-8 animate-fadeIn">
        <CardHeader>
          <CardTitle>GPA for Completed Semesters</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {completedSemesters.map((semester) => (
                <div key={semester.id} className="animate-slideInFromLeft" style={{ animationDelay: `${(semester.id - 1) * 100}ms` }}>
                  <Input
                    type="text"
                    label={`Semester ${semester.id} GPA`}
                    placeholder="Enter GPA (0-10)"
                    value={gpaValues[semester.id] || ''}
                    onChange={(e) => handleGpaChange(semester.id, e.target.value)}
                    error={errors[`semester-${semester.id}`]}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 border-t pt-6">
              <div className="flex items-center mb-4">
                <Target className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium">Your Target CGPA</h3>
              </div>

              <Input
                type="text"
                label="Enter your target CGPA"
                placeholder="e.g., 8.5"
                value={targetCgpaValue}
                onChange={(e) => handleTargetCgpaChange(e.target.value)}
                error={errors.targetCgpa}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" className="flex items-center">
              Analyze
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default GPAEntryPage;
