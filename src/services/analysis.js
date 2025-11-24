// Code Analysis Engine - Pattern-based detection
// Reused from previous version with enhancements

export const analysisPatterns = {
    javascript: [
        {
            type: 'security',
            severity: 'critical',
            pattern: /eval\s*\(/gi,
            title: 'Dangerous eval() usage',
            description: 'Using eval() can lead to code injection vulnerabilities.',
            suggestion: 'Replace eval() with safer alternatives like JSON.parse().',
        },
        {
            type: 'security',
            severity: 'critical',
            pattern: /(SELECT|INSERT|UPDATE|DELETE).*\+/gi,
            title: 'SQL Injection vulnerability',
            description: 'String concatenation in SQL queries can lead to SQL injection.',
            suggestion: 'Use parameterized queries or prepared statements.',
        },
        {
            type: 'security',
            severity: 'critical',
            pattern: /(password|secret|api[_-]?key|token)\s*[:=]\s*['"][^'"]+['"]/gi,
            title: 'Hardcoded credentials detected',
            description: 'Hardcoded secrets pose a serious security risk.',
            suggestion: 'Use environment variables or secure credential management.',
        },
        {
            type: 'security',
            severity: 'high',
            pattern: /\.innerHTML\s*=/gi,
            title: 'XSS vulnerability with innerHTML',
            description: 'Setting innerHTML with user input can lead to XSS attacks.',
            suggestion: 'Use textContent or sanitize input before setting innerHTML.',
        },
        {
            type: 'bug',
            severity: 'high',
            pattern: /var\s+\w+/g,
            title: 'Use of var instead of let/const',
            description: 'Using var can lead to unexpected behavior due to hoisting.',
            suggestion: 'Replace var with let or const.',
        },
        {
            type: 'bug',
            severity: 'medium',
            pattern: /console\.(log|warn|error)/gi,
            title: 'Console statement in code',
            description: 'Console statements should be removed before production.',
            suggestion: 'Remove console statements or use a proper logging library.',
        },
        {
            type: 'performance',
            severity: 'medium',
            pattern: /for\s*\([^)]*\)[\s\S]{0,100}document\.querySelector/gi,
            title: 'DOM query inside loop',
            description: 'Querying DOM inside loop impacts performance.',
            suggestion: 'Cache the DOM query result outside the loop.',
        },
    ],
    python: [
        {
            type: 'security',
            severity: 'critical',
            pattern: /eval\s*\(/gi,
            title: 'Dangerous eval() usage',
            description: 'eval() can execute arbitrary code.',
            suggestion: 'Use ast.literal_eval() for safe evaluation.',
        },
        {
            type: 'bug',
            severity: 'medium',
            pattern: /except\s*:/g,
            title: 'Bare except clause',
            description: 'Catching all exceptions can hide bugs.',
            suggestion: 'Catch specific exceptions.',
        },
    ],
    generic: [
        {
            type: 'security',
            severity: 'high',
            pattern: /TODO.*security/gi,
            title: 'Security-related TODO found',
            description: 'Security TODOs should be addressed before production.',
            suggestion: 'Complete the security task or create a ticket.',
        },
    ],
};

export const analyzeCode = (code, language = 'javascript', options = {}) => {
    const issues = [];
    const lines = code.split('\n');

    // Default to all enabled if no options provided
    const enabledTypes = options.enabledTypes || ['security', 'bug', 'performance'];

    const patterns = [
        ...(analysisPatterns[language] || []),
        ...analysisPatterns.generic,
    ].filter(p => enabledTypes.includes(p.type));

    lines.forEach((line, index) => {
        patterns.forEach(pattern => {
            if (pattern.pattern.test(line)) {
                issues.push({
                    ...pattern,
                    line: index + 1,
                    code: line.trim(),
                    id: `issue-${issues.length}`,
                });
            }
        });
    });

    return issues;
};

export const analyzePatch = (patch, language = 'javascript', options = {}) => {
    // Analyze git diff patch
    const lines = patch.split('\n');
    const issues = [];
    let currentLine = 0;

    // Default to all enabled if no options provided
    const enabledTypes = options.enabledTypes || ['security', 'bug', 'performance'];

    const patterns = [
        ...(analysisPatterns[language] || []),
        ...analysisPatterns.generic,
    ].filter(p => enabledTypes.includes(p.type));

    lines.forEach((line) => {
        // Parse line number from diff
        if (line.startsWith('@@')) {
            const match = line.match(/@@ -\d+,?\d* \+(\d+)/);
            if (match) {
                currentLine = parseInt(match[1]);
            }
        } else if (line.startsWith('+') && !line.startsWith('+++')) {
            // This is an added line
            const code = line.substring(1);
            patterns.forEach(pattern => {
                if (pattern.pattern.test(code)) {
                    issues.push({
                        ...pattern,
                        line: currentLine,
                        code: code.trim(),
                        id: `issue-${issues.length}`,
                    });
                }
            });
            currentLine++;
        } else if (!line.startsWith('-')) {
            currentLine++;
        }
    });

    return issues;
};
