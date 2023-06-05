import { DatabaseService } from '@fireenjin/sdk';
import BaseModel from './baseModel';

export default class Message extends BaseModel {
  constructor(db: DatabaseService) {
    super(db, 'messages');
  }
}
