import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./schema",
  dialect: "postgresql",
  dbCredentials: {
    host: Deno.env.get("POSTGRES_HOST")!,
    port: parseInt(Deno.env.get("POSTGRES_PORT")!),
    user: Deno.env.get("POSTGRES_USER")!,
    password: Deno.env.get("POSTGRES_PASSWORD")!,
    database: Deno.env.get("POSTGRES_DB")!,
    ssl:
      Deno.env.get("POSTGRES_SSL") === "false"
        ? false
        : (Deno.env.get("POSTGRES_SSL")! as
            | "require"
            | "allow"
            | "prefer"
            | "verify-full"),
  },
});
