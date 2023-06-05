import { Timestamp } from '@firebase/firestore';

export interface LocalCache {
  session?: {
    displayName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    photoURL?: string | null;
    providerId?: string;
    uid?: string;
    [key: string]: any;
  };
  claims?: {
    admin?: boolean;
    tester?: boolean;
    role?: string;
  };
  profile?: User;
}

export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  photo?: string;
  createdAt?: Timestamp;
}
