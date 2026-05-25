// Cookie name shared by the server auth helpers and the client-side admin hook.
// Kept in its own module so client components can import it without pulling in
// the server-only `crypto` code in admin.ts.
export const ADMIN_COOKIE = 'alaria_admin';
