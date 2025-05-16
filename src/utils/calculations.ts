import { 
  Semester, 
  FutureSemester, 
  AnalysisResult,
  DetailedAnalysisResult,
  SemesterStrategy
} from '../types';

const TOTAL_SEMESTERS = 8;

const calculateCurrentCgpa = (semesters: Semester[]): number => {
  if (semesters.length === 0) return 0;
  
  const sum = semesters.reduce((acc, semester) => acc + semester.gpa, 0);
  return parseFloat((sum / semesters.length).toFixed(2));
};

const isTargetPossible = (
  currentCgpa: number, 
  targetCgpa: number, 
  completedSemesters: number
): boolean => {
  const remainingSemesters = TOTAL_SEMESTERS - completedSemesters;
  
  if (remainingSemesters <= 0) {
    return currentCgpa >= targetCgpa;
  }
  
  const maxPossibleCgpa = (
    (currentCgpa * completedSemesters) + (10 * remainingSemesters)
  ) / TOTAL_SEMESTERS;
  
  return maxPossibleCgpa >= targetCgpa;
};

const calculateRequiredGpa = (
  currentCgpa: number,
  targetCgpa: number,
  completedSemesters: number
): number => {
  const remainingSemesters = TOTAL_SEMESTERS - completedSemesters;
  
  if (remainingSemesters <= 0) return 0;
  
  const requiredTotalPoints = targetCgpa * TOTAL_SEMESTERS;
  const currentTotalPoints = currentCgpa * completedSemesters;
  const requiredFuturePoints = requiredTotalPoints - currentTotalPoints;
  
  return parseFloat((requiredFuturePoints / remainingSemesters).toFixed(2));
};

const calculateProgressPercentage = (
  currentCgpa: number,
  targetCgpa: number
): number => {
  if (targetCgpa <= 0) return 0;
  const percentage = (currentCgpa / targetCgpa) * 100;
  return Math.min(100, parseFloat(percentage.toFixed(1)));
};

const determineRiskLevel = (requiredGpa: number): 'Low' | 'Moderate' | 'High' => {
  if (requiredGpa > 9) return 'High';
  if (requiredGpa > 8.5) return 'Moderate';
  return 'Low';
};

const generateStudyTips = (
  currentCgpa: number,
  requiredGpa: number,
  riskLevel: 'Low' | 'Moderate' | 'High'
): string[] => {
  const tips: string[] = [];
  
  if (riskLevel === 'High') {
    tips.push('Consider focusing intensely on high-credit subjects.');
    tips.push('Seek academic counseling or tutoring for challenging subjects.');
    tips.push('Create a strict study schedule with daily goals.');
  } else if (riskLevel === 'Moderate') {
    tips.push('Improve your study techniques for better retention.');
    tips.push('Form or join study groups for collaborative learning.');
    tips.push('Allocate extra time for subjects you find challenging.');
  } else {
    tips.push('Maintain your current study habits and consistency.');
    tips.push('Consider challenging yourself with additional learning opportunities.');
    tips.push('Help peers who may be struggling with subjects you excel in.');
  }
  
  if (requiredGpa > currentCgpa + 1) {
    tips.push('You need significant improvement. Consider reducing extracurricular commitments.');
  }
  
  return tips;
};

export const analyzeGpa = (
  semesters: Semester[],
  targetCgpa: number
): AnalysisResult => {
  const currentCgpa = calculateCurrentCgpa(semesters);
  const completedCount = semesters.length;
  const remainingSemesters = TOTAL_SEMESTERS - completedCount;
  const possible = isTargetPossible(currentCgpa, targetCgpa, completedCount);
  const requiredGpa = calculateRequiredGpa(currentCgpa, targetCgpa, completedCount);
  const progressPercentage = calculateProgressPercentage(currentCgpa, targetCgpa);
  const riskLevel = determineRiskLevel(requiredGpa);
  const suggestions = generateStudyTips(currentCgpa, requiredGpa, riskLevel);
  
  const requiredGpaPerSemester = Array(remainingSemesters).fill(requiredGpa);
  
  return {
    currentCgpa,
    targetCgpa,
    remainingSemesters,
    isPossible: possible,
    requiredGpa,
    progressPercentage,
    riskLevel,
    suggestions,
    requiredGpaPerSemester,
  };
};

const calculateCourseImportance = (
  futureSemesters: FutureSemester[]
): Record<string, number> => {
  const courseImportance: Record<string, number> = {};
  const allCourses = futureSemesters.flatMap(sem => sem.courses);
  const totalCredits = allCourses.reduce((sum, course) => sum + course.credits, 0);
  
  allCourses.forEach(course => {
    const importance = (course.credits / totalCredits) * 100;
    courseImportance[course.id] = parseFloat(importance.toFixed(1));
  });
  
  return courseImportance;
};

const generateSemesterStrategies = (
  futureSemesters: FutureSemester[],
  requiredGpaPerSemester: number[]
): SemesterStrategy[] => {
  return futureSemesters.map((semester, index) => {
    const sortedCourses = [...semester.courses]
      .sort((a, b) => b.credits - a.credits);
    
    const priorityCourses = sortedCourses
      .slice(0, Math.min(2, sortedCourses.length))
      .map(course => course.id);
    
    return {
      semesterId: semester.id,
      requiredGpa: requiredGpaPerSemester[index] || 0,
      priorityCourses,
    };
  });
};

const calculateBestWorstCgpa = (
  currentCgpa: number,
  completedCount: number,
  futureSemesters: FutureSemester[]
): { bestCaseCgpa: number; worstCaseCgpa: number } => {
  const bestCase = (
    (currentCgpa * completedCount) + (10 * futureSemesters.length)
  ) / (completedCount + futureSemesters.length);
  
  const worstCase = (
    (currentCgpa * completedCount) + (4 * futureSemesters.length)
  ) / (completedCount + futureSemesters.length);
  
  return {
    bestCaseCgpa: parseFloat(bestCase.toFixed(2)),
    worstCaseCgpa: parseFloat(worstCase.toFixed(2)),
  };
};

export const analyzeDetailedGpa = (
  completedSemesters: Semester[],
  targetCgpa: number,
  futureSemesters: FutureSemester[]
): DetailedAnalysisResult => {
  const basicAnalysis = analyzeGpa(completedSemesters, targetCgpa);
  
  const courseImportance = calculateCourseImportance(futureSemesters);
  
  const semesterStrategies = generateSemesterStrategies(
    futureSemesters, 
    basicAnalysis.requiredGpaPerSemester || []
  );
  
  const { bestCaseCgpa, worstCaseCgpa } = calculateBestWorstCgpa(
    basicAnalysis.currentCgpa,
    completedSemesters.length,
    futureSemesters
  );
  
  return {
    ...basicAnalysis,
    courseImportance,
    semesterStrategies,
    bestCaseCgpa,
    worstCaseCgpa,
  };
};