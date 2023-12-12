import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { getSTAC, getSTACs, upsertSTAC } from '$lib/server/helpers';
import type { Stac } from '$lib/types';

export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.getSession();

	const is_superuser = session?.user?.is_superuser ?? false;
	if (!is_superuser) {
		throw error(403, { message: 'Permission error' });
	}

	const type = url.searchParams.get('type');
	const stacs = await getSTACs(type);

	return new Response(JSON.stringify(stacs));
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.getSession();
	if (!session) {
		throw error(403, { message: 'Permission error' });
	}

	const is_superuser = session?.user?.is_superuser ?? false;
	if (!is_superuser) {
		throw error(403, { message: 'Permission error' });
	}

	const user_email = session?.user.email;

	const body: Stac = (await request.json()) as unknown as Stac;

	const exists = await getSTAC(body.id);
	if (exists) {
		throw error(400, {
			message: `${body.id} is already registered at the database, please use PUT if you want to update this.`
		});
	}

	const updatedStac = await upsertSTAC(body, user_email);

	return new Response(JSON.stringify(updatedStac));
};