import { Request, Response } from 'express'
import { myDataBase } from '../db'
import { Post } from '../entity/Post'
import { Comment } from '../entity/Comment'
import { Like } from '../entity/Like'

interface MulterS3Request extends Request {
  // 넘어오는 파일을 고려해서 타입 작성
  file: Express.MulterS3.File
}

export class PostController {
  static getPosts = async (req: Request, res: Response) => {
    const posts = await myDataBase.getRepository(Post).find({ relations: ['comments', 'likes'] })
    return res.status(200).send(posts)
  }
  static getPost = async (req: Request, res: Response) => {
    const post = await myDataBase.getRepository(Post).findOne({
      where: {
        id: Number(req.params.id),
      },
      relations: ['comments', 'likes'],
    })
    if (!post) {
      // 해당 번호의 글이 없다면 404 응답
      return res.status(404).send('No Content')
    }
    return res.status(200).send(post)
  }

  static createPost = async (req: MulterS3Request, res: Response) => {
    // 요청 데이터 값 가져오기
    const { title, body, feeling_code, open = true } = req.body
    // 해당 값대로 Post 객체 생성
    const post = new Post()
    post.title = title
    post.body = body
    post.feeling_code = feeling_code
    post.open = open

    if (req.file) {
      const { location } = req.file
      post.img = location
    }
    // 해당 객체대로 db 에 추가
    const result = await myDataBase.getRepository(Post).save(post)
    return res.status(201).send('success')
  }

  static updatePost = async (req: MulterS3Request, res: Response) => {
    const { title, body, feeling_code, open } = req.body

    const post = new Post()
    post.title = title
    post.body = body
    post.feeling_code = feeling_code
    post.open = open

    if (req.file) {
      const { location } = req.file
      post.img = location
    }

    const result = await myDataBase.getRepository(Post).update(Number(req.params.id), post)
    return res.status(200).send('success')
  }

  static deletePost = async (req: Request, res: Response) => {
    await myDataBase.getRepository(Post).delete(Number(req.params.id))
    return res.status(204).send('success')
  }
}
