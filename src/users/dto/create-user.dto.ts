import { User } from '../entities/user.entity';

export class CreateUserDto {
  // readonly _id: string;
  readonly name: string;
  readonly email: string;
}

// export function toUserDTO(user: User): CreateUserDto {
//   return {
//     _id: user._id.toHexString(),
//     name: user.name,
//     email: user.email,
//   };
// }
