DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  admin_id INTEGER NOT NULL REFERENCES admins(id),
  content TEXTNOT NULL,
  from_user BOOLEAN NOT NULL /* this checks if the message is from user vs. from sender*/
);
