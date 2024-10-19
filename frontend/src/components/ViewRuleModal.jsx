import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ViewRuleModal = ({ isOpen, onClose, rule }) => {
    if (!rule) return null;

    const renderASTNode = (node, depth = 0) => {
        if (!node) return null;

        const indent = '  '.repeat(depth);

        if (node.type === 'operand') {
            return <div className="ml-4">{indent}{node.value}</div>;
        }

        return (
            <div className="ml-4">
                {indent}{node.value}
                {renderASTNode(node.left, depth + 1)}
                {renderASTNode(node.right, depth + 1)}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{rule.name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Rule Structure:</h3>
                        <div className="mt-2 p-4 bg-gray-50 rounded-md font-mono text-sm">
                            {renderASTNode(rule)}
                        </div>
                    </div>

                    <div className="text-sm text-gray-500">
                        <p>Created: {new Date(rule.createdAt).toLocaleString()}</p>
                        <p>Last Modified: {new Date(rule.updatedAt).toLocaleString()}</p>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewRuleModal;