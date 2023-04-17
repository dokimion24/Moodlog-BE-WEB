import { Entity, ManyToOne } from 'typeorm'
import { User } from './User'

@Entity()
export class Post {
  @ManyToOne(() => User, (user) => user.post)
  user: User
}
