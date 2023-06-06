import state from '../global/store';

export default function isLoggedIn() {
  return state?.session;
}
