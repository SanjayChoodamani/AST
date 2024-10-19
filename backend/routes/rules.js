import express from "express";
const router = express.Router();
import Node from '../models/ast.model.js';

// Utility function to create a new AST node and save it in MongoDB
const createNode = async (type, value = null, left = null, right = null) => {
    const node = new Node({ type, value, left, right });
    await node.save();
    return node;
};

// Enhanced condition parser to handle more complex conditions
const parseCondition = (condition) => {
    // Handle quoted strings and various operators
    const match = condition.match(/(\w+)\s*([><=!]+)\s*([\w']+)/);
    if (!match) throw new Error(`Invalid condition format: ${condition}`);
    
    const [_, field, operator, rawValue] = match;
    let value = rawValue.replace(/['"]/g, ''); // Remove quotes if present
    
    // Convert numeric values
    if (!isNaN(value)) {
        value = Number(value);
    }
    
    return { field, operator, value };
};

// Enhanced condition evaluator
const evalCondition = (condition, data) => {
    const { field, operator, value } = parseCondition(condition);
    const fieldValue = data[field];
    
    if (fieldValue === undefined) {
        throw new Error(`Field "${field}" not found in data`);
    }

    switch (operator) {
        case '>': return fieldValue > value;
        case '<': return fieldValue < value;
        case '>=': return fieldValue >= value;
        case '<=': return fieldValue <= value;
        case '==': 
        case '=': return fieldValue == value;
        case '!=': return fieldValue != value;
        default: throw new Error(`Unsupported operator: ${operator}`);
    }
};

// Improved rule parser with better error handling
const parseRuleString = async (ruleString) => {
    try {
        // Tokenize the rule string
        const tokens = ruleString.match(/("[^"]*")|('[^']*')|(\w+)|([><=!]+)|(\(|\))|(\bAND\b|\bOR\b)/g);
        if (!tokens) throw new Error("Invalid rule string format");

        const operatorPrecedence = { 'AND': 2, 'OR': 1 };
        const outputQueue = [];
        const operatorStack = [];

        const isOperator = (token) => token === 'AND' || token === 'OR';
        let expectOperand = true;

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (token === '(') {
                operatorStack.push(token);
                expectOperand = true;
            } else if (token === ')') {
                while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                if (!operatorStack.length) throw new Error("Mismatched parentheses");
                operatorStack.pop(); // Remove the '('
                expectOperand = false;
            } else if (isOperator(token)) {
                if (expectOperand) throw new Error("Unexpected operator");
                while (operatorStack.length && isOperator(operatorStack[operatorStack.length - 1]) &&
                    operatorPrecedence[operatorStack[operatorStack.length - 1]] >= operatorPrecedence[token]) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
                expectOperand = true;
            } else {
                // Build complete condition by combining tokens until we have a valid condition
                let condition = token;
                while (i + 1 < tokens.length && !isOperator(tokens[i + 1]) && tokens[i + 1] !== ')') {
                    condition += ' ' + tokens[++i];
                }
                try {
                    parseCondition(condition); // Validate condition format
                    outputQueue.push(condition);
                    expectOperand = false;
                } catch (error) {
                    throw new Error(`Invalid condition: ${condition}`);
                }
            }
        }

        if (expectOperand) throw new Error("Rule ends with operator");

        while (operatorStack.length) {
            const op = operatorStack.pop();
            if (op === '(') throw new Error("Mismatched parentheses");
            outputQueue.push(op);
        }

        // Build AST from postfix expression
        const astStack = [];
        for (const token of outputQueue) {
            if (isOperator(token)) {
                if (astStack.length < 2) throw new Error("Invalid rule structure");
                const right = astStack.pop();
                const left = astStack.pop();
                const node = await createNode('operator', token, left, right);
                astStack.push(node);
            } else {
                const node = await createNode('operand', token);
                astStack.push(node);
            }
        }

        if (astStack.length !== 1) throw new Error("Invalid rule structure");
        return astStack[0];
    } catch (error) {
        throw new Error(`Rule parsing error: ${error.message}`);
    }
};

// Enhanced rule evaluator with error handling
const evaluateRule = async (node, data) => {
    try {
        if (!node) throw new Error("Invalid rule node");

        if (node.type === 'operand') {
            return evalCondition(node.value, data);
        } else if (node.type === 'operator') {
            const leftResult = await evaluateRule(node.left, data);
            const rightResult = await evaluateRule(node.right, data);
            
            switch (node.value) {
                case 'AND': return leftResult && rightResult;
                case 'OR': return leftResult || rightResult;
                default: throw new Error(`Unknown operator: ${node.value}`);
            }
        }
        throw new Error(`Invalid node type: ${node.type}`);
    } catch (error) {
        throw new Error(`Rule evaluation error: ${error.message}`);
    }
};

// API Routes
router.post('/create', async (req, res) => {
    console.log(req.body);
    const {ruleName, ruleString } = req.body;
    
    if (!ruleString) {
        return res.status(400).json({ error: 'Rule string is required' });
    }

    try {
        const ast = await parseRuleString(ruleString);
        ast.name = ruleName || `Rule_${Date.now()}`;
        await ast.save();
        
        res.json({
            message: 'Rule created successfully',
            rule: {
                id: ast._id,
                name: ast.name,
                ast: ast
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/combine', async (req, res) => {
    const { ruleIds, combinationType = 'AND' } = req.body;
    
    if (!Array.isArray(ruleIds) || ruleIds.length < 2) {
        return res.status(400).json({ error: 'At least two rule IDs are required' });
    }

    try {
        const rules = await Node.find({ _id: { $in: ruleIds } });
        
        if (rules.length !== ruleIds.length) {
            throw new Error('One or more rules not found');
        }

        let combinedAST = rules[0];
        for (let i = 1; i < rules.length; i++) {
            combinedAST = await createNode('operator', combinationType, combinedAST, rules[i]);
        }

        combinedAST.name = `Combined_Rule_${Date.now()}`;
        await combinedAST.save();

        res.json({
            message: 'Rules combined successfully',
            rule: {
                id: combinedAST._id,
                name: combinedAST.name,
                ast: combinedAST
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/evaluate', async (req, res) => {
    const { ruleId, data } = req.body;
    
    if (!ruleId || !data) {
        return res.status(400).json({ error: 'Rule ID and data are required' });
    }

    try {
        const rule = await Node.findById(ruleId);
        if (!rule) {
            throw new Error('Rule not found');
        }

        const result = await evaluateRule(rule, data);
        res.json({
            result,
            evaluation: {
                ruleId: rule._id,
                ruleName: rule.name,
                data: data,
                matches: result
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Additional routes for rule management

router.get('/rules', async (req, res) => {
    try {
        const rules = await Node.find({ type: 'operator' }).select('_id name');
        res.json(rules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/rule/:id', async (req, res) => {
    try {
        const rule = await Node.findById(req.params.id);
        if (!rule) {
            return res.status(404).json({ error: 'Rule not found' });
        }
        res.json(rule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/rule/:id', async (req, res) => {
    try {
        const rule = await Node.findByIdAndDelete(req.params.id);
        if (!rule) {
            return res.status(404).json({ error: 'Rule not found' });
        }
        res.json({ message: 'Rule deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;