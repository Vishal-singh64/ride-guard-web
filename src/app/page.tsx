import { HomePageClient } from '@/components/home-page-client';
import { checkNumber } from './actions';

export default function Home() {
  return (
    <>
      <HomePageClient checkNumberAction={checkNumber} />
    </>
  );
}
