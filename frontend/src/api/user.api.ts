import api from "../utils/axios";

export const getUserProfileApi = async (id: string) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const sendFriendRequestApi = async (id: string) => {
  await api.post(`/users/${id}/request`);
};

export const acceptFriendRequestApi = async (id: string) => {
  await api.post(`/users/${id}/accept`);
};

export const rejectFriendRequestApi = async (id: string) => {
  const res = await api.post(`/users/${id}/reject`);
  return res.data;
};

export const removeFriendApi = async (id: string) => {
  await api.post(`/users/${id}/remove`);
};

// user.api.ts
export const markNotificationsReadApi = async () => {
  await api.post("/users/notifications/read");
};
