import { Client, Users } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Users service
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  const users = new Users(client);

  try {
    const response = await users.list();
    // Log messages and errors to the Appwrite Console
    // These logs won't be seen by your end users
    log(`Total users: ${response.total}`);

  // Filter out admins
        const filtered = response.users.filter(
      (u) => !u.prefs || u.prefs.role !== "admin"
    );

        // Only return the fields needed for the dashboard
    const safeUsers = filtered.map((u) => ({
      $id: u.$id,
      name: u.name,
      email: u.email,
      emailVerification: u.emailVerification,
      registration: u.registration,
    }));

        // Log the safeUsers for debugging (optional)
    log(JSON.stringify(safeUsers));

        // Return the user list to the frontend
    return res.json({ users: safeUsers });
  } catch(err) {
    error("Could not list users: " + err.message);
  }

  // The req object contains the request data
  if (req.path === "/ping") {
    // Use res object to respond with text(), json(), or binary()
    // Don't forget to return a response!
    return res.text("Pong");
  }

  return res.json({
    motto: "Build like a team of hundreds_",
    learn: "https://appwrite.io/docs",
    connect: "https://appwrite.io/discord",
    getInspired: "https://builtwith.appwrite.io",
  });
};
