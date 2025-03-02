type article = {
  articleId: number;
  user: user;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  commentList: comment[];
};

type comment = {
  commentId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: user;
};

type user = {
  userId: number;
  name: string;
  email: string;
  password: string;
  introduction: string;
  createdAt: Date;
  updatedAt: Date;
};

type tokenPayload = {
  userId: number;
  exp: number;
};

type toastStore = {
  successMessage: string | null;
  setSuccessMessage: (message: string) => void;
  clearMessage: () => void;
};

export type { article, user, tokenPayload, toastStore, comment };
