import execa from 'execa';
// import glob from 'fast-glob';
import { workflowToTests as toTests } from './nodes/Helpers';

const filePaths = [
	'nodes/Code/test/Code.workflow.json',
	'nodes/Switch/V1/test/switch.expression.workflow.json',
	'nodes/Microsoft/Excel/test/v2/node/table/append.workflow.json',
	'nodes/Microsoft/Teams/test/v2/node/channel/get.workflow.json',
	'nodes/Microsoft/Excel/test/v2/node/worksheet/readRows.workflow.json',
	'nodes/ReadPdf/test/ReadPDF.workflow.json',
	'nodes/Microsoft/Teams/test/v2/node/task/get.workflow.json',
	'nodes/Discord/test/v2/node/member/roleAdd.workflow.json',
	'nodes/Discord/test/v2/node/member/getAll.workflow.json',
	'nodes/Microsoft/Outlook/test/v2/node/folderMessage/getAll.workflow.json',
];
console.log(`Found ${filePaths.length} workflows to benchmark`);
const tests = toTests(filePaths);
console.log(`Running ${tests.length} tests`);

async function main() {
	// const filePaths = await glob('nodes/**/*.workflow.json');

	const promises: Array<Promise<void>> = [];

	for (const [testIndex, _test] of tests.entries()) {
		promises.push(
			(async () => {
				const bench = await execa.node('dist/test/benchTest.js', [testIndex.toString()]);
				console.log(bench.stdout);
			})(),
		);
	}

	await Promise.all(promises);
}

void main();
