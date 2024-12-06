export const sendResponse = (success: boolean, message: string, data?: any) => {
  return {
    success: success,
    message: message,
    data: data,
  };
};
