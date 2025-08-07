
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !appUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-xl mx-auto glassmorphic">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-2xl">
                {appUser.firstName?.[0]}
                {appUser.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-headline">
                {appUser.firstName} {appUser.lastName}
              </CardTitle>
              <CardDescription>{appUser.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Role</h3>
            <p className="text-muted-foreground capitalize">{appUser.role}</p>
          </div>
          <div>
            <h3 className="font-semibold">Phone Number</h3>
            <p className="text-muted-foreground">{appUser.phoneNumber || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="font-semibold">Age Range</h3>
            <p className="text-muted-foreground">{appUser.ageRange || 'Not provided'}</p>
          </div>
          <Button variant="outline" className="mt-4">Edit Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
