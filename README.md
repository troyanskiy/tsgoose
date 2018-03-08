[![npm version](https://img.shields.io/npm/v/tsgoose.svg)](https://www.npmjs.com/package/tsgoose)

# tsgoose


```ts

import * as bcrypt from 'bcrypt-nodejs';
import {
  getTSGooseModel,
  TSGoose,
  TSGooseDocument,
  TSGooseDocumentQuery,
  TSGooseHook,
  TSGooseHookType,
  TSGooseMethod,
  TSGooseModel,
  TSGooseProp,
  TSGooseQueryHelper,
  TSGooseSchemaOptions
} from 'tsgoose';

// Model/Schema for UserComment subdocument
export class UserComment extends TSGoose {

  // Define Date property
  @TSGooseProp({
    default: Date.now
  })
  date?: Date;

  // Define String property
  @TSGooseProp()
  message: string;

}

// Model/Schema for Group
export class Group extends TSGoose {

  // Define String property
  @TSGooseProp()
  title: string;

  // Define String array property [String]
  @TSGooseProp({
    arrayType: String
  })
  roles: string[];

}

// Just an interface will be treated as Mixed type
export interface IExtraInfo {
  bestFriendName: string;
}


// Model/Schema of User
@TSGooseSchemaOptions({ /* here you can provide options which will be applied for the Schema */})
export class User extends TSGoose {

  // Difine String property with unique flag
  @TSGooseProp({
    unique: true
  })
  email: string;

  @TSGooseProp()
  firstName: string;

  @TSGooseProp()
  lastName: string;

  @TSGooseProp()
  password?: string;

  @TSGooseProp({
    default: 1
  })
  loginCount: number;

  // This is virtual http://mongoosejs.com/docs/guide.html#virtuals
  @TSGooseProp()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // This will create ref property http://mongoosejs.com/docs/populate.html
  // like `group: {type: ObjectId, ref: 'Group'}`
  @TSGooseProp({
    asRef: true
  })
  group: Group;

  // Will create subdocument array property http://mongoosejs.com/docs/subdocs.html
  // like `comments: [UserCommentSchema]
  @TSGooseProp({
    arrayType: UserComment
  })
  comments: UserComment[];

  // Just mixed type
  @TSGooseProp()
  extraInfo: IExtraInfo;


  // Static method http://mongoosejs.com/docs/guide.html#statics
  // I had to put that as instance method property, because if you have it as static the autocompletion in WebStrom does not see it
  @TSGooseMethod({isStatic: true})
  method() {
    console.log('static');
  }

  // Instance method http://mongoosejs.com/docs/guide.html#methods
  @TSGooseMethod()
  matchPassword(candidatePassword: string): Promise<boolean> {
    return new Promise((resolve) => {
      bcrypt.compare(String(candidatePassword), this.password, (err, isMatch) => {
        if (err || !isMatch) {
          return resolve(false);
        }

        resolve(true);
      });
    });
  }


  // A hook
  // http://mongoosejs.com/docs/api.html#schema_Schema-pre
  // http://mongoosejs.com/docs/api.html#schema_Schema-post
  @TSGooseHook({
    type: TSGooseHookType.Pre,
    name: 'save'
  })
  private preSave(next) {
    const user: UserDocument = this as any;

    if (!user.isModified('password')) {
      return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }

      bcrypt.hash(String(user.password), salt, null, (err, hash) => {
        if (err) {
          return next(err);
        }

        user.password = hash;
        next();
      });
    });
  }

  // A query helper
  // http://mongoosejs.com/docs/guide.html#query-helpers
  @TSGooseQueryHelper({name: 'byEmail'})
  private queryHelperFindByEmail(email: string) {
    const query: UserDocumentQuery = this as any;

    return query.find({email});
  }

}

export type UserDocument = TSGooseDocument<User>;
export type UserRepository = TSGooseModel<User>;
export type UserDocumentQuery = TSGooseDocumentQuery<User>;

export type GroupDocument = TSGooseDocument<Group>;
export type GroupRepository = TSGooseModel<Group>;
export type GroupDocumentQuery = TSGooseDocumentQuery<Group>;

const userModel: UserRepository = getTSGooseModel<User>(User);
const groupModel: GroupRepository = getTSGooseModel<Group>(Group);

(async function() {

  const group = new groupModel();
  group.title = 'My group';
  group.roles = ['admin', 'root', 'god'];
  await group.save();

  const user = new userModel({
    firstName: 'Roman',
    lastName: 'R'
  });
  user.email = 'myemail@domain.com';
  user.password = 'mypasss';
  user.group = group;
  user.comments = [{message: 'Hello world'}];
  user.extraInfo = {
    bestFriendName: 'You are'
  };
  await user.save();

  console.log('wehhea');

})();

```
