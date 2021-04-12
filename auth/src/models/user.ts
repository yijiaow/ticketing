import mongoose, { Schema } from 'mongoose';
import { Password } from '../services/hash';

// An interface that describes the properties required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes to properties a user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new Schema(
  { email: String, password: String },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Define a pre hook for the model
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hash = await Password.toHash(this.get('password'));
    this.set('password', hash);
  }
  next();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
