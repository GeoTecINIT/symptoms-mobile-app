import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
    transform(seconds: number): any {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        let formattedTime = `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
        if (hours > 0) {
            formattedTime = `${hours
                .toString()
                .padStart(2, "0")}:${formattedTime}`;
        }

        return formattedTime;
    }
}
