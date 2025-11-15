import { PrismaClient } from "@prisma/client/extension";

export class AccountRepository {
    constructor(private prisma: PrismaClient) {}


    async create(data: {userId: string; accountId: string; providerId: string; accessToken: string | null; refreshToken: string | null}) {
        return this.prisma.account.create({
            data: {...data}
        });
    }
}