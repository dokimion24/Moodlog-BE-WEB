import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { User } from './User'

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.following, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  following: User

  @ManyToOne(() => User, (user) => user.follower, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  followee: User
}
