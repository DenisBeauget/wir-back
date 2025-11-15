import { betterAuth } from 'better-auth';
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from '../../generated/prisma/client.js';


const prisma = new PrismaClient();

export const auth = betterAuth({
    trustedOrigins: ["http://localhost:8081"],
     database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
});




