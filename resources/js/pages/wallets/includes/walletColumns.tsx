import { DatatableCell } from '@/components/custom-ui/datatable/DatatableCell';
import { DataTableColumnHeader } from '@/components/custom-ui/datatable/DataTableColumnHeader';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { WalletName } from '@/enums';
import useConfirmationStore from '@/stores/confirmationStore';
import type { Wallet } from '@/types/models/wallet';
import { Link, router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { ArchiveIcon, ArchiveRestoreIcon, CheckIcon, Edit2Icon, MoreHorizontalIcon, WalletIcon, XCircleIcon } from 'lucide-react';
import { WalletForm } from '..';

export const walletColumns: ColumnDef<Wallet>[] = [
  {
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    accessorKey: 'name',
    cell: function CellComponent({ row }) {
      const wallet = row.original;
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" size="sm" className="px-0">
              {wallet.name}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold">{wallet.name}</span>
              {wallet.meta?.bankName && (
                <span className="text-muted-foreground text-sm">
                  {wallet.meta.bankName} - {wallet.meta.bankAccountNumber}
                </span>
              )}
              {wallet.description && <p className="text-muted-foreground text-sm">{wallet.description}</p>}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    enableHiding: false,
    accessorKey: 'balanceFloat',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Balance" />,
    cell: ({ row }) => <DatatableCell justify="end">${row.original.balanceFloat}</DatatableCell>,
  },
  {
    sortingFn: (rowA, rowB) => (rowA.original.deletedAt ? 1 : 0) - (rowB.original.deletedAt ? 1 : 0),
    accessorKey: 'deletedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Active" />,
    meta: 'Active',
    cell: ({ row }) => (
      <DatatableCell justify="center">
        {row.original.deletedAt ? <XCircleIcon className="text-destructive size-4" /> : <CheckIcon className="size-4 text-green-600" />}
      </DatatableCell>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    enableSorting: false,
    size: 0,
    cell: function CellComponent({ row }) {
      const { t } = useLaravelReactI18n();
      const { openConfirmation } = useConfirmationStore();
      //   const { can: userCan } = useUser();
      const wallet = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontalIcon />
              <span className="sr-only">{t('Actions')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={route('wallets.show', wallet.uuid)}>
                <WalletIcon className="size-3" />
                <span>{t('Transactions')}</span>
              </Link>
            </DropdownMenuItem>
            {/* {userCan(UserPermission.UPDATE_SKILLS) && ( */}
            <WalletForm wallet={wallet}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit2Icon className="size-3" />
                <span>{t('Edit')}</span>
              </DropdownMenuItem>
            </WalletForm>
            {/* )} */}
            {wallet.slug !== WalletName.PRIMARY && wallet.deletedAt ? (
              <DropdownMenuItem
                onClick={() => {
                  openConfirmation({
                    title: t('Are you sure you want to activate this wallet?'),
                    description: t('This wallet will be usable again'),
                    actionLabel: t('Activate'),
                    cancelLabel: t('Cancel'),
                    onAction: () => {
                      router.put(route('wallets.restore', wallet.uuid), {
                        preserveScroll: true,
                      });
                    },
                  });
                }}
              >
                <ArchiveRestoreIcon className="size-3" />
                <span>{t('Activate')}</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  openConfirmation({
                    title: t('Are you sure you want to deactivate this wallet?'),
                    description: t("This wallet won't be usable until it is activated"),
                    actionLabel: t('Deactivate'),
                    actionVariant: 'destructive',
                    cancelLabel: t('Cancel'),
                    onAction: () => {
                      router.delete(route('wallets.destroy', wallet.uuid), {
                        preserveScroll: true,
                      });
                    },
                  });
                }}
              >
                <ArchiveIcon className="size-3" />
                <span>{t('Deactivate')}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
