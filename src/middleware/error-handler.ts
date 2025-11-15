// middlewares/error-handler.ts
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../utils/errors.js';

export async function errorHandler(
  error: FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);

 
  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      error: error.message,
      code: error.code,
    });
  }

  if (error.statusCode) {
    return reply.code(error.statusCode).send({
      error: error.message,
    });
  }

  return reply.code(500).send({
    error: 'Internal Server Error',
  });
}