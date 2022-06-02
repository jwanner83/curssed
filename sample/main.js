import { render } from '../src/cssed.js'

render(
    document.querySelector('#app'),
    `
    .wrapper {
        height: 400px;
        width: 600px;
        background: black;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        padding: 40px;
    } 
    
    .wrapper .title[h1] {
        color: white;
        content: "Hoihoi";
        font-size: 100px;
    }
    
    .wrapper .content[p] {
        content: "Da isch so sau unnötig aber unglaublich lustig";
        color: white;
    }
    `
)