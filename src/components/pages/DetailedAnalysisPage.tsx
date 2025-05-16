import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, FileDown, Lightbulb, Book as Books, Target, BarChart2, Download } from 'lucide-react';
import { useGpa } from '../../context/GpaContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import GPAChart from '../charts/GPAChart';
import ProgressChart from '../charts/ProgressChart';
import PriorityChart from '../charts/PriorityChart';
import { generateAnalysisPdf } from '../../utils/pdfGenerator';

const DetailedAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { completedSemesters, futureSemesters, detailedAnalysisResult } = useGpa();
  const [isDownloading, setIsDownloading] = useState(false);
  
  // If no detailed analysis result is available, redirect
  if (!detailedAnalysisResult) {
    navigate('/future-courses');
    return null;
  }
  
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await generateAnalysisPdf('detailed-analysis-content', detailedAnalysisResult, true);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleStartOver = () => {
    navigate('/semesters');
  };
  
  // Get all courses from all future semesters
  const allCourses = futureSemesters.flatMap(semester => semester.courses);
  
  const {
    currentCgpa,
    targetCgpa,
    isPossible,
    progressPercentage,
    courseImportance,
    semesterStrategies,
    bestCaseCgpa,
    worstCaseCgpa,
  } = detailedAnalysisResult;
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <BrainCircuit className="mr-2 h-6 w-6 text-blue-600" />
        Detailed CGPA Analysis
      </h2>
      
      <div id="detailed-analysis-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-blue-600" />
                CGPA Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Current CGPA</span>
                  <span className="text-xl font-semibold text-blue-700">{currentCgpa.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span className="text-gray-700">Target CGPA</span>
                  <span className="text-xl font-semibold text-indigo-700">{targetCgpa.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Best Case CGPA</span>
                  <span className="text-xl font-semibold text-green-700">{bestCaseCgpa.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700">Worst Case CGPA</span>
                  <span className="text-xl font-semibold text-red-700">{worstCaseCgpa.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-blue-600" />
                Progress Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ProgressChart 
                percentage={progressPercentage} 
                label="Progress to Target CGPA" 
              />
              
              <div className="mt-4 text-center">
                <p className="text-gray-700">
                  {isPossible 
                    ? `Your target CGPA of ${targetCgpa.toFixed(2)} is achievable`
                    : `Reaching ${targetCgpa.toFixed(2)} might not be feasible`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6 animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Books className="mr-2 h-5 w-5 text-blue-600" />
              Course Impact Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This chart shows which courses have the highest impact on your CGPA based on their credit values.
              Focus more effort on courses with higher impact.
            </p>
            
            <PriorityChart 
              courses={allCourses} 
              importanceValues={courseImportance}
            />
          </CardContent>
        </Card>
        
        <Card className="mb-6 animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-blue-600" />
              Semester-by-Semester Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {semesterStrategies.map((strategy) => {
                const semester = futureSemesters.find(s => s.id === strategy.semesterId);
                if (!semester) return null;
                
                const priorityCourseNames = strategy.priorityCourses.map(courseId => {
                  const course = semester.courses.find(c => c.id === courseId);
                  return course ? course.name : '';
                }).filter(Boolean);
                
                return (
                  <div key={strategy.semesterId} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      Semester {strategy.semesterId}
                    </h3>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Required GPA</span>
                        <span className="font-medium text-blue-700">{strategy.requiredGpa.toFixed(2)}</span>
                      </div>
                      
                      <div>
                        <p className="text-gray-700">Priority Courses:</p>
                        <ul className="list-disc pl-5 mt-1">
                          {priorityCourseNames.map((name, index) => (
                            <li key={index} className="text-gray-700">{name}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6 animate-fadeIn">
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">General Strategy</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">1</span>
                    <span className="text-gray-700">Focus most on high-credit courses as they have the greatest impact on your CGPA.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">2</span>
                    <span className="text-gray-700">Ensure you maintain at least the required GPA for each semester to stay on track.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">3</span>
                    <span className="text-gray-700">Consider forming study groups for challenging subjects to improve understanding and retention.</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-indigo-800 mb-2">Personalized Tips</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-indigo-100 text-indigo-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">1</span>
                    <span className="text-gray-700">
                      With your current CGPA of {currentCgpa.toFixed(2)}, you'll need consistent performance in all semesters to reach your target.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 text-indigo-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">2</span>
                    <span className="text-gray-700">
                      Pay special attention to courses with 4 or more credits as they heavily influence your final CGPA.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 text-indigo-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">3</span>
                    <span className="text-gray-700">
                      Create a balanced study schedule that allocates time proportional to course credits.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-4 sm:space-y-0">
        <Button
          variant="outline"
          onClick={handleStartOver}
        >
          Start New Analysis
        </Button>
        
        {/* <Button
          variant="outline"
          className="flex items-center"
          onClick={handleDownloadPdf}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>Downloading...</>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Detailed Analysis as PDF
            </>
          )}
        </Button> */}
      </div>
    </div>
  );
};

export default DetailedAnalysisPage;