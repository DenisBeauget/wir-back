import { FastifyRequest, FastifyReply } from 'fastify';

export async function healthController(request: FastifyRequest, reply: FastifyReply) {
  return { status: 'ok', uptime: process.uptime() };
}
