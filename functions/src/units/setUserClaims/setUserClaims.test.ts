import { connectFirestore } from '@fireenjin/graphql';
import setUserClaims from './setUserClaims';

describe('Set User Claims', () => {
  connectFirestore({
    serviceAccount: true,
  });
  it('Should Set a users claims on Firebase Auth', async () => {
    const response = await setUserClaims({
      userId: 'LRa13z6BIkWM5dKvFVeGHwwSVdS2',
      claims: {
        admin: false,
        tester: true,
        role: 'tester',
      },
    });
    console.log(response);
    expect(response).toMatchObject({ uid: 'LRa13z6BIkWM5dKvFVeGHwwSVdS2' });
  });
});
