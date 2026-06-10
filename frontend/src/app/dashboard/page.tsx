import { DashboardHome } from '@/components/dashboard/DashboardHome';
import { PageHeader } from '@/components/dashboard/PageHeader';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Premium operational command center for orders, customers, documents, contacts and completed-order revenue." />
      <DashboardHome />
    </>
  );
}
