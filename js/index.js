import { init, loadI18n, base } from "./global.js";

// const hrefs =
// {
//     help: 'help.html',
//     give: 'give.html',
//     locate: 'locate.html'
// }

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

    // Listener for buttons
    const btns = document.querySelectorAll('.game-button[data-type]');
    if (btns.length > 0)
    {
        btns.forEach(function(element)
        {
            const btnType = element.dataset.type;
            if (btnType)    // && hrefs && hrefs[btnType])
            {
                element.addEventListener('click', function()
                {
                    window.location.href = pagesUrl + btnType + '.html';    // pagesUrl + hrefs[btnType];
                });
            }
        });
    }
}