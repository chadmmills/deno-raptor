console.log("Hello World");

export type TDb = {
  table: {
    find: (id: string) => Promise<null | { id: string; name: string }>;
  };
};

export default { table: { find: async (id: string) => null } };
