import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const CreateRuleModal = ({ isOpen, onClose, onCreate }) => {
    const [ruleName, setRuleName] = useState('');
    const [ruleString, setRuleString] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!ruleName.trim() || !ruleString.trim()) {
            setError('Both rule name and rule string are required');
            return;
        }

        try {
            await onCreate({ ruleName, ruleString  });
            setRuleName('');
            setRuleString('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Rule</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ruleName">Rule Name</Label>
                        <Input
                            id="ruleName"
                            value={ruleName}
                            onChange={(e) => setRuleName(e.target.value)}
                            placeholder="Enter rule name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ruleString">Rule Definition</Label>
                        <Textarea
                            id="ruleString"
                            value={ruleString}
                            onChange={(e) => setRuleString(e.target.value)}
                            placeholder="Example: (age > 30 AND department = 'Sales') OR (salary > 50000)"
                            rows={4}
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Rule</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateRuleModal;