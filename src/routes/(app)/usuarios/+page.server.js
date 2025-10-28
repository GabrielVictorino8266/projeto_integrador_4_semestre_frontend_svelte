import { userService } from "$lib/api/users";
import { fail } from "@sveltejs/kit";
import { UpsertUserSchema } from "$lib/schemas/user";
import { getValidationErrors } from "$lib/utils/validation";

/** @type {import('./$types').PageLoad} */
export async function load({ locals }) {
  const service = userService(locals.token);
  const result = await service.getUsers();
  return {
    users: result.users || [],
    pagination: result.pagination || {},
    error: result.error || null,
    session: { user: locals.user },
    title: 'Gerenciamento de Usuários',
  };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
  search: async ({ request, locals }) => {
    const data = await request.formData();
    const searchQuery = data.get("search")?.trim() || "";
    const params = {
      page: data.get("page"),
      size: data.get("size"),
      sort: data.get("sort"),
      nome: searchQuery,
      email: searchQuery,
      telefone: searchQuery,
      cpf: searchQuery,
    };

    const service = userService(locals.token);
    const result = await service.getUsers(params);
    return result.error
      ? fail(500, { error: result.error })
      : { users: result.users, pagination: result.pagination };
  },

  save: async ({ request, locals }) => {
    const user = Object.fromEntries(await request.formData());

    const validation = UpsertUserSchema.safeParse(user);
    if (!validation.success) {
      return fail(400, { errors: getValidationErrors(validation) });
    }

    const service = userService(locals.token);
    const result = validation.data.id
      ? await service.updateUser(validation.data)
      : await service.createUser(validation.data);

    return result.error
      ? fail(500, { error: result.error })
      : { user: result.user };
  },

  delete: async ({ request, locals }) => {
    const data = await request.formData();
    const id = data.get("id");
    const service = userService(locals.token);
    const result = await service.deleteUser(id);
    return result.error
      ? fail(500, { error: result.error })
      : { success: true };
  },
};
