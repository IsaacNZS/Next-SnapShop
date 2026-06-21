export const getbaseurl = () => {
  if (typeof window === undefined) return "";
  if (process.env.VERSAL_URL) return `https://${process.env.VERSAL_URL}`;
  return "http://localhost:3000";
};
