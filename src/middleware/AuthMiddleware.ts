import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

export interface TokenPayload {
  email: string
  username: string
  id: number
}

export interface JwtRequest extends Request {
  decoded?: TokenPayload
  file: Express.MulterS3.File
}

export interface RequestImg extends Request {
  file: Express.MulterS3.File
}

//app.post('/', 인증미들웨어, 글작성 함수)
export class AuthMiddleware {
  static verifyToken = (req: JwtRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(403).send('A token is required')
    }

    try {
      const decoded = verify(token, process.env.SECRET_ATOKEN) as TokenPayload
      req.decoded = decoded
    } catch (err) {
      return res.status(401).send('Invalid Token')
    }

    return next()
  }
}
