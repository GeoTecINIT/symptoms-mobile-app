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
        title: "Consecuencias de evitar ",
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
        title: "La clave del éxito: exposicion frecuente",
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
        title: "¿Qué es la ansiedad?",
        body: `Las emociones forman parte del funcionamiento normal de los seres humanos, tanto las positivas como las negativas, no es posible entender la vida sin la función importantísima que cumplen las emociones, juegan un papel fundamental y no son perjudiciales. El foco no está en deshacerse de las emociones, sino en conocerlas, ser más consciente de los factores asociados a las mismas y poder regularlas mejor.
Una función fundamental de las emociones es alertarnos, avisarnos de que algo importante ha ocurrido (tanto en el medio externo como en el medio interno) y motivarnos para actuar. Las emociones nos inducen a la acción en situaciones importantes y son energizantes. Otra función de las emociones es comunicarnos con los demás. Las expresiones faciales son una parte importante de las emociones.
Para tener una idea mejor de qué ocurre cuando se desencadena la emoción, es importante saber que tiene tres componentes principales. A continuación, describiremos esos tres componentes y te haremos reflexionar sobre ellos:


    1)  Componente cognitivo (Lo que pienso): Cuando sentimos emociones a menudo aparecen pensamientos.

    2)  Componente comportamental (lo que hago): Son las acciones, las conductas que la persona hace o tiene el impulso de hacer cuando siente una emoción.

    3)  Componente fisiológico (cómo me siento): Existen respuestas fisiológicas asociadas a las emociones, las palpitaciones y la sudoración pueden ser dos sensaciones características, aunque puede tener otras muchas manifestaciones.


El miedo es una de las emociones básica que es tremendamente adaptativa y ha servido a los seres humanos a lo largo de todos nuestros años de historia.

Experimentar cierto temor a determinadas situaciones que ocurren a tu alrededor puede ser una reacción no problemática, el problema está en que tu experiencia no termine ahí sino que ese conjunto de reacciones (pensamientos, conductas y sensaciones físicas) interaccionen entre ellas, impidan que veamos la situación a la que nos enfrentamos de forma objetiva a la experiencia tal y como está sucediendo y se centre más bien en el pasado o en los que podría ocurrir en el futuro, convirtiéndose así en realmente amenazante o catastrófica. Es ahí cuando estas reacciones se convierten en extremadamente desadaptativas y podemos hablar de una emoción más compleja como la ansiedad y que se caracteriza por un miedo intenso.`,
    },
    {
        id: "cp02",
        index: 2,
        type: TreatmentContentType.Psychoeducation,
        title: "El papel de las cogniciones",
        body: `Ante cualquier situación o experiencia las personas podemos atender a una gran cantidad de aspectos distintos. La mente humana funciona como un filtro, focalizamos la atención sobre ciertos aspectos de una situación y les damos significado.

Este proceso tiene una razón muy clara, aumentar la eficiencia y la velocidad de nuestras respuestas ante una situación determinada. Esto tiene sus ventajas y sus inconvenientes.

La mayor parte de las veces, este proceso se produce de forma tan rápida que no nos llegamos a dar cuenta de lo que estamos pensando. Estas interpretaciones son automáticas, se producen de forma no consciente. Ahora bien, estas interpretaciones no surgen de la nada, en gran medida, se deben a nuestras experiencias pasadas. Además, en ocasiones, utilizamos estas interpretaciones automáticas para imaginar lo que podría ocurrir en el futuro.

Nuestras interpretaciones influyen en lo que esperamos que ocurra en una determinada situación. Cuando sentimos emociones también aparecen pensamientos. Por ejemplo, alguien que sienta ansiedad en espacios cerrados puede tener pensamientos negativos relacionados con “se va a acabar el aire y me voy a ahogar”. Pues bien, este proceso de interpretaciones tiene importantes consecuencias en cómo nos sentimos y dependiendo de cada una de las interpretaciones la persona experimentará una determinada emoción u otra, a su vez cómo nos sintamos influye en las futuras valoraciones que hagamos.`,
    },
    {
        id: "cp03",
        index: 3,
        type: TreatmentContentType.Psychoeducation,
        title: "¿Qué es la evitación?",
        body: `El elemento fundamental que contribuye al mantenimiento del miedo intenso en múltiples situaciones es la evitación, es decir, el no enfrentarse a las situaciones temidas.

La evitación puede servir a corto plazo para eliminar la ansiedad (p.ej., una persona con claustrofobia puede empezar a sentir ansiedad al entrar en un ascensor y si decide evitar la situación y salir del ascensor, se producirá un descenso de la ansiedad), pero a largo plazo evitar tiene numerosas consecuencias negativas:


    -  El alivio de la ansiedad que se experimenta es momentáneo, de corta duración.

    -  No nos acostumbramos a experimentar esa emoción y por tanto, cada vez que aparece nos sentimos mucho peor.

    -  Hace que la próxima vez que nos enfrentemos a la situación experimentemos mayor temor y una ansiedad más intensa, es decir, refuerza negativamente el miedo por el alivio momentáneo de la ansiedad.

    -  Poco a poco, se llega a desear evitar cada vez más cosas. De esta manera, la evitación se generalizará cada vez a más situaciones interfiriendo en distintas áreas de la vida de la persona y limitándole cada vez más.

    -  Se van perdiendo las habilidades necesarias para enfrentarse a la situación temida o actuar adecuadamente, como ocurre cuando una persona ha estado mucho tiempo sin escribir a máquina y nos impide desarrollar un sentimiento de autoeficacia.

    -  La evitación impide realizar actividades que se desean hacer (p.ej., en el caso de la claustrofobia evitar subir en ascensor nos obliga a tener que subir siempre por las escaleras… ¡aunque se trate del piso 14!)

    -  Impide a la persona comprobar si lo que teme es cierto o no. Esto es, la persona no puede desconfirmar la creencia acerca de la peligrosidad de la situación temida.

    -  La evitación hace que la persona pierda la confianza en sí misma, disminuyendo su autoestima al no considerarse capaz de afrontar con eficacia la situación temida y mermando tu autonomía.


Todo lo anterior limita sustancialmente la vida.

Este tipo de comportamientos o estrategias destinados a impedir que ocurran experiencias emocionales dolorosas o no deseadas por el malestar que generan, son por lo tanto estrategias muy desadaptativas. Es importante que comprendas que el hecho de realizar estas estrategias de evitación emocional lo que hacen es justo contribuir a que se mantenga el malestar que experimentas. A pesar de que puedas considerar que estas estrategias son útiles en algunas situaciones, ya que tienden a reducir o inhibir la experiencia de emociones intensas a corto plazo, no te ayudarán a superar el problema a largo plazo, al contrario, contribuirán a mantenerlo.

Quizás, durante tu vida has aprendido que el hecho de realizar ciertas conductas reduce o elimina la intensidad de un estímulo que te produce malestar, ya sea un estímulo interno (una sesión física, por ejemplo, el temblor) como externo (estar en un lugar alto). Sin embargo, aunque la utilización de estas estrategias a corto plazo puede aliviar tu malestar o reducir la intensidad de la emoción, a largo plazo contribuyen al mantenimiento del malestar que querías modificar y, por tanto, aumentan la gravedad de tu problema.

Es importante saber además que la evitación puede ser muy sutil y en ocasiones la persona pone en marcha conductas de seguridad (por ejemplo, tomar medicación para enfrentarse a esa situación) o utiliza señales de seguridad (ir siempre acompañado) y en ambos casos también estamos hablando de una evitación perjudicial para superar el problema.`,
    },
    {
        id: "cp04",
        index: 4,
        type: TreatmentContentType.Psychoeducation,
        title: "La importancia de exponerse",
        body: `Por todo lo que hemos comentado en la sección anterior, es importante exponerse. Esta técnica consiste en mantenerse en las situaciones ansiógenas, experimentando ansiedad el tiempo necesario hasta que la ansiedad disminuya, produciéndose lo que se denomina habituación. Es decir, consiste en enfrentarse a una situación temida hasta familiarizarse con ella, comprobar que no es peligrosa y adquirir las habilidades necesarias para actuar de forma eficaz. No te pedimos que te enfrentes a una situación peligrosa, de verdad para ti, sino que te expongas a situaciones que se entienden como amenazantes, pero realmente no entrañan un peligro real para tu vida. Esta exposición se hará de forma gradual y se establecerán distintos objetivos de exposición en función de la ansiedad que la persona experimente y el grado de evitación que tengan en las distintas situaciones que tema. De este modo, se empezará la exposición con objetivos más fáciles, para ir consiguiendo todos los objetivos uno a uno y avanzando a los más difíciles.

En las exposiciones es esencial que experimentes tus emociones de forma completa, es decir, sin tratar de evitarlas, aplicando nuevas formas de afrontamiento más adaptativas que las usadas hasta ahora ya que han hecho que se mantenga el problema. Es importante que sepas que el principal objetivo de las exposiciones a la emoción no es la reducción inmediata de la respuesta emocional, sino que aprendas algo nuevo como resultado de la experiencia. Es fundamental que durante todas las exposiciones intentes experimentar las emociones de forma completa, es decir, sin tratar de evitarlas, aplicando nuevas formas de afrontamiento más adaptativas. Este procedimiento te ayudará a incrementar la tolerancia a las emociones, esta es la meta de aprendizaje central de las exposiciones que queremos que realices. También es importante que se creen nuevas asociaciones, es decir, conforme te expongas, incorpores nuevas experiencias, comprobando cómo esas consecuencias más catastróficas que siempre has anticipado no ocurren realmente.

Además, las exposiciones han de llevarse a cabo de forma sistemática, gradual y repetidamente.

Esta parte del tratamiento puede resultarte complicada al principio, ya que supone enfrentarte a aquello que te genera malestar, pero conforme vayas exponiéndote de forma repetida y sistemática, sin llevar a cabo ninguna estrategia de evitación, la tolerancia a las emociones que experimentes se incrementará permitiéndote afrontar situaciones cada vez más difíciles.

Es importante que prestes atención a los pensamientos, emociones y comportamientos que anteceden a la exposición, y también a los que experimentarás durante la realización de ésta, analizando si las consecuencias que esperabas en un inicio han llegado a ocurrir en relación a los pensamientos catastróficos que habías anticipado, o respecto a la intensidad de las emociones o sensaciones físicas que anticipabas.

Recuerda, cuando te permites experimentar tus emociones de forma completa sin evitarlas, te estás dando la oportunidad de poner en marcha las estrategias adecuadas y eficaces para hacerles frente que, con la práctica, acaban convirtiéndose en estrategias automáticas.`,
    },
    {
        id: "cp05",
        index: 5,
        type: TreatmentContentType.Psychoeducation,
        title: "Curva de ansiedad y evitación",
        body: `Es fundamental que conozcas curva de ansiedad que se producirá durante las exposiciones, es decir, cómo aumenta la ansiedad al exponerse a la situación temida (esto es normal y es señal de que el proceso va bien) y después va descendiendo si permanecemos en la situación el tiempo suficiente sin realizar conductas de evitación.

Por otra parte, a medida que nos exponemos repetidamente a la misma situación, la ansiedad sube menos y tarda menos tiempo en bajar.

La exposición, como alternativa a las conductas de evitación, nos permite enfrentarnos gradualmente a aquellas situaciones que tratan de evitarse o se experimentan con gran malestar.

La exposición repetida a estas situaciones produce un descenso del malestar ya que permite que se empiecen a vivir y experimentar y es ahí donde actúa el proceso de habituación. Se trata de un fenómeno natural mediante el cual, si permanecemos el tiempo suficiente en una situación que no es amenazante de forma objetiva, ésta deja de afectarnos. Se reduce entonces la fuerza con la que se percibe el estímulo y hace que se disminuya el malestar que experimenta la personas ante el estímulo que teme. `,
    },
    {
        id: "cp06",
        index: 6,
        type: TreatmentContentType.Psychoeducation,
        title: "Efectos colaterales",
        body: `Cuando se comienza la exposición, es habitual que aparezcan algunos efectos colaterales de la misma, como son:


    1)  Ansiedad, aunque no requiere tratamiento especial.

    2)  A veces, pesadillas por las noches después de las sesiones de exposición que generalmente desaparecen a medida que avanza el tratamiento.

    3)  Estado de ánimo bajo que generalmente desaparece a medida que avanza el tratamiento.

    4)  Recaídas. Es importante identificar las causas y atajarlas.


Ten en cuenta estas características del momento de exposición por el que puedes estar pasando, porque al contrario de lo que podría parecer, indica que todo está funcionando bien y estás afrontando estas situaciones adecuadamente, a pesar de que experimentes efectos colaterales que irán despareciendo con el tiempo. Habla con tu terapeuta si no es así.`,
    },
    {
        id: "cp07",
        index: 7,
        type: TreatmentContentType.Psychoeducation,
        title: "Tácticas de manejo de la ansiedad",
        body: `Puedes apoyarte en algunas tácticas de control de la ansiedad durante el periodo de tiempo en el que estarás haciendo exposición. Algunas de estas tácticas son:


    1)  Respiración lenta.

    2)  Relajación muscular progresiva.

    3)  Tácticas paradójicas: intentar que el temor aumente.

    4)  Reglas para afrontar el miedo. Concretamente:

        a)  Recuerda que las sensaciones no son más que una exageración de las reacciones corporales al estrés.

        b)  No son, en absoluto, perjudiciales ni peligrosas. Solamente desagradables. No sucederá nada peor.

        c)  Deja de aumentar el pánico con pensamientos atemorizadores sobre lo que está sucediendo.

        d)  Observa lo que está sucediendo en tu cuerpo justamente ahora, no lo que temas que pueda pasar.

        e)  Espera y deja tiempo al miedo para que pase. No luches en contra, no huyas de él. Simplemente acéptalo.

        f)  Observa que cuando dejas de aumentarlo al añadir pensamientos atemorizadores, el miedo comienza a desaparecer por sí mismo.

        g)  Recuerda que el objetivo de exponerse es aprender a afrontar el miedo (sin evitarlo). Por tanto, esta es una oportunidad de progresar.

        h)  Piensa en el avance que has conseguido hasta ahora, a pesar de todas las dificultades. Piensa en lo satisfecho que estarás cuando lo consigas esta vez.

        i)  Cuando comiences a sentirte mejor, mira a tu alrededor y empieza a planear qué vas a hacer después.

        j)  Cuando estés dispuesto a continuar, comienza de forma tranquila, relajada. No hay necesidad de sobreesforzarse ni de tener prisa.`,
    },
    {
        id: "cp08",
        index: 8,
        type: TreatmentContentType.Psychoeducation,
        title: "Situaciones difíciles",
        body: `El cambio es un proceso largo, con altibajos y lograr la consolidación definitiva del cambio requiere un esfuerzo por tu parte. Estos altibajos forman parte de la emoción de vivir y en cualquier momento se puede dar una situación que nos afecte especialmente y ante la que conviene saber cómo podríamos responder.

Con independencia de los progresos realizados, es probable que en algún momento vuelvas a tener experiencias emocionales intensas desagradables y que te produzcan malestar. Determinadas situaciones pueden favorecer además con mayor probabilidad la reaparición de tu problema. A estas situaciones las llamamos situaciones “de alto riesgo”.

Todo esto forma parte de lo esperable, ya sabes que las emociones fluctúan y que el proceso de cambio no es siempre lineal y constante. Es decir, vas a tener momentos mejores y momentos peores y respecto a los momentos peores, es importante saber manejarlas. La mejor manera de estar preparado para afrontar adecuadamente una situación de alto riesgo es seguir estos tres puntos:


    1)  Saber identificar las situaciones de alto riesgo o reconocerlas a tiempo.

    2)  Saber qué habilidades tienes para hacerles frente y asegurarse de haberlas practicado.

    3)  Que aprendas a pedir ayuda (si esta ayuda es necesaria, sin ningún temor). No esperes a sentirte mal.


Una vez hayas reflexionado sobre estos aspectos trata de realizar un listado de esas situaciones y plantearte dos cuestiones 1º) ¿qué puedo hacer para afrontarlas?, y 2º) ¿con quién podría contar para apoyarme? De esta manera estarás más preparado/a para afrontarlas.`,
    },
    {
        id: "cp09",
        index: 9,
        type: TreatmentContentType.Psychoeducation,
        title: "Mantenimiento de los logros",
        body: `Las principales estrategias de mantenimiento se pueden resumir en: 1) intenta practicar todo lo aprendido y 2) procura estar atento/a a posibles fluctuaciones en el estado de ánimo y a las posibles recaídas.

Es fundamental que practiques todo lo que has aprendido, ya que esta práctica es un elemento clave en el mantenimiento de los logros. Con este objetivo, te proponemos desarrollar un plan de puesta en práctica de aquello que has aprendido, de manera que en tus actividades del día a día esté muy presente todo lo aprendido en el programa de tratamiento que has realizado. Algunos ejercicios que te pueden ayudar a esto son:


    -  Busca un momento cada día en el que practicar la exposición. Realiza evaluaciones periódicas de tu progreso. Puedes utilizar un calendario en el que puedes marcar las habilidades que te conviene practicar, como si fueras tu propio terapeuta y los días en los que vas a evaluar si has llevado a cabo cada práctica.

    -  Intenta poner en práctica todo esto el mismo día en que finalices el tratamiento.

    -  Recuerda que estás tomando las riendas de tu propia mejoría. Eso implica que te responsabilices de practicar diariamente las técnicas aprendidas.

    -  Ya has avanzado y aprendido mucho, ¡¡¡enhorabuena!!! Seguro que puedes lograr tus objetivos. Sólo se trata de planificarlos bien y trabajar a fondo las habilidades que te conviene practicar para lograrlos.


Finalmente, conviene que recuerdes una serie de consejos respecto a posibles formas para mantener tus progresos:


    -  Sortea la evitación. Recuerda, cuando llevas a cabo la evitación de una emoción estás recompensando tus emociones negativas y haciendo que éstas empeoren.

    -  Continúa practicando las exposiciones a la emoción, trata de practicar la conciencia libre de interpretaciones y centrada en el presente de las experiencias emocionales.

    -  Recuerda, lo importante que es practicar, practicar y practicar. No olvides hacerlo, aunque veas que estás bien, es importante no dejar que se oxide todo lo que has aprendido.

    -  No te preocupes si tienes días en los que parece que has vuelto atrás. Ese es precisamente el momento de aplicar todo lo que has aprendido y practicado.

    -  Prevé las situaciones de alto riesgo. No las ignores, trata de identificarlas y busca la mejor manera de afrontarlas.

    -  Sí lo necesitas, acude de nuevo a un especialista. Recuerda que una recaída no es un fracaso, aunque puede que lo veas así cuando te sientas mal. ¡Es un obstáculo que puedes superar!`,
    },
];
