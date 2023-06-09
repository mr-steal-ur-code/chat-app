import { DatabaseService } from '@fireenjin/sdk';
import BaseModel from './baseModel';

export default class MessageModel extends BaseModel {
  constructor(db: DatabaseService) {
    super(db, 'messages');
  }
}
