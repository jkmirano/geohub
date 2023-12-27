import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ parent }) => {
	const { session } = await parent();
	if (!session) throw error(403, { message: 'No permission to access' });
	const is_superuser = session?.user?.is_superuser ?? false;
	if (is_superuser !== true) throw error(403, { message: 'No permission to access' });
};
