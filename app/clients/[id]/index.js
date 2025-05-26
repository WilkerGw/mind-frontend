import dynamic from 'next/dynamic';
import Loading from '../../../components/Loading'; // Componente de loading personalizado

const ClientDetails = dynamic(() => import('./page'), {
  loading: () => <Loading />,
  suspense: true,
});

export default function ClientDetailsPage() {
  return (
    <ClientDetails />
  );
}