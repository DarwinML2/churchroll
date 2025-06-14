import { DataTableColumnHeader } from '@/components/custom-ui/datatable/DataTableColumnHeader';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useConfirmationStore from '@/stores/confirmationStore';
import { type OfferingType } from '@/types/models/offering-types';
import { router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Edit2Icon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { OfferingTypeForm } from '..';
export const columns: ColumnDef<OfferingType>[] = [
  {
    enableHiding: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    accessorKey: 'name',
  },
  {
    id: 'actions',
    enableHiding: false,
    enableSorting: false,
    size: 0,
    cell: function CellComponent({ row }) {
      const { t } = useLaravelReactI18n();
      const { openConfirmation } = useConfirmationStore();
      const offeringType = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontalIcon />
              <span className="sr-only">{t('Actions')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <OfferingTypeForm offeringType={offeringType}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit2Icon className="size-3" />
                <span>{t('Edit')}</span>
              </DropdownMenuItem>
            </OfferingTypeForm>

            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                openConfirmation({
                  title: t('Are you sure you want to delete this offering type?'),
                  description: t('This action cannot be undone.'),
                  actionLabel: t('Delete'),
                  actionVariant: 'destructive',
                  cancelLabel: t('Cancel'),
                  onAction: () => {
                    router.delete(route('codes.offeringTypes.destroy', offeringType.id), {
                      preserveScroll: true,
                    });
                  },
                });
              }}
            >
              <Trash2Icon className="size-3" />
              <span>{t('Delete')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
