import { SetMetadata } from '@nestjs/common';

export const Scopes = (...scopeIds: string[]) => SetMetadata('scopes', scopeIds);
