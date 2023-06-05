import { DatabaseService } from '@fireenjin/sdk';
import BaseModel from './baseModel';

export default class UserModel extends BaseModel {
  constructor(db: DatabaseService) {
    super(db, 'users');
  }
}
