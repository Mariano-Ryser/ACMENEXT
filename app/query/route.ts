import { db } from "@vercel/postgres";

const client = await db.connect();

async function listDebts() {
  const data = await client.sql`
  SELECT debts.amount, customers.name
  FROM debts
  JOIN customers ON debts.customer_id = customers.id
  WHERE debts.amount = 666;
  `;
  console.log(data)
	return data.rows;
}

export async function GET() {

  try {
    return Response.json(await listDebts());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}


