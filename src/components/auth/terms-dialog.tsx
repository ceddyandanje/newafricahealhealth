
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface TermsDialogProps {
  isOpen: boolean;
  onAccept: () => Promise<void>;
  isSaving: boolean;
}

export default function TermsDialog({ isOpen, onAccept, isSaving }: TermsDialogProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Africa Heal Health!</DialogTitle>
          <DialogDescription>
            Before you continue, please review and accept our Terms of Service.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2 text-sm text-muted-foreground max-h-60 overflow-y-auto">
          <p>By clicking "I Agree", you acknowledge that you have read, understood, and agree to be bound by our <Link href="/terms" target="_blank" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</Link>.</p>
          <p>This includes understanding that our platform provides information and services but does not constitute medical advice. Always consult a qualified healthcare professional for any medical concerns.</p>
        </div>
        <DialogFooter className="pt-4">
          <Button
            type="button"
            className="w-full"
            disabled={isSaving}
            onClick={onAccept}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            I Agree
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
