import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as brcypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = new User();
    const salt = await brcypt.genSalt();

    user.username = username;
    user.password = await this.hashPassword(password, salt);
    user.salt = salt;

    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    const passwordMatches = await user.validatePassword(password);

    if (user && passwordMatches) {
      return user.username;
    }

    return void 0;
  }

  private hashPassword(password: string, salt: string): Promise<string> {
    return brcypt.hash(password, salt);
  }
}