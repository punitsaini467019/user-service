export const apiResponse = (
  status_code: number,
  status: boolean,
  message: string,
  data?: any,
) => {
  return {
    status_code: status_code,
    status: status,
    message: message,
    data: data,
  };
};
