
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function GetStartedButton() {
  const router = useRouter();

  const handleGetStartedClick = () => {
    router.push('/upload-prescription');
  };

  return (
    <Button size="lg" onClick={handleGetStartedClick}>
      Get Started <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  );
}
