import { userService } from "$lib/api/users";
import { motoristaService } from "$lib/api/motorista";
import { fail } from "@sveltejs/kit";
import { UpsertUserSchema } from "$lib/schemas/user";
import { UpsertMotoristaSchema } from "$lib/schemas/motorista";
import { getValidationErrors } from "$lib/utils/validation";

/** @type {import('./$types').PageLoad} */
export async function load({ locals }) {
  const userSvc = userService(locals.token);
  const motoristaSvc = motoristaService(locals.token);

  const [userResult, motoristaResult] = await Promise.all([
    userSvc.getAll(),
    motoristaSvc.getAll(),
  ]);

  const items =
    userResult.items?.map((user) => ({
      ...user,
      motorista: motoristaResult.items?.find((m) => m.usuarioId === user.id),
    })) || [];

  return {
    items,
    pagination: userResult.pagination || {},
    error: userResult.error || motoristaResult.error || null,
    session: { user: locals.user },
    title: "Gerenciamento de Usuários",
  };
}

const saveAdmin = async (formData, token) => {
  const validation = UpsertUserSchema.safeParse(formData);
  if (!validation.success) {
    return fail(400, { errors: getValidationErrors(validation) });
  }
  const service = userService(token);
  const result = validation.data.id
    ? await service.update(validation.data)
    : await service.create(validation.data);
  return result.error
    ? fail(500, { error: result.error })
    : { user: result.item };
};
const saveMotorista = async (formData, token) => {
  // Validate both schemas first
  const userValidation = UpsertUserSchema.safeParse(formData);
  const motoristaData = {
    id: formData.motoristaId,
    nomeMotorista: formData.nome,
    tipoCnh: formData.tipoCnh,
    numeroCnh: formData.cnh,
    desempenho: 1,
    usuarioId: formData.usuarioId, // if updating
  };
  const motoristaValidation = UpsertMotoristaSchema.safeParse(motoristaData);

  // Combine errors if either validation failed
  if (!userValidation.success || !motoristaValidation.success) {
    const combinedErrors = {
      ...(userValidation.success ? {} : getValidationErrors(userValidation)),
      ...(motoristaValidation.success
        ? {}
        : getValidationErrors(motoristaValidation)),
    };
    return fail(400, { errors: combinedErrors });
  }

  // Save user
  const userSvc = userService(token);
  const userResult = userValidation.data.id
    ? await userSvc.update(userValidation.data)
    : await userSvc.create(userValidation.data);

  if (userResult.error) {
    return fail(500, { error: userResult.error });
  }

  motoristaValidation.data.usuarioId = userResult.item.id;

  const motoristaSvc = motoristaService(token);
  if (!motoristaValidation.data.id) {
    const motoristaResult = await motoristaSvc.create(motoristaValidation.data);
    if (motoristaResult.error) {
      return fail(500, { error: motoristaResult.error });
    }
    return { user: userResult.item, motorista: motoristaResult.item };
  }

  return { user: userResult.item, motorista: null };
};

const deleteAdmin = async (id, token) => {
  const service = userService(token);
  const result = await service.delete(id);
  return result.error ? fail(500, { error: result.error }) : { success: true };
};

const deleteMotorista = async (id, token) => {
  const service = userService(token);
  const result = await service.delete(id);
  return result.error ? fail(500, { error: result.error }) : { success: true };
};

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
    const [userResult, motoristaResult] = await Promise.all([
      userService(locals.token).getAll(params),
      motoristaService(locals.token).getAll(params),
    ]);

    if (userResult.error) {
      return fail(500, { error: userResult.error });
    }
    if (motoristaResult.error) {
      return fail(500, { error: motoristaResult.error });
    }

    const items =
      userResult.items?.map((user) => ({
        ...user,
        motorista: motoristaResult.items?.find((m) => m.usuarioId === user.id),
      })) || [];

    return { items, pagination: userResult.pagination };
  },
  save: async ({ request, locals }) => {
    const formData = Object.fromEntries(await request.formData());
    const targetRole = formData.role; // Role being saved, not current user's role

    if (targetRole === "MOTORISTA") {
      return await saveMotorista(formData, locals.token);
    } else {
      return await saveAdmin(formData, locals.token);
    }
  },
  delete: async ({ request, locals }) => {
    const data = await request.formData();
    const id = data.get("id");
    const userRole = locals.user?.role;

    if (userRole === "ADMIN") {
      return await deleteAdmin(id, locals.token);
    } else if (userRole === "MOTORISTA") {
      return await deleteMotorista(id, locals.token);
    }

    return fail(403, { error: "Unauthorized role" });
  },
};
