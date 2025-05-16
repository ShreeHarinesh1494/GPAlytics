// Main data structure types
export interface Semester {
  id: number;
  gpa: number;
}

export interface Course {
  id: string;
  name: string;
  credits: number;
  semesterId: number;
}

export interface FutureSemester {
  id: number;
  courseCount: number;
  courses: Course[];
}

export interface AnalysisResult {
  currentCgpa: number;
  targetCgpa: number;
  remainingSemesters: number;
  isPossible: boolean;
  requiredGpa: number;
  progressPercentage: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  suggestions: string[];
  requiredGpaPerSemester?: number[];
}

export interface DetailedAnalysisResult extends AnalysisResult {
  courseImportance: Record<string, number>;
  semesterStrategies: SemesterStrategy[];
  bestCaseCgpa: number;
  worstCaseCgpa: number;
}

export interface SemesterStrategy {
  semesterId: number;
  requiredGpa: number;
  priorityCourses: string[];
}

// Context types
export interface GpaContextType {
  completedSemesters: Semester[];
  targetCgpa: number;
  futureSemesters: FutureSemester[];
  analysisResult: AnalysisResult | null;
  detailedAnalysisResult: DetailedAnalysisResult | null;
  
  setCompletedSemestersCount: (count: number) => void;
  updateSemesterGpa: (id: number, gpa: number) => void;
  setTargetCgpa: (cgpa: number) => void;
  runAnalysis: () => void;
  setFutureSemestersCount: (count: number) => void;
  updateFutureSemesterCourseCount: (semesterId: number, count: number) => void;
  updateCourse: (semesterId: number, courseId: string, field: 'name' | 'credits', value: string | number) => void;
  runDetailedAnalysis: () => void;
  resetData: () => void;
}