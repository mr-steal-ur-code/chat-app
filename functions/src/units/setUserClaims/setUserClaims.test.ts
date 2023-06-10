import { connectFirestore } from '@fireenjin/graphql';
import setUserClaims from './setUserClaims';

describe('Set User Claims', () => {
  connectFirestore({
    serviceAccount: true,
  });
  it('Should Set a users claims on Firebase Auth', async () => {
    const response = await setUserClaims({
      userId: 'bJNinURh0UNITOYqc055650re2S2',
      claims: {
        role: 'subscriber',
        admin: true,
        tester: true,
      },
    });
    console.log(response);
    expect(response).toMatchObject({ uid: 'bJNinURh0UNITOYqc055650re2S2' });
  });
});
