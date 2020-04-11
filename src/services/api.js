import environment from 'environment';
import axios from 'axios';

const API_PATH = environment.api.baseApi;

export const get = apiEndpoint => {
  return axios.get(API_PATH + apiEndpoint).then(response => {
    return response;
  });
};

export const post = (apiEndpoint, payload) => {
  return axios.post(API_PATH + apiEndpoint, payload).then(response => {
    return response.data;
  });
};

export const put = (apiEndpoint, payload) => {
  return axios.put(API_PATH + apiEndpoint, payload).then(response => {
    return response.data;
  });
};

export const deleteMethod = (apiEndpoint, payload) => {
  return axios.delete(API_PATH + apiEndpoint, payload).then(response => {
    return response.data;
  });
};
