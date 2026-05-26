import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<{ user?: { id?: string } }>();
    // Assuming user is injected into request by auth middleware
    return request.user?.id || 'system-user-id';
  },
);
