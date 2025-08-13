
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRoadmapTasks, updateTaskStatus, addTask, deleteTask } from "@/lib/roadmap";
import { type RoadmapTask, RoadmapTaskStatus, RoadmapTaskCategory } from "@/lib/types";
import { ListChecks, PlusCircle, Trash2, Loader2, Bot, Palette, Shield, Files } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { addLog } from '@/lib/logs';

// Manually map icons as they are components, not strings
const categoryIcons: Record<RoadmapTaskCategory, React.ElementType> = {
    'Core Feature': Files,
    'AI & Automation': Bot,
    'UI/UX': Palette,
    'Security': Shield,
    'Other': ListChecks,
};

const categoryColors: Record<RoadmapTaskCategory, string> = {
    'Core Feature': 'text-blue-500',
    'AI & Automation': 'text-purple-500',
    'UI/UX': 'text-green-500',
    'Security': 'text-red-500',
    'Other': 'text-gray-500',
};


const taskSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description is required'),
  category: z.enum(['Core Feature', 'AI & Automation', 'UI/UX', 'Security', 'Other']),
});


function AddTaskForm({ onSave, onOpenChange }: { onSave: (data: z.infer<typeof taskSchema>) => void, onOpenChange: (open: boolean) => void }) {
    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: { title: '', description: '', category: 'Other' },
    });

    const handleSubmit = (values: z.infer<typeof taskSchema>) => {
        onSave(values);
        onOpenChange(false);
        form.reset();
    };
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Task Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                {Object.keys(categoryIcons).map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <DialogFooter>
                    <Button type="submit">Add Task</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

function TaskCard({ task, onStatusChange, onDelete }: { task: RoadmapTask, onStatusChange: (id: string, status: RoadmapTaskStatus) => void, onDelete: (id: string) => void }) {
    const CategoryIcon = categoryIcons[task.category] || categoryIcons['Other'];
    const categoryColor = categoryColors[task.category] || categoryColors['Other'];

    return (
        <Card className="mb-4 bg-background/80 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-xs font-semibold mb-2">
                        <CategoryIcon className={cn("h-4 w-4", categoryColor)} />
                        <span className={categoryColor}>{task.category}</span>
                    </div>
                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(task.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive"/>
                    </Button>
                </div>
                <h4 className="font-semibold mb-2">{task.title}</h4>
                <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">{task.description}</p>
                <Select value={task.status} onValueChange={(value) => onStatusChange(task.id, value as RoadmapTaskStatus)}>
                    <SelectTrigger className="text-xs h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Todo">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>
    )
}

const columns: RoadmapTaskStatus[] = ['Todo', 'In Progress', 'Done'];

export default function RoadmapPage() {
    const { tasks, isLoading } = useRoadmapTasks();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { toast } = useToast();

    const progress = useMemo(() => {
        if (tasks.length === 0) return 0;
        const doneTasks = tasks.filter(t => t.status === 'Done').length;
        return Math.round((doneTasks / tasks.length) * 100);
    }, [tasks]);

    const handleUpdateStatus = async (taskId: string, status: RoadmapTaskStatus) => {
        const originalTask = tasks.find(t => t.id === taskId);
        if (originalTask && originalTask.status !== status) {
            await updateTaskStatus(taskId, status);
            addLog('INFO', `Roadmap task "${originalTask.title}" status changed to ${status}.`);
            toast({ title: 'Task Updated', description: `Status changed to ${status}.` });
        }
    }
    
    const handleAddTask = async (data: z.infer<typeof taskSchema>) => {
        try {
            await addTask({ ...data, status: 'Todo' });
            addLog('INFO', `New roadmap task added: "${data.title}".`);
            toast({ title: 'Task Added', description: `"${data.title}" has been added to the roadmap.` });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to add task.' });
        }
    }

     const handleDeleteTask = async (taskId: string) => {
        const taskToDelete = tasks.find(t => t.id === taskId);
        if (!taskToDelete) return;

        try {
            await deleteTask(taskId);
            addLog('WARN', `Roadmap task deleted: "${taskToDelete.title}".`);
            toast({ variant: 'destructive', title: 'Task Deleted', description: `"${taskToDelete.title}" has been removed.` });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete task.' });
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <ListChecks className="w-8 h-8" />
                    Project Roadmap
                </h1>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                         <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Task</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Create New Task</DialogTitle></DialogHeader>
                        <AddTaskForm onSave={handleAddTask} onOpenChange={setIsFormOpen} />
                    </DialogContent>
                </Dialog>
            </div>
            
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Project Completion Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Progress value={progress} className="w-full" />
                        <span className="font-bold text-lg">{progress}%</span>
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map(status => (
                        <div key={status} className="bg-muted/50 rounded-lg p-4">
                            <h3 className="font-bold text-lg mb-4">{status}</h3>
                            <div className="space-y-4 min-h-[100px]">
                                {tasks.filter(t => t.status === status).map(task => (
                                    <TaskCard key={task.id} task={task} onStatusChange={handleUpdateStatus} onDelete={handleDeleteTask} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
