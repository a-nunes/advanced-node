export type HttpResponse = {
  statusCode: number,
  data: any,
};

export const badRequest = (error: Error) => ({
  statusCode: 400,
  data: error,
});
