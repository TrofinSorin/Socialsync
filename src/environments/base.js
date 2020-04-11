export default function(baseApi, domainUrl) {
  return {
    domainUrl: domainUrl,
    cookies: {
      expiration: 30
    },
    intervals: {
      logout: 3600 // 1 hour in seconds
    },
    api: {
      baseApi: `${baseApi}/api/v1`,
      dashboard: `${baseApi}/api/v1/dashboards`,
      schedule: `${baseApi}/api/v1/schedule`
    },
    token: {
      auth: process.env.AUTH_TOKEN
    },
    logoutRedirectTimeout: 2e3,
    socialApps: {
      facebook: {
        appId: '581156889119874'
      },
      google: {
        clientId: 'PUT_CLIENT_ID_HERE'
      }
    }
  };
}
