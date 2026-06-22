import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ZapierAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    
    if (!authHeader) {
      throw new UnauthorizedException('No Authorization header found');
    }
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Invalid Authorization header format');
    }
    
    const token = parts[1];
    const zapierApiKey = process.env.ZAPIER_API_KEY || 'dev-zapier-key';
    
    if (token !== zapierApiKey) {
      throw new UnauthorizedException('Invalid Zapier API Key');
    }
    
    return true;
  }
}
