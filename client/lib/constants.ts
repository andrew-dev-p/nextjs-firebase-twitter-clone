export enum APIRoute {
  POST = "/posts/:id",
  POSTS = "/posts",
  REACTIONS_LIKE = "/reactions/like",
  REACTIONS_DISLIKE = "/reactions/dislike",
  COMMENTS = "/comments",
  COMMENTS_REPLY = "/comments/reply",
}

export enum QueryKey {
  USER = "USER",
  POSTS = "POSTS",
}
