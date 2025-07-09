import { Client, Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); // Use env var, not header

  const users = new Users(client);

  try {
    const response = await users.list();
    // Filter out admins
    const filtered = response.users.filter(
      (u) => !u.prefs || u.prefs.role !== "admin"
    );
    // Only return safe fields
    const safeUsers = filtered.map((u) => ({
      $id: u.$id,
      email: u.email,
      name: u.name,
      prefs: u.prefs,
      registration: u.registration,
      status: u.status,
    }));
    return res.json({ users: safeUsers });
  } catch(err) {
    error("Could not list users: " + err.message);
    return res.json({ error: err.message }, 500);
  }
};