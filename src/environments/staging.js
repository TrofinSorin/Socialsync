import environment from './base';

const baseApi = 'http://localhost:3000';
const env = environment(baseApi);

export default {
  ...env,
  intervals: {
    ...env.intervals,
    logout: 300 // 5 min in seconds
  }
};
