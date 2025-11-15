import { PrismaClient } from "@prisma/client/extension";

export class SessionRepository {
    constructor(private prisma: PrismaClient) {}

    async create(userId: string, ipAddress: string, userAgent: string) {
        return this.prisma.session.create({
            data: {
                userId,
                expiresAt: this.expire30Days(),
                token: crypto.randomUUID(),
                ipAddress,
                userAgent
            }
        });
    }

    async retrieveByToken(token: string) {
        return this.prisma.session.findUnique({
            where: { token },
            include: { user: true}
        })
    }

    private expire30Days(): Date {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
}