import { render } from '../src/cssed.js'

render(
    document.querySelector('#app'),
    `
    .wrapper[div] {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;   
        background: black;
    }
    
    .wrapper .content {
        width: 600px;
        padding: 30px;
        border: 3px solid white;
        border-radius: 5px;
        background: #cecece;
        font-family: monospace;
        margin: 40px;
    }
    
    .wrapper .content .title[h1] {
        color: black;
        margin-top: 2px;
        margin-bottom: 8px;
        font-size: 40px;
        content: "cssed";
    }
    
    .wrapper .content .message[p] {
        color: #6a6a6a;
        margin-bottom: 0;
        font-size: 16px;
        line-height: 22px;
        content: "the complete css framework";
    }
    
    .wrapper .content .get-started[h2] {
        content: "Getting started";
        margin-top: 40px;
    }
    
    .wrapper .content .code {
        margin-top: 18px;
        background: #c4c4c4;
        border-radius: 5px;
        padding: 16px;
    }
    
    .wrapper .content .code .first {
        content: "import { render } from 'cssed'<br><br>render(<br>";
    }
    
    .wrapper .content .code .second {
        margin-left: 20px;
        content: "document.querySelector('#app'),<br>\`<br>.wrapper {<br>";
    }
    
    .wrapper .content .code .third {
        margin-left: 40px;
        content: "content: \'hello world\';<br>color: blue;<br>";
    }
    
    .wrapper .content .code .second {
        content: "}<br>\`<br>";
    }
    
    .wrapper .content .code .first {
        content: "}";
    }
    `
)