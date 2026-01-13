import { form, getRequestEvent,query } from '$app/server';
import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { post } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';


// CAN DO DATABASE STUFF HERE!~
export const get_all_posts = query(async () => db.query.post.findMany());

export const get_post_by_id = query(v.string(), async (id) =>
	db.query.post.findFirst({
		where: (p, { eq }) => eq(p.id, id)
	})
);

export const create_post = form(
	v.object({
		title: v.pipe(v.string(), v.nonEmpty('Title is required')),
		body: v.pipe(v.string(), v.nonEmpty())
	}),
	async ({ title, body }) => {
		const event = getRequestEvent();
		const session = await auth.api.getSession({
			headers: event.request.headers
		});
		if (session?.user?.role !== 'admin') {
			error(401, 'Unauthorized');
		}
		const slug = title.toLowerCase().replace(/ /g, '-');
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 30);
		await db.insert(post).values({
			title,
			slug,
			body,
			authorId: session.user.id,
			expiresAt
		});
		redirect(303, '/admin');
	}
);

export const update_post = form(
	v.object({
		id: v.pipe(v.string(), v.nonEmpty('Id is required')),
		title: v.pipe(v.string(), v.nonEmpty('Title is required')),
		body: v.pipe(v.string(), v.nonEmpty())
	}),
	async ({ id, title, body }) => {
		const event = getRequestEvent();
		const session = await auth.api.getSession({
			headers: event.request.headers
		});
		if (session?.user?.role !== 'admin') {
			error(401, 'Unauthorized');
		}
		const slug = title.toLowerCase().replace(/ /g, '-');
		await db
			.update(post)
			.set({
				title,
				slug,
				body
			})
			.where(eq(post.id, id));
		redirect(303, '/admin');
	}
);
