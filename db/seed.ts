import { db, User } from 'astro:db';

export default async function () {
  await db.insert(User).values([
    { id: '123456', email: 'ezriharmusial@gmail.com', hashed_password: '$argon2id$v=19$m=19456,t=2,p=1$k9b3mv8zC2hnwCZPNUUI+w$6G/JCzvBlcbP7ws8N0UwyzrM04SDbdpI92BR6X3yfuo' },
    { id: '234567', email: 'test2@email.com', hashed_password: '$argon2id$v=19$m=19456,t=2,p=1$k9b3mv8zC2hnwCZPNUUI+w$6G/JCzvBlcbP7ws8N0UwyzrM04SDbdpI92BR6X3yfuo' },
  ]);
}