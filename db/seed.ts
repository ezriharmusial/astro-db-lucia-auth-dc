import { db, User } from 'astro:db';

export default async function () {
  await db.insert(User).values([
    // { id: '123456', email: 'ezriharmusial@gmail.com', hashed_password: '' },
    { id: '234567', email: 'test2@email.com', hashed_password: '' },
  ]);
}