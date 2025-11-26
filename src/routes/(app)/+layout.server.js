/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  return {
    user: locals.user,
    showProcessingPayment: locals.showProcessingPayment,
    justActivatedPlan: locals.justActivatedPlan,
  };
}
