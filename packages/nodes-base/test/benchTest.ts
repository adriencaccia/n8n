import { withCodSpeed } from '@codspeed/tinybench-plugin';
import Bench from 'tinybench';
import { performExecution, setupExecution } from './nodes/ExecuteWorkflow';
import { setup, workflowToTests as toTests } from './nodes/Helpers';

const testIndex = parseInt(process.argv[2]);
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
const tests = toTests(filePaths);
const test = tests[testIndex];
const nodeTypes = setup([test]);

async function main() {
	const { waitPromise, additionalData, executionMode, workflowInstance, nodeExecutionOrder } =
		await setupExecution(test, nodeTypes);

	console.log(`Benchmarking: ${test.description} with pid: ${process.pid}`);

	const bench = withCodSpeed(new Bench());
	bench.add(test.description, async () => {
		await performExecution(
			waitPromise,
			additionalData,
			executionMode,
			test,
			workflowInstance,
			nodeExecutionOrder,
		);
	});

	await bench.run();
}

void main();
