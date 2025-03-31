import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChildren
} from '@angular/core';
import {
  CoreTypes, KeyframeAnimation, KeyframeAnimationInfo, Page, View
} from "@nativescript/core";


@Component({
  selector: "SymAudioWaves",
  templateUrl: "./audio-waves.component.html",
  styleUrls: ["./audio-waves.component.scss"],
})
export class AudioWavesComponent implements AfterViewInit, OnDestroy {

  @Input() private numBars: number = 50; // Number of bars to display
  @Input() private maxDuration: number = 1.0;
  @Input() private minDuration: number = 0.5;

  @ViewChildren("wave_bar", { read: ElementRef })
  private waveBars: QueryList<ElementRef>;

  private keyframesNames = ["wave-sm", "wave-md", "wave-lg"];
  private animationsInfo: Array<KeyframeAnimationInfo>;
  private animations: Array<KeyframeAnimation> = [];

  protected get bars(): number[] {
    return Array(this.numBars);
  }

  constructor(private page: Page) {
    this.animationsInfo = this.keyframesNames.map(name => this.page.getKeyframeAnimationWithName(name));
  }

  ngAfterViewInit(): void {
    this.animations = this.waveBars.map((waveBar) => this.buildAndStartKeyframeAnimationFor(waveBar));
  }

  ngOnDestroy(): void {
    this.animations.forEach((animation) => animation.cancel());
  }

  private buildAndStartKeyframeAnimationFor(elementRef: ElementRef): KeyframeAnimation {
    const view = <View> elementRef.nativeElement;
    const keyframeAnimation = this.buildRandomKeyframeAnimation();
    keyframeAnimation.play(view);
    return keyframeAnimation;
  }

  private buildRandomKeyframeAnimation(): KeyframeAnimation {
    const animationInfo = this.animationsInfo[Math.floor(Math.random() * this.animationsInfo.length)];
    animationInfo.duration = this.randomDuration(this.minDuration, this.maxDuration);
    animationInfo.iterations = Number.POSITIVE_INFINITY;
    animationInfo.curve = CoreTypes.AnimationCurve.easeInOut;
    return KeyframeAnimation.keyframeAnimationFromInfo(animationInfo);
  }

  private randomDuration(min: number, max: number): number {
    return (Math.random() * (max - min) + min) * 1000;
  }
}

