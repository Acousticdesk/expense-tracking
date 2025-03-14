/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasTable = await knex.schema.hasTable("default_quick_transactions");

  if (hasTable) {
    return;
  }

  await knex.schema.createTable("default_quick_transactions", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable().unique();
    table.integer("category_id").notNullable();

    table
      .foreign("category_id")
      .references("id")
      .inTable("default_categories")
      .onDelete("CASCADE");
  });

  return knex("default_quick_transactions").insert([
    { category_id: 1, title: "Rent Payment" },
    { category_id: 1, title: "Mortgage Payment" },
    { category_id: 2, title: "Electric Bill" },
    { category_id: 2, title: "Water Bill" },
    { category_id: 2, title: "Gas Bill" },
    { category_id: 3, title: "Grocery Store" },
    { category_id: 3, title: "Supermarket" },
    { category_id: 4, title: "Restaurant" },
    { category_id: 4, title: "Coffee Shop" },
    { category_id: 5, title: "Gas Station" },
    { category_id: 5, title: "Public Transit" },
    { category_id: 6, title: "Gym Membership" },
    { category_id: 6, title: "Doctor Visit" },
    { category_id: 7, title: "Movie Tickets" },
    { category_id: 7, title: "Streaming Subscription" },
    { category_id: 8, title: "Savings Deposit" },
    { category_id: 8, title: "Credit Card Payment" },
    { category_id: 9, title: "Clothing Store" },
    { category_id: 9, title: "Electronics Purchase" },
    { category_id: 10, title: "Miscellaneous Expense" },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("default_quick_transactions");
};
