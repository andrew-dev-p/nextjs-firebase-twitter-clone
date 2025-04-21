import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './post.entity';
import { firestore } from '../firebase';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  private collection = firestore.collection('posts');

  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    const post: PostEntity = {
      userId: createPostDto.userId,
      title: createPostDto.title,
      description: createPostDto.description,
      photoUrl: createPostDto.photoUrl,
      likes: [],
      likesCount: 0,
      dislikes: [],
      dislikesCount: 0,
      comments: [],
      commentsCount: 0,
      createdAt: new Date().toISOString(),
    };
    await this.collection.doc().set(post);
    return post;
  }

  async findAll(): Promise<PostEntity[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => doc.data() as PostEntity);
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostEntity | undefined> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return undefined;
    const updatedData = { ...doc.data(), ...updatePostDto };
    await docRef.set(updatedData, { merge: true });
    return updatedData as PostEntity;
  }

  async remove(id: string): Promise<boolean> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    return true;
  }
}
