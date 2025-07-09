import { Client, Databases } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    // Use your actual database and collection IDs
    const databaseId = process.env.APPWRITE_DATABASE_ID; // or hardcode your database ID
    const collectionId = '686e17800021db214146'; // contact_form collection ID

    const response = await databases.listDocuments(databaseId, collectionId);

    const contacts = response.documents.map(doc => ({
      id: doc.$id,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      subject: doc.subject,
      message: doc.message,
      createdAt: doc.$createdAt,
    }));

    return res.json({ contacts });
  } catch (err) {
    error("Could not fetch contacts: " + err.message);
    return res.json({ error: err.message }, 500);
  }
};