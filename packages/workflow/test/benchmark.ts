import { Bench } from 'tinybench';
import { withCodSpeed } from '@codspeed/tinybench-plugin';
import { baseFixtures } from './ExpressionFixtures/base';
import { evaluate } from './evaluate';
import type { INodeExecutionData } from '@/index';

function addExpressionEvaluationTasks(bench: Bench) {
	for (const [fixtureIndex, fixture] of baseFixtures.entries()) {
		for (const [testIndex, test] of fixture.tests.entries()) {
			if ('error' in test) continue;

			if (test.type === 'evaluation') {
				const input = test.input.map((d) => ({ json: d })) as INodeExecutionData[];
				bench.add(`fId:${fixtureIndex}-tId:${testIndex}:${fixture.expression}`, () =>
					evaluate(fixture.expression, input),
				);
			}
		}
	}
}

async function main() {
	const bench = withCodSpeed(new Bench());

	addExpressionEvaluationTasks(bench);

	await bench.warmup();
	await bench.run();

	console.table(bench.table());
}

void main();
