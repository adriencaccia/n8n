import glob from 'fast-glob';
import Bench from 'tinybench';
import { withCodSpeed } from '@codspeed/tinybench-plugin';
import { setup, workflowToTests as toTests } from './nodes/Helpers';
import { performExecution, setupExecution } from './nodes/ExecuteWorkflow';

const testIndex = parseInt(process.argv[2]);

async function main() {
	const filePaths = await glob('nodes/**/*.workflow.json');
	const test = toTests(filePaths)[testIndex];
	const nodeTypes = setup([test]);

	const { waitPromise, additionalData, executionMode, workflowInstance, nodeExecutionOrder } =
		await setupExecution(test, nodeTypes);

	console.log(`Benchmarking: ${test.description} with pid: ${process.pid}`);

	const bench = withCodSpeed(new Bench({ time: 0, iterations: 1 })); // @TODO temp config
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
