import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { analyzeGpa, analyzeDetailedGpa } from '../utils/calculations';
import { 
  Semester, 
  Course, 
  FutureSemester, 
  AnalysisResult, 
  DetailedAnalysisResult,
  GpaContextType 
} from '../types';

const defaultContext: GpaContextType = {
  completedSemesters: [],
  targetCgpa: 0,
  futureSemesters: [],
  analysisResult: null,
  detailedAnalysisResult: null,
  
  setCompletedSemestersCount: () => {},
  updateSemesterGpa: () => {},
  setTargetCgpa: () => {},
  runAnalysis: () => {},
  setFutureSemestersCount: () => {},
  updateFutureSemesterCourseCount: () => {},
  updateCourse: () => {},
  runDetailedAnalysis: () => {},
  resetData: () => {},
};

const GpaContext = createContext<GpaContextType>(defaultContext);

export const useGpa = () => useContext(GpaContext);

export const GpaProvider = ({ children }: { children: ReactNode }) => {
  const [completedSemesters, setCompletedSemesters] = useState<Semester[]>([]);
  const [targetCgpa, setTargetCgpa] = useState<number>(0);
  const [futureSemesters, setFutureSemesters] = useState<FutureSemester[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [detailedAnalysisResult, setDetailedAnalysisResult] = useState<DetailedAnalysisResult | null>(null);

  const setCompletedSemestersCount = useCallback((count: number) => {
    const semesters: Semester[] = [];
    for (let i = 0; i < count; i++) {
      semesters.push({ id: i + 1, gpa: 0 });
    }
    setCompletedSemesters(semesters);
  }, []);

  const updateSemesterGpa = useCallback((id: number, gpa: number) => {
    setCompletedSemesters(prev => 
      prev.map(semester => 
        semester.id === id ? { ...semester, gpa } : semester
      )
    );
  }, []);

  const runAnalysis = useCallback(() => {
    const result = analyzeGpa(completedSemesters, targetCgpa);
    setAnalysisResult(result);
  }, [completedSemesters, targetCgpa]);

  const setFutureSemestersCount = useCallback((count: number) => {
    const semesters: FutureSemester[] = [];
    for (let i = 0; i < count; i++) {
      const semesterId = completedSemesters.length + i + 1;
      semesters.push({ 
        id: semesterId, 
        courseCount: 0,
        courses: [] 
      });
    }
    setFutureSemesters(semesters);
  }, [completedSemesters.length]);

  const updateFutureSemesterCourseCount = useCallback((semesterId: number, count: number) => {
    setFutureSemesters(prev => 
      prev.map(semester => {
        if (semester.id === semesterId) {
          const courses: Course[] = [];
          for (let i = 0; i < count; i++) {
            courses.push({
              id: `semester${semesterId}-course${i+1}`,
              name: `Course ${i+1}`,
              credits: 3,
              semesterId
            });
          }
          return { ...semester, courseCount: count, courses };
        }
        return semester;
      })
    );
  }, []);

  const updateCourse = useCallback((
    semesterId: number, 
    courseId: string, 
    field: 'name' | 'credits', 
    value: string | number
  ) => {
    setFutureSemesters(prev => 
      prev.map(semester => {
        if (semester.id === semesterId) {
          const updatedCourses = semester.courses.map(course => {
            if (course.id === courseId) {
              return { ...course, [field]: value };
            }
            return course;
          });
          return { ...semester, courses: updatedCourses };
        }
        return semester;
      })
    );
  }, []);

  const runDetailedAnalysis = useCallback(() => {
    if (!analysisResult) return;
    
    const result = analyzeDetailedGpa(
      completedSemesters, 
      targetCgpa, 
      futureSemesters
    );
    
    setDetailedAnalysisResult(result);
  }, [analysisResult, completedSemesters, targetCgpa, futureSemesters]);

  const resetData = useCallback(() => {
    setCompletedSemesters([]);
    setTargetCgpa(0);
    setFutureSemesters([]);
    setAnalysisResult(null);
    setDetailedAnalysisResult(null);
  }, []);

  const value = {
    completedSemesters,
    targetCgpa,
    futureSemesters,
    analysisResult,
    detailedAnalysisResult,
    
    setCompletedSemestersCount,
    updateSemesterGpa,
    setTargetCgpa,
    runAnalysis,
    setFutureSemestersCount,
    updateFutureSemesterCourseCount,
    updateCourse,
    runDetailedAnalysis,
    resetData,
  };

  return (
    <GpaContext.Provider value={value}>
      {children}
    </GpaContext.Provider>
  );
};