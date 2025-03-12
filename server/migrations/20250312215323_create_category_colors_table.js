/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("category_colors", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("hash", 7).notNullable();
  });

  return knex("category_colors").insert([
    { name: "Income", hash: "#2ECC71" },
    { name: "Expenses", hash: "#E74C3C" },
    { name: "Savings", hash: "#F1C40F" },
    { name: "Investments", hash: "#3498DB" },
    { name: "Debt Payments", hash: "#9B59B6" },
    { name: "Subscriptions", hash: "#1ABC9C" },
    { name: "Groceries", hash: "#E67E22" },
    { name: "Bills", hash: "#34495E" },
    { name: "Miscellaneous", hash: "#95A5A6" },
    { name: "Entertainment", hash: "#D35400" },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("category_colors");
};
