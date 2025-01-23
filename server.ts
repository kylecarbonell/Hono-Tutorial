import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "./schema/user.ts";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { zUpdateUser, zUser } from "./types/user.ts";

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

function validateInput(data: any) {
  return zUser.parse(data);
}

const app = new Hono().basePath("/api/v1");

app.post("/create", async (c) => {
  try {
    const data = await c.req.json();

    if (!validateInput(data)) {
      return c.json({ error: "Wrong input" });
    }

    const { name, email } = data;

    const id = uuidv4();
    addUser(name, email, id);
    return c.json("success");
  } catch (error) {
    return c.json({ error });
  }
});
app.get("/read", async (c) => {
  try {
    const users = await getUser();

    users.forEach((user) => {
      if (!validateInput(user)) {
        return c.json({ error: "Wrong input" });
      }
    });

    return c.json(users);
  } catch (error) {
    c.json({ error });
  }
});
app.delete("/delete", async (c) => {
  try {
    const data = await c.req.json();
    if (!validateInput(data)) {
      return c.json({ error: "Wrong input" });
    }

    const { name, email } = data;

    deleteUser(name);
    return c.json("Deleted user : " + name);
  } catch (error) {
    c.json({ error });
  }
});
app.post("/update", async (c) => {
  try {
    const { oldName, oldEmail, name, email } = await c.req.json();
    const data = { name, email };
    const oldData = { oldName, oldEmail };

    if (!validateInput(data) && !validateInput(oldData)) {
      return c.json({ error: "Wrong input" });
    }

    // const  = data;

    console.log(name);
    updateUser(oldName, email, name);
    return c.json({ msg: `Updated User to ${oldName}: ${name}` });
  } catch (error) {
    c.json({ error });
  }
});
Deno.serve({ port: 8081 }, app.fetch);
