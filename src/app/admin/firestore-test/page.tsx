
'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, DocumentData } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Edit, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function FirestoreTestPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [readData, setReadData] = useState<DocumentData[]>([]);
    const [isReading, setIsReading] = useState(false);
    const { toast } = useToast();
    const testCollectionName = "test-collection";

    const handleWrite = async () => {
        setIsLoading(true);
        try {
            const docRef = await addDoc(collection(db, testCollectionName), {
                name: "name",
                email: "email@email.com",
                timestamp: new Date()
            });
            toast({
                title: "Write Successful",
                description: `Document written with ID: ${docRef.id}`,
            });
        } catch (e) {
            console.error("Error adding document: ", e);
            toast({
                variant: "destructive",
                title: "Write Failed",
                description: "Could not write document to Firestore. Check console for errors.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRead = async () => {
        setIsReading(true);
        setReadData([]);
        try {
            const querySnapshot = await getDocs(collection(db, testCollectionName));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReadData(data);
            if (data.length === 0) {
                 toast({
                    title: "Read Complete",
                    description: "The collection is empty or does not exist.",
                });
            } else {
                toast({
                    title: "Read Successful",
                    description: `Successfully fetched ${data.length} documents.`,
                });
            }
        } catch (e) {
             console.error("Error reading documents: ", e);
             toast({
                variant: "destructive",
                title: "Read Failed",
                description: "Could not read documents from Firestore. Check console for errors.",
            });
        } finally {
            setIsReading(false);
        }
    };

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Database className="w-8 h-8" />
                    Firestore Connection Test
                </h1>
            </header>
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Edit className="w-5 h-5"/> Write Operation</CardTitle>
                        <CardDescription>Click the button to write a sample document to the '{testCollectionName}' collection in Firestore.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleWrite} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Write Test Data
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><List className="w-5 h-5"/> Read Operation</CardTitle>
                        <CardDescription>Click to fetch all documents from the '{testCollectionName}' collection and display them below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button onClick={handleRead} disabled={isReading}>
                             {isReading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Read Test Data
                         </Button>
                    </CardContent>
                </Card>
                 <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Results</CardTitle>
                            <CardDescription>Data read from Firestore will be displayed here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isReading ? (
                                <p>Reading data...</p>
                            ) : readData.length > 0 ? (
                                <pre className="p-4 bg-muted rounded-md text-sm overflow-auto">
                                    {JSON.stringify(readData, null, 2)}
                                </pre>
                            ) : (
                                <p className="text-muted-foreground">No data to display. Click "Read Test Data" to fetch.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
