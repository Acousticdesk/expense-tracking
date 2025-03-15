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
    table.integer("default_category_id").notNullable();

    table
      .foreign("default_category_id")
      .references("id")
      .inTable("default_categories")
      .onDelete("CASCADE");
  });

  return knex("default_quick_transactions").insert([
    { default_category_id: 1, title: "Rent Payment" },
    { default_category_id: 1, title: "Mortgage Payment" },
    { default_category_id: 2, title: "Electric Bill" },
    { default_category_id: 2, title: "Water Bill" },
    { default_category_id: 2, title: "Gas Bill" },
    { default_category_id: 2, title: "Internet Bill" },
    { default_category_id: 3, title: "Grocery Store" },
    { default_category_id: 4, title: "Restaurant" },
    { default_category_id: 4, title: "Coffee Shop" },
    { default_category_id: 4, title: "Fast Food" },
    { default_category_id: 5, title: "Gas Station" },
    { default_category_id: 5, title: "Car Wash" },
    { default_category_id: 5, title: "Car Parking" },
    { default_category_id: 5, title: "Public Transit" },
    { default_category_id: 5, title: "Car Insurance" },
    { default_category_id: 5, title: "Uber/Lyft" },
    { default_category_id: 6, title: "Gym Membership" },
    { default_category_id: 6, title: "Pharmacy" },
    { default_category_id: 6, title: "Dental Checkup" },
    { default_category_id: 7, title: "Movie Tickets" },
    { default_category_id: 7, title: "Streaming Subscription" },
    { default_category_id: 7, title: "Concert Ticket" },
    { default_category_id: 7, title: "Video Game Purchase" },
    { default_category_id: 8, title: "Savings Deposit" },
    { default_category_id: 8, title: "Credit Card Payment" },
    { default_category_id: 8, title: "Loan Repayment" },
    { default_category_id: 8, title: "Investment Contribution" },
    { default_category_id: 9, title: "Clothing Store" },
    { default_category_id: 9, title: "Electronics Purchase" },
    { default_category_id: 10, title: "Miscellaneous Expense" },
]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("default_quick_transactions");
};
