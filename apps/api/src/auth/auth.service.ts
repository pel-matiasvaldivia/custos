import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return null;

    // Check if locked
    if (user.locked_until && user.locked_until > new Date()) {
      throw new UnauthorizedException(
        `Cuenta bloqueada temporalmente hasta ${user.locked_until.toISOString()}`,
      );
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      // Reset on success
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failed_attempts: 0, locked_until: null },
      });
      const { password, ...result } = user;
      return result;
    } else {
      // Increment failed attempts
      const newAttempts = user.failed_attempts + 1;
      let lockedUntil = null;

      if (newAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 60 * 60 * 1000); // Lock for 1 hour
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { failed_attempts: newAttempts, locked_until: lockedUntil },
      });

      return null;
    }
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      tenant_id: user.tenant_id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
