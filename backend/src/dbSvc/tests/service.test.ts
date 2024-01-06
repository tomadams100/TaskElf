import { DbSvc } from '../service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Model, Document } from 'mongoose';

describe('DbSvc', () => {
  let mongoServer: MongoMemoryServer;
  let exampleModel: Model<Document>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGO_DB_URL = mongoUri;

    const exampleSchema = new mongoose.Schema({
      id: String,
      name: String
    });

    exampleModel = mongoose.model(
      'Example',
      exampleSchema
    ) as unknown as Model<Document>;
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('should connect to the in-memory database', async () => {
    const dbSvc = new DbSvc();
    expect(dbSvc).toBeDefined();
    expect(mongoose.connection.readyState).not.toBe(0);
  });

  it('should handle get operation', async () => {
    const dbSvc = new DbSvc();
    await exampleModel.create({ id: '1', name: 'Example' });

    const result = await dbSvc.get({ model: exampleModel, id: '1' });

    expect(result).toEqual(
      expect.objectContaining({ id: '1', name: 'Example' })
    );
  });

  it('should handle list operation', async () => {
    const dbSvc = new DbSvc();
    await exampleModel.create({ id: '1', name: 'Example 1', userId: '1' });
    await exampleModel.create({ id: '2', name: 'Example 2', userId: '1' });

    const result = await dbSvc.list({ model: exampleModel, userId: '1' });

    expect(result).toHaveLength(2);
  });

  it('should handle create operation', async () => {
    const dbSvc = new DbSvc();
    const data = { id: '1', name: 'New Example' };

    const result = await dbSvc.create({ model: exampleModel, data });

    expect(result).toEqual(expect.objectContaining(data));
  });

  it('should handle update operation', async () => {
    const dbSvc = new DbSvc();
    const originalDocument = await exampleModel.create({
      id: '1',
      name: 'Original Example'
    });
    const updatedData = { name: 'Updated Example' };

    const result = await dbSvc.update({
      model: exampleModel,
      data: updatedData as any,
      _id: originalDocument._id
    });

    expect(result).toEqual(expect.objectContaining(updatedData));
  });

  it('should handle delete operation', async () => {
    const dbSvc = new DbSvc();
    const exampleDocument = await exampleModel.create({
      id: '1',
      name: 'Example to delete'
    });

    const result = await dbSvc.delete({
      model: exampleModel,
      _id: exampleDocument._id
    });

    expect(result).toBe(true);
    const deletedDocument = await exampleModel.findOne({
      _id: exampleDocument._id
    });
    expect(deletedDocument).toBeNull();
  });
});
