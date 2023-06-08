import state from '../store';

export default function isAdmin() {
  return state?.session && state?.claims?.admin;
}
