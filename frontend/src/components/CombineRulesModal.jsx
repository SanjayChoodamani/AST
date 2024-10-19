import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const CombineRulesModal = ({ isOpen, onClose, rules, onCombine }) => {
    const [selectedRules, setSelectedRules] = useState([]);
    const [combinationType, setCombinationType] = useState('AND');
    const [newRuleName, setNewRuleName] = useState('');
    const [error, setError] = useState('');

    const handleCombine = async () => {
        if (selectedRules.length < 2) {
            setError('Please select at least two rules to combine');
            return;
        }

        if (!newRuleName.trim()) {
            setError('Please provide a name for the combined rule');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/rules/combine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ruleIds: selectedRules,
                    combinationType,
                    ruleName: newRuleName
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            await onCombine();
            onClose();
            setSelectedRules([]);
            setNewRuleName('');
            setCombinationType('AND');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRuleToggle = (ruleId) => {
        setSelectedRules(prev =>
            prev.includes(ruleId)
                ? prev.filter(id => id !== ruleId)
                : [...prev, ruleId]
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Combine Rules</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Select Rules to Combine</Label>
                        <div className="mt-2 space-y-2">
                            {rules.map(rule => (
                                <div key={rule._id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={rule._id}
                                        checked={selectedRules.includes(rule._id)}
                                        onChange={() => handleRuleToggle(rule._id)}
                                        className="w-4 h-4"
                                    />
                                    <Label htmlFor={rule._id}>{rule.name}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Combination Type</Label>
                        <Select value={combinationType} onValueChange={setCombinationType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AND">AND</SelectItem>
                                <SelectItem value="OR">OR</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>New Rule Name</Label>
                        <Input
                            value={newRuleName}
                            onChange={(e) => setNewRuleName(e.target.value)}
                            placeholder="Enter name for combined rule"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleCombine}>Combine Rules</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CombineRulesModal;