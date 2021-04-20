import { Injectable } from "@angular/core";
import { ApplicationSettings } from "@nativescript/core";
import { Observable, ReplaySubject } from "rxjs";

const TREATMENT_CONTENT_SEEN_KEY = "TREATMENT_CONTENT_SEEN_KEY";
const SEEN_SEPARATOR = ";";

@Injectable({
    providedIn: "root",
})
export class TreatmentContentService {
    get contents$(): Observable<Array<TreatmentContent>> {
        return this.contentUpdates.asObservable();
    }

    private contentUpdates = new ReplaySubject<Array<TreatmentContent>>(1);
    private seen = new Set<string>();

    constructor() {
        this.loadSeen();
        this.propagateUpdates();
    }

    async getAll(): Promise<Array<TreatmentContent>> {
        return contents.map((content) => this.joinWithLocalData(content));
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
        this.getAll().then((latestContents) =>
            this.contentUpdates.next(latestContents)
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
    title: string;
    body: string;
}

const contents: Array<RemoteTreatmentContent> = [
    {
        id: "c01",
        index: 1,
        title: "Introducción",
        body: `Defectus privatio perspicuum utrimque favis notandum.

Defectibus effectus gustu tum. Occasionem verarum exhibentur heri caligantis alicujus explorant auditu. Emergere audiam assignare mallent quocunque ponamus manifestam donec ignorem author me religionis sentiat ullis. Finitus augeatur integritas habentem ejusmodi audio. Scire habeam securum nam utiles animos dormiam confirmet alia externis funditus veris actum vixque perfecta sui.

Nullas attigerint detorqueat singulis habentur automata mutationum remotam regi. Videntur sacras describere suae solam dubium finitas errore debiliora apud perfectis remotis. Cumque propugnent persuadere judiciis quieti enatare cujuslibet quaerere ferre aestimare mediam. Esset impetu induci evidentes nudam tangantur discrimen corpori sae  ideo autem suum. Odoratu loquebar duratio.

Corporea externis tactiles judicia. Artificis sentio judiciis essentiam imponere primum explorant. Crescit quoties considero obstet fallar percipior locus obstinate soleam desinerem manum aetheris parte longe praecipuus addo occurrere. Mutata imaginem fallebar certi tantaeque probabiles recte objectioni deleantur conemur. Caligantis deus iis noluisse plus imponere solus impetus mansurum rationes sensisse posuisse typis carnem tantaeque causas referam.

Sumamus creari imaginem nequeam singulari aut conversa indubitati aliquid aberrare inquiram iste. Ventus loquebar pendeant talium cadavere cerebella haberem deveniri visum assentiri opera supponant possem suscipere amen quod. Divelli intra sine ausi differre arrogo externis potuerunt puram motum. Solam possumne similibus culpa qualem visione videretur ipsos paulatim factae praesenti. Mo demus tractarem manifestam velim certas.

Sacras liberam purgantur primam ope fruebatur habemus tius solam du quantumvis agendis. Deo putare extensio quaerendum eo utrum sonos necessitas formalis creatis cogitandi inscitiae cogitantur quas hominem usitata incipit. Utrimque perspexi ultimam opinione idem deveniri tractandae oculis tantummodo motus unam istius pleraque quapropter divinae opinione. Appellatur admovetur putarem finguntur sim fides habuimus perspicue percepturi nolens collecta foret pleraque aliquo altera item. `,
    },
    {
        id: "c02",
        index: 2,
        title: "¿Qué es la ansiedad?",
        body: `Aliquamdiu somnis visu tollitur vere corporeis advenire anno contentae habentur.

Expectanti obstinate putabam nullamque tes examinare propositio velim talium favis longo. Ausit admi eversioni affectus suae supponatur insomnia contentae adsit nullo sensisse experiar ferias quaerantur terea quam. Pudeat solum comparem oculi realem parum disputari magnum mutuatur. Primas eodem aliisque hactenus proposui sufficeret materialis majorem ipsarum aliquanto priusquam scientiam sese meditabor spectant natura quascunque. Nolens constare artificium exsurgit insuper falsae advertebam longe immensi dissimilem mundo diversorum innumeras.

Certius secunda aspexi mo magnum. Sex praemia rationale. Omniscium tractatur remaneat scripturas acquirere ostendam remotam vox materiam constanter quum alienis. Primae ipsam habuimus persuadet tractatur posuisse cohibendam qua ipso anno interire veritate mandat. Possidendi affirmarem liberius spero sentire.

Ea firmae veri scirem realitatis discrepant annos noctu audio evidentius aliisque. Mutuari reddere similes scriptum poterunt ponamus quarundam quidem audio producatur tangantur solo ullas. Aliquandiu substantia causas prudentiae caeteri dictis fuisse nos quis cujuslibet ii corrigatur scriptum atqui. Exhibet dubitem theologiae quaerendum integritas improviso geometria requirunt errores novam prosecutus incipere praevidere induci sed. `,
    },
    {
        id: "c03",
        index: 3,
        title: "Métodos para lidiar con la ansiedad",
        body: `Tactiles quarta consumerem pertineant contra.

Argumenta reddere retinet potentiam quadratam solum fuisse testari firmae occurret maximam alias flexibile prius pergamque complexus fidam. Callidus confidam nunc afferuntur reducantur. Cujuslibet durationem horum agnosco incertas colore errore meliores attendenti corporibus sumptum assignetur agendum persuadeor extensum exponantur. Argumenta corpori volo potestis versa corporis cucurbitas omnesque praeditis undenam. Producatur aliquandiu deleantur attigi voluntate duas clarae hesterna occasione extensum ferant putabo originis.

Reliquiae existentia extendere sciamus judicio inveniri subjectum lucem profecto vigilem ferre fide profecta possint. Potentiali causam desinerem modo eram tactu opinantem. Dubitari deo suae infigatur. Praecipuis veritatem corporea frigoris distinguit dicamne deumque spectentur solent posse juncta crescit ideamque minor punctum. Nullum itaque tacitus.

Profundum invenerunt me ferventi dum. Cogit existam aliarum vulgus videor totumque gloria intuebar heri patiatur reliquiae concursum. Frigus nova existentia tangatur quaero equidem nemine suffossis paucos objectivae simul assequi deleantur experior. Suo timet spectant afferri inde vigilantes concedam scriptae requiratur quidquid tractandae. Evidentes vos eorum extitisse invenit bonus callidum primas entis infinitae difficilia falso insidias.

Divinae elicitam delusisse rationem evidenter solis catholicae dubitandi existimavi liquida sit quocunque humanae cupiam certi advertisse praesertim. Non assignem habentem visa asseverent ingeniosi color ideas cohibendam famam desinere illarum. Memores sui ultimam dispari dubitabam causas divelli vita scientiam invenero tangatur omnesque ideis angelos luminis est vitari. Allatis imaginari tantas. Fuerit inanimes pertineant ceram certum apud propositio videmus quantitas perlegere certius vel commendare sae reddendum ultimum.

Omnes enatare imaginabar nota satyriscos nutriri applicare. Regula detorqueat dividi sola pleraque quarta primo imaginatio venturum experimur. Praemia loquebar aliquo facultate naturali nocturna exerant calida ideamque. Scio tribuebam exempli quocunque tollentur ente. Figuras praesenti confusae fallebar co signa defectibus nihili per imaginarer etiam.

Putandum agendis sentiens ipsis externo referebam aliquamdiu extitisse ostensum assentiri sensus falsam eorum fallar.`,
    },
    {
        id: "c04",
        index: 4,
        title: "¿Qué es la terapia de exposición?",
        body: `Meditabor dormiam potuerunt.

Prava pileos perfectum ideoque curandum incipit confidere venturum affectus diversi sentiens donec major principia longo probant. Partes totaque cessarem. Verumtamen author dei facit scio judicarent fecto quae. Singulae aperte inquiram indubitati initia remaneat respondere periculi magnum ero creari fallit digna videbuntur sequentium. Flexibile quae discrimen fictitium concipio neque simulque cogitandi cavendum quaeretur faciliorem ferri pappo.

Quietem offerendum nocturna passim certi testari cognoscere majestatis matura magis foco usurpabam. Elicitam pappo conemur abducerem capax essem scripto totos. Majus originis attigeram primo utcunque explicui quaslibet vestro. Factae superest tollitur imbecillia nusquam dedissem insuper pla exsurgit. Componat affirmo diversorum falsam quam tactiles naturas.

Quaedam nolo fuerit fuerit pileos diversas totumque quolibet percurrere veritatem. Revocari probandum isti atqui ipsam. Meum certus nequeam immorari durationis. Clara agendis volens somnis. Poni simplex forte voluptatem opinor nomine terea fruebatur adhuc loco inter causam habet in spectentur ipsi sim.

Manus matura admodum odor tamque numeri iterum facillimam animalia percipi plerosque innotuit argumentis tot ope. Contrariae visae ritas certas admisi finitas dubitandum difficilia essem mutationum spatium ejusque meos profecto sensus attributa. Alienas fingo naturae rationum archimedes recte. Delusisse offerendum quarum ille quodcumque. Causam nullis quoque speranda consistat existeret considero.

Angelum nonnisi percipiat loquebar exsolvi attinet referuntur longum contrarium sexta generales voluptatem re fuse supponam. Rationum capax nonnisi credendam athei imaginem gustum attigeram sentio mutuatur ecclesiae agnoscitur aliquid immortalem aliquoties sensuum attributa. Blandisque distinctum tentassem affectus timeo cumque. Imaginabar fuisse curiosius affectus ignota admodum tangatur respondeam ventus efficere denegante idea virorum integritas cum. Materiam extra quavis est positivum anima objectioni foret antehac haben differant aër fore fiat quoties ferias.

Quam mandat alio immorari melius. Data chartam objectiva aliquoties actum naturales voces aliquanto admiserim visae tanquam conservet mens artificis loco inveniri. Credimus meditatas corrigatur imponere inde at. `,
    },
    {
        id: "c05",
        index: 5,
        title: "La importancia de exponerse",
        body: `Constare calorem motus angelos theologos meas.

Existenti co apud causis objective prae separatum originem existant solvendae illos tentassem imaginata. Illi ignota nia argumentis sumamus modi adipisci lus fatigor quaslibet cunctatus pileos probant illo similium ausit color. Pergamque commoveo spondeo hesterna concedam assentiri iterum productus dormio. Tale vocant externa haben propria manifestum. Erunt longum animus tritam aliquoties prudens haustam efficiat constet admodum operatione.

Animos humanam absoluta strepitum explicui inquirere. Quaero liberius meditatio qui recordor putare caeteri denique firma callidum manifeste. Vacabo nihilum notandum locum quomodo collabitur quales erat extensarum vestra facultates vocant lus attigerint omnibus habeatur excogitent. Quo frigus aliquod agendum subducam timet conformes animos geometria cur multarum mundo theologiae dubitandum assumere efficiat praemia. Advenire neutrum tantumdem evidentius agnoscitur aliis unitas haberet certis ullius.

Quis putabam extensa firmae potuit multarum calorem habemus qualia quoniam vixque scribi tangi docetur physicae ignotas. Ullius cogitantur exponetur quidquid ostendam arcte actiones donec nocturna earumdem. Male credo obstinate hinc praestare longum incedere chartam ipsos. Maxima desumptas detrahere dubitarem meipsum possem aggrediar recte praeterea advertebam. Plures defectibus cumque alicubi catholicae accepit volent monendos supersit.

Autho potest cognitio allatis magis vestibus quoque per ullius tempore. Imaginem infinite perfecti soliditas etsi data advenire suscipere hesterna pretium distincte nullo dubium pappo dormio alicujus extendo. `,
    },
    {
        id: "c06",
        index: 6,
        title: "Contenido 6",
        body: `Cogitans maxime rerumque ubi loquendi causam superare quis cumque possunt volens lus supponant alia.

Confidam elicitam erunt generalia. Potuit sensus ejusmodi invenerunt me tam istiusmodi illarum detractis improviso dubito notandum fictitium idea incipit existant. Fallebar liberius consistere positivum materiam originis expectabam spectentur nunquid. Spectatum eminenter imperfecta. Probabiles cavebo impetus denique ei desiderant opportune meum essent videor advertatur finitus dubitem.

Exponetur somniemus veritatem. Aliud to prudens cerae divinae loquebar imo latere. Usu spondeo visu. Postquam fallat facit extensio advenire sine causis requiratur serie nullam figurata igni facile ideas fit sentiat funditus. Objectiva poterunt solis bono augeri ille tale pictores istas hesterna praesertim videmus lor impetus externarum. `,
    },
    {
        id: "c07",
        index: 7,
        title: "Contenido 7",
        body: `Efficitur corpori cui physicam effectibus timeo.

Nequit illos sui. Concipiam summum excogitent deinde utens extensio publice explicui sed apprehendo ausit audio posse credo ideis. Proposui inveniant ideam tanti partiales agnoscitur rerumque earumque brachia aliarum removendo deus docti ullius. Assentiar secunda attentius alios durent oculis conflantur quantumvis. Credidi assideo constat intellectu requiratur ipsis machinam.

Atque difficilia maxima mirum etsi separatum actu. Consuetae excoluisse prudens suam tam lumine agebam humano confirmet totaque falsam requiratur producatur geometria discrepant. Potuit iis caeteras possumne necdum ingressus multi altera innumeras signa revolvo exponetur punctum imaginatio ubi regi. Alio quid scopo magnum exponuntur respondeam potestate respondere sentiat simus ulterius ille novam credidi. Strepitum gustu animalia excludat spatium transferre fuse aliter data solo paritura differant pendere vi saltem aliquamdiu gurgitem.

Nondum ut assignem dum habentur fallacem communi habeo quomodo vere cogitatio pugnare item attendendo imaginem anno. Illos spem credimus praeditis gi veritate vestra tangatur perfectae regi fingo exsurgit amen caeteri. Admiserim lapide sequeretur dicetur videmur devinctam incrementi judicare sufficiunt solam cujuslibet replere veras ullos defectu majora obnoxius. `,
    },
    {
        id: "c08",
        index: 8,
        title: "Contenido 8",
        body: `Circulum apparet tamquam refutent ante permiscent voces potuerit praecipuis obscure cernitur dormire inspiciam integritas denegante oblivisci.

Apertum procedere quavis excitari divelli posse. Digna brevi probatur fas repugnaret quascunque perfecti admodum decipi exigui. Neutrum manum omnia sufficit discrimen verbum infusum distinctum iterum extendo praecipuas conservat nomen. Objectivus judicia frigus distinguo talis viris talem accepit figuram maximam. Occurrere privatio ideae faciendam mentem consuetae fueram probabiles testari ipse ubi liberet.

Quanta tempusque unde rationes nego dixi facturum propria. Cucurbitas omnem invenio sum eminenter ima causis praeterea utili vitro ab. Cupio odor vel angelum ingenio sex fuit ostendam tius mihi intra. Color detrahere dubitavit probandam quaestione intra sae his videmus dubitabam crediderim consumerem aucta formalis. Scilicet persuaderi etiam conari de bile confidere.

Incipere meam sensisse scientiis. `,
    },
    {
        id: "c09",
        index: 9,
        title: "Contenido 9",
        body: `Prava theologiae evidenter vis patiatur novo tanquam ut odoratu ageretur incidissem bono assignare quaecumque.

Dimoveret affirmarem viderunt quomodo illo loquor potentiali reperero plura habentur externa humano. Respondere ullum potuerit qualis bile finguntur tempore curant vul perfectum cessarem memores libertate missae. Attendamus caligantis novas figmenta impetus vixque quidem desumptas numeranda procedere. Cunctatus impetus credo externarum sine noctu sit quandiu solus capax praestare advertatur idque ausint audio. Nonnisi falleret occurrere respondeam distinctum affectus credidi apertum supponam deesset.

Nullum perlegere tam. Jactantur assidere interire faciendam magna. Evadit situs hactenus sese cognoscere advertebam desumptas referam tractarem utor persuadeam ea naturae. Istis audio quaero utrum. Sufficiat perfectae istae percipimus admovetur procuravi opinio habuerim ideis audio.

Quadrati formas aspexi possem perfectis probatur fallar ideo hoc idearum. Tantumque videtur attigerint persuadere possum judicare fuit sonos. Certe parte an abducendam affirmabam induci vel. Sentio inanes aliquoties opinantem regendae suo immorari visu animalium sola ipsius deus innatis hactenus proprie differant. Agnoscitur habemus negat diverso conceptum perfacile deceptor.

Haben consuetudo ventus meam relabor quaedam regendae meos quadrati etiam fueram dubitare. Veritate objective effectus heri ac archimedes producatur revolvo. Prudentiae illa asseverent imagines conformes fore quales quaedamque. Sum eam posse ipsos dicam mo dubitari cerae cognitas nudi explorant nullamque reliquiae interdum divinae admiserim. Credamus voce perfecti fatigor naturales bono deus nihili tius ostenditur objicient vocant diversi conari continent. `,
    },
    {
        id: "c10",
        index: 10,
        title: "Contenido 10",
        body: `Sufficere alio utcunque corporeis coloribus actiones levitatem primo suas finitae falleret spectant omnibus.

Ideamque usitate hesterna inusitatis externarum efficiat se his remanet cogit patiatur aspexi tanquam compages ineunte. Veniebant conflatum vitiis. Auditu scripto fateri manum fuerit reges erunt abducendam recurrunt potentiale quapropter prae tactu credimus locus profertur. Videbuntur firmas nullamque aperte extensa peccato ignorata. Scriptis maximum ineptire ineunte desiderant reducit delusisse erumpam ha pileos deteriorem utrum magnis.

Minor quaerere ero possem at aliam more diversitas mox desinere artificium vulgo dura manus patet. Clarius mox recte regi tollatur invenio ideo novi sola addi hauriantur rea retinet porro justam. Humanum perfectum rum tamen utili. Puram figmenta fingo studiose dulcedinem judiciis fidam tangitur prosecutus sonos falsum regula credo. Fallacem facit physicae apprehendo erit praesenti priusquam essentiae manet ipsos creatis intellectu.

Oculis indidisse numeranda viris formalem caelum liberet possint spem. Cognitione opinionis comparem contineri figura manibus improviso docti omnes praecipuus archetypi formas mutationum. Mutatur minus mearum quieti efficere. Mea percipimus probatur poni actu ulterius disputari spero separatum reducantur unitas finitas sufficit. `,
    },
    {
        id: "c11",
        index: 11,
        title: "Contenido 11",
        body: `Evidentes demus facultatem errore insidias visu imagines scriptae turbatus advenire has inveniri videmus chartam discrepant.

Quum vitiis prava maximam propter dei nequit industriam exerant quaecumque quovis iterum cupientem duo suscipere. Meliores futurus eminenter. Id lapide opus formis de existam posuisse habemus sive integram possint ei industria pendam neque. Inquirere formas timet interitum fallant cavendum actum lor propria laboriosa pertinet tria doctum. Hodie prius subjectum veritate.

Dubitavit igni sensum contentae repugnemus reges afferri imponere gnum antedictis partibus cum evidentes omnem partibus. Duce vestra voluntates. Soleam gnum distinctae existat corrigatur saporis tritam hac aut tollentur ideam pleraque negari verti tactu. Dat animam diversas integritas pileos major paucos majorem vigilantes esse. Levitatem apta curantes.

Levitatem nuperrime tollentur indefinite tractarem si sint postquam privatio certis tractandae indefinite prudentiae studiose corrigatur causas concedam. Angelos illo agendis imagines articulo memores illi certi viderunt meipsum judicabam arrogo. Aeque publice entis qua cognoscam novam humano objectiva scioli. Affirmarem figmenta tangitur falsum tertia talia effecerit certum discrimen solo qualitates. Ulterius solis visa unam immensi pictores longe deprehendi cogitatio membris cunctaque aliam exigui.

Placidae voluptatem volui dico laboriosa anno similes. Monendos experiar cernitur rerumque affirmarem. Tacitus generales demus esset iste indidisse aliisque satyriscos pertineant ullum major unam spem assignem essentiam. Ipsum aetheris conceptum aetate recensenda humanae indidisse habeo durationem appellatur simulque deveniatur cogitandi perspicuae materiam constet imaginata. Contrariae cur auditu quibus confirmet dormiam pappo acceptis possim locis.

Cogit credo ecce innumeras persuaderi rerum fallacem infinitum ii repugnemus aspi credendas quaeretur plura tertia. Figuras adjuvetis ultimam scientiis pendere priusquam dubitans modos tenebras naturales humano adsunt. `,
    },
    {
        id: "c12",
        index: 12,
        title: "Contenido 12",
        body: `Meis imaginabor qualia contra permittere producatur partes physicae vapor quaslibet.

Admodum operatione corporeis vestes humanae primo antehac rogo possidendi. Putabo infirmari funditus equidem gustu nec majus omne necesse eo tum communibus latum. Primae evidentius judicio affectibus prius cohaereant perfecta judicarint. Animae cognitio exhibentur mutatur refutent gustum unaquaque importare seipso occurret. Automata credo totumque erant sum reipsa duce quaecumque locum adhuc aliquam.

Aliquamdiu examinare facultate incrementi apud manifestam probabiles adjuvetis erumpam prudentiae. Lectores humano intellectu formalis earumque supponatur sensus tius supersunt gustu et enim duo. Habentem creatis agnoscerem tactu potentiam libertate deesset excaecant indidisse haberi attendendo notitia imaginem ecclesiae aberrare. Hic relabor quia interdum creatis partiales restat. Quiddam fallar probandum probandum.

Exhibet creando perspicuae imaginarer duce examinare forte originis putare perfecti utili solam loquendi facilius. Lumine frigida caeteris ullas varia flexibile vere ostensum. Disputari qualem venientia supersit liberius extensum membris verbis illos admittere enatare ferenda discrepant theologos quantum item missae. Non assidere facultatem crediderim difficilia aspi certe mutuatur innata prava memores conflatum facilius cupientem sapores. Quid ageretur caelum cupiam ordinis lapide matura finitae.

Extat verarum terra. `,
    },
    {
        id: "c13",
        index: 13,
        title: "Contenido con título máximo #####",
        body: `Quantumvis figuram  efficiat primo nemine coloribus paulo rationem.

Velit sum ulla adesse. Quandiu magna me prosecutus quos notionibus esse faciliorem poterunt quales intelligo perspicuae simplex ferenda operatione archetypi impellit. Anima desuescam lumine judicio qui deceret veras propria etc percepturi meliores. Mandat multum erumpam multae nitebatur difficilia culpa crediderim singulis nusquam inscitiae peccant aliquando corpus calorem cunctaque. Esse aliquo visione longe prudens sequeretur subjectum saltem naturali qualia vulgo contentae.

Illo ejusque agnosco credo tandem foret ingressus at animam manus fallit deesse potentiali tanquam accidentia coloribus. Mentibus tollatur nullo mutuari. Mo rari nego favis habemus velit. Sint lus fuerit missae oculis notandum nonnihil. Praefatio haustam primas sensum data caetera nemo figurata ignorem ceram intelligat.

Abducerem cognitas hesterna sub ipsarum synopsis nempe augeatur caeteri vocant scripta desinere quem. Inquirere calida quapropter formis apollonio quarta nihili colore vitro cap. Realem invenero delibarem magnis. Persuadeor deo vul figurata aliquoties nia talia mutata realitatem essent durat memoriae cogitandi clarae interitum. Clarius excogitent assideo ope simus finitae devenietur immortalem requiratur requirunt conflantur sit.

Objecta igitur novum deinde objectioni tollentur contrariae temporis totos. Aliquo infinitam opinionum nonnihil ente assumam aucta sub obversari somno volui utcunque condemnat summopere extensio remotam admisi. Erroris potest ille proxime. Ullum sequuturum modos ista dumtaxat nullo putavi accepisse co gustu. Realem voce notaverim pleraque effecerit simul durationis corporis. `,
    },
];
