import * as SHA1 from './sha1';
import * as Base64 from './base64';

const formatDate = d => {
  const pad = function(num) {
    return ('0' + num).slice(-2);
  };
  const formattedDate =
    [d.getUTCFullYear(), pad(d.getUTCMonth() + 1), pad(d.getUTCDate())].join('-') +
    'T' +
    [pad(d.getUTCHours()), pad(d.getUTCMinutes()), pad(d.getUTCSeconds())].join(':') +
    'Z';

  return formattedDate;
};

const generateNonce = () => {
  const length = 16;
  const nonceChars = '0123456789abcdef';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += nonceChars.charAt(Math.floor(Math.random() * nonceChars.length));
  }

  return result;
};

export const getHeader = (accessToken, username) => {
  if (!accessToken || !username) {
    return '';
  }

  SHA1.setB64Pad('=');

  const created = formatDate(new Date());
  const nonce = generateNonce();
  const nonce64 = Base64.base64encode(nonce);
  const passwordDigest = SHA1.b64_sha1(nonce + created + accessToken);

  const header =
    'UsernameToken Username="' +
    username +
    '", PasswordDigest="' +
    passwordDigest +
    '", Nonce="' +
    nonce64 +
    '", Created="' +
    created +
    '"';

  return header;
};

export default getHeader;
