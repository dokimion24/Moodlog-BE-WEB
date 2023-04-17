import { Request, Response } from 'express'
import { myDataBase } from '../db'
import { User } from '../entity/User'
import { generateAccessToken, generatePassword, generateRefreshToken, registerToken } from '../util/Auth'
import { verify } from 'jsonwebtoken'

interface MulterS3Request extends Request {
  file: Express.MulterS3.File
}

export class UserController {
  static register = async (req: MulterS3Request, res: Response) => {
    const { email, password, username } = req.body

    const { location } = req.file

    const existUser = await myDataBase.getRepository(User).findOne({
      where: { email },
    })

    if (existUser) {
      //아이디중복
      return res.status(400).json({ error: 'Duplicate User' })
    }

    const user = new User()
    user.email = email
    user.password = await generatePassword(password)
    user.username = username
    user.profile_image = location

    const newUser = await myDataBase.getRepository(User).save(user)

    const accessToken = generateAccessToken(newUser.id, newUser.username, newUser.email)

    const refreshToken = generateRefreshToken(newUser.id, newUser.username, newUser.email)

    registerToken(refreshToken, accessToken)

    const decoded = verify(accessToken, process.env.SECRET_ATOKEN)
    res.cookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      maxAge: 3600 * 24 * 30 * 1000,
    })
    res.send({ content: decoded, accessToken })
  }
}
