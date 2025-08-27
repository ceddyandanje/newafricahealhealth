
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Truck, PlusCircle, Edit, Trash2, Loader2, Plane, HeartPulse, Bike } from "lucide-react";
import { type EmergencyUnit } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useFleet, addUnit, updateUnit, deleteUnit } from "@/lib/fleet";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import UnitForm from '@/components/emergency/unit-form';
import { useToast } from '@/hooks/use-toast';
import { addLog } from '@/lib/logs';

const statusVariant = {
    'Available': 'default',
    'En Route': 'secondary',
    'At Scene': 'destructive',
    'Transporting': 'outline',
    'At Hospital': 'outline',
    'Unavailable': 'secondary',
} as const;

const typeIcon = {
    'Ground': Truck,
    'Air': Plane,
    'Motorbike Medic': Bike,
    'Other': HeartPulse
}

export default function FleetManagementPage() {
    const { user } = useAuth();
    const { units, isLoading } = useFleet(user?.id);
    const { toast } = useToast();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<EmergencyUnit | undefined>(undefined);
    const [deletingUnit, setDeletingUnit] = useState<EmergencyUnit | undefined>(undefined);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const handleSave = async (unitData: Omit<EmergencyUnit, 'id' | 'providerId' | 'createdAt' | 'updatedAt'>) => {
        if (!user) return;
        
        try {
            if (editingUnit) {
                await updateUnit(user.id, editingUnit.id, unitData);
                toast({ title: "Unit Updated", description: `Details for ${unitData.licensePlate} have been saved.` });
                addLog("INFO", `Emergency unit ${unitData.licensePlate} updated by ${user.name}.`);
            } else {
                await addUnit(user.id, unitData);
                toast({ title: "Unit Added", description: `${unitData.licensePlate} has been added to your fleet.` });
                addLog("INFO", `New emergency unit ${unitData.licensePlate} added by ${user.name}.`);
            }
            setIsFormOpen(false);
            setEditingUnit(undefined);
        } catch (error) {
            console.error("Failed to save unit:", error);
            toast({ variant: 'destructive', title: "Save Failed", description: "Could not save unit details."});
        }
    };
    
    const handleDelete = async (unit: EmergencyUnit) => {
        if (!user) return;
        try {
            await deleteUnit(user.id, unit.id);
            toast({ variant: 'destructive', title: "Unit Removed", description: `${unit.licensePlate} has been removed from your fleet.`});
            addLog("WARN", `Emergency unit ${unit.licensePlate} removed by ${user.name}.`);
        } catch (error) {
            console.error("Failed to delete unit:", error);
            toast({ variant: 'destructive', title: "Delete Failed", description: "Could not remove the unit."});
        } finally {
            setDeletingUnit(undefined);
            setIsDeleteConfirmOpen(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Truck className="w-8 h-8" />
                    Fleet Management
                </h1>
                 <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                         <Button onClick={() => setEditingUnit(undefined)}><PlusCircle className="mr-2 h-4 w-4" /> Add Unit</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingUnit ? "Edit Unit" : "Add New Unit"}</DialogTitle>
                            <DialogDescription>
                                {editingUnit ? "Update the details for this emergency unit." : "Provide the details for a new unit in your fleet."}
                            </DialogDescription>
                        </DialogHeader>
                        <UnitForm unit={editingUnit} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Emergency Fleet</CardTitle>
                    <CardDescription>Manage all your available emergency response units.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-48">
                           <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Unit / License Plate</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Life Support</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {units.map((unit) => {
                                    const Icon = typeIcon[unit.type];
                                    return (
                                        <TableRow key={unit.id}>
                                            <TableCell className="font-semibold">{unit.licensePlate}</TableCell>
                                            <TableCell><div className="flex items-center gap-2"><Icon className="h-5 w-5"/> {unit.type}</div></TableCell>
                                            <TableCell><Badge variant={statusVariant[unit.status]}>{unit.status}</Badge></TableCell>
                                            <TableCell>{unit.hasLifeSupport ? "Yes" : "No"}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => { setEditingUnit(unit); setIsFormOpen(true); }}><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingUnit(unit); setIsDeleteConfirmOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    )}
                </CardContent>
            </Card>

            {deletingUnit && (
                 <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently remove the unit with license plate "{deletingUnit.licensePlate}".
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDelete(deletingUnit)}>Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
