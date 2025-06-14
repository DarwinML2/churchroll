import { DataTable } from '@/components/custom-ui/datatable/data-table';
import { PageTitle } from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { UserPermission } from '@/enums/user';
import AppLayout from '@/layouts/app-layout';

import { useUser } from '@/hooks/use-permissions';
import { type BreadcrumbItem } from '@/types';
import { type Missionary } from '@/types/models/missionary';
import { Link } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { columns } from './includes/columns';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Missionaries',
    href: route('missionaries.index'),
  },
];

interface IndexPageProps {
  missionaries: Missionary[];
}

export default function Index({ missionaries }: IndexPageProps) {
  const { t } = useLaravelReactI18n();
  const { can: userCan } = useUser();
  return (
    <AppLayout title={t('Missionaries')} breadcrumbs={breadcrumbs}>
      <PageTitle>{t('Missionaries')}</PageTitle>
      <DataTable
        headerButton={
          userCan(UserPermission.CREATE_MISSIONARIES) && (
            <Button asChild>
              <Link href={route('missionaries.create')}>{t('Add Missionary')}</Link>
            </Button>
          )
        }
        data={missionaries}
        columns={columns}
      />
    </AppLayout>
  );
}
