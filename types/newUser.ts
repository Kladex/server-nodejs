export type newUser = {
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  last_logged_in: Date;
};

export type registerUser = {
  username: string;
  email: string;
  password: string;
  created_at: Date;
  last_logged_in: Date;
};
