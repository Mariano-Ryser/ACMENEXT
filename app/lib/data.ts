import { sql } from '@vercel/postgres';
//Crear Definitions DEBTS
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  DebtForm,   //Crear!
  DebtsTable,  //Crear! 
  LatestDebtRaw, //Crear !
  Revenue,

} from './definitions';
import { formatCurrency } from './utils';


export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
        // Simula un retraso de 3 segundos
        // await new Promise((resolve) => setTimeout(resolve, 3000));


    const data = await sql<Revenue>`SELECT * FROM revenue`;
    console.log('Data fetch completed after 3 seconds.');


    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}


//CONSULTA PARA LAS CARTAS "PAGADOS" , "PENDIENTES" "TOTAL FACTURAS" "TOTAL CLIENTES"
export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.

    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}
//CUSTOMERS     //CUSTOMERS     //CUSTOMERS     
//CUSTOMERS     //CUSTOMERS     //CUSTOMERS     
export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}
export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

//INVOICES      //INVOICES      //INVOICES      
//INVOICES      //INVOICES      //INVOICES      
const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}
export async function fetchLatestInvoices() {
  try {
 

    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}
export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));
    
    console.log(invoice); // Invoice is an empty array []
    return invoice[0];

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}
export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}


// DEBTS NEWW!!   // DEBTS NEWW!!   // DEBTS NEWW!!   
// DEBTS NEWW!!   // DEBTS NEWW!!   // DEBTS NEWW!!   
export async function fetchFilteredDebts(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const debts = await sql<DebtsTable>`
      SELECT
        debts.id,
        debts.amount,
        debts.date,
        debts.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM debts
      JOIN customers ON debts.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        debts.amount::text ILIKE ${`%${query}%`} OR
        debts.date::text ILIKE ${`%${query}%`} OR
        debts.status ILIKE ${`%${query}%`}
      ORDER BY debts.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return debts.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch debts.');
  }
}
export async function fetchLatestDebts() {
  try {
    const data = await sql<LatestDebtRaw>`
      SELECT debts.amount, customers.name, customers.image_url, customers.email, debts.id
      FROM debts
      JOIN customers ON debts.customer_id = customers.id
      ORDER BY debts.date DESC
      LIMIT 5`;

    const latestDebts = data.rows.map((debt) => ({
      ...debt,
      amount: formatCurrency(debt.amount),
    }));
    return latestDebts;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest debts.');
  }
}
export async function fetchDebtById(id: string) {
  try {
    const data = await sql<DebtForm>`
      SELECT
        debts.id,
        debts.customer_id,
        debts.amount,
        debts.status
      FROM debts
      WHERE debts.id = ${id};
    `;

    const debt = data.rows.map((debt) => ({
      ...debt,
      // Convert amount from cents to dollars
      amount: debt.amount / 100,
    }));
    
    console.log(debt); // Invoice is an empty array []
    return debt[0];

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch debt.');
  }
}
export async function fetchDebtsPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM debts
    JOIN customers ON debts.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      debts.amount::text ILIKE ${`%${query}%`} OR
      debts.date::text ILIKE ${`%${query}%`} OR
      debts.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of debts.');
  }
}
