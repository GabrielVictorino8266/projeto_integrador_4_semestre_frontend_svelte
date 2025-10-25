import { logout } from "$lib/api/auth";
import { redirect } from "@sveltejs/kit";
import { logger } from "$lib/utils/logger";

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
  try {
    await logout(cookies);
  } catch (e) {
    logger.error(e);
  } finally {
    redirect(302, "/login");
  }
}
