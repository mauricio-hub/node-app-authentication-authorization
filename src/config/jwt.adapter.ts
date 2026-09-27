import jwt, { SignOptions } from 'jsonwebtoken';

import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {

  static async generateToken(
    payload: any,
    duration: SignOptions['expiresIn'] = '2h'
  ) {

    return new Promise<string | null>((resolve) => {

      jwt.sign(
        payload,
        JWT_SEED,
        { expiresIn: duration },
        (err, token) => {

          if (err) return resolve(null);

          resolve(token ?? null);
        }
      );

    });
  }

  static validateToken(token: string) {

    try {

      const payload = jwt.verify(token, JWT_SEED);

      return payload;

    } catch (error) {

      return null;

    }

  }

}