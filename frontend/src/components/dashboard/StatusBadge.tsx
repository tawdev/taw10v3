import { Badge } from '@/components/ui/badge';
import { OrderStatus, PublishStatus } from '@/types/admin';

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variant = status === 'COMPLETED' ? 'success' : status === 'CANCELLED' ? 'danger' : status === 'PENDING' || status === 'WAITING_DOCUMENTS' ? 'warning' : 'default';
  return <Badge variant={variant}>{status.replaceAll('_', ' ')}</Badge>;
}

export function ActiveBadge({ active }: { active: boolean }) {
  return <Badge variant={active ? 'success' : 'muted'}>{active ? 'Active' : 'Inactive'}</Badge>;
}

export function PublishBadge({ status }: { status: PublishStatus }) {
  return <Badge variant={status === 'PUBLISHED' ? 'success' : 'warning'}>{status}</Badge>;
}
