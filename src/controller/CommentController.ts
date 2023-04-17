import { Request, Response } from 'express'
import { myDataBase } from '../db'
import { Post } from '../entity/Post'
import { Comment } from '../entity/Comment'

export class CommentController {
  static createComment = async (req: Request, res: Response) => {
    // 요청 데이터 값 가져오기
    const { postId, body } = req.body
    // 해당 게시글 번호로 게시글 찾기
    const post = await myDataBase.getRepository(Post).findOneBy({
      id: postId,
    })
    // 해당 값대로 Comment 객체 생성
    const comment = new Comment()
    comment.comment = body
    comment.post = post // 연결할 게시글 지정
    // 해당 객체대로 db 에 추가
    const result = await myDataBase.getRepository(Comment).insert(comment)
    return res.status(201).send('success')
  }

  static updateComment = async (req: Request, res: Response) => {
    const result = await myDataBase.getRepository(Comment).update(Number(req.params.id), req.body)
    return res.status(200).send('success')
  }

  static deleteComment = async (req: Request, res: Response) => {
    await myDataBase.getRepository(Comment).delete(Number(req.params.id))
    return res.status(204).send('success')
  }

  static getComments = async (req: Request, res: Response) => {
    const comments = await myDataBase.getRepository(Comment).find({ relations: ['post'] })
    return res.status(200).send(comments)
  }
  static getComment = async (req: Request, res: Response) => {
    const comment = await myDataBase.getRepository(Comment).findOne({
      where: {
        id: Number(req.params.id),
      },
      relations: ['post'],
    })
    if (!comment) {
      return res.status(404).send('No Content')
    }
    return res.status(200).send(comment)
  }
}
