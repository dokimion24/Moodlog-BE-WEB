import { myDataBase } from './db'
import cors from 'cors'
import express, { Request, Response } from 'express'
import postRouter from './router/posts'
import commentRouter from './router/comments'
import likeRouter from './router/like'
import { upload } from './util/upload'
import UserRouter from './router/auth'
import FollowRouter from './router/follow'
import FeelingCodeRouter from './router/feelingcode'

export const tokenList = {}

myDataBase
  .initialize()
  .then(() => {
    console.log('DataBase has been initialized!')
  })
  .catch((err) => {
    console.error('Error during DataBase initialization:', err)
  })

const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(
  cors({
    origin: true,
  }),
)
app.post('/upload', upload.single('img'), (req: Request, res: Response) => {
  res.json(req.file)
}) // 업로드 후에, (req, res) => {} 부분이 실행

app.use('/posts', postRouter)
app.use('/comments', commentRouter)
app.use('/likes', likeRouter)
app.use('/auth', UserRouter)
app.use('/follow', FollowRouter)
app.use('/feeling', FeelingCodeRouter)

app.listen(3000, () => {
  console.log('Express server has started on port 3000')
})
