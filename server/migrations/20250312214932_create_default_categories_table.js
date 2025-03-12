/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("default_categories", function (table) {
    table.increments("id").primary();
    table.string("title").notNullable().unique();
    table.integer("color_id").notNullable();
  });

  return knex("default_categories").insert([
    { title: "Housing", color_id: 1 },
    { title: "Utilities", color_id: 2 },
    { title: "Groceries", color_id: 3 },
    { title: "Dining Out", color_id: 4 },
    { title: "Transportation", color_id: 5 },
    { title: "Health & Wellness", color_id: 6 },
    { title: "Entertainment", color_id: 7 },
    { title: "Debt & Savings", color_id: 8 },
    { title: "Shopping", color_id: 9 },
    { title: "Miscellaneous", color_id: 10 },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("default_categories");
};
