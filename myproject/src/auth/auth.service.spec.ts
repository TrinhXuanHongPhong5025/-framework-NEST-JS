import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../user/user.entity';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const userRepository = {
    count: jest.fn().mockResolvedValue(1),
    create: jest.fn((user) => user),
    findOne: jest.fn().mockResolvedValue(null),
    save: jest.fn((user) => Promise.resolve({ id: 1, ...user })),
  };
  const jwtService = { sign: jest.fn(() => 'signed-token') };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a new admin with a hashed password', async () => {
    const result = await service.createAdmin('new-admin', 'ADMIN@example.com', 'password123');

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'new-admin',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      }),
    );
    expect(userRepository.create.mock.calls[0][0].password).not.toBe('password123');
    expect(result).toEqual({
      id: 1,
      username: 'new-admin',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
    });
  });

  it('registers new accounts with the admin role', async () => {
    const result = await service.register('new-admin', 'admin@example.com', 'password123');

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ role: UserRole.ADMIN }),
    );
    expect(result.role).toBe(UserRole.ADMIN);
  });

  it('promotes existing accounts to admin on successful login', async () => {
    const existingUser = {
      id: 8,
      username: 'old-user',
      email: 'old@example.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.VISITOR,
    };
    userRepository.findOne.mockResolvedValueOnce(existingUser);

    const result = await service.login('old-user', 'password123');

    expect(existingUser.role).toBe(UserRole.ADMIN);
    expect(userRepository.save).toHaveBeenCalledWith(existingUser);
    expect(result.user.role).toBe(UserRole.ADMIN);
    expect(jwtService.sign).toHaveBeenCalledWith(expect.objectContaining({ role: UserRole.ADMIN }));
  });

  it('rejects duplicate account identifiers', async () => {
    userRepository.findOne.mockResolvedValueOnce({ id: 2 });

    await expect(
      service.createAdmin('existing', 'existing@example.com', 'password123'),
    ).rejects.toThrow('Email hoặc Tên đăng nhập đã tồn tại');
  });
});
