/**
 * Concurrency-Controlled Submission Queue
 * Allows 4,000+ students to submit concurrently without overwhelming server CPU or memory.
 * Excess requests are queued and processed smoothly without dropping connections.
 */

type Task<T> = () => Promise<T>;

class ConcurrencyQueue {
  private concurrency: number;
  private running: number = 0;
  private queue: Array<() => void> = [];

  constructor(concurrency: number = 6) {
    this.concurrency = concurrency;
  }

  public get pendingCount(): number {
    return this.queue.length;
  }

  public get activeCount(): number {
    return this.running;
  }

  public setConcurrency(limit: number) {
    this.concurrency = Math.max(1, limit);
    this.next();
  }

  public async run<T>(task: Task<T>): Promise<T> {
    if (this.running >= this.concurrency) {
      await new Promise<void>((resolve) => {
        this.queue.push(resolve);
      });
    }

    this.running++;

    try {
      return await task();
    } finally {
      this.running--;
      this.next();
    }
  }

  private next() {
    if (this.running < this.concurrency && this.queue.length > 0) {
      const nextTask = this.queue.shift();
      if (nextTask) {
        nextTask();
      }
    }
  }
}

// Global execution queue tuned for multi-core processors
// Spawns max 6 parallel compilation/sandbox processes to prevent CPU thrashing
const globalForQueue = globalThis as unknown as {
  submissionQueue: ConcurrencyQueue | undefined;
};

export const submissionQueue =
  globalForQueue.submissionQueue ?? new ConcurrencyQueue(6);

if (process.env.NODE_ENV !== 'production') {
  globalForQueue.submissionQueue = submissionQueue;
}

export default submissionQueue;
