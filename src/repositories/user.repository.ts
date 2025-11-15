import { PrismaClient } from "@prisma/client/extension";

export class UserRepository {
    constructor(private prisma: PrismaClient) {}

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email }});
    }

    async create(data: {email: string; name: string; image: string | null}) {
        return this.prisma.user.create({
            data: {...data, emailVerified: true} // df to change it to another auth method
        })
    }
}