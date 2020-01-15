import { schedule } from '.';
import { NativeSQLite } from '@nano-sql/adapter-sqlite-nativescript';
import { nSQL } from '@nano-sql/core/lib/index';
import { ScheduledTask, TaskToSchedule } from './scheduled-task';

const DB_NAME = 'symptoms-mobile';
const SCHEDULED_TASKS_TABLE = 'scheduledTasks';

class ScheduledTasksDBStore implements ScheduledTasksStore {
    private dbInitialized: boolean = false;

    async insert(scheduledTask: ScheduledTask): Promise<void> {
        await this.createDB();
        const { task, interval, recurrent } = scheduledTask;
        const taskToSchedule = { task, interval, recurrent };
        const possibleTask = await this.get(taskToSchedule);
        if (possibleTask) {
            throw new Error(
                `Already stored: {task=${task}, interval=${interval}, recurrent=${recurrent}}`
            );
        }

        await nSQL(SCHEDULED_TASKS_TABLE)
            .query('upsert', { ...scheduledTask })
            .exec();
    }

    async delete(task: string): Promise<void> {
        await this.createDB();
        await nSQL(SCHEDULED_TASKS_TABLE)
            .query('delete')
            .where(['id', '=', task])
            .exec();
    }

    async get(task: string | TaskToSchedule): Promise<ScheduledTask> {
        await this.createDB();

        let whereStatement: Array<any> = ['id', '=', task];
        if (typeof task !== 'string') {
            const taskToSchedule = task as TaskToSchedule;
            whereStatement = [
                ['task', '=', taskToSchedule.task],
                'AND',
                ['interval', '=', taskToSchedule.interval],
                'AND',
                ['recurrent', '=', taskToSchedule.recurrent]
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

    async getAllSortedByInterval(): Promise<Array<ScheduledTask>> {
        await this.createDB();
        const rows = await nSQL(SCHEDULED_TASKS_TABLE)
            .query('select')
            .orderBy(['interval ASC'])
            .exec();

        return rows.map((row) => this.scheduledTaskFromRow(row));
    }

    async increaseErrorCount(task: string): Promise<void> {
        await this.createDB();
        const scheduledTask = await this.get(task);

        if (scheduledTask) {
            await nSQL(`${SCHEDULED_TASKS_TABLE}.errorCount`)
                .query('upsert', scheduledTask.errorCount + 1)
                .where(['id', '=', task])
                .exec();
        } else {
            throw new Error(`Task not found: ${task}`);
        }
    }

    async increaseTimeoutCount(task: string): Promise<void> {
        await this.createDB();
        const scheduledTask = await this.get(task);

        if (scheduledTask) {
            await nSQL(`${SCHEDULED_TASKS_TABLE}.timeoutCount`)
                .query('upsert', scheduledTask.timeoutCount + 1)
                .where(['id', '=', task])
                .exec();
        } else {
            throw new Error(`Task not found: ${task}`);
        }
    }

    async updateLastRun(task: string, timestamp: number): Promise<void> {
        await this.createDB();
        const scheduledTask = await this.get(task);

        if (scheduledTask) {
            await nSQL(`${SCHEDULED_TASKS_TABLE}.lastRun`)
                .query('upsert', timestamp)
                .where(['id', '=', task])
                .exec();
        } else {
            throw new Error(`Task not found: ${task}`);
        }
    }

    async deleteAll(): Promise<void> {
        await this.createDB();
        await nSQL(SCHEDULED_TASKS_TABLE)
            .query('delete')
            .exec();
    }

    private async createDB() {
        if (this.dbInitialized) {
            return;
        }
        await nSQL().createDatabase({
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
        this.dbInitialized = true;
    }

    private scheduledTaskFromRow(obj: any) {
        return new ScheduledTask(
            obj.type,
            {
                task: obj.task,
                interval: obj.interval,
                recurrent: obj.recurrent
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
    get(task: TaskToSchedule | string): Promise<ScheduledTask>;
    getAllSortedByInterval(): Promise<Array<ScheduledTask>>;
    increaseErrorCount(task: string): Promise<void>;
    increaseTimeoutCount(task: string): Promise<void>;
    updateLastRun(task: string, timestamp: number): Promise<void>;
}

export const scheduledTasksDB = new ScheduledTasksDBStore();
