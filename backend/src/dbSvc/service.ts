import mongoose, { Document, Model } from 'mongoose';

export class DbSvc {
  private mongoDbUrl: string;
  private mongoose: typeof mongoose;
  private db: mongoose.Connection;

  constructor() {
    this.mongoDbUrl = process.env.MONGO_DB_URL!;
    this.mongoose = mongoose;
    this.mongoose.connect(this.mongoDbUrl);
    this.db = mongoose.connection;
    this.db.once('open', async () => {
      console.log('Connected to database');
    });
  }

  public async get<D extends Document>(args: {
    model: Model<D>;
    id: string;
  }): Promise<D | null> {
    const { id } = args;
    try {
      return await args.model.findOne({ id });
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }

  public async list<D extends Document>(args: {
    model: Model<D>;
    userId: string;
  }): Promise<D[]> {
    try {
      return await args.model.find({ userId: args.userId });
    } catch (error) {
      console.log('error', error);
      return [];
    }
  }

  public async create<D extends Document>(args: {
    model: mongoose.Model<D>;
    data: mongoose.ObtainDocumentType<D>;
  }): Promise<D | null> {
    const { model, data } = args;
    try {
      const createdDocument = await model.create(data);
      return createdDocument;
    } catch (error) {
      console.error('Error during document creation:', error);
      return null;
    }
  }

  public async update<D extends Document>(args: {
    model: mongoose.Model<D>;
    data: mongoose.ObtainDocumentType<D>;
    _id: mongoose.Types.ObjectId;
  }): Promise<D | null> {
    const { model, data, _id } = args;
    try {
      return await model.findOneAndUpdate({ _id }, data, {
        new: true,
        runValidators: true
      });
    } catch (error) {
      return null;
    }
  }

  public async delete<D extends Document>(args: {
    model: mongoose.Model<D>;
    _id: mongoose.Types.ObjectId;
  }): Promise<boolean> {
    const { model, _id } = args;
    try {
      await model.deleteOne({ _id });
      return true;
    } catch (error) {
      return false;
    }
  }
}
