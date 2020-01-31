import { NativeSQLite } from '@nano-sql/adapter-sqlite-nativescript';
import { nSQL } from '@nano-sql/core/lib/index';
import {
    PlannedTask,
    PlanningType
} from '../runners/task-planner/planned-task';
import { RunnableTask } from '../runners/runnable-task';

const DB_NAME = 'symptoms-mobile';
const PLANNED_TASKS_TABLE = 'plannedTasks';

class PlannedTaskDBStore implements PlannedTasksStore {
    private dbInitialized: boolean = false;
    private createDBProcedure: Promise<void>;

    async insert(plannedTask: PlannedTask): Promise<void> {
        await this.createDB();
        const { name, interval, recurrent, params, cancelEvent } = plannedTask;
        const runnableTask: RunnableTask = {
            name,
            interval,
            recurrent,
            params,
            cancelEvent
        };
        const possibleTask = await this.get(runnableTask);
        if (possibleTask) {
            throw new Error(
                `Already stored: {name=${name}, interval=${interval}, recurrent=${recurrent}}`
            );
        }

        await nSQL(PLANNED_TASKS_TABLE)
            .query('upsert', { ...plannedTask })
            .exec();
    }

    async delete(taskId: string): Promise<void> {
        await this.createDB();
        await nSQL(PLANNED_TASKS_TABLE)
            .query('delete')
            .where(['id', '=', taskId])
            .exec();
    }

    async get(task: string | RunnableTask): Promise<PlannedTask> {
        await this.createDB();

        let whereStatement: Array<any> = ['id', '=', task];
        if (typeof task !== 'string') {
            const runnableTask = task as RunnableTask;
            whereStatement = [
                ['name', '=', runnableTask.name],
                'AND',
                ['interval', '=', runnableTask.interval],
                'AND',
                ['recurrent', '=', runnableTask.recurrent]
            ];
        }

        const rows = await nSQL(PLANNED_TASKS_TABLE)
            .query('select')
            .where(whereStatement)
            .exec();
        if (rows.length === 0) {
            return null;
        }

        return this.plannedTaskFromRow(rows[0]);
    }

    // TODO: Allow filtering by type
    async getAllSortedByInterval(
        planningType?: PlanningType
    ): Promise<Array<PlannedTask>> {
        await this.createDB();
        const rows = await nSQL(PLANNED_TASKS_TABLE)
            .query('select')
            .orderBy(['interval ASC'])
            .exec();

        return rows.map((row) => this.plannedTaskFromRow(row));
    }

    async getAllFilteredByCancelEvent(
        cancelEvent: string
    ): Promise<Array<PlannedTask>> {
        await this.createDB();
        const rows = await nSQL(PLANNED_TASKS_TABLE)
            .query('select')
            .where(['cancelEvent', '=', cancelEvent])
            .exec();

        return rows.map((row) => this.plannedTaskFromRow(row));
    }

    async increaseErrorCount(taskId: string): Promise<void> {
        await this.createDB();
        const plannedTask = await this.get(taskId);

        if (plannedTask) {
            await nSQL(`${PLANNED_TASKS_TABLE}.errorCount`)
                .query('upsert', plannedTask.errorCount + 1)
                .where(['id', '=', taskId])
                .exec();
        } else {
            throw new Error(`Task not found: ${taskId}`);
        }
    }

    async increaseTimeoutCount(taskId: string): Promise<void> {
        await this.createDB();
        const plannedTask = await this.get(taskId);

        if (plannedTask) {
            await nSQL(`${PLANNED_TASKS_TABLE}.timeoutCount`)
                .query('upsert', plannedTask.timeoutCount + 1)
                .where(['id', '=', taskId])
                .exec();
        } else {
            throw new Error(`Task not found: ${taskId}`);
        }
    }

    async updateLastRun(taskId: string, timestamp: number): Promise<void> {
        await this.createDB();
        const plannedTask = await this.get(taskId);

        if (plannedTask) {
            await nSQL(`${PLANNED_TASKS_TABLE}.lastRun`)
                .query('upsert', timestamp)
                .where(['id', '=', taskId])
                .exec();
        } else {
            throw new Error(`Task not found: ${taskId}`);
        }
    }

    async deleteAll(): Promise<void> {
        await this.createDB();
        await nSQL(PLANNED_TASKS_TABLE)
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
                        name: PLANNED_TASKS_TABLE,
                        model: {
                            'id:uuid': { pk: true },
                            'name:string': {},
                            'params:obj': {},
                            'interval:int': {},
                            'recurrent:boolean': {},
                            'createdAt:int': {},
                            'errorCount:int': {},
                            'timeoutCount:int': {},
                            'lastRun:int': {},
                            'cancelEvent:string': {}
                        }
                    }
                ]
            });
        }
        await this.createDBProcedure;
        this.dbInitialized = true;
    }

    private plannedTaskFromRow(obj: any) {
        return new PlannedTask(
            obj.planningType,
            {
                name: obj.name,
                interval: obj.interval,
                recurrent: obj.recurrent,
                params: obj.params,
                cancelEvent: obj.cancelEvent
            },
            obj.id,
            obj.createdAt,
            obj.lastRun,
            obj.errorCount,
            obj.timeoutCount
        );
    }
}

export interface PlannedTasksStore {
    insert(plannedTask: PlannedTask): Promise<void>;
    delete(task: string): Promise<void>;
    get(task: RunnableTask | string): Promise<PlannedTask>;
    getAllSortedByInterval(
        planningType: PlanningType
    ): Promise<Array<PlannedTask>>;
    getAllFilteredByCancelEvent(
        cancelEvent: string
    ): Promise<Array<PlannedTask>>;
    increaseErrorCount(task: string): Promise<void>;
    increaseTimeoutCount(task: string): Promise<void>;
    updateLastRun(task: string, timestamp: number): Promise<void>;
}

export const plannedTasksDB = new PlannedTaskDBStore();
