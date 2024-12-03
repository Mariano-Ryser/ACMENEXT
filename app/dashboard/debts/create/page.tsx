import Form from '@/app/ui/debts/create-form';
import Breadcrumbs from '@/app/ui/debts/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Debts', href: '/dashboard/debts' },
          {
            label: 'Create Debt',
            href: '/dashboard/debts/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}