import { ApiResponseOptions } from '@nestjs/swagger';

export const DefaultUnauthorizedResponse: ApiResponseOptions = {
  description: 'Unauthorized',
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'number', example: 401 },
      message: { type: 'string', example: 'Unauthorized' },
    },
  },
};
