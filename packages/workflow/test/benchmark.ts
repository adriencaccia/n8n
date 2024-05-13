import execa from 'execa';
import { baseFixtures } from './ExpressionFixtures/base';

async function main() {
	for (const [fixtureIndex, fixture] of baseFixtures.entries()) {
		for (const [testIndex, test] of fixture.tests.entries()) {
			if ('error' in test || test.type === 'transform') continue;

			const bench = await execa.node('dist/test/benchTest.js', [
				fixtureIndex.toString(),
				testIndex.toString(),
			]);
			console.log(bench.stdout);
		}
	}
}

void main();
