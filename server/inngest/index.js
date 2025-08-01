import { Inngest } from "inngest";
import User from "../models/User.js";
import connectDB from "../configs/db.js";

export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Helper to ensure DB connection before DB ops
async function ensureDBConnected() {
  // Mongoose connection states: 1 = connected
  if (User.db.readyState !== 1) {
    await connectDB();
  }
}

// === sync user creation ===
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    await ensureDBConnected();

    console.log("🔥 Received user.created event:", event.data);

    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses?.[0]?.email_address || "noemail@example.com",
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    try {
      const user = await step.run("create-user-in-db", async () => {
        return await User.create(userData);
      });
      console.log("✅ User created:", user);
    } catch (error) {
      console.error("❌ Error creating user:", error);
      throw error; // signal failure to Inngest
    }

    return { status: "done" };
  }
);

// === sync user deletion ===
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => {
    await ensureDBConnected();

    console.log("🔥 Received user.deleted event:", event.data);

    try {
      const result = await step.run("delete-user", async () => {
        return await User.findByIdAndDelete(event.data.id);
      });
      console.log("✅ User deleted:", result);
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      throw error;
    }

    return { status: "deleted" };
  }
);

// === sync user update ===
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event, step }) => {
    await ensureDBConnected();

    console.log("🔥 Received user.updated event:", event.data);

    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const updatedUserData = {
      email: email_addresses?.[0]?.email_address || "noemail@example.com",
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    try {
      const updatedUser = await step.run("update-user", async () => {
        return await User.findByIdAndUpdate(id, updatedUserData, { new: true });
      });
      console.log("✅ User updated:", updatedUser);
    } catch (error) {
      console.error("❌ Error updating user:", error);
      throw error;
    }

    return { status: "updated" };
  }
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];
