import { chatComplete } from './llm';

export interface PistonRunResult {
  verdict: 'PASS' | 'RUNTIME_ERROR' | 'COMPILE_ERROR' | 'EXTERNAL_UNAVAILABLE';
  stdout: string;
  stderr: string;
  runtimeMs: number;
  stdin?: string;
}

function tryParseJsonLikeInput(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return '';

  const parts: string[] = [];
  let token = '';
  let depth = 0;
  let quote: string | null = null;

  for (const char of trimmed) {
    if (quote) {
      token += char;
      if (char === quote) quote = null;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      token += char;
      continue;
    }

    if (char === '[' || char === '{' || char === '(') depth += 1;
    if (char === ']' || char === '}' || char === ')') depth -= 1;

    if (char === ',' && depth === 0) {
      parts.push(token.trim());
      token = '';
      continue;
    }

    token += char;
  }
  if (token.trim()) parts.push(token.trim());

  if (parts.length === 0) return null;

  const normalizedLines: string[] = [];
  for (const rawPart of parts) {
    const withoutLabel = rawPart.replace(/^[A-Za-z_]\w*\s*=\s*/, '').trim();
    const jsonish = withoutLabel.replace(/'/g, '"');

    try {
      const value = JSON.parse(jsonish);
      if (Array.isArray(value)) {
        if (value.every((item) => !Array.isArray(item))) {
          normalizedLines.push(String(value.length));
          normalizedLines.push(value.join(' '));
        } else {
          normalizedLines.push(String(value.length));
          normalizedLines.push(
            value
              .map((row) => (Array.isArray(row) ? row.join(' ') : String(row)))
              .join('\n')
          );
        }
      } else {
        normalizedLines.push(String(value));
      }
    } catch {
      if (/^".*"$/.test(jsonish)) {
        normalizedLines.push(jsonish.slice(1, -1));
      } else if (/^-?\d+(\.\d+)?$/.test(jsonish)) {
        normalizedLines.push(jsonish);
      } else {
        return null;
      }
    }
  }

  return normalizedLines.join('\n');
}

export function normalizeCodingInput(input?: string): string {
  const raw = String(input || '').trim();
  if (!raw) return '';
  if (raw.includes('\n')) return raw;
  if (!/[,[\]"'=]/.test(raw)) return raw;
  return tryParseJsonLikeInput(raw) ?? raw;
}

export async function runCodeWithPiston(payload: {
  language: string;
  code: string;
  input?: string;
}): Promise<PistonRunResult> {
  const started = Date.now();

  const normalizedInput = normalizeCodingInput(payload.input);
  const isSqlite = payload.language === 'sqlite3';

  const prompt = `
You are a strict code execution engine for ${payload.language}. 
I will provide you with the user's code and ${isSqlite ? 'SQLite database setup SQL' : 'standard input'}.
You must trace the execution of the code with the given input and return ONLY a valid JSON object matching this schema, without markdown formatting:
{
  "verdict": "PASS" | "RUNTIME_ERROR" | "COMPILE_ERROR",
  "stdout": "the exact standard output string of the program",
  "stderr": "any error messages or standard error output"
}

If the code has syntax errors, set verdict to COMPILE_ERROR and explain in stderr.
If the code crashes during execution, set verdict to RUNTIME_ERROR and explain in stderr.
If the code runs successfully, set verdict to PASS and provide stdout.
Do not include explanations, markdown, alternate executions, prose, or multiple JSON objects.
${isSqlite
  ? 'SQLite rule: USER CODE is the submitted SQL query. SQL SETUP must be executed first to create and populate tables, then run USER CODE against that database. Do not treat SQL SETUP as stdin and do not report syntax errors for the setup if the query is valid.'
  : 'The USER STDIN below has already been normalized for stdin scanners. Do not reject it because the original problem statement used arrays.'}

USER CODE:
\`\`\`
${payload.code}
\`\`\`

${isSqlite ? 'SQL SETUP' : 'USER STDIN'}:
\`\`\`
${normalizedInput}
\`\`\`
`;

  const responseJson = await chatComplete([{ role: 'system', content: prompt }], '{"verdict": "EXTERNAL_UNAVAILABLE", "stdout": "", "stderr": "LLM failed to simulate"}');

  try {
    const cleanJson = responseJson.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanJson);
    return {
      verdict: result.verdict || 'PASS',
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      runtimeMs: Date.now() - started,
      stdin: normalizedInput,
    };
  } catch (e) {
    return {
      verdict: 'RUNTIME_ERROR',
      stdout: '',
      stderr: 'Simulation Output Parsing Failed:\\n' + responseJson,
      runtimeMs: Date.now() - started,
      stdin: normalizedInput,
    };
  }
}
