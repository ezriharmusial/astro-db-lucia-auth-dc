import { lucia } from '@/auth';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { db, isDbError, User } from 'astro:db';

import type { APIContext } from 'astro';

export const prerender = false;

export async function POST(context: APIContext): Promise<Response> {

  // Get Formdata
  const formData = await context.request.formData();

  // validate email
  const email = (formData.get('email') as string).trim();
  if (
    typeof email !== 'string' ||
    email.length < 3 ||
    email.length > 255 ||
    !/.+@.+\..+/.test(email)
  ) {
    return new Response('Invalid email', {
      status: 400,
    });
  }

  // validate password
  const password = formData.get('password');
  if (
    typeof password !== 'string' ||
    password.length < 6 ||
    password.length > 255
  ) {
    return new Response('Invalid password', {
      status: 400,
    });
  }

  // Generate User Id & Hashed Password
  const userId = generateId(15);
  const hashedPassword = await new Argon2id().hash(password);

  // Insert user into database
  try {
    await db.insert(User).values({
      id: userId,
      email: email.toLowerCase(),
      hashed_password: hashedPassword,
    });

    // when all successful, create a session
    console.log('YEAH WE GOT TROUGH THE REGISTRATION DATA 💪, CREATING SESSION');
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (e) {
    if (isDbError(e)) {
      return new Response(`Could not finalize Register because of db error\n\n${e.message}`, { status: 400 });
    }
    return new Response('An unexpected error occurred', { status: 500 });
  }

  // If all went well redirect to account
  return context.redirect('/account');
}