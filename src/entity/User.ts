import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Post } from './Post'
import { Follow } from './Follow'
// import { Comment } from './Comment'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true }) // 이메일은 중복되지 않도록 설계
  email: string

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  profile_image: string

  @Column()
  profile_message: string

  @OneToMany(() => Post, (post) => post.user)
  post: Post[]

  @OneToMany(() => Follow, (follow) => follow.following)
  following: Follow[]

  @OneToMany(() => Follow, (follow) => follow.followee)
  follower: Follow[]

  // @OneToMany(() => Comment, (comment) => comment.user)
  // Comment: Comment[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
