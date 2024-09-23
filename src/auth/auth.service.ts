import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { identity } from 'rxjs';

const fakeUsers = [
  {
    id: 1,
    username: 'john',
    password: 'changeme',
  },
  {
    id: 2,
    username: 'maria',
    password: 'guess',
  },
];
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateUser(authPayloadDto: AuthPayloadDto) {
    const { username, password } = authPayloadDto;
    const user = fakeUsers.find((user) => user.username === username && user.password === password);
    if (!user) {
      return null;
    }
    const { password: _, ...result } = user;
    return this.jwtService.sign({ result });
  }
}
