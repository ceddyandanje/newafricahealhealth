
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
            <Card className="glassmorphic">
                <CardHeader className="items-center text-center">
                     <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={user.avatarUrl || ''} alt={user.name} />
                        <AvatarFallback className="text-4xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground mb-6">
                        Welcome to your profile page. This area is under construction.
                    </p>
                     <div className="flex justify-center gap-4">
                        <Button onClick={() => router.push('/patient/settings')} variant="default">Go to Settings</Button>
                        <Button onClick={logout} variant="outline">Log Out</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
