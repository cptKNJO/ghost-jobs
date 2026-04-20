import { db, eq, Table, Column } from "@repo/db";
import { companies } from "@repo/db/schema";
import { z } from "zod";

type ValidTables = typeof companies;

/**
 * Validates if a value is a number and exists in a specific DB table/column.
 */
export async function validateAndFetchRecord(
  table: ValidTables,
  column: Column,
  value: unknown,
) {
  // What if the user enters a name but is an id - should be deliberate!

  // 1. Check if the value is a number (or a numeric string)
  const numberSchema = z.coerce.number().safeParse(value);

  if (!numberSchema.success) {
    return null; // Value is not a valid number
  }

  // 2. Check the database
  const record = await db
    .select()
    .from(table)
    .where(eq(column, numberSchema.data))
    .limit(1);

  return record.length > 0 ? record : null;
}
