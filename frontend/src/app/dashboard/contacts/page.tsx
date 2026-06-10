'use client';

import { useEffect, useState } from 'react';
import { MailCheck, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, Td, Th } from '@/components/ui/table';
import { useAdminStore } from '@/store/admin-store';
import { useToastStore } from '@/store/toast-store';
import { cn } from '@/lib/utils';
import { contactsService } from '@/services/contacts.service';

export default function ContactsPage() {
  const { contacts, setContacts, markContactRead, removeContact } = useAdminStore();
  const toast = useToastStore((state) => state.toast);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    contactsService.list()
      .then((data: any) => {
        if (data) {
          const mapped = data.map((item: any) => ({
            id: item.id,
            name: `${item.nom} ${item.prenom}`.trim(),
            email: item.email,
            phone: item.phone || 'N/A',
            subject: item.service || 'General Contact',
            message: item.message,
            isRead: item.isRead,
            createdAt: item.createdAt,
          }));
          setContacts(mapped);
        }
      })
      .catch((err) => {
        console.error(err);
        toast({ variant: 'destructive', title: 'Failed to fetch contact requests.' });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await contactsService.markRead(id);
      markContactRead(id);
      toast({ variant: 'success', title: 'Marked as read.' });
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Failed to update message status.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await contactsService.delete(id);
      removeContact(id);
      toast({ variant: 'success', title: 'Message deleted.' });
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Failed to delete message.' });
    }
  };

  return (
    <>
      <PageHeader title="Contact Requests" description="Read and manage contact form submissions." />
      <Card>
        <CardContent className="overflow-x-auto p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-sm text-[#667085]">
              Loading messages...
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-sm text-[#667085]">
              No contact requests found.
            </div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Subject</Th>
                  <Th>Message</Th>
                  <Th>Created Date</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className={cn(
                      'hover:bg-[#faf9f6]/80 transition-colors',
                      !contact.isRead && 'bg-[#faf7ee]/30 font-semibold',
                    )}
                  >
                    <Td className="font-bold text-[#1f2a24]">{contact.name}</Td>
                    <Td className="text-xs text-[#667085]">{contact.email}</Td>
                    <Td className="text-xs text-[#4f5b54]">{contact.phone}</Td>
                    <Td>
                      <div className="flex items-center gap-2 font-bold text-[#1f2a24] tracking-tight">
                        {contact.subject}
                        {!contact.isRead ? <Badge variant="warning">New</Badge> : null}
                      </div>
                    </Td>
                    <Td className="max-w-md min-w-[280px] break-words text-xs text-[#4f5b54] leading-relaxed font-normal">
                      {contact.message}
                    </Td>
                    <Td className="text-xs">{new Date(contact.createdAt).toLocaleDateString()}</Td>
                    <Td>
                      <div className="flex gap-1.5 items-center">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 hover:bg-[#efe9dd]"
                          onClick={() => handleMarkRead(contact.id)}
                          disabled={contact.isRead}
                          title={contact.isRead ? 'Marked as read' : 'Mark as read'}
                        >
                          <MailCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={() => handleDelete(contact.id)}
                          title="Delete Request"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
