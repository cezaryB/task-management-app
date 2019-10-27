import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}
  
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const result = await this.userRepository.validateUserPassword(authCredentialsDto);

    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
