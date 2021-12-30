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
        this.getAll(
            TreatmentContentType.PSICHOEDUCATION
        ).then((latestContents) =>
            this.psychoeducationUpdates.next(latestContents)
        );
        this.getAll(TreatmentContentType.GUIDELINES).then((latestContents) =>
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
    GUIDELINES = "guidelines",
    PSICHOEDUCATION = "psychoeducation",
}

const contents: Array<RemoteTreatmentContent> = [
    {
        id: "cg01",
        index: 1,
        type: TreatmentContentType.GUIDELINES,
        title: "¿Cómo llevar a cabo una exposición?",
        body: "Incluir pautas aquí...",
    },
    {
        id: "cg02",
        index: 2,
        type: TreatmentContentType.GUIDELINES,
        title: "¿Cómo lidiar con la ansiedad?",
        body: "Incluir pautas aquí...",
    },
    {
        id: "cg03",
        index: 3,
        type: TreatmentContentType.GUIDELINES,
        title: "Sobre la evitación",
        body: "Incluir pautas aquí...",
    },
    {
        id: "cg04",
        index: 4,
        type: TreatmentContentType.GUIDELINES,
        title: "Refuerzo >= 5 y >= 3 USAs (60 min)",
        body: "Incluir pautas aquí...",
    },
    {
        id: "cg05",
        index: 5,
        type: TreatmentContentType.GUIDELINES,
        title: "Pautas > 5 y < 3 USAs (60 min)",
        body: "Incluir pautas aquí...",
    },
    {
        id: "cg06",
        index: 6,
        type: TreatmentContentType.GUIDELINES,
        title: "Refuerzo < 8 (75 min)",
        body: "Incluir pautas aquí...",
    },
    {
        id: "cg07",
        index: 7,
        type: TreatmentContentType.GUIDELINES,
        title: "Pautas >= 8 (75 min)",
        body: "Incluir pautas aquí...",
    },
    {
        id: "cg08",
        index: 8,
        type: TreatmentContentType.GUIDELINES,
        title: "Pautas 90 min",
        body: "Incluir pautas aquí...",
    },
    {
        id: "cp01",
        index: 1,
        type: TreatmentContentType.PSICHOEDUCATION,
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
        type: TreatmentContentType.PSICHOEDUCATION,
        title: "El papel de las cogniciones",
        body: `Ante cualquier situación o experiencia las personas podemos atender a una gran cantidad de aspectos distintos. La mente humana funciona como un filtro, focalizamos la atención sobre ciertos aspectos de una situación y les damos significado.

Este proceso tiene una razón muy clara, aumentar la eficiencia y la velocidad de nuestras respuestas ante una situación determinada. Esto tiene sus ventajas y sus inconvenientes.

La mayor parte de las veces, este proceso se produce de forma tan rápida que no nos llegamos a dar cuenta de lo que estamos pensando. Estas interpretaciones son automáticas, se producen de forma no consciente. Ahora bien, estas interpretaciones no surgen de la nada, en gran medida, se deben a nuestras experiencias pasadas. Además, en ocasiones, utilizamos estas interpretaciones automáticas para imaginar lo que podría ocurrir en el futuro.

Nuestras interpretaciones influyen en lo que esperamos que ocurra en una determinada situación. Cuando sentimos emociones también aparecen pensamientos. Por ejemplo, alguien que sienta ansiedad en espacios cerrados puede tener pensamientos negativos relacionados con “se va a acabar el aire y me voy a ahogar”. Pues bien, este proceso de interpretaciones tiene importantes consecuencias en cómo nos sentimos y dependiendo de cada una de las interpretaciones la persona experimentará una determinada emoción u otra, a su vez cómo nos sintamos influye en las futuras valoraciones que hagamos.`,
    },
    {
        id: "cp03",
        index: 3,
        type: TreatmentContentType.PSICHOEDUCATION,
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
        type: TreatmentContentType.PSICHOEDUCATION,
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
        type: TreatmentContentType.PSICHOEDUCATION,
        title: "Curva de ansiedad y evitación",
        body: `Es fundamental que conozcas curva de ansiedad que se producirá durante las exposiciones, es decir, cómo aumenta la ansiedad al exponerse a la situación temida (esto es normal y es señal de que el proceso va bien) y después va descendiendo si permanecemos en la situación el tiempo suficiente sin realizar conductas de evitación.

Por otra parte, a medida que nos exponemos repetidamente a la misma situación, la ansiedad sube menos y tarda menos tiempo en bajar.

La exposición, como alternativa a las conductas de evitación, nos permite enfrentarnos gradualmente a aquellas situaciones que tratan de evitarse o se experimentan con gran malestar.

La exposición repetida a estas situaciones produce un descenso del malestar ya que permite que se empiecen a vivir y experimentar y es ahí donde actúa el proceso de habituación. Se trata de un fenómeno natural mediante el cual, si permanecemos el tiempo suficiente en una situación que no es amenazante de forma objetiva, ésta deja de afectarnos. Se reduce entonces la fuerza con la que se percibe el estímulo y hace que se disminuya el malestar que experimenta la personas ante el estímulo que teme. `,
    },
    {
        id: "cp06",
        index: 6,
        type: TreatmentContentType.PSICHOEDUCATION,
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
        type: TreatmentContentType.PSICHOEDUCATION,
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
        type: TreatmentContentType.PSICHOEDUCATION,
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
        type: TreatmentContentType.PSICHOEDUCATION,
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
