
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Step, Stepper, useStepper } from '@/components/ui/stepper';
import { UploadCloud, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { addProduct } from '@/lib/products';
import { addLog } from '@/lib/logs';
import { addNotification } from '@/lib/notifications';
import { enrichProductData, type EnrichedProductData } from '@/ai/flows/product-importer-flow';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { getDocument, GlobalWorkerOptions, TextItem } from 'pdfjs-dist';

function Step1UploadAndEnrich({ onEnriched }: { onEnriched: (products: EnrichedProductData[]) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState('');
    const { nextStep } = useStepper();
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            setFile(null);
            toast({ variant: 'destructive', title: 'Invalid File', description: 'Please select a valid PDF file.' });
        }
    };
    
    const handleExtractAndEnrich = async () => {
        if (!file) {
            toast({ variant: 'destructive', title: 'No File Selected', description: 'Please upload a PDF file.' });
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        
        try {
            // Step 1: Extract raw text from PDF
            setProgressText('Extracting text from PDF...');
            GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await getDocument(arrayBuffer).promise;
            
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const text = textContent.items.map(item => (item as TextItem).str).join(' ');
                fullText += text + '\n';
                setProgress(Math.round((i / pdf.numPages) * 50)); // Extraction is 50% of the process
            }
            
            // Step 2: Send raw text to AI for enrichment
            setProgressText('AI is enriching product data...');
            const result = await enrichProductData({ rawProductData: fullText });
            setProgress(100);

            if (result.products && result.products.length > 0) {
                 onEnriched(result.products);
                 toast({ title: "Enrichment Complete", description: `AI identified and enriched ${result.products.length} products.` });
                 nextStep();
            } else {
                toast({ variant: 'destructive', title: "Enrichment Failed", description: "The AI could not identify any products from the document. Please check the PDF content and try again." });
            }

        } catch (error) {
            console.error("Error during AI import process:", error);
            toast({ variant: 'destructive', title: 'Processing Error', description: 'An unexpected error occurred. Please check the console for details.' });
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <div className="space-y-4">
            <p className="text-muted-foreground">
                Upload your PDF file containing product names and prices. The AI will read the document, identify the products, and automatically generate descriptions, categories, and other details.
            </p>
            <div className="flex items-center gap-4 p-4 border-2 border-dashed rounded-lg">
                <UploadCloud className="h-12 w-12 text-muted-foreground" />
                <div className="space-y-1">
                    <Label htmlFor="pdf-upload" className="font-semibold cursor-pointer text-primary hover:underline">Click to upload a file</Label>
                    <Input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} className="sr-only"/>
                    <p className="text-xs text-muted-foreground">PDF (up to 20MB)</p>
                     {file && <p className="text-sm font-medium">{file.name}</p>}
                </div>
            </div>
            
            <Button onClick={handleExtractAndEnrich} disabled={!file || isProcessing}>
                {isProcessing ? <Loader2 className="mr-2 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                Upload & Enrich with AI
            </Button>
            
            {isProcessing && (
                 <div className="space-y-2 pt-2">
                    <Label>{progressText}</Label>
                    <Progress value={progress} />
                </div>
            )}
        </div>
    );
}

function Step2ReviewAndImport({ enriched, onUpdate }: { enriched: EnrichedProductData[], onUpdate: (products: EnrichedProductData[]) => void }) {
    const { toast } = useToast();
    const [isImporting, setIsImporting] = useState(false);
    const { goToStep } = useStepper();

    const handleImport = async () => {
        setIsImporting(true);
        try {
            const batch = enriched.map(product => addProduct(product));
            await Promise.all(batch);
            
            addLog('INFO', `${enriched.length} products were imported via the AI Product Importer.`);
            addNotification({ recipientId: 'admin_role', type: 'product_update', title: 'Bulk Import Successful', description: `${enriched.length} new products have been added to the inventory.` });
            toast({ title: "Import Successful", description: `${enriched.length} products have been added to your inventory.` });
            
            // To allow another import, we should reset the flow
            goToStep(0);
            onUpdate([]); // Clear the enriched data

        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Import Failed", description: "Something went wrong while saving the products." });
        } finally {
            setIsImporting(false);
        }
    };

    const handleEdit = (index: number, field: keyof EnrichedProductData, value: string | number | string[]) => {
        const updated = [...enriched];
        // @ts-ignore
        updated[index][field] = value;
        onUpdate(updated);
    };

    return (
        <div className="space-y-4">
             <p className="text-muted-foreground">
                The AI has enriched your product data. Review, edit if needed, and then import to your Firestore database. The data will be reflected site-wide instantly.
            </p>
            <div className="h-[50vh] overflow-y-auto border rounded-md">
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow>
                            <TableHead className="w-[50px]">Img</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {enriched.map((p, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Image src={p.image} alt={p.name} width={40} height={40} className="rounded" />
                                </TableCell>
                                <TableCell><Input value={p.name} onChange={(e) => handleEdit(i, 'name', e.target.value)} className="min-w-[200px]" /></TableCell>
                                <TableCell><Textarea value={p.description} onChange={(e) => handleEdit(i, 'description', e.target.value)} className="min-w-[300px]" rows={2}/></TableCell>
                                <TableCell><Input value={p.category} onChange={(e) => handleEdit(i, 'category', e.target.value)} className="min-w-[150px]" /></TableCell>
                                <TableCell><Input type="number" value={p.price / 100} onChange={(e) => handleEdit(i, 'price', Number(e.target.value) * 100)} className="w-[100px]" /></TableCell>
                                <TableCell><Input type="number" value={p.stock} onChange={(e) => handleEdit(i, 'stock', Number(e.target.value))} className="w-[80px]" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
             <Button onClick={handleImport} disabled={isImporting}>
                {isImporting ? <Loader2 className="mr-2 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                Import to Firestore ({enriched.length} items)
            </Button>
        </div>
    )
}


export default function AIProductImporterPage() {
    const [enrichedProducts, setEnrichedProducts] = useState<EnrichedProductData[]>([]);

    const steps = [
        { label: 'Upload & Enrich', icon: Sparkles, component: <Step1UploadAndEnrich onEnriched={setEnrichedProducts} /> },
        { label: 'Review & Import', icon: CheckCircle, component: <Step2ReviewAndImport enriched={enrichedProducts} onUpdate={setEnrichedProducts} /> },
    ];

    return (
        <div className="p-6">
            <header className="py-6">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-primary" />
                    AI Product Importer
                </h1>
                <p className="text-muted-foreground">
                    Bulk-import products from a PDF file using AI to automatically enrich the data.
                </p>
            </header>

            <Card>
                <CardContent className="p-6">
                    <Stepper initialStep={0} steps={steps} className="mb-8">
                        {steps.map((stepProps, index) => (
                            <Step key={stepProps.label} {...stepProps}>
                                <div className="p-4 mt-4 border bg-muted/50 rounded-lg min-h-[300px]">
                                    {stepProps.component}
                                </div>
                            </Step>
                        ))}
                    </Stepper>
                </CardContent>
            </Card>
        </div>
    );
}
