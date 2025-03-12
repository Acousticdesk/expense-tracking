/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  return knex.schema.createTable("categories", function (table) {
    table.increments("id").primary();
    table.string("title").notNullable().unique();
    table.integer("color_id").notNullable();
    table.integer("user_id").unsigned();
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
  return knex.schema.dropTableIfExists("categories");
};
