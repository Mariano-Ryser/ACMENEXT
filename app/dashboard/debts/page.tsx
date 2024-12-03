import Pagination from '@/app/ui/debts/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/debts/table';
import { CreateDebt } from '@/app/ui/debts/buttons';
import { lusitana } from '@/app/ui/fonts';
import { DebtsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchDebtsPages } from '@/app/lib/data';


export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchDebtsPages(query); 

  return (
    <div className="w-full">

      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Debts</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search debts..." />
        <CreateDebt />
      </div>

       <Suspense key={query + currentPage} fallback={<DebtsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>

    </div>
  );
}


