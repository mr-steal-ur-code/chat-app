import { connectFirestore } from '@fireenjin/graphql';
import setUserClaims from './setUserClaims';

describe('Set User Claims', () => {
  connectFirestore({
    serviceAccount: true,
  });
  it('Should Set a user&#x27;s claims on Firebase Auth', async () => {
    const response = await setUserClaims({
      userId: 'bZopNAQgkrOM64fwa3upceACPoJ3',
      claims: {
        role: 'tech',
        admin: true,
        tester: true,
      },
    });
    console.log(response);
    expect(response).toMatchObject({ uid: 'bZopNAQgkrOM64fwa3upceACPoJ3' });
  });
});
