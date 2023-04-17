import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { myDataBase } from '../db'
import { User } from '../entity/User'
import bcrypt from 'bcrypt'

export interface TokenPayload {
  email: string
  username: string
  id: number
}

export interface JwtRequest extends Request {
  decoded?: TokenPayload
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

  static verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    const user = await myDataBase.getRepository(User).findOne({
      where: { email },
    })

    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid Password' })
    }

    return next()
  }
}
