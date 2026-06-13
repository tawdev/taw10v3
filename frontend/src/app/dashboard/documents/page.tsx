'use client';

import { Download, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/form';
import { Table, Td, Th } from '@/components/ui/table';
import { useAdminStore } from '@/store/admin-store';
import { DocumentType } from '@/types/admin';

const filters: Array<DocumentType | 'ALL'> = ['ALL', 'CIN', 'PASSPORT', 'COMPANY_DOCUMENTS', 'CONTRACTS'];

export default function DocumentsPage() {
  const [filter, setFilter] = useState<DocumentType | 'ALL'>('ALL');
  const { filterDocuments, removeDocument } = useAdminStore();
  const documents = filterDocuments(filter);

  function getDocBadgeVariant(type: DocumentType) {
    if (type === 'CIN') return 'success';
    if (type === 'PASSPORT') return 'warning';
    if (type === 'COMPANY_DOCUMENTS') return 'default';
    return 'muted';
  }

  return (
    <>
      <PageHeader
        title="Documents"
        description="Review uploaded CIN, passports, company documents, and contracts."
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">Filter:</span>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as DocumentType | 'ALL')}
              className="w-56 h-9 text-xs font-semibold"
            >
              {filters.map((item) => (
                <option key={item} value={item}>
                  {item.replaceAll('_', ' ')}
                </option>
              ))}
            </Select>
          </div>
        }
      />
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Customer</Th>
                <Th>Type</Th>
                <Th>Size</Th>
                <Th>Uploaded</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr key={document.id} className="hover:bg-white/5 transition-colors">
                  <Td className="font-bold text-white">{document.name}</Td>
                  <Td className="font-semibold">{document.customerName}</Td>
                  <Td>
                    <Badge variant={getDocBadgeVariant(document.type)}>
                      {document.type.replaceAll('_', ' ')}
                    </Badge>
                  </Td>
                  <Td className="text-xs font-semibold text-[#667085]">{document.size}</Td>
                  <Td className="text-xs">{document.uploadedAt}</Td>
                  <Td>
                    <div className="flex items-center gap-1.5">
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-[#efe9dd]" title="View Document">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8" title="Download Document">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => removeDocument(document.id)}
                        title="Delete Document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
