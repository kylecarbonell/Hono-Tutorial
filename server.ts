import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "./schema/club.ts";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

console.log(uuidv4());
const db = drizzle(Deno.env.get("DATABASE_URL"));

async function addUser(name: string, email: string, id: string) {
  const res = await db
    .insert(users)
    .values({ name: name, email: email, id: id })
    .returning({ insertedId: users.id });
  return res;
}

async function getUser() {
  const res = await db.select().from(users);
  console.log(res);
  return res;
}

async function deleteUser(name: string) {
  const res = await db.delete(users).where(eq(users.name, name));
  return res;
}

async function updateUser(name: string, email: string, newName: string) {
  const res = await db
    .update(users)
    .set({ name: newName, email: email })
    .where(eq(users.name, name));
  return res;
}

const app = new Hono().basePath("/api/v1");

app.post("/create", async (c) => {
  try {
    const { name } = await c.req.json();
    console.log(name);
    const id = uuidv4();
    addUser(name, name + "@gmail.com", id);
    return c.json("success");
  } catch (error) {
    c.json({ error });
  }
});
app.get("/read", async (c) => {
  try {
    const user = await getUser();
    return c.json(user);
  } catch (error) {
    c.json({ error });
  }
});
app.delete("/delete", async (c) => {
  try {
    const { name } = await c.req.json();
    deleteUser(name);
    return c.json("Deleted user : " + name);
  } catch (error) {
    c.json({ error });
  }
});
app.patch("/update", async (c) => {
  try {
    const { oldName, name } = await c.req.json();
    console.log(name);
    const id = uuidv4();
    updateUser(oldName, name + "@gmail.com", name);
    return c.json("Updated User to : ", name);
  } catch (error) {
    c.json({ error });
  }
});
Deno.serve({ port: 8080 }, app.fetch);
