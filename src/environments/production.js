// src/environments/production.ts
import environment from './base';

const baseApi = 'http://localhost:3000';
const env = environment(baseApi);

export default {
  ...env
};
