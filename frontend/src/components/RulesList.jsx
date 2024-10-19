import { useState } from 'react';
import { Trash2, Edit, Eye } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ViewRuleModal from './ViewRuleModal';

const RulesList = ({ rules, onRuleSelect, onRulesChange }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [ruleToDelete, setRuleToDelete] = useState(null);
    const [viewRuleData, setViewRuleData] = useState(null);

    const handleDelete = async (ruleId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/rules/rule/${ruleId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            onRulesChange();
        } catch (error) {
            console.error('Failed to delete rule:', error);
        }
        setDeleteDialogOpen(false);
        setRuleToDelete(null);
    };

    const confirmDelete = (rule) => {
        setRuleToDelete(rule);
        setDeleteDialogOpen(true);
    };

    const viewRule = async (ruleId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/rules/rule/${ruleId}`);
            const data = await response.json();
            setViewRuleData(data);
        } catch (error) {
            console.error('Failed to fetch rule details:', error);
        }
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rules.map((rule) => (
                        <TableRow key={rule._id}>
                            <TableCell className="font-medium">{rule.name}</TableCell>
                            <TableCell>{new Date(rule.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(rule.updatedAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => viewRule(rule._id)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRuleSelect(rule)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => confirmDelete(rule)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Rule</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{ruleToDelete?.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDelete(ruleToDelete?._id)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ViewRuleModal
                isOpen={!!viewRuleData}
                onClose={() => setViewRuleData(null)}
                rule={viewRuleData}
            />
        </>
    );
};

export default RulesList;