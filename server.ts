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

async function getUser(name: string) {
  const res = await db.select().from(users).where(eq(users.name, name));
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

app.post("/post", (c) => {
  const id = uuidv4();
  return c.json({ name: addUser("Joomey", "James@gmail.com", id) });
});
app.get("/get", (c) => {
  const user = getUser("Joomey");
  return c.json("HI");
});
app.delete("/delete", (c) => {
  return c.json({ name: deleteUser("Joe") });
});
app.patch("/update", (c) => {
  return c.json({ name: updateUser("Joomey", "Joe@gmail.com", "Joe") });
});
Deno.serve({ port: 8080 }, app.fetch);
