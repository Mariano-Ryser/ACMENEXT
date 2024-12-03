import Form from '@/app/ui/debts/edit-form';
import Breadcrumbs from '@/app/ui/debts/breadcrumbs';
import { fetchDebtById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const [debt, customers] = await Promise.all([
        fetchDebtById(id),
        fetchCustomers(),
      ]);
      if (!debt) {
        notFound();
      }

      
      
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Debts', href: '/dashboard/debts' },
          {
            label: 'Edit Debt',
            href: `/dashboard/debts/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form debt={debt} customers={customers} />
    </main>
  );
}
