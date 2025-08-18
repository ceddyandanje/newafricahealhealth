
'use client';

import { useRouter } from 'next/navigation';
import { Button, type ButtonProps } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface GetStartedButtonProps extends ButtonProps {}

export default function GetStartedButton({className, ...props}: GetStartedButtonProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleGetStartedClick = () => {
    if (user) {
        router.push('/upload-prescription');
    } else {
        router.push('/login');
    }
  };

  return (
    <Button size="lg" onClick={handleGetStartedClick} className={className} {...props}>
      Get Started <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  );
}
