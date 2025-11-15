import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { OAuth2Client } from "google-auth-library";
import type { GoogleAuthRequest, AuthResponse, UserResponse, LogoutResponse } from '../types/auth.js'
import { AuthController } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import { UserRepository } from "../repositories/user.repository.js";
import { AccountRepository } from "../repositories/account.repository.js";
import { SessionRepository } from "../repositories/session.repository.js";
import { prisma } from "../utils/prisma.js";


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export async function authRoutes(fastify: FastifyInstance) {

    const userRepository = new UserRepository(prisma);
    const accountRepository = new AccountRepository(prisma);
    const sessionRepository = new SessionRepository(prisma);
    
    const authService = new AuthService(
        googleClient,
        userRepository,
        accountRepository,
        sessionRepository
    );

    const authController = new AuthController(authService);


    fastify.post<{Body: GoogleAuthRequest}>
    ('/api/auth/google', authController.googleAuth.bind(authController));
}


