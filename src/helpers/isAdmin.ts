import state from '../global/store';

export default function isAdmin() {
  return state?.session && state?.claims?.admin;
}
