/**
 * Apply ADMIN_EMAIL / ADMIN_PASSWORD from environment to the seeded static admin user.
 * Keeps a single bootstrap account while allowing deploy-specific credentials.
 */
export function applyAdminEnvOverrides(store) {
  const admin = store.getUserById("u-admin");
  if (!admin || admin.role !== "admin") return;

  const email = (process.env.ADMIN_EMAIL || "").trim();
  const password = (process.env.ADMIN_PASSWORD || "").trim();

  if (email) {
    store.usersByEmail.delete(admin.email.toLowerCase());
    admin.email = email;
    store.usersByEmail.set(admin.email.toLowerCase(), admin.id);
    const row = store.platformUsers.find((p) => p.id === admin.id);
    if (row) row.email = email;
  }
  if (password) {
    admin.password = password;
  }
}
