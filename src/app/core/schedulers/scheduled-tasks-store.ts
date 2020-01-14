import { ScheduledTask, TaskToSchedule, schedule } from '.';
import { NativeSQLite } from '@nano-sql/adapter-sqlite-nativescript';
import { nSQL } from '@nano-sql/core/lib/index';

const DB_NAME = 'symptoms-mobile';

export class ScheduledTasksDBStore implements ScheduledTasksStore {

    dbInitialized: boolean = false;
    
    async insert(scheduledTask: ScheduledTask): Promise<any> {
        await this.createDB();

        return nSQL('scheduledTasks').query('upsert', scheduledTask).exec();
    }
    
    async delete(task: string): Promise<any> {
        // ['id','=',task]
        await this.createDB();

        return nSQL('scheduledTasks').query('delete').where((row) => row.id === task).exec();
    }

    async get(task: string | TaskToSchedule): Promise<any> {
        await this.createDB();
        let whereStatement = (row) => row.id === task;
        if (typeof task !== 'string') {
            const taskToSchedule = <TaskToSchedule>task;
            whereStatement = (row) => row.task === taskToSchedule.task &&
                            row.interval === taskToSchedule.interval &&
                            row.recurrent === taskToSchedule.recurrent;
        }

        return nSQL('scheduledTasks').query('select').where(whereStatement).exec();
    }

    async getAllSortedByInterval(): Promise<any> {
        await this.createDB();

        return nSQL('scheduledTasks').query('select').orderBy(['interval ASC']).exec();
    }

    async increaseErrorCount(task: string): Promise<any> {
        await this.createDB();

        const result = await nSQL('scheduledTasks').query('select').where((row) => row.id === task).exec();

        if (result.length !== 0) {
            const scheduledTask = result[0] as ScheduledTask;

            return nSQL('scheduledTasks.errorCount')
                .query('upsert', scheduledTask.errorCount + 1).where((row) => row.id === task).exec();
        } else {
            throw new Error('Task not found');
        }
    }

    async increaseTimeoutCount(task: string): Promise<any> {
        await this.createDB();

        const result = await nSQL('scheduledTasks').query('select').where((row) => row.id === task).exec();

        if (result.length !== 0) {
            const scheduledTask = result[0] as ScheduledTask;

            return nSQL('scheduledTasks.timeoutCount')
                .query('upsert', scheduledTask.timeoutCount + 1).where((row) => row.id === task).exec();
        } else {
            throw new Error('Task not found');
        }
    }

    async updateLastRun(task: string, timestamp: number): Promise<any> {
        await this.createDB();

        return nSQL('scheduledTasks.lastRun').query('upsert', timestamp).where((row) => row.id === task).exec();
    }

    async deleteAll(): Promise<any> {
        await this.createDB();

        return nSQL('scheduledTasks').query('delete').exec();
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
                        'id:uuid': {pk: true},
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
}

export interface ScheduledTasksStore {
    insert(scheduledTask: ScheduledTask): Promise<any>;
    delete(task: string): Promise<any>;
    get(task: TaskToSchedule | string): Promise<any>;
    getAllSortedByInterval(): Promise<any>;
    increaseErrorCount(task: string): Promise<any>;
    increaseTimeoutCount(task: string): Promise<any>;
    updateLastRun(task: string, timestamp: number): Promise<any>;
}
