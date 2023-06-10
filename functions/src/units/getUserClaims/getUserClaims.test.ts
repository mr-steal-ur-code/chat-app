import { connectFirestore } from '@fireenjin/graphql';
import getUserClaims from './getUserClaims';

describe('Get User Claims', () => {
  connectFirestore({
    serviceAccount: true,
  });
  it('Should Get a user&#x27;s claims on Firebase Auth', async () => {
    const response = await getUserClaims({
      userId: 'LRa13z6BIkWM5dKvFVeGHwwSVdS2',
    });
    console.log(response);
    expect(response).toMatchObject({ uid: 'LRa13z6BIkWM5dKvFVeGHwwSVdS2' });
  });
});
