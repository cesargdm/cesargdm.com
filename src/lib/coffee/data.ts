import type { Locale } from '@/lib/i18n'

import additions from './additions.json'

export type Localized = Record<Locale, string>
export type Evidence = 'documented' | 'reported' | 'disputed' | 'unknown'
export type Source = {
	id: string
	title: string
	url: string
	published: string | null
	reviewed: string
}
export type Claim<T> = { value: T; source: string | null; status: Evidence }
export type Species = {
	id: string
	name: string
	scientific: string
	color: string
	source: string
}
export type Variety = {
	id: string
	name: string
	aliases: string[]
	species: Claim<string>
	kind: Claim<'cultivar' | 'selection' | 'hybrid' | 'landrace' | 'trade-name'>
	origin: Claim<string | null>
	group: Claim<string | null>
	summary: Claim<Localized>
	featured: boolean
}
export type Relationship = {
	from: string
	to: string
	type: 'parent' | 'mutation' | 'selection'
	source: string
	status: Evidence
}
export const REVISION = '2026-09-16'
const WCR = 'https://varieties.worldcoffeeresearch.org/varieties/'
const sourceIds = [
	'bourbon',
	'typica',
	'caturra',
	'pacas',
	'villa-sarchi',
	'maragogipe',
	'mundo-novo',
	'catuai',
	'sl28',
	'sl34',
	'pacamara',
	'geisha-panama',
	'nemaya',
	'kr-1',
]
export const SOURCES: Source[] = [
	...[...sourceIds, ...additions.map((v) => v.id)].map((id) => ({
		id,
		title: `World Coffee Research · ${id}`,
		url: `${WCR}${id}`,
		published: null,
		reviewed: REVISION,
	})),
	{
		id: 'iac',
		title: 'Instituto Agronômico · Programa café',
		url: 'https://www.iac.sp.gov.br/produtoseservicos/orgulhonacional/programa_cafe.php',
		published: null,
		reviewed: REVISION,
	},
	{
		id: 'iac-register',
		title: 'Instituto Agronômico · Registro de cultivares',
		url: 'https://www.iac.sp.gov.br/cultivares/inicio/resultados_quantitativos_view.php?pesquisa=Caf%C3%A9',
		published: null,
		reviewed: REVISION,
	},
]
export const SPECIES: Species[] = [
	{
		id: 'arabica',
		name: 'Arabica',
		scientific: 'Coffea arabica',
		color: '#55745b',
		source: 'bourbon',
	},
	{
		id: 'canephora',
		name: 'Canephora',
		scientific: 'Coffea canephora',
		color: '#a4633e',
		source: 'iac',
	},
]
export const GROUPS: Record<string, Localized> = {
	catimor: { en: 'Catimor related', es: 'Relacionado con Catimor' },
	sarchimor: { en: 'Sarchimor related', es: 'Relacionado con Sarchimor' },
	introgressed: { en: 'Other introgressed', es: 'Otras introgresiones' },
	f1: { en: 'F1 hybrids', es: 'Híbridos F1' },
	congo: { en: 'Congo', es: 'Congo' },
	guinea: { en: 'Guinea', es: 'Guinea' },
	'congo-guinea': { en: 'Congo × Guinea', es: 'Congo × Guinea' },
	uganda: { en: 'Uganda', es: 'Uganda' },
	congensis: { en: 'Congensis introgression', es: 'Introgresión de congensis' },

	bourbon: { en: 'Bourbon related', es: 'Relacionado con Bourbon' },
	typica: { en: 'Typica related', es: 'Relacionado con Typica' },
	mixed: {
		en: 'Typica & Bourbon related',
		es: 'Relacionado con Typica y Bourbon',
	},
	ethiopian: { en: 'Ethiopian landrace', es: 'Variedad local etíope' },
}
export const COUNTRIES: Record<string, Localized> = {
	GT: { en: 'Guatemala', es: 'Guatemala' },
	VE: { en: 'Venezuela', es: 'Venezuela' },
	RW: { en: 'Rwanda', es: 'Ruanda' },
	ID: { en: 'Indonesia', es: 'Indonesia' },
	NI: { en: 'Nicaragua', es: 'Nicaragua' },
	HN: { en: 'Honduras', es: 'Honduras' },
	MX: { en: 'Mexico', es: 'México' },
	PR: { en: 'Puerto Rico', es: 'Puerto Rico' },
	IN: { en: 'India', es: 'India' },
	VN: { en: 'Vietnam', es: 'Vietnam' },

	BR: { en: 'Brazil', es: 'Brasil' },
	SV: { en: 'El Salvador', es: 'El Salvador' },
	CR: { en: 'Costa Rica', es: 'Costa Rica' },
	KE: { en: 'Kenya', es: 'Kenia' },
	ET: { en: 'Ethiopia', es: 'Etiopía' },
	UG: { en: 'Uganda', es: 'Uganda' },
}
function claim<T>(value: T, source: string | null): Claim<T> {
	return { value, source, status: source ? 'documented' : 'unknown' }
}
function variety(
	id: string,
	name: string,
	species: string,
	kind: Variety['kind']['value'],
	origin: string | null,
	group: string | null,
	en: string,
	es: string,
	options: { source?: string; aliases?: string[]; featured?: boolean } = {},
): Variety {
	const source = options.source ?? id
	return {
		id,
		name,
		aliases: options.aliases ?? [],
		species: claim(species, source),
		kind: claim(kind, source),
		origin: claim(origin, origin ? source : null),
		group: claim(group, group ? source : null),
		summary: claim({ en, es }, source),
		featured: options.featured ?? false,
	}
}
// Original short factual summaries, not reproductions of catalog text or diagrams.
// Origin means the documented place of discovery/selection; unresolved histories remain null.
export const VARIETIES: Variety[] = [
	variety(
		'timor-832-1',
		'Timor Hybrid 832/1',
		'arabica',
		'selection',
		null,
		'introgressed',
		'A Timor Hybrid accession used with Caturra in Catimor breeding. Kept distinct from accession 832/2.',
		'Accesión de Híbrido de Timor utilizada con Caturra en el mejoramiento Catimor. Se distingue de la accesión 832/2.',
		{ source: 't8667' },
	),
	variety(
		'timor-832-2',
		'Timor Hybrid 832/2',
		'arabica',
		'selection',
		null,
		'introgressed',
		'A Timor Hybrid accession used with Villa Sarchi in Sarchimor breeding. Kept distinct from accession 832/1.',
		'Accesión de Híbrido de Timor utilizada con Villa Sarchi en el mejoramiento Sarchimor. Se distingue de la accesión 832/1.',
		{ source: 't5296' },
	),
	variety(
		'rume-sudan',
		'Rume Sudan',
		'arabica',
		'landrace',
		null,
		'ethiopian',
		'A landrace parent of the F1 hybrids Centroamericano and Milenio.',
		'Variedad local progenitora de los híbridos F1 Centroamericano y Milenio.',
		{ source: 'centroamericano' },
	),

	...additions.map((v) =>
		variety(
			v.id,
			v.name,
			v.species,
			v.kind as Variety['kind']['value'],
			v.origin,
			v.group,
			v.en,
			v.es,
		),
	),
	variety(
		'bourbon',
		'Bourbon',
		'arabica',
		'cultivar',
		null,
		'bourbon',
		'An old Arabica variety carried from Yemen to Réunion. Its descendants include several compact mutations.',
		'Variedad histórica de arábica llevada de Yemen a Reunión. Entre sus descendientes hay varias mutaciones compactas.',
		{ featured: true },
	),
	variety(
		'typica',
		'Typica',
		'arabica',
		'cultivar',
		null,
		'typica',
		'A foundational Arabica variety with a migration history through Yemen, India and Java. Its exact origin is not reduced to one country here.',
		'Variedad fundamental del arábica con una historia que pasa por Yemen, India y Java. Aquí no reducimos su origen a un solo país.',
		{ featured: true },
	),
	variety(
		'caturra',
		'Caturra',
		'arabica',
		'cultivar',
		'BR',
		'bourbon',
		'A compact mutation of Bourbon discovered in Brazil and subsequently selected by IAC.',
		'Mutación compacta de Bourbon descubierta en Brasil y seleccionada posteriormente por el IAC.',
		{ aliases: ['Nanico'], featured: true },
	),
	variety(
		'pacas',
		'Pacas',
		'arabica',
		'cultivar',
		'SV',
		'bourbon',
		'A compact Bourbon mutation discovered on the Pacas family farm in El Salvador.',
		'Mutación compacta de Bourbon descubierta en la finca de la familia Pacas en El Salvador.',
	),
	variety(
		'villa-sarchi',
		'Villa Sarchi',
		'arabica',
		'cultivar',
		'CR',
		'bourbon',
		'A Bourbon mutation selected in Costa Rica. Its relationship to Bourbon is documented as a mutation.',
		'Mutación de Bourbon seleccionada en Costa Rica. Su relación con Bourbon está documentada como una mutación.',
		{ aliases: ['La Luisa', 'Villalobos Bourbon'] },
	),
	variety(
		'maragogipe',
		'Maragogipe',
		'arabica',
		'cultivar',
		'BR',
		'typica',
		'A large-seeded mutation of Typica discovered in Brazil. It is one parent of Pacamara.',
		'Mutación de Typica de semillas grandes descubierta en Brasil. Es uno de los progenitores de Pacamara.',
	),
	variety(
		'mundo-novo',
		'Mundo Novo',
		'arabica',
		'cultivar',
		'BR',
		'mixed',
		'A Brazilian selection from a natural cross between Typica and Bourbon.',
		'Selección brasileña de un cruce natural entre Typica y Bourbon.',
	),
	variety(
		'catuai',
		'Catuaí',
		'arabica',
		'cultivar',
		'BR',
		'mixed',
		'Developed at IAC by crossing Mundo Novo with Caturra. Multiple red- and yellow-fruited selections exist.',
		'Desarrollado en el IAC mediante el cruce de Mundo Novo con Caturra. Existen distintas selecciones de frutos rojos y amarillos.',
	),
	variety(
		'sl28',
		'SL28',
		'arabica',
		'selection',
		'KE',
		'bourbon',
		'Selected at Scott Agricultural Laboratories in Kenya. Bourbon-like genetics indicate a group relationship, not a documented direct parent.',
		'Seleccionado en los laboratorios Scott de Kenia. Su afinidad genética con Bourbon indica un grupo, no un progenitor directo documentado.',
		{ aliases: ['SL 28'] },
	),
	variety(
		'sl34',
		'SL34',
		'arabica',
		'selection',
		'KE',
		'typica',
		'A Kenyan Scott Laboratories selection with Typica-like genetics. Group membership is separate from parentage.',
		'Selección keniana de los laboratorios Scott con afinidad genética con Typica. Pertenecer al grupo no equivale a tener un progenitor documentado.',
		{ aliases: ['SL 34'] },
	),
	variety(
		'pacamara',
		'Pacamara',
		'arabica',
		'hybrid',
		'SV',
		'mixed',
		'A cross of Pacas and Maragogipe developed in El Salvador. The population is not fully genetically stabilized.',
		'Cruce de Pacas y Maragogipe desarrollado en El Salvador. La población no está completamente estabilizada genéticamente.',
		{ featured: true },
	),
	variety(
		'geisha-panama',
		'Geisha (Panama)',
		'arabica',
		'landrace',
		'ET',
		'ethiopian',
		'This entry refers to the Panamanian lineage descended from accession T2722, collected in Ethiopia. It does not merge all coffees sold as Gesha.',
		'Esta ficha corresponde al linaje panameño descendiente de la accesión T2722, recolectada en Etiopía. No agrupa todos los cafés vendidos como Gesha.',
		{ aliases: ['Gesha', 'Geisha'], featured: true },
	),
	variety(
		'nemaya',
		'Nemaya',
		'canephora',
		'hybrid',
		null,
		null,
		'A canephora rootstock bred from accessions T3561 and T3751 by PROMECAFE, CIRAD and CATIE. Those accessions are not separate varieties in this atlas.',
		'Portainjerto de canephora obtenido de las accesiones T3561 y T3751 por PROMECAFE, CIRAD y CATIE. Esas accesiones no se presentan como variedades independientes.',
		{ featured: true },
	),
	variety(
		'kr-1',
		'NARO-Kituza Robusta 1',
		'canephora',
		'selection',
		'UG',
		'uganda',
		'A Ugandan NaCORI selection screened for coffee wilt disease resistance. Its parentage is not mapped in this edition.',
		'Selección de NaCORI en Uganda evaluada por su resistencia a la marchitez del cafeto. Su ascendencia no se representa en esta edición.',
		{ aliases: ['KR1', 'KR 1'], featured: true },
	),
	variety(
		'apoata-iac-2258',
		'Apoatã IAC 2258',
		'canephora',
		'cultivar',
		'BR',
		null,
		'An IAC canephora cultivar registered in 1987 and used as a rootstock. Its listing comes directly from the Brazilian breeding institute.',
		'Cultivar de canephora del IAC registrado en 1987 y utilizado como portainjerto. La ficha procede del instituto brasileño de mejoramiento.',
		{ source: 'iac-register', aliases: ['IAC 2258'], featured: true },
	),
	variety(
		'caturra-vermelho-iac-477',
		'Caturra Vermelho IAC 477',
		'arabica',
		'selection',
		'BR',
		null,
		'A named red Caturra selection listed by IAC. Kept distinct from the broader Caturra entry; detailed pedigree remains unreviewed here.',
		'Selección roja de Caturra identificada en el listado del IAC. Se mantiene separada de la ficha general de Caturra; su genealogía detallada aún no se ha revisado aquí.',
		{ source: 'iac' },
	),
	variety(
		'caturra-amarelo-iac-476',
		'Caturra Amarelo IAC 476',
		'arabica',
		'selection',
		'BR',
		null,
		'A named yellow Caturra selection listed by IAC. This atlas preserves its selection identifier rather than merging it with Caturra.',
		'Selección amarilla de Caturra identificada en el listado del IAC. Este atlas conserva su identificador de selección en lugar de fusionarla con Caturra.',
		{ source: 'iac' },
	),
]
const relations: [string, string, Relationship['type']][] = [
	['timor-832-1', 'catisic', 'parent'],
	['timor-832-1', 'costa-rica-95', 'parent'],
	['timor-832-1', 'lempira', 'parent'],
	['timor-832-1', 'ihcafe-90', 'parent'],
	['timor-832-1', 'oro-azteca', 'parent'],
	['timor-832-1', 'kartika-1', 'parent'],
	['timor-832-1', 't5175', 'parent'],
	['timor-832-1', 't8667', 'parent'],
	['timor-832-2', 't5296', 'parent'],
	['timor-832-2', 'iapar-59', 'parent'],
	['timor-832-2', 'limani', 'parent'],
	['timor-832-2', 'marsellesa', 'parent'],
	['timor-832-2', 'obata-red', 'parent'],
	['timor-832-2', 'monte-claro', 'parent'],
	['rume-sudan', 'centroamericano', 'parent'],
	['rume-sudan', 'milenio', 'parent'],

	['typica', 'pache', 'mutation'],
	['bourbon', 'venecia', 'mutation'],
	['bourbon', 'tekisic', 'selection'],
	['typica', 'caripe', 'selection'],
	['t5296', 'cuscatleco', 'selection'],
	['t5296', 'parainema', 'selection'],
	['sln-6', 'rab-c15', 'selection'],
	['iapar-59', 'ipr-107', 'parent'],
	['mundo-novo', 'ipr-107', 'parent'],
	['marsellesa', 'starmaya', 'parent'],
	['caturra', 'casiopea', 'parent'],
	['caturra', 'h3', 'parent'],
	['caturra', 'catisic', 'parent'],
	['caturra', 'costa-rica-95', 'parent'],
	['caturra', 'lempira', 'parent'],
	['caturra', 'ihcafe-90', 'parent'],
	['caturra', 'oro-azteca', 'parent'],
	['caturra', 'kartika-1', 'parent'],
	['caturra', 'fronton', 'parent'],
	['caturra', 't5175', 'parent'],
	['caturra', 't8667', 'parent'],
	['villa-sarchi', 't5296', 'parent'],
	['villa-sarchi', 'iapar-59', 'parent'],
	['villa-sarchi', 'limani', 'parent'],
	['villa-sarchi', 'marsellesa', 'parent'],
	['villa-sarchi', 'obata-red', 'parent'],
	['villa-sarchi', 'monte-claro', 'parent'],
	['t5296', 'centroamericano', 'parent'],
	['t5296', 'milenio', 'parent'],
	['t5296', 'esperanza', 'parent'],
	['t5296', 'mundo-maya', 'parent'],
	['tr4', 'trs1', 'parent'],
	['tr9', 'trs1', 'parent'],
	['tr11', 'trs1', 'parent'],

	['bourbon', 'caturra', 'mutation'],
	['bourbon', 'pacas', 'mutation'],
	['bourbon', 'villa-sarchi', 'mutation'],
	['typica', 'maragogipe', 'mutation'],
	['typica', 'mundo-novo', 'parent'],
	['bourbon', 'mundo-novo', 'parent'],
	['mundo-novo', 'catuai', 'parent'],
	['caturra', 'catuai', 'parent'],
	['pacas', 'pacamara', 'parent'],
	['maragogipe', 'pacamara', 'parent'],
]
export const RELATIONSHIPS: Relationship[] = relations.map(
	([from, to, type]) => ({ from, to, type, source: to, status: 'documented' }),
)
