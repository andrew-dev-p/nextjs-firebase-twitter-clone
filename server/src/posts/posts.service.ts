import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { firestore } from '../firebase';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from 'src/types/entities';
import { SortOption } from './posts.controller';

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

  async findAll(
    userId?: string,
    sortOption?: SortOption,
    cursor?: string,
    limit = 10,
  ): Promise<{ posts: PostEntity[]; nextCursor: string | null }> {
    let query: FirebaseFirestore.Query = userId
      ? this.collection.where('userId', '==', userId)
      : this.collection;

    if (sortOption === SortOption.Recent)
      query = query.orderBy('createdAt', 'desc');
    else if (sortOption === SortOption.MostLikes)
      query = query.orderBy('likesCount', 'desc');
    else if (sortOption === SortOption.MostComments)
      query = query.orderBy('commentsCount', 'desc');

    if (cursor) {
      const lastDocSnapshot = await this.collection.doc(cursor).get();
      if (lastDocSnapshot.exists) {
        query = query.startAfter(lastDocSnapshot);
      }
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    const posts = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as PostEntity,
    );

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    return { posts, nextCursor: lastDoc?.id ?? null };
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

  async findOne(postId: string): Promise<PostEntity | null> {
    const doc = await firestore.collection('posts').doc(postId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as PostEntity;
  }
}
