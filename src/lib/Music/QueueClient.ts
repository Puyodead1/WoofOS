import { Node, NodeOptions, NodeSend } from '@skyra/audio';
import { QueueStore } from './QueueStore';

export class QueueClient extends Node {
	public readonly queues: QueueStore;

	public constructor(options: NodeOptions, send: NodeSend) {
		super(options, send);
		this.queues = new QueueStore(this);
	}
}
