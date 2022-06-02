import {render} from '../src/cssed.js'

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
        padding: 30px 30px 26px;
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
    `
)