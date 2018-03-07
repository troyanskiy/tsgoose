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

export class UserComment extends TSGoose {

  @TSGooseProp({
    default: Date.now
  })
  date?: Date;

  @TSGooseProp()
  message: string;

}

export class Group extends TSGoose {

  @TSGooseProp()
  title: string;

  @TSGooseProp({
    arrayType: String
  })
  roles: string[];

}

export interface IExtraInfo {
  bestFriendName: string;
}


@TSGooseSchemaOptions({})
export class User extends TSGoose {

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

  @TSGooseProp()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @TSGooseProp({
    asRef: true
  })
  group: Group;

  @TSGooseProp({
    arrayType: UserComment
  })
  comments: UserComment[];

  @TSGooseProp()
  extraInfo: IExtraInfo;



  @TSGooseMethod({isStatic: true})
  method() {
    console.log('static');
  }

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


  @TSGooseHook({
    type: TSGooseHookType.Pre,
    name: 'save'
  })
  //tslint:disable-next-line
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