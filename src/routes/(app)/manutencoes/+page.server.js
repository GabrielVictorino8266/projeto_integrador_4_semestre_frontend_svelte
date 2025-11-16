import { maintenanceService } from "$lib/api/maintenance";
import { vehicleService } from "$lib/api/vehicles";
import { fail } from "@sveltejs/kit";
import { MaintenanceSchema, mapFormDataToMaintenance } from "$lib/schemas/maintenance";
import { getValidationErrors } from "$lib/utils/validation";

/** @type {import('./$types').PageLoad} */
export async function load({ locals }) {
 const manutencaoApi = maintenanceService(locals.token);
 const veiculoApi = vehicleService(locals.token);

  const [result, lookups, vehicles] = await Promise.all([
    manutencaoApi.getAll({ sort: 'dataManutencao,desc' }),
    manutencaoApi.getLookups(),
    veiculoApi.getAll()
  ]);

  return {
    items: result.items || [],
    pagination: result.pagination || {},
    error: result.error || null,
    session: { user: locals.user },
    title: 'Gerenciamento de Manutenções',
    tipoManutencao: lookups.items.tipos || [],
    vehicles: vehicles.items || [],
  };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
  search: async ({ request, locals }) => {
    const data = await request.formData();
    const searchQuery = data.get("search")?.trim() || "";

    const dateRegex = /^(?!^\d{4}\/\d{2}\/\d{2}$)/;
    let dateFilter = '';
    if (dateRegex.test(searchQuery)) {
      dateFilter = searchQuery.split('/').reverse().join('-');
    }
    
    const params = {
      page: data.get("page"),
      size: data.get("size"),
      sort: data.get("sort"),
      dataManutencao: dateFilter,
      descricao: searchQuery,
      custo: Number(searchQuery),
      tipoManutencao: searchQuery,
      placaVeiculo: searchQuery,
    };

    const service = maintenanceService(locals.token);
    const result = await service.getAll(params);
    return result.error
      ? fail(500, { error: result.error })
      : { items: result.items, pagination: result.pagination };
  },


  save: async ({ request, locals }) => {
    const formData = await request.formData();
    const maintenanceData = Object.fromEntries(formData.entries());
    
    // Convert form data to maintenance object
    const maintenance = mapFormDataToMaintenance(maintenanceData);
    
    const validation = MaintenanceSchema.safeParse(maintenance);
    if (!validation.success) {
      return fail(400, { errors: getValidationErrors(validation) });
    }

    const service = maintenanceService(locals.token);
    const result = maintenance.id
      ? await service.update(maintenance)
      : await service.create(maintenance);

    return result.error
      ? fail(500, { error: result.error })
      : { maintenance: result.item };
  },

  delete: async ({ request, locals }) => {
    const data = await request.formData();
    const id = data.get("id");
    if (!id) return fail(400, { error: "ID da manutenção é obrigatório" });
    
    const service = maintenanceService(locals.token);
    const result = await service.delete(id);
    
    return result.error
      ? fail(500, { error: result.error })
      : { success: true };
  },
};