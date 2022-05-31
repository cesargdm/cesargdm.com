import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  :root {
    --colors--tint: #DD5256;
    --colors--background: #fff;
    --colors--border: #ddd;
    --colors--background-secondary: #fcfcfc;
    --colors--text: #111;
    
    --sizes--content_max_width: 900px;
    --sizes--nav_height: 50px;
  }

  /* Change root vars when prefers dark */
  @media (prefers-color-scheme: dark) {
    :root {
      --colors--tint: #DD5256;
      --colors--background: #111;
      --colors--border: #333;
      --colors--background-secondary: #222;
      --colors--text: #fff;
    }
  }
  
  html {
    background-color: var(--colors--background);
  }

  html, li, p, body {
    font-family: 'Inter', Helvetica, sans-serif;
    color: var(--colors--text);
    
  }

  a {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 40px;
    min-height: 40px;

    &:hover {
      opacity: 0.7;
    }
  }

  p {
    margin-bottom: 10px;
    line-height: 1.3;
  }

  h1 {
    font-size: 1.7rem;
    font-weight: 700;
    margin: 10px 0 20px;
  }

  h2 {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 5px 0 10px;
  }

  pre {
    background-color: #242B2E;
    color: white;
    font-family: 'Fira Code', consolas, monospace;
    width: 100%;
    border-radius: 4px;
    padding: 15px;
    margin: 20px 0;
  }

  button, input[type="submit"] {
    will-change: transform;
    transform: scale(1);
    transition: transform ease 0.1s;
    min-height: 40px;
    min-width: 40px;
    border-radius: 10px;

    &:hover {
      background-color: rgba(0,0,0,0.05);
    }

    &:active {
      opacity: 0.5; 
      /* transform: scale(0.9); */
    }
  }
`

export default GlobalStyles
