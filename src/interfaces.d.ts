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
  users?: { [userId: string]: User };
}

export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  role?: string;
  photo?: string;
  createdAt?: Date;
}

export interface Message {
  id?: string;
  createdBy?: User;
  createdAt?: Timestamp;
  text?: string;
}

export interface textRoom {
  id?: string;
  name?: string;
  type?: 'voice' | 'text';
  icon?: any;
  createdBy?: any;
  createdAt?: Date;
}

export interface voiceRoom {
  id?: string;
  name?: string;
  type?: 'voice' | 'text';
  icon?: any;
  createdBy?: any;
  createdAt?: Date;
}
