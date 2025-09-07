
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

type ExtractedProduct = {
    name: string;
    price: number;
};

// PDF parsing function (will require a library like pdf-lib or pdf.js)
// For now, we will simulate it with a text area for pasting content.

function Step1Upload({ onExtracted }: { onExtracted: (products: ExtractedProduct[]) => void }) {
    const [text, setText] = useState('');
    const { nextStep } = useStepper();

    const handleExtract = () => {
        const lines = text.trim().split('\n');
        const products: ExtractedProduct[] = [];
        lines.forEach(line => {
            // Attempt to split by a common delimiter like tab, multiple spaces, or a specific character
            const parts = line.split(/\s{2,}|[\t,;]+/);
            if (parts.length >= 2) {
                const name = parts[0].trim();
                const priceMatch = parts.slice(1).join(' ').match(/(\d[\d,.]*)/);
                if (name && priceMatch) {
                    const price = parseFloat(priceMatch[1].replace(/,/g, ''));
                    if (!isNaN(price)) {
                        products.push({ name, price: Math.round(price * 100) }); // Convert to cents
                    }
                }
            }
        });
        onExtracted(products);
        nextStep();
    };

    return (
        <div className="space-y-4">
            <p className="text-muted-foreground">
                Since we can't directly read a PDF, please copy the content from your PDF and paste it into the text area below. Ensure each product name and price is on its own line.
            </p>
            <Textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your product list here. e.g.&#10;Paracetamol 500mg      550.00&#10;Aspirin 75mg           300.50"
                className="h-48 font-mono"
            />
            <Button onClick={handleExtract} disabled={!text.trim()}>
                <Sparkles className="mr-2 h-4 w-4" /> Extract Products
            </Button>
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
            const rawData = extracted.map(p => `${p.name} - ${p.price / 100}`).join('\n');
            const result = await enrichProductData({ rawProductData: rawData });
            onEnriched(result.products);
            toast({ title: "Enrichment Complete", description: "Product data has been enhanced by AI." });
            nextStep();
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Enrichment Failed", description: "The AI could not process the product data." });
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
                            <TableHead>Price (KES)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {extracted.map((p, i) => (
                            <TableRow key={i}>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>Ksh {(p.price / 100).toFixed(2)}</TableCell>
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
            for (const product of enriched) {
                // @ts-ignore
                await addProduct(product);
            }
             addLog('INFO', `${enriched.length} products were imported via the AI Product Importer.`);
            addNotification({ recipientId: 'admin_role', type: 'product_update', title: 'Bulk Import Successful', description: `${enriched.length} new products have been added to the inventory.` });
            toast({ title: "Import Successful", description: `${enriched.length} products have been added to your inventory.` });
            goToStep(0); // Reset after successful import
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
                The AI has enriched your product data. Review, edit if needed, and then import to your Firestore database.
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
                    Bulk-import products from a PDF file using AI to enrich the data.
                </p>
            </header>

            <Card>
                <CardContent className="p-6">
                    <Stepper initialStep={0} steps={steps} className="mb-8">
                        {steps.map((stepProps, index) => (
                            <Step key={stepProps.label} {...stepProps}>
                                <div className="p-4 mt-4 border bg-muted/50 rounded-lg">
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

// Minimalistic Textarea for the product import page
function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    );
}
