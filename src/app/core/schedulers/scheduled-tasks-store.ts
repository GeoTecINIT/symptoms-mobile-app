import { NativeSQLite } from '@nano-sql/adapter-sqlite-nativescript';
import { nSQL } from '@nano-sql/core/lib/index';
import { ScheduledTask, SchedulerType } from './scheduled-task';
import { RunnableTask } from '../runners/runnable-task';

const DB_NAME = 'symptoms-mobile';
const SCHEDULED_TASKS_TABLE = 'scheduledTasks';

class ScheduledTasksDBStore implements ScheduledTasksStore {
    private dbInitialized: boolean = false;
    private createDBProcedure: Promise<void>;

    async insert(scheduledTask: ScheduledTask): Promise<void> {
        await this.createDB();
        const { task, interval, recurrent } = scheduledTask;
        const runnableTask: RunnableTask = {
            name: task,
            interval,
            recurrent,
            params: null
        };
        const possibleTask = await this.get(runnableTask);
        if (possibleTask) {
            throw new Error(
                `Already stored: {name=${task}, interval=${interval}, recurrent=${recurrent}}`
            );
        }

        await nSQL(SCHEDULED_TASKS_TABLE)
            .query('upsert', { ...scheduledTask })
            .exec();
    }

    async delete(taskId: string): Promise<void> {
        await this.createDB();
        await nSQL(SCHEDULED_TASKS_TABLE)
            .query('delete')
            .where(['id', '=', taskId])
            .exec();
    }

    async get(task: string | RunnableTask): Promise<ScheduledTask> {
        await this.createDB();

        let whereStatement: Array<any> = ['id', '=', task];
        if (typeof task !== 'string') {
            const runnableTask = task as RunnableTask;
            whereStatement = [
                ['task', '=', runnableTask.name],
                'AND',
                ['interval', '=', runnableTask.interval],
                'AND',
                ['recurrent', '=', runnableTask.recurrent]
            ];
        }

        const rows = await nSQL(SCHEDULED_TASKS_TABLE)
            .query('select')
            .where(whereStatement)
            .exec();
        if (rows.length === 0) {
            return null;
        }

        return this.scheduledTaskFromRow(rows[0]);
    }

    // TODO: Allow filtering by type
    async getAllSortedByInterval(
        schedulerType?: SchedulerType
    ): Promise<Array<ScheduledTask>> {
        await this.createDB();
        const rows = await nSQL(SCHEDULED_TASKS_TABLE)
            .query('select')
            .orderBy(['interval ASC'])
            .exec();

        return rows.map((row) => this.scheduledTaskFromRow(row));
    }

    async increaseErrorCount(taskId: string): Promise<void> {
        await this.createDB();
        const scheduledTask = await this.get(taskId);

        if (scheduledTask) {
            await nSQL(`${SCHEDULED_TASKS_TABLE}.errorCount`)
                .query('upsert', scheduledTask.errorCount + 1)
                .where(['id', '=', taskId])
                .exec();
        } else {
            throw new Error(`Task not found: ${taskId}`);
        }
    }

    async increaseTimeoutCount(taskId: string): Promise<void> {
        await this.createDB();
        const scheduledTask = await this.get(taskId);

        if (scheduledTask) {
            await nSQL(`${SCHEDULED_TASKS_TABLE}.timeoutCount`)
                .query('upsert', scheduledTask.timeoutCount + 1)
                .where(['id', '=', taskId])
                .exec();
        } else {
            throw new Error(`Task not found: ${taskId}`);
        }
    }

    async updateLastRun(taskId: string, timestamp: number): Promise<void> {
        await this.createDB();
        const scheduledTask = await this.get(taskId);

        if (scheduledTask) {
            await nSQL(`${SCHEDULED_TASKS_TABLE}.lastRun`)
                .query('upsert', timestamp)
                .where(['id', '=', taskId])
                .exec();
        } else {
            throw new Error(`Task not found: ${taskId}`);
        }
    }

    async deleteAll(): Promise<void> {
        await this.createDB();
        await nSQL(SCHEDULED_TASKS_TABLE)
            .query('delete')
            .exec();
    }

    // TODO: Extract to an isolated class
    private async createDB() {
        if (this.dbInitialized) {
            return;
        }
        if (!this.createDBProcedure) {
            this.createDBProcedure = nSQL().createDatabase({
                id: DB_NAME,
                mode: new NativeSQLite(),
                tables: [
                    {
                        name: 'scheduledTasks',
                        model: {
                            'id:uuid': { pk: true },
                            'type:string': {},
                            'task:string': {},
                            'interval:int': {},
                            'recurrent:boolean': {},
                            'createdAt:int': {},
                            'errorCount:int': {},
                            'timeoutCount:int': {},
                            'lastRun:int': {}
                        }
                    }
                ]
            });
        }
        await this.createDBProcedure;
        this.dbInitialized = true;
    }

    private scheduledTaskFromRow(obj: any) {
        return new ScheduledTask(
            obj.type,
            {
                name: obj.task,
                interval: obj.interval,
                recurrent: obj.recurrent,
                params: null
            },
            obj.id,
            obj.createdAt,
            obj.lastRun,
            obj.errorCount,
            obj.timeoutCount
        );
    }
}

export interface ScheduledTasksStore {
    insert(scheduledTask: ScheduledTask): Promise<void>;
    delete(task: string): Promise<void>;
    get(task: RunnableTask | string): Promise<ScheduledTask>;
    getAllSortedByInterval(
        schedulerType: SchedulerType
    ): Promise<Array<ScheduledTask>>;
    increaseErrorCount(task: string): Promise<void>;
    increaseTimeoutCount(task: string): Promise<void>;
    updateLastRun(task: string, timestamp: number): Promise<void>;
}

export const scheduledTasksDB = new ScheduledTasksDBStore();
