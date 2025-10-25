import { getUsers, createUser, updateUser } from "$lib/api/user";
import { fail } from "@sveltejs/kit";
import { UpsertUsuarioSchema } from "$lib/schema/usuario";
import { getValidationErrors } from "$lib/utils/validation";

/** @type {import('./$types').PageLoad} */
export async function load({ locals }) {
  const result = await getUsers(locals.token);
  return {
    users: result.users || [],
    pagination: result.pagination || {},
    error: result.error || null,
    session: { user: locals.user },
  };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
  search: async ({ request, locals }) => {
    const data = await request.formData();
    const params = {
      page: data.get("page"),
      size: data.get("size"),
      sort: data.get("sort"),
      nome: data.get("nome"),
      email: data.get("email"),
      telefone: data.get("telefone"),
      cpf: data.get("cpf"),
    };

    const result = await getUsers(locals.token, params);
    return result.error
      ? fail(500, { error: result.error })
      : { users: result.users, pagination: result.pagination };
  },

  save: async ({ request, locals }) => {
    const user = Object.fromEntries(await request.formData());

    const validation = UpsertUsuarioSchema.safeParse(user);
    if (!validation.success) {
      return fail(400, { errors: getValidationErrors(validation) });
    }

    const result = user.id
      ? await updateUser(locals.token, user)
      : await createUser(locals.token, user);

    return result.error
      ? fail(500, { error: result.error })
      : { user: result.user };
  },
};
