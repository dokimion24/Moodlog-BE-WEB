import { Request, Response } from 'express'
import { myDataBase } from '../db'
import { User } from '../entity/User'
import { generateAccessToken, generatePassword, generateRefreshToken, registerToken, removeToken } from '../util/Auth'
import { verify } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { JwtRequest } from '../middleware/AuthMiddleware'

interface MulterS3Request extends Request {
  file: Express.MulterS3.File
}

type JwtwithMulter = JwtRequest & MulterS3Request

export class UserController {
  static register = async (req: MulterS3Request, res: Response) => {
    const { email, password, username } = req.body

    const existUser = await myDataBase.getRepository(User).findOne({
      where: { email },
    })

    if (existUser) {
      return res.status(400).json({ error: 'Duplicate User' })
    }

    const user = new User()
    user.email = email
    user.password = await generatePassword(password)
    user.username = username
    if (req.file) {
      const { location } = req.file
      user.profile_image = location
    }

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

  static getProfile = async (req: JwtRequest, res: Response) => {
    const decoded = req.decoded
    const result = await myDataBase.getRepository(User).findOne({
      where: { id: Number(decoded.id) },
      select: {
        id: true,
        email: true,
        username: true,
        profile_image: true,
        profile_message: true,
        follower: {
          id: true,
          following: {
            id: true,
            username: true,
            profile_image: true,
            profile_message: true,
          },
        },
        following: {
          id: true,
          follower: {
            id: true,
            username: true,
            profile_image: true,
            profile_message: true,
          },
        },
      },
      relations: ['post', 'following', 'following.follower', 'follower', 'follower.following', 'post.likes'],
    })
    return res.send(result)
  }
  static getUser = async (req: Request, res: Response) => {
    const result = await myDataBase.getRepository(User).findOne({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        email: true,
        username: true,
        profile_image: true,
        profile_message: true,
        follower: {
          id: true,
          following: {
            id: true,
            username: true,
            profile_image: true,
            profile_message: true,
          },
        },
        following: {
          id: true,
          follower: {
            id: true,
            username: true,
            profile_image: true,
            profile_message: true,
          },
        },
      },
      relations: ['post', 'following', 'following.follower', 'follower', 'follower.following'],
    })
    return res.send(result)
  }
  static login = async (req: Request, res: Response) => {
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

    //로그인 성공
    const accessToken = generateAccessToken(user.id, user.username, user.email)
    const refreshToken = generateRefreshToken(user.id, user.username, user.email)
    registerToken(refreshToken, accessToken)
    const decoded = verify(accessToken, process.env.SECRET_ATOKEN)
    res.cookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      maxAge: 3600 * 24 * 30 * 1000,
    })
    return res.send({ content: decoded, accessToken })
  }

  static logout = (req: Request, res: Response) => {
    const cookie = req.headers['cookie']
    const refreshToken = cookie.includes('refreshToken') && cookie.match(/(?<=refreshToken=).{1,}/gm)[0]

    removeToken(refreshToken)
    res.clearCookie('refreshToken', { path: '/' })
    res.send({ message: 'success' })
  }

  static withdrawal = async (req: JwtRequest, res: Response) => {
    const { password } = req.body
    const decoded = req.decoded

    const user = await myDataBase.getRepository(User).findOne({
      where: { email: decoded.email },
    })

    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid Password' })
    }

    try {
      await myDataBase.getRepository(User).delete(user.id)
      res.status(204).send({ message: 'success' })
    } catch (error) {
      res.status(403).json(error)
    }
  }

  static updateProfile = async (req: JwtwithMulter, res: Response) => {
    const { username, profile_message } = req.body

    const decoded = req.decoded

    const user = await myDataBase.getRepository(User).findOne({
      where: { email: decoded.email },
    })

    const newUser = new User()
    newUser.username = username
    newUser.profile_message = profile_message
    if (req.file) {
      const { location } = req.file
      newUser.profile_image = location
    }

    const result = await myDataBase.getRepository(User).update(user.id, newUser)
    res.send(result)
  }
}
