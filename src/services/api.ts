import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from "@storage/storageAuth";
import { AppError } from "@utils/AppError";
import axios, { AxiosError, AxiosInstance } from "axios";

type SignOut = () => void;

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailed: (error: AxiosError) => void;
};

const api = axios.create({
  baseURL: "http://192.168.2.170:3333",
}) as APIInstanceProps;

let failedRequestsQueue: PromiseType[] = [];
let isRefreshing = false;

// registerInterceptTokenManager WAS CREATED TO API HAVE ACCESS TO THE CONTEXT SIGN OUT FUNCTION RECEIVING SIGN OUT FUNCTION AS PARAM  TO BE CALLED INSIDE THE APPLICATION CONTEXT

api.registerInterceptTokenManager = (signOut) => {
  const intercepTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        if (
          requestError.response?.data?.message === "token.expired" ||
          requestError.response?.data?.message === "token.invalid"
        ) {
          //NEW TOKEN PROCESS
          const { refresh_token } = await storageAuthTokenGet();
          if (!refresh_token) {
            signOut();
            return Promise.reject(requestError);
          }

          const originalRequest = requestError.config;

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedRequestsQueue.push({
                onSuccess: (token: string) => {
                  originalRequest.headers = {
                    Authorization: `Bearer ${token}`,
                  };
                },
                onFailed: (error: AxiosError) => {
                  reject(error);
                },
              });
            });
          }

          isRefreshing = true;

          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post("/sessions/refresh-token", {
                refresh_token,
              });
              if (originalRequest.data) {
                originalRequest.data = JSON.parse(originalRequest.data);
              }

              originalRequest.headers = {
                Authorization: `Bearer ${data.token}`,
              };
              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${data.token}`;

              failedRequestsQueue.forEach((request) => {
                request.onSuccess(data.token);
              });

              resolve(api(originalRequest));
            } catch (error: any) {
              failedRequestsQueue.forEach((request) => {
                request.onFailed(error);
              });
              //SING USER OUT IF THE ERROR IS NOT RELATED TO TOKEN
              signOut();
              reject(error);
            } finally {
              isRefreshing = false;
            }
          });
        }
      }

      //RETURNS DIFFERENT MESSAGES BASED ON THE TYPE OF ERROR RETURNED BY THE SERVER (NOT RELATED TOKEN ERRORS
      //THE SERVER CAN RETURN GENERIC OU SPECIFICS MESSAGE ERRORS
      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        return Promise.reject(new AppError(requestError));
      }
    }
  );
  //MUST EJECT/CLEAN THE INTERCEPTOR AFTER THE INTERCEPTION
  return () => {
    api.interceptors.response.eject(intercepTokenManager);
  };
};

export { api };
