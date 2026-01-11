import { building } from "$app/environment";
import { auth } from "$lib/auth";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import {svelteKitHandler} from 'better-auth/svelte-kit'

export const authHandle:Handle = async ({event,resolve}) => {
  return svelteKitHandler({ event, resolve, auth, building });
}

const sessionHandle: Handle = async ({ event,resolve }) => {
  const session = await auth.api.getSession({
    headers:event.request.headers
  })

  // console.log(session)
  event.locals.user = session?.user

  const response = await resolve(event);
  return response
}


export const handle = sequence(authHandle,sessionHandle);

// export const handle:Handle = async ({event,resolve}) => {
//   console.log('Before page hit');
//   const response = await resolve(event);
//   console.log('Afyter page hit');
//   return response
// }
