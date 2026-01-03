import type { Post } from "../types/post";
import api from "../utils/axios";

interface FeedResponse {
  posts: Post[];
  page: number;
  hasMore: boolean;
}

export const fetchFeedApi = async (
  page: number,
  limit = 5
): Promise<FeedResponse> => {
  const res = await api.get<FeedResponse>(
    `/posts/feed?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const createPostApi = async (content: string): Promise<Post> => {
  const res = await api.post<Post>("/posts", { content });
  return res.data;
};

// export const likePostApi = async (postId: string) => {
//   await api.post(`/posts/${postId}/like`);
// };

export const likePostApi = async (postId: string) => {
  const res = await api.post<{ likesCount: number }>(`/posts/${postId}/like`);
  return res.data;
};

export const deletePostApi = async (postId: string) => {
  await api.delete(`/posts/${postId}`);
};

export const addCommentApi = async (postId: string, text: string) => {
  const res = await api.post(`/posts/${postId}/comment`, { text });
  return res.data;
};

export const deleteCommentApi = async (postId: string, commentId: string) => {
  await api.delete(`/posts/${postId}/comment/${commentId}`);
};

export const fetchUserPostsApi = async (userId: string) => {
  const res = await api.get(`/posts/user/${userId}`);
  return res.data;
};
