import { HomePageClient } from '@/components/home-page-client';
import { AppDownloadSection } from '@/components/app-download-section';
import { checkNumber } from './actions';

export default function Home() {
  return (
    <>
      <HomePageClient checkNumberAction={checkNumber} />
      <AppDownloadSection />
    </>
  );
}
