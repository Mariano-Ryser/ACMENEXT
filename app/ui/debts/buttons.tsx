import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteDebt } from '@/app/lib/actions'; 

//BUTTON REDIRIJE A -> CREATEE INVOICE FORM
export function CreateDebt() {
  return (
    <Link
      href="/dashboard/debts/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Debt</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
///BUTTON REDIRIJE A -> UPDATE FORM
export function UpdateDebt({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/debts/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

//BUTTON DELETE INVOICE FUNCTION
export function DeleteDebt({ id }: { id: string }) {
  const deleteDebtWithId = deleteDebt.bind(null, id);
  return (
    <>
 <form action={deleteDebtWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
    </>
  );
}
