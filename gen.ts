import * as db from "./lib.ts"


type User = {
  id: number | null;
  name: string;
  created_at: string | null;
}

const ORM = {
  User: {
    all: <User extends Record<string, unknown>>() => db.prepare("SELECT * FROM user;").all<User>(),
  },
},
