import { Image } from 'aws-sdk/clients/iotanalytics'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
} from 'typeorm'
import { Post } from './Post'

@Entity() // 해당 클래스는 DB 테이블
export class Comment {
  @PrimaryGeneratedColumn() // Primary Key, 자동 생성
  id: number

  @Column()
  comment: string

  @CreateDateColumn() // 생성 시의 시간 자동 기록
  createdAt: Date

  @UpdateDateColumn() // 수정 시의 시간 자동 기록
  updatedAt: Date

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  post: Post

  // User Table
}
