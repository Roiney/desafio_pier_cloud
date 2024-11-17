import { ApiResponseOptions } from '@nestjs/swagger';

export const DefaultForbiddenResponse: ApiResponseOptions = {
  description: 'Forbidden resource',
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'number', example: 403 },
      message: { type: 'string', example: 'Forbidden resource' },
      error: { type: 'string', example: 'Forbidden' },
    },
  },
};
