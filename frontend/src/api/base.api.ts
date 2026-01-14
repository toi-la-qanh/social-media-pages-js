import axios, { type AxiosInstance } from "axios";

/**
 * For reusable api purposes
 */
export default class BaseApi {
  private _axios: AxiosInstance;

  constructor() {
    this._axios = axios.create({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true,
    //   withXSRFToken: true
    });
  }

  /**
   * Send request to the API
   * @param method - The HTTP method to use
   * @param url - The URL to send the request to
   * @param data - The data to send with the request
   * @param params - The parameters to send with the request
   * @returns The response from the API
   */
  async request(method: string, url: string, data = null, params = null) {
    try {
      const response = await this._axios({ method, url, data, params });
      return JSON.parse(JSON.stringify(response.data));
    } catch (error: any) {
      if (error.response) {
        // Server responded with an error status code
        return error.response.data;
      } else if (error.request) {
        // Request was made but no response was received (network issues)
        return {'errors': 'Network Error: No response from server'};
      } else {
        // Something else triggered an error (e.g., bad request setup)
        return {'errors': `Unknown Error: ${error.message}`};
      }
    }
  }

  /**
   * Axios GET Method
   */
  get(url: string, params: any = null) {
    return this.request('get', url, null, params);
  }

  /**
   * Axios POST Method
   */
  post(url: string, data: any, params: any = null) {
    return this.request('post', url, data, params);
  }

  /**
   * Axios PUT Method
   */
  put(url: string, data: any, params: any = null) {
    return this.request('put', url, data, params);
  }

  /**
   * Axios PATCH Method
   */
  patch(url: string, data: any, params: any = null) {
    return this.request('patch', url, data, params);
  }

  /**
   * Axios DELETE Method
   */
  delete(url: string, data: any = null, params: any = null) {
    return this.request('delete', url, data, params);
  }
}