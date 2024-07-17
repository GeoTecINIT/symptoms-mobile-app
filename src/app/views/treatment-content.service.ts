import { Injectable } from "@angular/core";
import { ApplicationSettings } from "@nativescript/core";
import { Observable, ReplaySubject } from "rxjs";

const TREATMENT_CONTENT_SEEN_KEY = "TREATMENT_CONTENT_SEEN_KEY";
const SEEN_SEPARATOR = ";";

@Injectable({
    providedIn: "root",
})
export class TreatmentContentService {
    get guideliness$(): Observable<Array<TreatmentContent>> {
        return this.guidelinesUpdates.asObservable();
    }
    get psychoeducations$(): Observable<Array<TreatmentContent>> {
        return this.psychoeducationUpdates.asObservable();
    }

    private guidelinesUpdates = new ReplaySubject<Array<TreatmentContent>>(1);
    private psychoeducationUpdates = new ReplaySubject<Array<TreatmentContent>>(
        1
    );
    private seen = new Set<string>();

    constructor() {
        this.loadSeen();
        this.propagateUpdates();
    }

    async getAll(type: TreatmentContentType): Promise<Array<TreatmentContent>> {
        return contents
            .map((content) => this.joinWithLocalData(content))
            .filter((content) => content.type === type);
    }

    async getById(id: string): Promise<TreatmentContent> {
        const found = contents.find((content) => content.id === id);
        if (!found) {
            return null;
        }

        return this.joinWithLocalData(found);
    }

    async markAsSeen(id: string): Promise<void> {
        if (this.hasBeenSeen(id)) return;
        this.seen.add(id);
        this.propagateUpdates();
        this.saveSeen();
    }

    private hasBeenSeen(id: string): boolean {
        return this.seen.has(id);
    }

    private getAllSeen(): Array<string> {
        return [...this.seen];
    }

    private joinWithLocalData(remote: RemoteTreatmentContent) {
        const seen = this.hasBeenSeen(remote.id);

        return { ...remote, seen };
    }

    private loadSeen() {
        const encodedSeen = ApplicationSettings.getString(
            TREATMENT_CONTENT_SEEN_KEY,
            ""
        );
        if (encodedSeen === "") return;

        for (const elem of encodedSeen.split(SEEN_SEPARATOR)) {
            this.seen.add(elem);
        }
    }

    private propagateUpdates() {
        this.getAll(TreatmentContentType.Psychoeducation).then(
            (latestContents) => this.psychoeducationUpdates.next(latestContents)
        );
        this.getAll(TreatmentContentType.Guidelines).then((latestContents) =>
            this.guidelinesUpdates.next(latestContents)
        );
    }

    private saveSeen() {
        const encodedSeen = this.getAllSeen().join(SEEN_SEPARATOR);
        ApplicationSettings.setString(TREATMENT_CONTENT_SEEN_KEY, encodedSeen);
    }
}

export interface TreatmentContent extends RemoteTreatmentContent {
    seen: boolean;
}

interface RemoteTreatmentContent {
    id: string;
    index: number;
    type: TreatmentContentType;
    title: string;
    subtitle?: string;
    videoPath?: string;
    infographicPath?: string;
    body: string;
}

export enum TreatmentContentType {
    Guidelines = "guidelines",
    Psychoeducation = "psychoeducation",
}

const contents: Array<RemoteTreatmentContent> = [
    {
        id: "cg01",
        index: 1,
        type: TreatmentContentType.Guidelines,
        title: "¿Cómo llevar a cabo una exposición?",
        body: `Acabas de comenzar la exposición, recuerda todo lo que ya sabes sobre la tolerancia de tu malestar.

No intentes luchar contra la ansiedad o rechazar esta experiencia, por el contrario, te será más útil intentar tolerarla y mantenerte en el lugar hasta que dicha ansiedad vaya disminuyendo.

A pesar de que aparezcan las ganas de evitar y marcharte de este lugar, salir de aquí no te ayudará a solucionar tu problema, por el contrario hará que tu ansiedad sea cada vez mayor, por eso te animamos a que permanezcas en el lugar de exposición hasta que toleres la ansiedad y no genere tanto malestar.

Esto puede llevarte un tiempo y para saber cómo te vas encontrando te iremos preguntando cómo te encuentras cada cierto tiempo.

Adelante.`,
    },
    {
        id: "cg02",
        index: 2,
        type: TreatmentContentType.Guidelines,
        title: "¿Cómo afrontar la ansiedad?",
        body: `Parece que estás teniendo un momento de alta ansiedad.

Recuerda que es importante mantenerte en la situación y tolerar el malestar con las herramientas que has aprendido en terapia. Para esto te puede ayudar recordar algunas cuestiones como:

        -  Centra tu atención en lo que está sucediendo ahora, no en lo que puede llegar a suceder.

        -  No intentes protegerte de la ansiedad o rechazarla, es solo una emoción más que puedes llegar a tolerar.

        -  Afrontar esta ansiedad (en lugar de evitarla) hará que aumentes tu tolerancia al malestar y, como consecuencia, te resultará más fácil conseguir tus objetivos.

        -  Si identificas pensamientos negativos, intenta generar pensamientos alternativos más realistas o probables.`,
    },
    {
        id: "cg03",
        index: 3,
        type: TreatmentContentType.Guidelines,
        title: "Consecuencias de evitar",
        body: `Has salido de la zona de exposición.

Te recordamos lo importante que es volver al lugar para continuar con la exposición y trabajar la tolerancia al malestar, hasta que tus niveles de ansiedad sean moderados.

Evitar en este momento y marcharte, hará que la ansiedad sea mayor cuando vuelvas a intentarlo, como te ha ocurrido en otras ocasiones.

Te recomendamos que tomes aire, esperes unos minutos y vuelvas al lugar de exposición. Cuando regreses, te pueden ayudar algunas de estas pautas para manejar la ansiedad:

        -  Centra tu atención en lo que está sucediendo ahora, no en lo que puede llegar a suceder.

        -  No intentes protegerte de la ansiedad o rechazarla, es solo una emoción más que puedes llegar a tolerar.

        -  Afrontar esta ansiedad (en lugar de evitarla) hará que aumentes tu tolerancia al malestar y, como consecuencia, te resultará más fácil conseguir tus objetivos.

        -  Si identificas pensamientos negativos, intenta generar pensamientos alternativos más realistas o probables.`,
    },
    {
        id: "cg04",
        index: 4,
        type: TreatmentContentType.Guidelines,
        title: "Has hecho un gran trabajo, ¡sigue así!",
        body: `Has conseguido finalizar la exposición con éxito.

Esto quiere decir que has podido tolerar tu ansiedad y terminar con niveles de ansiedad moderados-bajos.

¡Enhorabuena! Este logro te permitirá que, cuando vuelvas a exponerte, te sientas más preparado para afrontar la siguiente situación y que compruebes que frente a evitar, enfrentarte a la situación es la mejor estrategia para disminuir la ansiedad.`,
    },
    {
        id: "cg05",
        index: 5,
        type: TreatmentContentType.Guidelines,
        title: "Te animamos a continuar un poco más",
        body: `Has conseguido mantenerte en el lugar y tolerar la ansiedad que has experimentado durante la exposición, es un gran logro.

Hay momentos en los que la ansiedad no disminuye tanto como deseamos y nos cuesta más tolerar este malestar, pero afrontarlo se convierte en un éxito que te acerca cada vez más a resolver tu problema.

Te animamos  a permanecer algo más de tiempo en este lugar para poder aumentar tu tolerancia a tu malestar. Quizás estas pautas te ayuden:

        -  Centra tu atención en lo que está sucediendo ahora, no en lo que puede llegar a suceder.

        -  No intentes protegerte de la ansiedad o rechazarla, es solo una emoción más que puedes llegar a tolerar.

        -  Afrontar esta ansiedad (en lugar de evitarla) hará que aumentes tu tolerancia al malestar y, como consecuencia, te resultará más fácil conseguir tus objetivos.

        -  Si identificas pensamientos negativos, intenta generar pensamientos alternativos más realistas o probables.`,
    },
    {
        id: "cg06",
        index: 6,
        type: TreatmentContentType.Guidelines,
        title: "La clave del éxito: exposición frecuente",
        body: `Has conseguido mantenerte en el lugar y tolerar la ansiedad que has experimentado durante la exposición, es un gran logro.

La clave para lograr tolerar la ansiedad es repetir de forma frecuente la exposición a lugares temidos como este.

Es posible que haya momentos en los que la ansiedad no disminuya tanto como deseamos y nos cueste más tolerar este malestar, pero afrontarlo se convierte en un éxito que te acerca cada vez más a resolver tu problema.

Se trata de entrenar una habilidad que, como otras muchas, te llevará tiempo y esfuerzo, pero también una gran satisfacción con cada logro. Por esto, te animamos a volver a este lugar para realizar otra exposición.`,
    },
    {
        id: "cg07",
        index: 7,
        type: TreatmentContentType.Guidelines,
        title: "Conviene que continúes un poco más",
        body: `Sabemos que es difícil afrontar determinadas situaciones. Mantenerse en el lugar y tolerar la ansiedad ya es un gran esfuerzo.

Es posible que haya momentos en los que la ansiedad no disminuya tanto como deseamos y nos cueste más tolerar este malestar, pero afrontarlo se convierte en un éxito que te acerca cada vez más a resolver tu problema.

Se trata de entrenar una habilidad que, como otras muchas, te llevará tiempo y esfuerzo, pero también una gran satisfacción con cada logro.

Te animamos  a permanecer algo más de tiempo en este lugar para poder trabajar esta tolerancia a tu malestar. Recuerda estas pautas, puede que te ayuden:

        -  Centra tu atención en lo que está sucediendo ahora, no en lo que puede llegar a suceder.

        -  No intentes protegerte de la ansiedad o rechazarla, es solo una emoción más que puedes llegar a tolerar.

        -  Afrontar esta ansiedad (en lugar de evitarla) hará que aumentes tu tolerancia al malestar y, como consecuencia, te resultará más fácil conseguir tus objetivos.

        -  Si identificas pensamientos negativos, intenta generar pensamientos alternativos más realistas o probables.`,
    },
    {
        id: "cg08",
        index: 8,
        type: TreatmentContentType.Guidelines,
        title: "Enhorabuena por el esfuerzo",
        body: `Sabemos que la exposición de hoy ha supuesto un reto para ti y te damos la enhorabuena por el esfuerzo para aumentar tu tolerancia al malestar, podemos terminar la exposición por hoy.

La clave para tu mejoría es aumentar todo lo posible tu tolerancia al malestar y eso solo es posible si practicas las habilidades de regulación emocional que has entrenado en terapia en las situaciones que te generan malestar.

Eso sí, debes exponerte de manera repetida, una y otra vez hasta poder avanzar en tu jerarquía. Te animamos a repetir esta exposición en otro momento.`,
    },
    {
        id: "cg09",
        index: 9,
        type: TreatmentContentType.Guidelines,
        title: "¿Por qué no deberías irte ahora?",
        body: `Te animamos a continuar y seguir practicando un poco más, para trabajar la tolerancia al malestar, hasta que tus niveles de ansiedad se reduzcan.

Evitar en este momento y marcharte, hará que la ansiedad sea mayor cuando vuelvas a intentarlo, como te ha ocurrido en otras ocasiones.

Algunas de estas pautas te pueden ayudar a manejar la ansiedad:

        -  Centra tu atención en lo que está sucediendo ahora, no en lo que puede llegar a suceder.

        -  No intentes protegerte de la ansiedad o rechazarla, es solo una emoción más que puedes llegar a tolerar.

        -  Afrontar esta ansiedad (en lugar de evitarla) hará que aumentes tu tolerancia al malestar y, como consecuencia, te resultará más fácil conseguir tus objetivos.

        -  Si identificas pensamientos negativos, intenta generar pensamientos alternativos más realistas o probables.`,
    },
    {
        id: "cp01",
        index: 1,
        type: TreatmentContentType.Psychoeducation,
        title: "Presentación",
        body: `In development`,
        videoPath: "~/media/videos/GEOvid01.mp4",
    },
    {
        id: "cp02",
        index: 2,
        type: TreatmentContentType.Psychoeducation,
        title: "La respuesta de ansiedad",
        subtitle: "¿Qué veré en este vídeo?",
        body: `Aprenderás que cuando hablamos de ansiedad es necesario tener en cuenta la triple respuesta ya que son tres los sistemas: físico, cognitivo y de comportamiento o motor.`,
        videoPath: "~/media/videos/GEOvid10.mp4",
    },
    {
        id: "cp03",
        index: 3,
        type: TreatmentContentType.Psychoeducation,
        title: "¿Qué es la exposición?",
        subtitle: "¿Qué veré en este vídeo?",
        body: `Aprenderás en qué consiste la exposición y el papel de la ansiedad durante esta.`,
        videoPath: "~/media/videos/GEOvid02.mp4",
    },
    {
        id: "cp04",
        index: 4,
        type: TreatmentContentType.Psychoeducation,
        title: "Los efectos de la exposición",
        subtitle: "¿Qué veré en este vídeo?",
        body: `Aprenderás que es normal y parte del proceso de cambio experimentar ciertas sensaciones tras las sesiones de exposición, ya sean pesadillas, picos de ansiedad o tristeza.`,
        videoPath: "~/media/videos/GEOvid03.mp4",
    },
    {
        id: "cp05",
        index: 5,
        type: TreatmentContentType.Psychoeducation,
        title: "El papel de las cogniciones",
        subtitle: "¿Qué veré en este vídeo?",
        body: `Aprenderás que los pensamientos juegan un papel central en las respuestas de ansiedad y que pueden influir en el modo en que reaccionamos y nos comportamos en cualquier situación. También descubrirás que hay pensamientos desadaptativos y catastróficos y su papel en el mantenimiento de la ansiedad.`,
        videoPath: "~/media/videos/GEOvid07.mp4",
    },
    {
        id: "cp06",
        index: 6,
        type: TreatmentContentType.Psychoeducation,
        title: "Las ventajas del cambio",
        subtitle: "¿Qué veré en este vídeo?",
        body: `Te plantearás cuáles son las ventajas y las desventajas de seguir igual y de cambiar y aprenderás que es normal tener altibajos en la motivación.`,
        videoPath: "~/media/videos/GEOvid08.mp4",
    },
    {
        id: "cp07",
        index: 7,
        type: TreatmentContentType.Psychoeducation,
        title: "¿Qué es un escape?",
        subtitle: "¿Qué veré en este vídeo?",
        body: `Aprenderás qué es un escape y en qué se diferencia de la evitación.`,
        videoPath: "~/media/videos/GEOvid11.mp4",
        infographicPath: "src/media/images/infographics/infographic_1.png",
    },
    {
        id: "cp08",
        index: 8,
        type: TreatmentContentType.Psychoeducation,
        title: "Situaciones difíciles",
        subtitle: "¿Qué veré en este vídeo?",
        body: `Escucharás un mensaje de una terapeuta del equipo animándote a seguir en tu camino del cambio y recordándote las herramientas a las que podrás recurrir en los momentos difíciles.`,
        videoPath: "~/media/videos/GEOvid04.mp4",
    },
    {
        id: "cp09",
        index: 9,
        type: TreatmentContentType.Psychoeducation,
        title: "Los beneficios de la exposición",
        subtitle: "¿Qué veré en este vídeo?",
        body: `Conocerás a Lucía y su historia con la ansiedad. Te contará cómo la exposición la ayudó a lograr sus objetivos y a gestionar la ansiedad.`,
        videoPath: "~/media/videos/GEOvid05.mp4",
    },
    {
        id: "cp10",
        index: 10,
        type: TreatmentContentType.Psychoeducation,
        title: "Respiración lenta",
        subtitle: "¿Qué veré en este vídeo?",
        body: `Una terapeuta te guiará durante el ejercicio; podrás ponerlo en práctica siempre que lo necesites.`,
        videoPath: "~/media/videos/Geovid06.mp4",
    },
    {
        id: "cp11",
        index: 11,
        type: TreatmentContentType.Psychoeducation,
        title: "La importancia de exponerse",
        body: ``,
        infographicPath: "~/media/images/infographics/infographic_3.png",
    },
];
