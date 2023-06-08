import state from '../store';

export default function isLoggedIn() {
  return state?.session;
}
