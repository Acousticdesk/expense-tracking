/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("quick_transactions", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable().unique();
    table.integer("category_id").notNullable();
    table.integer("user_id").notNullable();

    table
      .foreign("category_id")
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("quick_transactions");
};
