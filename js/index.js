import { init, loadI18n, base } from "./global.js";

init(onInit);

async function onInit()
{
    await loadI18n('index', 'text');
    await loadI18n('index', 'tooltip');
    initButtons();
}

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