import type { Locale } from '@/lib/i18n'

/**
 * Copy for the photo mosaic tool, shared by the two locale-slugged pages that
 * render it (/en/projects/photo-mosaic and /es/projects/mosaico-de-fotos).
 */
export const MOSAIC_COPY = {
	en: {
		title: 'Photo Mosaic',
		description:
			'Turn a photo into a mosaic built from hundreds of your other photos, entirely in your browser — nothing is uploaded.',
		intro:
			'Pick one photo to recreate and a batch of others to build it from. This tool tiles the main image into a grid, matches each cell to the photo that fits it best, and draws the result — all in your browser. Nothing is uploaded.',
		noscript:
			'Your mosaic will appear here. This tool needs JavaScript, because it does all its work in your browser rather than on a server.',

		mainImageLabel: 'Choose the photo to recreate',
		mainImageEmpty: 'Click here to choose the photo to recreate',
		replaceMainImage: 'Replace main image',
		viewFullSize: 'View full size',
		closeFullSize: 'Close full size view',
		fullSizeLabel: 'Mosaic at full size',
		tilesHeading: 'Tile photos',
		photosLabel: 'Choose the photos to build it from',
		photosHint:
			'The more photos you add, the better the result. Up to 512 are used.',
		dropPrompt: 'Drag photos or a whole folder here, or:',
		dropPromptWithCount: '{count} photos ready. Drag more here, or:',
		photosPick: 'Choose files',
		photosMore: 'Add more',
		folderLabel: 'Choose a folder',
		folderMore: 'Add a folder',
		explain: 'What this does',
		gridDensityLabel: 'Grid density',
		gridDensityHint:
			'How many photos across. More means a closer likeness and smaller tiles; fewer means each photo stays recognisable.',
		blackAndWhiteLabel: 'Black and white',
		tintLabel: 'Tint strength',
		tintHint:
			"Blends the main image's colors into each tile, so the mosaic reads correctly from a distance.",
		orientationLabel: 'Rotate photos to fit',
		orientationHint:
			'Lets each photo turn in quarter turns, so one whose shapes run the other way can still match. Gives the matcher four times as much to choose from.',
		tiltLabel: 'Tilt',
		tiltHint:
			'Tilts each tile by a small random amount, so the grid looks less mechanical.',
		exportSizeLabel: 'Export size',
		nativeDetail: 'Native detail (full resolution)',
		exceedsCanvasLimit: "Exceeds this browser's canvas size limit",

		cancel: 'Cancel',
		download: 'Download',

		phaseIngest: 'Reading photos…',
		phaseMatch: 'Matching tiles…',
		phaseDraw: 'Drawing…',
		phaseEncode: 'Encoding…',
		progressAnnouncement: '{percent}% complete',

		empty: 'Your mosaic will appear here.',
		gridSummary: '{cols} columns × {rows} rows',
		photoCountSummary: 'Built from {count} photos',

		heicUnsupported:
			'iPhone photos in HEIC format cannot be read in Chrome or Firefox. Export them as JPEG first, or open this page in Safari.',
		errors: {
			unsupported:
				'This tool needs a recent browser — Chrome, Firefox, or Safari 16.4 or later.',
			decode:
				'One of your photos could not be read. It may be corrupted or in a format this browser does not support.',
			memory:
				'Ran out of memory. Try a smaller grid, fewer photos, or a smaller export size.',
			'no-tiles': 'Add at least one tile photo before generating a mosaic.',
			'no-target': 'Choose a main image before generating a mosaic.',
			'canvas-blank':
				'This browser could not allocate an image that large. Choose a smaller export size.',
			unknown: 'Something went wrong. Try again.',
		},
	},
	es: {
		title: 'Mosaico de fotos',
		description:
			'Convierte una foto en un mosaico hecho con cientos de tus otras fotos, todo en tu navegador — nada se sube.',
		intro:
			'Elige una foto para recrear y un lote de otras para construirla. Esta herramienta divide la imagen principal en una cuadrícula, empareja cada celda con la foto que mejor encaja y dibuja el resultado — todo en tu navegador. Nada se sube.',
		noscript:
			'Tu mosaico aparecerá aquí. Esta herramienta necesita JavaScript, porque hace todo su trabajo en tu navegador y no en un servidor.',

		mainImageLabel: 'Elige la foto que quieres recrear',
		mainImageEmpty: 'Haz clic aquí para elegir la foto que quieres recrear',
		replaceMainImage: 'Cambiar la imagen principal',
		viewFullSize: 'Ver a tamaño completo',
		closeFullSize: 'Cerrar la vista a tamaño completo',
		fullSizeLabel: 'Mosaico a tamaño completo',
		tilesHeading: 'Fotos para el mosaico',
		photosLabel: 'Elige las fotos con las que se construirá',
		photosHint:
			'Cuantas más fotos agregues, mejor será el resultado. Se usan hasta 512.',
		dropPrompt: 'Arrastra fotos o una carpeta entera aquí, o:',
		dropPromptWithCount: '{count} fotos listas. Arrastra más aquí, o:',
		photosPick: 'Elegir archivos',
		photosMore: 'Agregar más',
		folderLabel: 'Elegir una carpeta',
		folderMore: 'Agregar una carpeta',
		explain: 'Qué hace esto',
		gridDensityLabel: 'Densidad de la cuadrícula',
		gridDensityHint:
			'Cuántas fotos a lo ancho. Más significa mayor parecido y fotos más pequeñas; menos, que cada foto se siga reconociendo.',
		blackAndWhiteLabel: 'Blanco y negro',
		tintLabel: 'Intensidad del tinte',
		tintHint:
			'Mezcla los colores de la imagen principal en cada foto, para que el mosaico se lea bien desde lejos.',
		orientationLabel: 'Girar fotos para que encajen',
		orientationHint:
			'Permite que cada foto gire en cuartos de vuelta, para que una con las formas al revés también pueda encajar. Le da al emparejador cuatro veces más opciones.',
		tiltLabel: 'Inclinación',
		tiltHint:
			'Inclina cada foto una pequeña cantidad al azar, para que la cuadrícula se vea menos mecánica.',
		exportSizeLabel: 'Tamaño de exportación',
		nativeDetail: 'Detalle nativo (resolución completa)',
		exceedsCanvasLimit: 'Supera el límite de lienzo de este navegador',

		cancel: 'Cancelar',
		download: 'Descargar',

		phaseIngest: 'Leyendo fotos…',
		phaseMatch: 'Emparejando fotos…',
		phaseDraw: 'Dibujando…',
		phaseEncode: 'Codificando…',
		progressAnnouncement: '{percent}% completado',

		empty: 'Tu mosaico aparecerá aquí.',
		gridSummary: '{cols} columnas × {rows} filas',
		photoCountSummary: 'Hecho con {count} fotos',

		heicUnsupported:
			'Las fotos de iPhone en formato HEIC no se pueden leer en Chrome ni en Firefox. Expórtalas como JPEG, o abre esta página en Safari.',
		errors: {
			unsupported:
				'Esta herramienta necesita un navegador reciente — Chrome, Firefox o Safari 16.4 o posterior.',
			decode:
				'Una de tus fotos no se pudo leer. Puede estar dañada o en un formato que este navegador no admite.',
			memory:
				'Se acabó la memoria. Prueba con una cuadrícula más pequeña, menos fotos o un tamaño de exportación menor.',
			'no-tiles':
				'Agrega al menos una foto para el mosaico antes de generarlo.',
			'no-target': 'Elige una imagen principal antes de generar el mosaico.',
			'canvas-blank':
				'Este navegador no pudo reservar una imagen tan grande. Elige un tamaño de exportación menor.',
			unknown: 'Algo salió mal. Intenta de nuevo.',
		},
	},
} as const

export type MosaicCopy = (typeof MOSAIC_COPY)[Locale]
