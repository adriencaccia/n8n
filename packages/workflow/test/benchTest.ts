import type { INodeExecutionData } from '@/index';
import { withCodSpeed } from '@codspeed/tinybench-plugin';
import { Bench } from 'tinybench';
import { baseFixtures } from './ExpressionFixtures/base';
import { evaluate } from './evaluate';

async function benchTest() {
	const fixtureIndex = parseInt(process.argv[2]);
	const testIndex = parseInt(process.argv[3]);
	const fixture = baseFixtures[fixtureIndex];
	const test = fixture.tests[testIndex];

	if ('error' in test || test.type === 'transform') {
		throw new Error('Invalid test type');
	}

	console.log(`Benchmarking: ${fixture.expression} with pid: ${process.pid}`);

	const bench = withCodSpeed(new Bench());
	const input = test.input.map((d) => ({ json: d })) as INodeExecutionData[];
	bench.add(`fId:${fixtureIndex}-tId:${testIndex}:${fixture.expression}`, () =>
		evaluate(fixture.expression, input),
	);

	await bench.run();
	console.table(bench.table());
}

void benchTest();
