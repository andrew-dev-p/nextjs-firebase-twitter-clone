import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './post.entity';
import { firestore } from '../firebase';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  private collection = firestore.collection('posts');

  async create(createPostDto: CreatePostDto, userId: string) {
    const post = {
      ...createPostDto,
      userId,
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

  async findAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as PostEntity,
    );
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return undefined;
    const updatedData = { ...doc.data(), ...updatePostDto };
    await docRef.set(updatedData, { merge: true });
    return updatedData as PostEntity;
  }

  async remove(id: string) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    return true;
  }
}
