/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("transactions", function (table) {
    table.increments("id").primary();
    table.float("amount").notNullable();
    table.timestamp("timestamp").defaultTo(knex.fn.now());
    table.string("title");
    table.integer("user_id").unsigned();

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
  return knex.schema.dropTableIfExists("transactions");
};
