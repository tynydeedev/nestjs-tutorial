import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './users.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(credentials: AuthCredentialsDto): Promise<User> {
    const { username, password } = credentials;

    const salt = await bcrypt.genSalt();
    const hassedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hassedPassword,
    });

    try {
      const result = await this.save(user);
      return result;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
