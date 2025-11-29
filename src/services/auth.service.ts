import { OAuth2Client } from "google-auth-library";
import { UserRepository } from "../repositories/user.repository.js";
import { AccountRepository } from "../repositories/account.repository.js";
import { SessionRepository } from "../repositories/session.repository.js";
import { UnauthorizedError } from "../utils/errors.js";

export class AuthService {
  constructor(
    private googleClient: OAuth2Client,
    private userRepository: UserRepository,
    private accountRepository: AccountRepository,
    private sessionRepository: SessionRepository
  ) {}

  async findSession(token: string) {
    return await this.sessionRepository.retrieveByToken(token);
  }

  async authenticateWithGoogle(
    idToken: string,
    ipAddress: string,
    userAgent: string
  ) {
    const ticket = await this.googleClient
      .verifyIdToken({
        idToken,
        audience: [
          process.env.GOOGLE_CLIENT_ID!,
          process.env.GOOGLE_ANDROID_CLIENT_ID!,
        ],
      })
      .catch(() => {
        throw new UnauthorizedError("Invalid token");
      });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new UnauthorizedError("Invalid token");
    }

    let user = await this.userRepository.findByEmail(payload.email);

    if (!user) {
      user = await this.userRepository.create({
        email: payload.email,
        name: payload.name!,
        image: payload.picture || null,
      });

      await this.accountRepository.create({
        userId: user.id,
        accountId: payload.sub,
        providerId: "google",
        accessToken: null,
        refreshToken: null,
      });
    }

    const session = await this.sessionRepository.create(
      user.id,
      ipAddress,
      userAgent
    );

    return { user, session };
  }
}
