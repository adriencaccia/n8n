import execa from 'execa';
import glob from 'fast-glob';
import { workflowToTests as toTests } from './nodes/Helpers';

async function main() {
	const filePaths = await glob('nodes/**/*.workflow.json');

	console.log(`Found ${filePaths.length} workflows to benchmark`);

	const tests = toTests(filePaths);
	console.log(`Running ${tests.length} tests`);

	const promises: Array<Promise<void>> = [];

	for (const [testIndex, _test] of tests.entries()) {
		// only benchmark every 10th test
		if (testIndex % 10 !== 0) {
			continue;
		}
		promises.push(
			(async () => {
				const bench = await execa.node('dist/test/benchTest.js', [testIndex.toString()]);
				console.log(bench.stdout);
			})(),
		);
	}
}

void main();
