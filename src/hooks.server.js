import { authService } from "$lib/api/auth";
import { paymentService } from "$lib/api/payment";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const service = authService(event.cookies);
  const session = await service.getSessionUser();

  // Redireciona usuário autenticado tentando acessar login
  if (
    event.url.pathname.startsWith("/login") ||
    event.url.pathname.startsWith("/cadastro")
  ) {
    if (session?.user && event.request.method === "GET") {
      return new Response(null, {
        status: 302,
        headers: { Location: "/dashboard" },
      });
    }
  }
  // Redireciona usuário não autenticado tentando acessar rotas protegidas
  if (event.route.id?.startsWith("/(app)") && !session?.user) {
    if (event.request.method === "GET") {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/login?reason=session_expired&timestamp=${Date.now()}`,
        },
      });
    } else {
      return new Response(null, {
        status: 401,
      });
    }
  }

  // Read cookie instead of localStorage
  if (event.route.id?.startsWith("/(app)") && event.request.method === "GET") {
    const paymentStatus = await paymentService(
      event.cookies,
      event.locals.token,
    ).getPaymentStatus();
    event.locals.showProcessingPayment = paymentStatus?.showProcessingPayment;
    event.locals.justActivatedPlan = paymentStatus?.justActivatedPlan;
  }

  // Anexa usuário em event.locals se autenticado
  event.locals.user = session?.user;
  event.locals.token = session?.token;

  return await resolve(event);
}
