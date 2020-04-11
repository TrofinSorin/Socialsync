import environment from './base';

const domainUrl = 'localhost';
const baseApi = 'http://localhost:8000';
const env = environment(baseApi, domainUrl);

export default {
  ...env,
  intervals: {
    ...env.intervals,
    logout: 300 // 5 min in seconds
  }
};
