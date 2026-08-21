---
title: Configuración de macOS para desarrollo web
date: 2023
extract: Cómo preparo una Mac nueva para desarrollo web — gestor de paquetes, shell, runtimes y los pocos ajustes que vale la pena cambiar antes de escribir código.
technical: true
translationKey: macos-setup
isDraft: true
---

# Configuración de macOS para desarrollo web

Cada par de años termino frente a una Mac nueva sin nada instalado, y cada vez reconstruyo más o menos el mismo entorno de memoria. Esta es esa lista, ya escrita. El orden importa más que las decisiones individuales, porque cada paso depende del anterior.

## Homebrew primero

Casi todo lo demás se instala a través de él, así que va primero.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

En Apple Silicon se instala en `/opt/homebrew` y no en `/usr/local`, y el instalador imprime dos líneas para agregar al perfil de tu shell. No te las saltes: sin ellas, `brew` funciona en la ventana donde lo instalaste y en ninguna otra.

Después, las herramientas que quiero en toda máquina:

```bash
brew install git gh
brew install --cask visual-studio-code
```

`gh` vale la pena por sí solo: `gh auth login` configura de una vez el CLI y tus credenciales de git, lo que te ahorra lidiar con tokens más adelante.

## El shell

macOS trae zsh, que está bien tal cual. Lo único que cambio de inmediato es mostrar la rama de git en el prompt: saber en qué rama estás sin correr `git status` evita una clase de error específica y molesta.

```bash
# ~/.zshrc
autoload -Uz vcs_info
precmd() { vcs_info }
zstyle ':vcs_info:git:*' formats ' (%b)'
setopt PROMPT_SUBST
PROMPT='%1~${vcs_info_msg_0_} %# '
```

Eso viene incluido en zsh, así que no necesita ningún framework. Frameworks como Oh My Zsh son perfectamente buenos, pero agregan tiempo de arranque y mucho comportamiento que no elegiste, y un shell lento se siente cada vez que abres una terminal.

## Runtimes

Instala Node con un gestor de versiones, nunca directo con Homebrew. Los proyectos fijan versiones distintas y tarde o temprano vas a necesitar dos a la vez.

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
```

Con `--use-on-cd`, entrar a un directorio con `.nvmrc` o con un campo `engines` cambia Node automáticamente. La versión que necesita un proyecto deja de ser algo que tengas que recordar.

También instalo Bun, que hoy es lo primero que uso en proyectos personales:

```bash
curl -fsSL https://bun.sh/install | bash
```

Instala lo bastante rápido como para que `node_modules` deje de ser algo en lo que piensas, y corre TypeScript directamente. Para trabajo con una cadena de herramientas ya establecida sigo usando lo que el repositorio haya estandarizado: coincidir con el lockfile importa más que cualquier preferencia mía.

## Editor

Las extensiones están cubiertas en [6 extensiones esenciales de VS Code](/es/blog/6-extensiones-esenciales-de-vs-code). Los ajustes que vale la pena cambiar en una instalación nueva son menos de los que esperarías:

```json
{
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	"editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
	"files.trimTrailingWhitespace": true,
	"files.insertFinalNewline": true
}
```

Formatear al guardar es el que cambia cómo trabaja un equipo, no cómo se comporta una máquina. Una vez que el formato es automático e idéntico para todos, desaparece por completo de la revisión de código.

## Ajustes del sistema

Tres que valen los dos minutos:

**Repetición de teclas.** Ajustes → Teclado: la velocidad de repetición al máximo, el retardo al mínimo. Mantener una tecla para moverte por una línea es algo que haces cientos de veces al día.

**Mantener presionado.** Viene activado para mostrar el menú de acentos, lo que hace que mantener una tecla no sirva de nada en un editor:

```bash
defaults write -g ApplePressAndHoldEnabled -bool false
```

**Capturas en otro lugar que no sea el Escritorio**, salvo que disfrutes un Escritorio hecho enteramente de capturas:

```bash
mkdir -p ~/Pictures/Screenshots
defaults write com.apple.screencapture location ~/Pictures/Screenshots
killall SystemUIServer
```

## Git

Configura la identidad y un par de valores por defecto antes del primer commit, no después:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@ejemplo.com"
git config --global init.defaultBranch main
git config --global pull.rebase true
```

`pull.rebase true` es el opinionado. Mantiene un historial lineal en lugar de sembrar commits de merge cada vez que haces pull, lo que hace que el log se pueda leer después.

Si firmas tus commits, configúralo también ahora: es mucho más molesto hacerlo a posteriori.

## Y ya

Todo toma unos veinte minutos, la mayoría esperando descargas. Lo demás —las herramientas propias de cada proyecto, los dotfiles que llevas años cargando— se acomoda encima de esto sin mayor problema.
