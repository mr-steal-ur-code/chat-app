import { createStore } from '@stencil/store';
import setCache from './helpers/setCache';

const { state, onChange } = createStore({
  session: null,
  profile: null,
  roles: ['tester', 'tech', 'client', 'worker'],
  material: [],
  claims: null,
  users: {},
});

onChange('session', value => {
  localStorage.setItem('chatApp:session', JSON.stringify(value));
});

onChange('claims', async value => {
  await setCache('chatApp:claims', value);
});

onChange('profile', async value => {
  await setCache('chatApp:profile', value);
  console.log(value, 'profile');
});

export default state;
