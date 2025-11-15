import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services/auth.service.js";
import { GoogleAuthRequest } from "../types/auth.js";
import { UnauthorizedError } from "../utils/errors.js";

export class AuthController {
    constructor(private authService: AuthService) {}

    async googleAuth(request: FastifyRequest<{Body: GoogleAuthRequest}>, reply: FastifyReply) {
        const { idToken } = request.body;

        if(!idToken) {
            return reply.code(400).send({ error: 'Missing required parameter'});
        }
        
      try {
        const { user, session } = await this.authService.authenticateWithGoogle(
          idToken,
          request.ip,
          request.headers['user-agent'] || ''
      );

      return reply.send({
        token: session.token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
        expiresAt: session.expiresAt
      });
        } catch (error) {
        if (error instanceof UnauthorizedError) {
            return reply.code(401).send({ error: 'Unauthorized' });
        }
        throw error;
        }
    }

    async authMiddleWare(request: FastifyRequest, reply: FastifyReply) {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({
          error: 'Unhautorized',
        });
      }

        const token = authHeader?.split(" ")[1];

        const session = await this.authService.findSession(token!);

        if (!session || new Date() > session.expiresAt) {
        return reply.code(401).send({ error: "Unhautorized" });
       }

       request.user = session.user;
    }
}
