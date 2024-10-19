import { useState, useEffect } from 'react';
import { Plus, Combine, Play } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import CreateRuleModal from './CreateRuleModal';
import CombineRulesModal from './CombineRulesModal';
import EvaluateRuleModal from './EvaluateRuleModal';
import RulesList from './RulesList';

const RuleEngine = () => {
    const [rules, setRules] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCombineModalOpen, setIsCombineModalOpen] = useState(false);
    const [isEvaluateModalOpen, setIsEvaluateModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRule, setSelectedRule] = useState(null);

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/rules/rules');
            const data = await response.json();
            setRules(data);
        } catch (err) {
            setError('Failed to fetch rules');
        }
    };

    const handleCreateRule = async (ruleData) => {
        try {
            const response = await fetch('http://localhost:3000/api/rules/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ruleData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            fetchRules();
            setIsCreateModalOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Rule Engine</h1>
                <div className="space-x-4">
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Rule
                    </Button>
                    <Button onClick={() => setIsCombineModalOpen(true)} variant="outline">
                        <Combine className="w-4 h-4 mr-2" />
                        Combine Rules
                    </Button>
                    <Button onClick={() => setIsEvaluateModalOpen(true)} variant="secondary">
                        <Play className="w-4 h-4 mr-2" />
                        Evaluate Rule
                    </Button>
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <RulesList
                rules={rules}
                onRuleSelect={setSelectedRule}
                onRulesChange={fetchRules}
            />

            <CreateRuleModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateRule}
            />

            <CombineRulesModal
                isOpen={isCombineModalOpen}
                onClose={() => setIsCombineModalOpen(false)}
                rules={rules}
                onCombine={fetchRules}
            />

            <EvaluateRuleModal
                isOpen={isEvaluateModalOpen}
                onClose={() => setIsEvaluateModalOpen(false)}
                rules={rules}
            />
        </div>
    );
};

export default RuleEngine;