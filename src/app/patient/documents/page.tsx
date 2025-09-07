
'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Filter, Search, FileUp, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useLabRequests } from '@/lib/lab';
import { useAuth } from '@/hooks/use-auth';

type Document = {
    id: string;
    name: string;
    date: string;
    type: 'Lab Result' | 'Prescription' | 'Clinical Note';
    url?: string;
};

const statusVariant = {
    New: 'default',
    Reviewed: 'secondary',
    Archived: 'outline',
} as const;

export default function PatientDocumentsPage() {
    const { user } = useAuth();
    // Fetch lab requests to simulate having documents
    const { requests: labRequests, isLoading } = useLabRequests();

    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        if (!user || !labRequests) return;
        
        // Filter for completed lab requests for the current user and map them to the document structure
        const userLabResults = labRequests
            .filter(req => req.patientId === user.id && req.status === 'Completed')
            .map(req => ({
                id: req.id,
                name: `${req.testName} Results`,
                date: req.completedAt ? new Date(req.completedAt).toLocaleDateString() : 'N/A',
                type: 'Lab Result' as const,
                url: req.resultUrl
            }));
        
        setDocuments(userLabResults);
    }, [user, labRequests]);


    return (
        <div className="p-6">
            <header className="py-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3"><FileText className="w-8 h-8"/> Documents</h1>
                    <p className="text-muted-foreground">Access your medical records and lab results.</p>
                </div>
                 <Button><FileUp className="mr-2 h-4 w-4"/> Upload Document</Button>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Your Medical Files</CardTitle>
                    <CardDescription>A secure repository of all your health-related documents.</CardDescription>
                     <div className="pt-4 flex justify-between items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Search documents..." className="pl-10 max-w-sm" />
                        </div>
                        <Button variant="outline"><Filter className="mr-2 h-4 w-4"/> Filter by Type</Button>
                    </div>
                </CardHeader>
                <CardContent>
                   {isLoading ? (
                     <div className="flex items-center justify-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     </div>
                   ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Document Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.length > 0 ? (
                                documents.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">{doc.name}</TableCell>
                                        <TableCell>{doc.date}</TableCell>
                                        <TableCell><Badge variant="secondary">{doc.type}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" disabled={!doc.url || doc.url === '#'}><Download className="mr-2 h-4 w-4"/> Download</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                             ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No documents found. Your completed lab results and other files will appear here.
                                    </TableCell>
                                </TableRow>
                             )}
                        </TableBody>
                    </Table>
                   )}
                </CardContent>
            </Card>
        </div>
    );
}
