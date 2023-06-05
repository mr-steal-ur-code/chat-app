import { DatabaseService } from '@fireenjin/sdk';

export default class BaseModel {
  collectionName: string;
  db: DatabaseService;
  constructor(db: DatabaseService, collectionName?: string) {
    this.db = db;
    this.collectionName = collectionName;
  }
  async find(id: string) {
    return await this.db.find(this.collectionName, id);
  }
  async add(data: any) {
    return await this.db.add(this.collectionName, data);
  }
  async delete(path: string, id: string) {
    return await this.db.delete(path, id);
  }
  async update(id: string, data: any) {
    return await this.db.update(this.collectionName, id, data);
  }
  async setDoc(path: string, id: string, data: any) {
    return await this.db.setDocument(path, data, id);
  }
  async list(where?: any, orderBy?: any) {
    return await this.db.list(this.collectionName, where, orderBy);
  }
}
