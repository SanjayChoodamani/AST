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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const EvaluateRuleModal = ({ isOpen, onClose, rules }) => {
    const [selectedRule, setSelectedRule] = useState('');
    const [testData, setTestData] = useState({
        age: '',
        department: '',
        salary: '',
        experience: ''
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleEvaluate = async () => {
        if (!selectedRule) {
            setError('Please select a rule to evaluate');
            return;
        }

        // Validate and clean test data
        const cleanData = {};
        Object.entries(testData).forEach(([key, value]) => {
            if (value.trim()) {
                cleanData[key] = isNaN(value) ? value : Number(value);
            }
        });

        try {
            const response = await fetch('http://localhost:3000/api/rules/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ruleId: selectedRule,
                    data: cleanData
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setResult(data);
            setError('');
        } catch (err) {
            setError(err.message);
            setResult(null);
        }
    };

    const handleClose = () => {
        setSelectedRule('');
        setTestData({
            age: '',
            department: '',
            salary: '',
            experience: ''
        });
        setResult(null);
        setError('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Evaluate Rule</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select Rule</Label>
                        <Select value={selectedRule} onValueChange={setSelectedRule}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a rule to evaluate" />
                            </SelectTrigger>
                            <SelectContent>
                                {rules.map(rule => (
                                    <SelectItem key={rule._id} value={rule._id}>
                                        {rule.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <Label>Test Data</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Age</Label>
                                <Input
                                    type="number"
                                    value={testData.age}
                                    onChange={(e) => setTestData(prev => ({
                                        ...prev,
                                        age: e.target.value
                                    }))}
                                    placeholder="Enter age"
                                />
                            </div>
                            <div>
                                <Label>Department</Label>
                                <Input
                                    value={testData.department}
                                    onChange={(e) => setTestData(prev => ({
                                        ...prev,
                                        department: e.target.value
                                    }))}
                                    placeholder="Enter department"
                                />
                            </div>
                            <div>
                                <Label>Salary</Label>
                                <Input
                                    type="number"
                                    value={testData.salary}
                                    onChange={(e) => setTestData(prev => ({
                                        ...prev,
                                        salary: e.target.value
                                    }))}
                                    placeholder="Enter salary"
                                />
                            </div>
                            <div>
                                <Label>Experience</Label>
                                <Input
                                    type="number"
                                    value={testData.experience}
                                    onChange={(e) => setTestData(prev => ({
                                        ...prev,
                                        experience: e.target.value
                                    }))}
                                    placeholder="Years of experience"
                                />
                            </div>
                        </div>
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {result && (
                        <Alert variant={result.result ? "success" : "info"}>
                            <AlertTitle>Evaluation Result</AlertTitle>
                            <AlertDescription>
                                <div className="mt-2 space-y-2">
                                    <p>Rule: {rules.find(r => r._id === selectedRule)?.name}</p>
                                    <p>Result: {result.result ? "Matches" : "Does Not Match"}</p>
                                    <details className="mt-2">
                                        <summary className="cursor-pointer">View Details</summary>
                                        <pre className="mt-2 p-2 bg-gray-100 rounded text-sm">
                                            {JSON.stringify(result.evaluation, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Close
                        </Button>
                        <Button onClick={handleEvaluate}>Evaluate</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EvaluateRuleModal;