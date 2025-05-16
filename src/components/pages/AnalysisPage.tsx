import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, FileDown, AlertTriangle, Award, ArrowRight, CheckCircle, Download, TrendingUp } from 'lucide-react';
import { useGpa } from '../../context/GpaContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import GPAChart from '../charts/GPAChart';
import ProgressChart from '../charts/ProgressChart';
import { generateAnalysisPdf } from '../../utils/pdfGenerator';

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { completedSemesters, analysisResult } = useGpa();
  const [isDownloading, setIsDownloading] = useState(false);
  
  if (!analysisResult) {
    navigate('/gpa-entry');
    return null;
  }
  
  const {
    currentCgpa,
    targetCgpa,
    remainingSemesters,
    isPossible,
    requiredGpa,
    progressPercentage,
    riskLevel,
    suggestions,
    requiredGpaPerSemester,
  } = analysisResult;
  
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await generateAnalysisPdf('analysis-content', analysisResult);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleSubjectDetails = (answer: boolean) => {
    if (answer) {
      navigate('/future-semesters');
    } else {
      navigate('/semesters');
    }
  };
  
  const getRiskLevelColor = (level: 'Low' | 'Moderate' | 'High'): string => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Calculator className="mr-2 h-6 w-6 text-blue-600" />
        CGPA Analysis Results
      </h2>
      
      <div id="analysis-content">
        <Card className="mb-6 animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
              Semester-wise Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedSemesters.map((semester) => (
                <div key={semester.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Semester {semester.id}</span>
                  <span className="font-semibold text-blue-700">{semester.gpa.toFixed(2)} GPA</span>
                </div>
              ))}
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Current CGPA</span>
                <span className="font-semibold text-blue-700">{currentCgpa.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                <span className="text-gray-700">Target CGPA</span>
                <span className="font-semibold text-indigo-700">{targetCgpa.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="animate-fadeIn">
            <CardHeader>
              <CardTitle>Required Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                {isPossible && remainingSemesters > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Required GPA per Semester:</h4>
                    {requiredGpaPerSemester?.map((gpa, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-2">
                        <span className="text-gray-700">Semester {completedSemesters.length + index + 1}</span>
                        <span className="font-semibold text-blue-700">{gpa.toFixed(2)} GPA</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Remaining Semesters</span>
                  <span className="text-xl font-semibold text-purple-700">{remainingSemesters}</span>
                </div>
                
                {isPossible ? (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Average Required GPA</span>
                    <span className="text-xl font-semibold text-green-700">{requiredGpa.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="flex items-center p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                    <span className="text-red-700 font-medium">Target CGPA not mathematically possible</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Risk Level</span>
                  <span className={`px-3 py-1 rounded-full font-medium ${getRiskLevelColor(riskLevel)}`}>
                    {riskLevel}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fadeIn">
            <CardHeader>
              <CardTitle>Progress Toward Goal</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ProgressChart 
                percentage={progressPercentage} 
                label="Progress to Target CGPA" 
              />
              
              <div className="mt-4 text-center">
                <p className="text-gray-700">
                  You've completed <span className="font-medium">{completedSemesters.length}</span> out of 8 semesters
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {isPossible 
                    ? `You need a GPA of ${requiredGpa.toFixed(2)} in remaining semesters`
                    : 'Consider adjusting your target CGPA to a more achievable goal'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6 animate-fadeIn">
          <CardHeader>
            <CardTitle>GPA Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <GPAChart 
              completedSemesters={completedSemesters} 
              requiredGpaPerSemester={requiredGpaPerSemester}
            />
          </CardContent>
        </Card>
        
        <Card className="mb-6 animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-blue-600" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isPossible ? (
              <div className="p-4 bg-red-50 rounded-lg mb-4">
                <p className="text-red-700 font-medium flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Sorry, it is impossible to reach the target CGPA based on your current performance.
                </p>
                <p className="text-gray-700 mt-2">
                  Even if you score perfect 10 in all future semesters, your CGPA will still not reach {targetCgpa.toFixed(2)} because the average is too low due to past performance.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-green-50 rounded-lg mb-4">
                <p className="text-green-700 font-medium flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Your target CGPA of {targetCgpa.toFixed(2)} is achievable!
                </p>
                <p className="text-gray-700 mt-2">
                  You need to maintain an average GPA of {requiredGpa.toFixed(2)} for the remaining {remainingSemesters} semesters.
                </p>
              </div>
            )}
            
            <h4 className="font-medium text-gray-800 mb-2 mt-4">Study Tips & Suggestions:</h4>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6 animate-fadeIn">
        <CardHeader>
          <CardTitle>Do you know the subjects and credits of the upcoming semesters?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            For a more detailed analysis, we can provide subject-specific recommendations based on your upcoming courses and their credit values.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
          <Button
            variant="outline"
            onClick={() => handleSubjectDetails(false)}
          >
            No, thank you
          </Button>
          <Button
            onClick={() => handleSubjectDetails(true)}
          >
            Yes, I'd like detailed analysis
          </Button>
        </CardFooter>
      </Card>
      
      {/* <div className="flex justify-center mt-6">
        <Button
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
              Download Analysis as PDF
            </>
          )}
        </Button>
      </div> */}
    </div>
  );
};

export default AnalysisPage;