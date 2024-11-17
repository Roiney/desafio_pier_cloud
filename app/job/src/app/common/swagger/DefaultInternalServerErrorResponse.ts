import { ApiResponseOptions } from '@nestjs/swagger';

export const DefaultInternalServerErrorResponse: ApiResponseOptions = {
  description: 'Internal server error',
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'number', example: 500 },
      message: { type: 'string', example: 'Internal server error' },
    },
  },
};
