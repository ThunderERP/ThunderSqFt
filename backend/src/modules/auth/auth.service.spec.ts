// src/modules/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

const mockPrisma = {
  user: { findUnique: jest.fn(), create: jest.fn() },
};
const mockJwt = { sign: jest.fn().mockReturnValue('mock.jwt.token') };
const mockConfig = { get: jest.fn().mockReturnValue('24h') };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('throws UnauthorizedException for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.validateUser('x@x.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for inactive user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1, isActive: false, passwordHash: 'hash',
      });
      await expect(service.validateUser('x@x.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      const hash = await bcrypt.hash('correctpassword', 12);
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1, isActive: true, passwordHash: hash });
      await expect(service.validateUser('x@x.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });

    it('returns user without passwordHash on success', async () => {
      const hash = await bcrypt.hash('mypassword', 12);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1, name: 'Dev', email: 'dev@x.com', role: Role.DEVELOPER_ADMIN,
        isActive: true, passwordHash: hash,
      });
      const result = await service.validateUser('dev@x.com', 'mypassword');
      expect(result).not.toHaveProperty('passwordHash');
      expect(result).toHaveProperty('id', 1);
    });
  });

  describe('login', () => {
    it('returns access_token and user object', async () => {
      const result = await service.login({ id: 1, email: 'a@b.com', role: 'SALES_STAFF' });
      expect(result).toHaveProperty('access_token', 'mock.jwt.token');
      expect(result.user).toEqual({ id: 1, email: 'a@b.com', role: 'SALES_STAFF' });
    });
  });

  describe('register', () => {
    it('throws ConflictException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1 });
      await expect(
        service.register({ name: 'X', email: 'x@x.com', password: 'pass1234', role: Role.SALES_STAFF }),
      ).rejects.toThrow(ConflictException);
    });

    it('creates user with hashed password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 2, name: 'New', email: 'new@x.com', role: Role.SALES_STAFF, createdAt: new Date(),
      });
      const result = await service.register({
        name: 'New', email: 'new@x.com', password: 'securePass1', role: Role.SALES_STAFF,
      });
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ email: 'new@x.com' }),
        }),
      );
      expect(result).toHaveProperty('id');
    });
  });
});
