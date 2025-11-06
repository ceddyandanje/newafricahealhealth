
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Step, Stepper, useStepper } from '@/components/ui/stepper';
import { UploadCloud, Sparkles, CheckCircle, Loader2, List, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { addProduct } from '@/lib/products';
import { type Product } from '@/lib/types';
import { addLog } from '@/lib/logs';
import { addNotification } from '@/lib/notifications';
import { enrichProductData, type EnrichedProductData } from '@/ai/flows/product-importer-flow';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { getDocument, GlobalWorkerOptions, TextItem } from 'pdfjs-dist';

type ExtractedProduct = {
    name: string;
    price: number; // Stored in cents
};


function Step1Upload({ onExtracted }: { onExtracted: (products: ExtractedProduct[]) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [isParsing, setIsParsing] = useState(false);
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
    
    const handleExtract = async () => {
        if (!file) {
            toast({ variant: 'destructive', title: 'No File Selected', description: 'Please upload a PDF file to extract from.' });
            return;
        }

        setIsParsing(true);
        setProgress(0);
        setProgressText('Initializing...');
        
        try {
            // Set worker path for pdfjs
            GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await getDocument(arrayBuffer).promise;
            
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                setProgressText(`Processing page ${i} of ${pdf.numPages}...`);
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const text = textContent.items.map(item => (item as TextItem).str).join(' ');
                fullText += text + '\n';
                setProgress(Math.round((i / pdf.numPages) * 100));
            }

            setProgressText('Parsing extracted text...');
            const lines = fullText.trim().split('\n');
            const products: ExtractedProduct[] = [];
            let extractionErrors = 0;

            lines.forEach(line => {
                const match = line.match(/(.*?)\s+([\d,]+(?:\.\d{1,2})?)$/);
                if (match) {
                    const name = match[1].trim();
                    const priceString = match[2].replace(/,/g, '');
                    const price = parseFloat(priceString);
                    if (name && !isNaN(price)) {
                        products.push({ name, price: Math.round(price * 100) });
                    } else {
                        extractionErrors++;
                    }
                } else {
                     if (line.trim().length > 0) extractionErrors++;
                }
            });
            
            if (extractionErrors > 0) {
                 toast({ variant: 'destructive', title: 'Parsing Warning', description: `${extractionErrors} line(s) could not be parsed and were skipped.` });
            }

            if (products.length > 0) {
                toast({ title: 'Extraction Successful', description: `Successfully extracted ${products.length} products.`});
                onExtracted(products);
                nextStep();
            } else {
                toast({ variant: 'destructive', title: 'Extraction Failed', description: 'No valid products could be extracted. Please check the PDF format.' });
            }

        } catch (error) {
            console.error("Error parsing PDF:", error);
            toast({ variant: 'destructive', title: 'Parsing Error', description: 'There was an issue processing the PDF file.' });
        } finally {
            setIsParsing(false);
        }
    };


    return (
        <div className="space-y-4">
            <p className="text-muted-foreground">
                Upload your PDF file containing product names and prices. The system will perform OCR to extract the data. For best results, ensure the PDF has a clear, two-column format.
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
            
            <Button onClick={handleExtract} disabled={!file || isParsing}>
                {isParsing ? <Loader2 className="mr-2 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                Extract Product Data
            </Button>
            
            {isParsing && (
                 <div className="space-y-2">
                    <Label>{progressText}</Label>
                    <Progress value={progress} />
                </div>
            )}
        </div>
    );
}


function Step2ReviewAndEnrich({ extracted, onEnriched }: { extracted: ExtractedProduct[], onEnriched: (products: EnrichedProductData[]) => void }) {
    const { nextStep } = useStepper();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleEnrich = async () => {
        setIsLoading(true);
        try {
            // Convert price from cents back to a decimal string for the AI
            const rawData = extracted.map(p => `${p.name} - ${(p.price / 100).toFixed(2)}`).join('\n');
            const result = await enrichProductData({ rawProductData: rawData });
            onEnriched(result.products);
            toast({ title: "Enrichment Complete", description: "Product data has been enhanced by AI." });
            nextStep();
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Enrichment Failed", description: "The AI could not process the product data. Please check your server logs." });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-4">
             <p className="text-muted-foreground">
                We have extracted {extracted.length} products. Review the list below. If it looks correct, proceed to enrich the data with AI.
            </p>
            <div className="h-64 overflow-y-auto border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead className="text-right">Price (KES)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {extracted.map((p, i) => (
                            <TableRow key={i}>
                                <TableCell>{p.name}</TableCell>
                                <TableCell className="text-right">{(p.price / 100).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Button onClick={handleEnrich} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                Enrich with AI
            </Button>
        </div>
    )
}

function Step3Import({ enriched, onUpdate }: { enriched: EnrichedProductData[], onUpdate: (products: EnrichedProductData[]) => void }) {
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
    const [extractedProducts, setExtractedProducts] = useState<ExtractedProduct[]>([]);
    const [enrichedProducts, setEnrichedProducts] = useState<EnrichedProductData[]>([]);

    const steps = [
        { label: 'Upload & Extract', icon: UploadCloud, component: <Step1Upload onExtracted={setExtractedProducts} /> },
        { label: 'AI Data Enrichment', icon: Sparkles, component: <Step2ReviewAndEnrich extracted={extractedProducts} onEnriched={setEnrichedProducts} /> },
        { label: 'Review & Import', icon: CheckCircle, component: <Step3Import enriched={enrichedProducts} onUpdate={setEnrichedProducts} /> },
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

    