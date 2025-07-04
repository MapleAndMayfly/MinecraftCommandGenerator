import { init, base } from "./global.js";
let selectedLang = localStorage.getItem('lang') || 'zh';

init(initButtons);

function initButtons()
{
    let pagesUrl = base + 'pages/';

    // Listener for give button
    const giveButtons = document.querySelectorAll('.btn-give');
    if (giveButtons.length > 0)
    {
        giveButtons.forEach(function(element)
        {
            element.addEventListener('click', function()
            {
                window.location.href = pagesUrl + 'give.html';
            });
        });
    }

    // Listener for locate button
    const locateButtons = document.querySelectorAll('.btn-locate');
    if (locateButtons.length > 0)
    {
        locateButtons.forEach(function(element)
        {
            element.addEventListener('click', function()
            {
                window.location.href = pagesUrl + 'locate.html';
            });
        });
    }
}