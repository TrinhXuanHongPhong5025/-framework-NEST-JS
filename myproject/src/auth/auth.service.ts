import {
  BadRequestException,
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../user/user.entity';

const DUPLICATE_ACCOUNT_MESSAGE = 'Email hoặc Tên đăng nhập đã tồn tại';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) return;

    const adminCount = await this.userRepository.count({
      where: { role: UserRole.ADMIN },
    });
    if (adminCount === 0) {
      await this.createAccount(
        ADMIN_USERNAME,
        ADMIN_EMAIL,
        ADMIN_PASSWORD,
        UserRole.ADMIN,
      );
    }
  }

  async register(username: string, email: string, password: string) {
    return this.createAccount(username, email, password, UserRole.ADMIN);
  }

  async createAdmin(username: string, email: string, password: string) {
    return this.createAccount(username, email, password, UserRole.ADMIN);
  }

  private async createAccount(
    username: string,
    email: string,
    password: string,
    role: UserRole,
  ) {
    const normalizedUsername = username?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedUsername || normalizedUsername.length < 3) {
      throw new BadRequestException('Tên đăng nhập phải có ít nhất 3 ký tự');
    }
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new BadRequestException('Email không hợp lệ');
    }
    if (!password || password.length < 8) {
      throw new BadRequestException('Mật khẩu phải có ít nhất 8 ký tự');
    }

    const existingUser = await this.userRepository.findOne({
      where: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });
    if (existingUser) {
      throw new ConflictException(DUPLICATE_ACCOUNT_MESSAGE);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    try {
      const savedUser = await this.userRepository.save(user);
      return {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
      };
    } catch (error) {
      const driverCode = error?.driverError?.code;
      if (driverCode === 'SQLITE_CONSTRAINT' || driverCode === 'ER_DUP_ENTRY') {
        throw new ConflictException(DUPLICATE_ACCOUNT_MESSAGE);
      }
      throw error;
    }
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const match = await bcrypt.compare(
      password,
      user.password,
    );

    if (!match) {
      throw new UnauthorizedException();
    }

    if (user.role !== UserRole.ADMIN) {
      user.role = UserRole.ADMIN;
      await this.userRepository.save(user);
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: UserRole.ADMIN,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: UserRole.ADMIN,
      },
    };
  }
}