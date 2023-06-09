import { DatabaseService } from '@fireenjin/sdk';
import BaseModel from './baseModel';

export default class RoomModel extends BaseModel {
  constructor(db: DatabaseService) {
    super(db, 'rooms');
  }
}
