export const AppRoutes = {
  HOME: '/',
  REPORT_FRAUD: '/report-fraud',
  ABOUT: '/about',
  DOWNLOAD: '/download',
  LOGIN: '/login',
  REGISTER: '/register',
  OTP_VERIFICATION: '/otp-verification',
  PROFILE: '/profile',
  NUMBER_DETAILS: (phone: string) => `/number/${phone}`,
  APP_STORE: '#',
  GOOGLE_PLAY: '#',
};
