const sdk = require("node-appwrite");

module.exports = async function (req, res) {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new sdk.Users(client);

  try {
    const result = await users.list({ limit: 100 });
    const filtered = result.users.filter(
      (u) => !u.prefs || u.prefs.role !== "admin"
    );
    const safeUsers = filtered.map((u) => ({
      $id: u.$id,
      email: u.email,
      name: u.name,
      prefs: u.prefs,
      registration: u.registration,
      status: u.status,
    }));
    res.json({ users: safeUsers });
  } catch (err) {
    res.json({ error: err.message }, 500);
  }
};