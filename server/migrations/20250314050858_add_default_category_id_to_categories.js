/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("categories", (table) => {
    table.integer("default_category_id").unsigned();
  });

  await knex("categories").update({
    default_category_id: knex.raw(
      "(SELECT id FROM default_categories WHERE default_categories.title = categories.title)",
    ),
  });

  await knex.schema.alterTable("categories", (table) => {
    table
      .foreign("default_category_id")
      .references("id")
      .inTable("default_categories")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("categories", (table) => {
    table.dropForeign("default_category_id");
    table.dropColumn("default_category_id");
  });
};
