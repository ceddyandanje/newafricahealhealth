
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

export default function UploadPrescriptionPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="glassmorphic">
          <CardHeader className="text-center">
            <CardTitle>Upload Your Prescription</CardTitle>
            <CardDescription>
              Please upload a clear image of your prescription to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/50 rounded-lg">
                <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Drag & drop your file here, or click to browse.</p>
                <input type="file" className="sr-only" />
            </div>
            {/* Placeholder for future functionality */}
            <p className="text-xs text-center mt-4 text-muted-foreground">
                (This is a placeholder UI. The upload functionality is not yet implemented.)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
