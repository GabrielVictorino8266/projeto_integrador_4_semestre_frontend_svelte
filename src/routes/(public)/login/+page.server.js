/** @type {import('./$types').PageLoad} */
export function load({ url }) {
    return { username: url.searchParams.get('username') };
}