import { vehicleService } from "$lib/api/vehicles";
import { fail } from "@sveltejs/kit";
import { VehicleSchema } from "$lib/schemas/vehicle";
import { getValidationErrors } from "$lib/utils/validation";

/** @type {import('./$types').PageLoad} */
export async function load({ locals }) {
  const service = vehicleService(locals.token);
  const result = await service.getAll();
  return {
    items: result.items || [],
    pagination: result.pagination || {},
    error: result.error || null,
    session: { user: locals.user },
    title: 'Gerenciamento de Veículos',
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
      placa: searchQuery,
      marca: searchQuery,
      tipoVeiculo: searchQuery,
      anoFabricacao: searchQuery,
      kmAtual: searchQuery,
      limiteAvisoKm: searchQuery,
      status: searchQuery
    };

    const service = vehicleService(locals.token);
    const result = await service.getAll(params);
    return result.error
      ? fail(500, { error: result.error })
      : { items: result.items, pagination: result.pagination };
  },

  save: async ({ request, locals }) => {
    const vehicle = Object.fromEntries(await request.formData());

    const validation = VehicleSchema.safeParse(vehicle);
    if (!validation.success) {
      return fail(400, { errors: getValidationErrors(validation) });
    }

    const service = vehicleService(locals.token);
    const result = validation.data.id
      ? await service.update(validation.data)
      : await service.create(validation.data);

    return result.error
      ? fail(500, { error: result.error })
      : { vehicle: result.item };
  },

  delete: async ({ request, locals }) => {
    const data = await request.formData();
    const id = data.get("id");
    const service = vehicleService(locals.token);
    const result = await service.delete(id);
    return result.error
      ? fail(500, { error: result.error })
      : { success: true };
  },
};