export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    access_token: string;
    user: {
      id: string;
      email: string;
    };
  };
}
