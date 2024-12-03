'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache'; // borrar este caché y activar una nueva solicitud al servidor.
import { redirect } from 'next/navigation';
import { signIn } from '@/auth'; //AUTENTICACION
import { AuthError } from 'next-auth'; //AUTENTICACION


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// ZOD VALIDACIONES
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select status.',
  }),
  date: z.string(),
});


export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
  



  // INVOICESSSSS     // INVOICESSSSS       // INVOICESSSSS

const CreateInvoice = FormSchema.omit({ id: true, date: true });
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

// If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

// Insert data into the database
    try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  // Test it out:
    console.log(FormData);
    } catch (error) {
    console.error('Error al eliminar la factura:', error);
    return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }  
     // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices'); 
    redirect('/dashboard/invoices'); 
  }
  // Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.', error };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        
        revalidatePath('/dashboard/invoices'); 
        
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Invoice.',error,
          };
       }
}


 //DEBTS     //DEBTS     //DEBTS     
//DEBTS     //DEBTS     //DEBTS     

const CreateDebt = FormSchema.omit({ id: true, date: true });
export async function createDebt(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateDebt.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

// If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Debt.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

// Insert data into the database
    try {
    await sql`
    INSERT INTO debts (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  // Test it out:
    console.log(FormData);
    } catch (error) {
    console.error('Error al eliminar la deuda:', error);
    return {
        message: 'Database Error: Failed to Create Debt.',
      };
    }  
     // Revalidate the cache for the debts page and redirect the user.
    revalidatePath('/dashboard/debts'); //Crear
    redirect('/dashboard/debts'); //Crear
  }

  const UpdateDebt = FormSchema.omit({ id: true, date: true });
export async function updateDebt(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateDebt.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Debt.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE debts
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Debt.', error };
  }
 
  revalidatePath('/dashboard/debts'); //Crear Archivo
  redirect('/dashboard/debts'); //Crear Archivo
}
export async function deleteDebt(id: string) {
  try {
      await sql`DELETE FROM debts WHERE id = ${id}`;
      
      revalidatePath('/dashboard/debts'); //Crear Archivo
      
  } catch (error) {
      return {
          message: 'Database Error: Failed to Delete Debt.',error,
        };
     }
}

