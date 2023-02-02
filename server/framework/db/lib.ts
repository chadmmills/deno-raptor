import { Database } from "https://deno.land/x/sqlite3@0.7.2/mod.ts";

const db = new Database("dev.db");

// Do I need to db.close()? this?

const query = {
  run: (sql: string, params?: Record<string, string | boolean | number>) => {
    const stmt = db.prepare(sql);

    if (params) {
      return stmt.all(params);
    }

    return stmt.all();
  },
};

type TDbQuery = {
  all: <T extends Record<string, unknown>>() => T[];
}

const modelQuery: TDbQuery = {
  all: <Model extends Record<string, unknown>>() => db.prepare("SELECT * FROM users;").all<Model>(),
}


const execute = {
  run: (sql: string) => {
    return db.exec(sql);
  },
};

const dataType = {
  toJS: (dataType: string) => {
    switch (dataType) {
      case "INTEGER":
        return "number";
      case "TEXT":
        return "string";
      case "BOOLEAN":
        return "boolean";
      case "DATETIME":
        return "string"; // ISO 8601
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  },
};

export { dataType, execute, query, modelQuery, db };
