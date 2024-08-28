import { lucia } from '@/auth';
import { Argon2id } from 'oslo/password';
import { db, User, eq, isDbError } from 'astro:db';
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

  let existingUser: any
  try {
    // Check if user exists
    existingUser = await db
      .select()
      .from(User)
      .where(eq(User.email, email.toLowerCase()))
      .get();
    if (!existingUser) {
      return new Response('Incorrect username', {
        status: 400,
      });
    }

    // Check if password is correct
    const validPassword = await new Argon2id().verify( existingUser.hashed_password, password);
    if (!validPassword) {
      return new Response('Incorrect password', {
        status: 400,
      });
    }

    // When all is correct, Setsession Cookie with Lucia
    console.log('VALIDATION CORRECT!!! YEAH!! 😃')
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

  } catch (e) {
    if (isDbError(e)) {
      return new Response(`Could not finalize login because of db error\n\n${e.message}`, { status: 400 });
    }
    return new Response('An unexpected error occurred', { status: 500 });
  }

  // If all went well, redirect to /account
  return context.redirect('/account');
}
