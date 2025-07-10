import axios, {AxiosError} from "axios";

const headers = {
  headers: {"Content-Type": "application/json"}
};
const server_address = "http://artur.peshko.tw.cs.unibo.it";

export interface Response<T> {
  status: number,
  data: T,
}

export type FailedResponse = { data: string, status: number, statusText: string } | "ERR_NETWORK";

export function endpoint(endpoint: string): string {
  return server_address.concat(endpoint);
}

export async function postApi<T>(api: string, data: any): Promise<Response<T> | FailedResponse> {
  try {
    let response = await axios.post(endpoint(api), JSON.stringify(data), headers);
    return {data: response.data as T, status: response.status};
  } catch (error: any) {
    let axiosError = error as AxiosError;
    if (axiosError.code === "ERR_NETWORK") {
      return "ERR_NETWORK";
    } else {
      return {
        data: axiosError.response?.data,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText
      } as FailedResponse;
    }
  }
}

export async function checkToken(token: string): Promise<boolean> {
  let response = await postApi<string>("/user/token/check", {
    token: token
  });
  if (response === "ERR_NETWORK") return false;
  else return response.status === 200;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccess {
  token: string
}

export type LoginFail = "NO_USER" | "NO_NET";

export async function login(params: LoginRequest): Promise<LoginSuccess | LoginFail> {
  let response = await postApi<LoginSuccess>("/login", params);
  if (response === "ERR_NETWORK") return "NO_NET";
  else if (response.status === 200) return response.data as LoginSuccess;
  else return "NO_USER";
}

export interface RegisterRequest {
  email: string;
  password: string;
  handle: string;
  displayName: string;
}

export interface RegisterSuccess {
  token: string
}

export type RegisterFail = "EMAIL_FOUND" | "NO_NET" | "NO_INSERT";

export async function register(params: RegisterRequest): Promise<RegisterSuccess | RegisterFail> {
  let response = await postApi<RegisterSuccess>("/register", params);
  if (response === "ERR_NETWORK") return "NO_NET";
  else if (response.status === 200) return "EMAIL_FOUND";
  else if (response.status === 500) return "NO_INSERT";
  else return response.data as RegisterSuccess;
}