import { DatabaseService } from '@fireenjin/sdk';
import BaseModel from './baseModel';

export default class Room extends BaseModel {
  constructor(db: DatabaseService) {
    super(db, 'rooms');
  }
}
