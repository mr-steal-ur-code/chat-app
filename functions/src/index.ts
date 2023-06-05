import * as functions from 'firebase-functions';
import setUserClaims from './units/setUserClaims/setUserClaims';

const cors = require('cors')({ origin: true });
const setClaims = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    const input = req?.body || req?.params || req?.query;
    res.send(await setUserClaims(input));
  });
});

export { setClaims };