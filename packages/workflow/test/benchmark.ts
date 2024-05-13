import execa from 'execa';
import { baseFixtures } from './ExpressionFixtures/base';

async function main() {
	for (const [fixtureIndex, fixture] of baseFixtures.entries()) {
		for (const [testIndex, _] of fixture.tests.entries()) {
			const bench = await execa.node('dist/test/benchTest.js', [
				fixtureIndex.toString(),
				testIndex.toString(),
			]);
			console.log(bench.stdout);
		}
	}
}

void main();
