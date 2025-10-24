import { getUsers } from '$lib/api/user';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ locals }) {
    const result = await getUsers(locals.token);
	return { 
        users: result.users || [],
        pagination: result.pagination || {},
        error: result.error || null,
        session: { user: locals.user }
    };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
    search: async ({ request, locals }) => {
        const data = await request.formData();
        const page = data.get('page');
        const size = data.get('size');
        const sort = data.get('sort');
        const nome = data.get('nome');
        const email = data.get('email');
        const telefone = data.get('telefone');
        const cpf = data.get('cpf');

        const result = await getUsers(
            locals.token,
            {
                page,
                size,
                sort,
                nome,
                email,
                telefone,
                cpf
            }
        );

        if (result.error) {
            return fail(500, { error: result.error })
        }

        return {
          users: result.users,
          pagination: result.pagination,
        };
    }
};
