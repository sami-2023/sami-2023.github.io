import { Client, Databases } from 'node-appwrite';

export default async function (context) {
    const client = new Client()
        .setEndpoint('https://fra.cloud.appwrite.io/v1')
        .setProject('69930a880011dec1e960') 
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    try {
        if (!context.req.body) {
            return context.res.json({ success: false, message: "Missing body" }, 400);
        }

        const payload = JSON.parse(context.req.body);
        const { userId, secretKey } = payload;

        if (secretKey !== "Gold_Secure_88x") {
            return context.res.json({ success: false, message: "Unauthorized" }, 401);
        }

        // Fetch user
        const userDoc = await databases.getDocument('69930af300230e5efc4d', 'profiles', userId);

        // Add 2 points
        const newTotal = (userDoc.points || 0) + 2;

        // Update DB
        await databases.updateDocument('69930af300230e5efc4d', 'profiles', userId, {
            points: newTotal
        });

        return context.res.json({ success: true, newBalance: newTotal });

    } catch (err) {
        return context.res.json({ success: false, error: err.message }, 500);
    }
};
