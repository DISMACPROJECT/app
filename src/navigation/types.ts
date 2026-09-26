export type RootStackParamList = {
  Root: undefined;
  Auth: undefined;
  NotFound: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Attendance: undefined;
  Tasks: undefined;
  Reports: undefined;
  Profile: undefined;
};

export type AttendanceStackParamList = {
  AttendanceList: undefined;
  AttendanceDetail: { id: string };
};

export type TasksStackParamList = {
  TaskList: undefined;
  TaskDetail: { id: string };
  TaskForm: { id?: string };
  Camera: { taskId: string };
  LocationPicker: { taskId: string };
};

export type ReportsStackParamList = {
  ReportsList: undefined;
  ReportDetail: { id: string };
  ReportGenerator: undefined;
};
