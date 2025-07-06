export const ApiRoutes = {
  CHECK_NUMBER: '/api/check-number',
  SUBMIT_REPORT: '/api/submit-report',
  NUMBER_DETAILS: (phone: string) => `/api/number-details/${phone}`,
  ADD_COMMENT: '/api/add-comment',
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
};
