import Cookies from 'js-cookie';
import environment from 'environment';
import update from 'immutability-helper';

const Auth = {
  isAuthenticated: false,
  guestInfo: {},
  user: {},
  authenticate(data) {
    console.log('authenticate user:', data);
    if (!data) {
      return;
    }

    Cookies.set('accessToken', data ? data.accessToken : null, {
      expires: environment.cookies.expiration,
      path: '/',
      domain: environment.domainUrl
    });
    Cookies.set('username', data.loginUser ? data.loginUser.username : null, {
      expires: environment.cookies.expiration,
      path: '/',
      domain: environment.domainUrl
    });
    Cookies.set('id', data.loginUser ? data.loginUser.id : null, {
      expires: environment.cookies.expiration,
      path: '/',
      domain: environment.domainUrl
    });

    this.isAuthenticated = true;
    this.user = data;
  },
  init() {
    const accessToken = Cookies.get('accessToken');
    const username = Cookies.get('username');
    const id = Cookies.get('id');

    if (accessToken && username && id) {
      this.authenticate({
        accessToken,
        loginUser: { username, id }
      });
    }
  },
  update(userData) {
    console.log('data:', userData.data);
    if (!userData) {
      return;
    }

    this.user = update(this.user, {
      $merge: {
        dateCreated: userData.dateCreated,
        dateUpdated: userData.dateUpdated,
        username: userData.data.username,
        id: userData.data.id,
        lastLogin: userData.lastLogin,
        phone: userData.phone,
        role: userData.role ? userData.role : null
      }
    });
  },
  guestAuthenticate(guestInfo) {
    this.isAuthenticated = true;
    this.guestInfo = guestInfo;
  },
  signout() {
    this.isAuthenticated = false;
    this.reset();
    this.user = {};
  },
  signoutGuestAuth() {
    this.isAuthenticated = false;
    this.guestInfo = {};
  },
  getUser() {
    return {
      ...this.user
    };
  },
  getGuestAuth() {
    return {
      ...this.guestInfo
    };
  },
  reset() {
    Object.keys(this.user).forEach(el => {
      Cookies.remove(el);
    });
  }
};

export default Auth;
