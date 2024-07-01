import { Component, Input } from '@angular/core';
import { Page, View } from "@nativescript/core";

type AnimatedBar = {
    animationName: string,
    animationDuration: string
}

@Component({
  selector: "SymAudioWaves",
  templateUrl: "./audio-waves.component.html",
  styleUrls: ["./audio-waves.component.scss"],
})
export class AudioWavesComponent {
//   @Input() numBars: number = 160; // Number of bars to display
  @Input() numBars: number = 50; // Number of bars to display

  bars: any[] = Array.from({ length: this.numBars }, _ => ({
    class: this.getRandomAnimationName(),
  }));



  getRandomAnimationName() {
      const animations = [
        'wave-sm-class-short',
        'wave-sm-class-medium',
        'wave-sm-class-long',
        'wave-md-class-short',
        'wave-md-class-medium',
        'wave-md-class-long',
        'wave-lg-class-short',
        'wave-lg-class-medium',
        'wave-lg-class-long',
      ];
      return animations[Math.floor(Math.random() * animations.length)];
  }

  getRandomAnimationDuration() {
    const durations = ['sm-duration', 'md-duration', 'lg-duration'];
    return durations[Math.floor(Math.random() * durations.length)];
  }

  getRandomClasses(): string {
    const randomAnimationClass = this.getRandomAnimationName();
    const randomDurationClass = this.getRandomAnimationDuration();
    return `${randomAnimationClass} ${randomDurationClass}`;
  }

//   getRandomAnimationDuration() {
//     return `${(Math.random() * 0.5 + 0.2).toFixed(2)}s`
//   }

  getRandomColor() {
    const colors = ['white', 'cyan', 'magenta'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
