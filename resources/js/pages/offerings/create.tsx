import { Form } from '@/components/forms/Form';
import { ComboboxField } from '@/components/forms/inputs/ComboboxField';
import { CurrencyField } from '@/components/forms/inputs/CurrencyField';
import { DateField } from '@/components/forms/inputs/DateField';
import { FieldsGrid } from '@/components/forms/inputs/FieldsGrid';
import { InputField } from '@/components/forms/inputs/InputField';
import { SelectField } from '@/components/forms/inputs/SelectField';
import { PageTitle } from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SelectOption } from '@/types';
import { useForm } from '@inertiajs/react';
import { formatDate } from 'date-fns';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { TrashIcon } from 'lucide-react';

interface CreatePageProps {
  wallets: SelectOption[];
  paymentMethods: SelectOption[];
  members: SelectOption[];
  missionaries: SelectOption[];
  offeringTypes: SelectOption[];
}

interface CreateForm {
  payer_id: string;
  date: string;
  offerings: {
    payment_method: string;
    offering_type_id: string;
    recipient_id: string;
    wallet_id: string;
    amount: string;
    note: string;
  }[];
}
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Offerings',
    href: route('offerings.index'),
  },
  {
    title: 'New Offering',
  },
];

const nonMemberOption: SelectOption[] = [
  {
    label: 'Non member',
    value: 'non_member',
  },
];
export default function Create({ wallets, paymentMethods, members, missionaries, offeringTypes }: CreatePageProps) {
  const { t } = useLaravelReactI18n();
  const { data, setData, post, errors, processing } = useForm<Required<CreateForm>>({
    date: formatDate(new Date(), 'yyyy-MM-dd'),
    payer_id: 'non_member',
    offerings: [
      {
        wallet_id: wallets[0].value.toString(),
        payment_method: paymentMethods[0]?.value.toString() ?? '',
        offering_type_id: offeringTypes[0]?.value.toString() ?? '',
        recipient_id: '',
        amount: '5.00',
        note: '',
      },
    ],
  });

  function handleSubmit() {
    post(route('offerings.store'));
  }

  function handleAddOffering() {
    setData('offerings', [
      ...data.offerings,
      {
        wallet_id: wallets[0].value.toString(),
        payment_method: paymentMethods[0]?.value.toString() ?? '',
        offering_type_id: offeringTypes[0]?.value.toString() ?? '',
        recipient_id: '',
        amount: '0.00',
        note: '',
      },
    ]);
  }

  function handleRemoveOffering(index: number) {
    const updatedOfferings = [...data.offerings];
    updatedOfferings.splice(index, 1);
    setData('offerings', updatedOfferings);
  }

  function handleUpdateOffering(index: number, field: string, value: string) {
    const updatedOfferings = [...data.offerings];
    updatedOfferings[index] = {
      ...updatedOfferings[index],
      [field]: value,
    };
    setData('offerings', updatedOfferings);
  }

  return (
    <AppLayout title={t('Offerings')} breadcrumbs={breadcrumbs}>
      <PageTitle>{t('New Offering')}</PageTitle>
      <div className="mt-2 flex items-center justify-center">
        <Form isSubmitting={processing} className="w-full max-w-2xl" onSubmit={handleSubmit}>
          <ComboboxField
            required
            label={t('Who is this offering from?')}
            value={data.payer_id}
            onChange={(value) => setData('payer_id', value)}
            error={errors.payer_id}
            options={nonMemberOption.concat(members)}
          />
          <FieldsGrid>
            <DateField required label={t('Date of Offering')} value={data.date} onChange={(value) => setData('date', value)} error={errors.date} />
          </FieldsGrid>

          <Button size="sm" variant="secondary" type="button" onClick={handleAddOffering}>
            {t('Add offering')}
          </Button>

          <div className="space-y-4 py-2">
            {data.offerings.map((offering, index) => (
              <fieldset className="space-y-2" key={index}>
                {data.offerings.length > 1 && (
                  <legend className="px-2 text-sm font-semibold">
                    <Button size="icon" className="size-6" variant="destructive" type="button" onClick={() => handleRemoveOffering(index)}>
                      <TrashIcon className="size-4" />
                    </Button>
                  </legend>
                )}
                <FieldsGrid cols={2} className="grow">
                  <SelectField
                    required
                    label={t('Wallet')}
                    value={offering.wallet_id}
                    onChange={(value) => {
                      handleUpdateOffering(index, 'wallet_id', value);
                    }}
                    error={errors[`offerings.${index}.wallet_id` as keyof typeof data]}
                    options={wallets}
                  />
                  <ComboboxField
                    label={t('Recipient')}
                    placeholder={t('Select one or leave empty')}
                    value={offering.recipient_id}
                    onChange={(value) => {
                      handleUpdateOffering(index, 'recipient_id', value);
                    }}
                    error={errors[`offerings.${index}.recipient_id` as keyof typeof data]}
                    options={missionaries}
                  />
                </FieldsGrid>

                <FieldsGrid cols={3} className="grow">
                  <SelectField
                    required
                    label={t('Payment method')}
                    value={offering.payment_method}
                    onChange={(value) => {
                      handleUpdateOffering(index, 'payment_method', value);
                    }}
                    error={errors[`offerings.${index}.payment_method` as keyof typeof data]}
                    options={paymentMethods}
                  />
                  <SelectField
                    required
                    label={t('Offering type')}
                    value={offering.offering_type_id}
                    onChange={(value) => {
                      handleUpdateOffering(index, 'offering_type_id', value);
                    }}
                    error={errors[`offerings.${index}.offering_type_id` as keyof typeof data]}
                    options={offeringTypes}
                  />

                  <CurrencyField
                    required
                    label={t('Amount')}
                    value={offering.amount}
                    onChange={(value) => {
                      handleUpdateOffering(index, 'amount', value);
                    }}
                    error={errors[`offerings.${index}.amount` as keyof typeof data]}
                  />
                </FieldsGrid>
                <InputField
                  label={t('Note')}
                  value={offering.note}
                  onChange={(value) => {
                    handleUpdateOffering(index, 'note', value);
                  }}
                  error={errors[`offerings.${index}.note` as keyof typeof data]}
                />
              </fieldset>
            ))}
          </div>
        </Form>
      </div>
    </AppLayout>
  );
}
