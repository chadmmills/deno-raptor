// pull in sqlite3
import * as db from "./lib.ts";

// [x] PascalCase model name
// [ ] write file
// [ ] Deno fmt file

function toPascalCase(str: string) {
  return str
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
}

function singularize(str: string) {
  return str.slice(0, -1);
}

function pluralize(str: string) {
  return str + "s";
}

const tables = db.query.run(
  "SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name;",
);

const models = tables.filter(({ name }) => {
  return !["migrations", "sqlite_sequence"].includes(name);
});

const types: {
  name: string;
  fields: { id: string; dataType: string; isRequired: boolean }[];
}[] = [];

models.forEach(({ name }) => {
  const tableInfo = db.query.run(`PRAGMA table_info(${name})`);
  const type = {
    name: toPascalCase(singularize(name)),
    fields: tableInfo.map((t) => (
      { id: t.name, dataType: t.type, isRequired: t.notnull === 1 }
    )),
  };
  types.push(type);
});

const typeCode = types.reduce((code, type) => {
  return (
    `${code}
type ${type.name} = {
  ${
      type.fields.map((field) =>
        `${field.id}: ${db.dataType.toJS(field.dataType)}${
          field.isRequired ? "" : " | null"
        };`
      ).join("\n  ")
    }
}\n`
  );
}, ``);

console.log(typeCode);

let modelCode = "const ORM = {\n";


  types.forEach((type) => {
  const pluralTableName = pluralize(type.name.toLowerCase());

  modelCode += `  ${pluralTableName}: {
    all: () => db.prepare("SELECT * FROM ${pluralTableName};").all<${type.name}>(),
      find: (id: string) => db.prepare("SELECT * FROM ${pluralTableName} WHERE id = ? LIMIT 1;").get<${type.name}>(id),
      findAll: (searchParams: Partial<${type.name}>) => {
      const keys = Object.keys(searchParams);
      const values = Object.values(searchParams);
      const query = \`SELECT * FROM ${pluralTableName} WHERE \${keys.map((key) => \`\${key} = ?\`).join(" AND ")}\`;
      return db.prepare(query).all<${type.name}>(...values);
    },
    create: (input: Omit<Partial<${type.name}>, "id" | "created_at">) => {
      const data = { ...input, id: crypto.randomUUID()};
      const keys = Object.keys(data);
      const values = Object.values(data);
      const query = \`INSERT INTO ${pluralTableName} (\${keys.join(", ")}) VALUES (\${keys.map(() => "?").join(", ")})\`;
      const result = db.prepare(query).run(...values);
      console.info("Rows inserted:", result);
      return ORM.${pluralTableName}.find(data.id);
    },
  },\n`;
  })

modelCode += `}\n`;
console.log(modelCode);

const imports = `import { crypto } from "https://deno.land/std@0.173.0/crypto/mod.ts";\n`;
const code = `import { db } from "./lib.ts"`;
const fileContent = `${imports}\n${code}\n${typeCode}\n${modelCode}\nexport { ORM };`;

await Deno.writeTextFile("./server/framework/db/orm.gen.ts", fileContent);


// pull in fs
// read the database tables?
// generate the typescript files
// run deno fmt on it
