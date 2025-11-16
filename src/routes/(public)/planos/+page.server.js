// +page.server.js

import { fail, redirect } from "@sveltejs/kit";
import { paymentService } from "$lib/api/payment";

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
  const selectedPlan = url.searchParams.get("planId");
  return { selectedPlan };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
  "create-payment": async ({ request, url, locals, cookies }) => {
    const formData = Object.fromEntries(await request.formData());
    const planId = formData?.planId;

    // Simula um delay de 1 segundo
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!planId) {
      return fail(400, { error: "Plano inválido" });
    }

    if (!locals?.user) {
      const loginUrl = new URL("/login", url.origin);
      loginUrl.searchParams.set("reason", "must_login_to_purchase");
      loginUrl.searchParams.set("timestamp", Date.now().toString());
      loginUrl.searchParams.set("redirect", `${url.pathname}?planId=${planId}`);

      throw redirect(303, loginUrl.toString());
    }

    const service = paymentService(cookies, locals.token);
    const result = await service.generatePix(locals.user, planId);
    if (result.error) {
      return fail(400, { error: result.error });
    }
    return { payment: result };
  },
};
