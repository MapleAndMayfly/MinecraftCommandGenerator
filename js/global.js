let lang = localStorage.getItem('lang') || 'zh';
let tooltipContainer;
let supportedLang = ['zh', 'en'];

let isDev = !window.location.origin.includes('https://mapleandmayfly.github.io');
export const base = isDev ? '/' : 'https://mapleandmayfly.github.io/MinecraftCommandGenerator/';

const text = {};
const tooltip = {};
const tooltipAttr =
{
    zh: 'class="tip-text zh normal" style="margin-top: 16px"',
    en: 'class="tip-text en normal"'
}

/**
 * Initializing function for all pages
 * @param {Function} additionalFunction Additional functions for initializing
 */
export function init(additionalFunction = null)
{
    console.log('Dev mode: ' + isDev);

    let pagesUrl = base + 'pages/';
    supportedLang.forEach(function(langCode)
    {
        text[langCode] = {};
        tooltip[langCode] = {};
    });

    Promise.all(
    [
        loadHeader(pagesUrl),
        loadItemSelector(pagesUrl, base),
        loadI18n('global', 'text'),
        loadI18n('global', 'tooltip')
    ]).then(() => onInit(additionalFunction));
}

/* ===================================== Initializing part ===================================== */
async function loadHeader(pagesUrl)
{
    try
    {
        const response = await fetch(pagesUrl + 'common/header.html');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const headerBar = doc.querySelector('#MCG-header').content.cloneNode(true);
        document.getElementById('header').appendChild(headerBar);

        document.getElementById('title-image').src = base + 'assets/images/title.png';
        document.getElementById('title-link').href = base;
        initDropdownMenus();
        initThemeSwitcher();
    }
    catch (error)
    {
        console.error('Header loading failed!\n' + error);
    }
}

async function loadItemSelector(pagesUrl, base)
{

    const targets = document.querySelectorAll('.item-selector');
    if (targets.length <= 0) return;
    try
    {
        const response = await fetch(pagesUrl + 'common/itemSelector.html');
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const model = doc.querySelector('#MCG-item-selector').content;
        targets.forEach(function(selector)
        {
            const itemSelector = model.cloneNode(true);
            selector.appendChild(itemSelector);
        });

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = base + 'css/itemSelector.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = base + 'js/itemSelector.js';
        script.type = 'module';
        document.body.appendChild(script);
    }
    catch (error)
    {
        console.error('Item Selector loading failed!\n' + error);
    }
}

async function onInit(additionalFunction)
{
    // Run additional initializing functions
    if (typeof additionalFunction === 'function') await additionalFunction();
    else if (!additionalFunction)
        console.error(`Type of additionalFunction expected to be Function, but ${typeof(additionalFunction)} found.`);

    // Init tooltip
    tooltipContainer = document.getElementById('tooltip');
    document.querySelectorAll('[data-tooltip]').forEach(function(element)
    {
        element.addEventListener('mouseenter', function()
        {
            let key = element.dataset.tooltip;
            if (key === '') return;             // Skip empty tooltip

            let text = tooltip[lang][key] || `<span style="color: red">Error: Key [${key}] not found in tooltip!</span>`;
            let html = `<span ${tooltipAttr[lang]}>${text}</span>`;
            tooltipContainer.innerHTML = html;
            tooltipContainer.classList.remove('hide');
        });
        element.addEventListener('mousemove', function(event)
        {
            tooltipContainer.style.left = (event.clientX + 16) + 'px';
            tooltipContainer.style.top = (event.clientY - 48) + 'px';
        });
        element.addEventListener('mouseleave', () => tooltipContainer.classList.add('hide'));
    });

    initLanguage(lang);
}

function initDropdownMenus()
{
    // Listener for dropdown menus
    document.querySelectorAll('.dropdown-button').forEach(function(button)
    {
        button.addEventListener('click', function(event)
        {
            event.stopPropagation();
            const menu = this.nextElementSibling;
            const isOpen = !menu.classList.contains('hide');
            document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hide'));

            if (!isOpen) menu.classList.remove('hide');
        });
    });

    // Listener for language switching menu
    document.querySelectorAll('.lang-option').forEach(function(item)
    {
        item.addEventListener('click', function(e)
        {
            e.preventDefault();
            initLanguage(this.dataset.value);

            console.log('Language switched to: ' + lang);
        });
    });

    // Listener for edition switching button
    document.querySelectorAll('.edition-option').forEach(function(item)
    {
        item.addEventListener('click', function(e)
        {
            e.preventDefault();
            let currEdition = this.dataset.i18n;
            let currEdtnLabel = document.getElementById('current-edition');

            currEdtnLabel.dataset.i18n = currEdition;
            currEdtnLabel.textContent = text[lang][currEdition];
            localStorage.setItem('edition', currEdition);

            console.log('Edition switched to: ' + currEdition);
        });
    });

    // Reset dropdown menus
    document.addEventListener('click', function()
    {
        document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hide'));
    });
}

function initThemeSwitcher()
{
    let currMode = localStorage.getItem('display-mode') || 'light';
    if (currMode === 'light')
    {
        document.body.classList.remove('dark-mode');
    }
    else
    {
        document.body.classList.add('dark-mode');
    }

    const btn = document.querySelector('.display-mode-button');
    if (btn)
    {
        const sun = btn.querySelector('.light-mode');
        const moon = btn.querySelector('.dark-mode');
        if (currMode === 'light')
        {
            sun.classList.remove('hide');
            moon.classList.add('hide');
        }
        else
        {
            sun.classList.add('hide');
            moon.classList.remove('hide');
        }

        // Listener for theme switching button
        btn.addEventListener('click', function()
        {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode'))
            {
                sun.classList.add('hide');
                moon.classList.remove('hide');
                localStorage.setItem('display-mode', 'dark');
            }
            else
            {
                sun.classList.remove('hide');
                moon.classList.add('hide');
                localStorage.setItem('display-mode', 'light');
            }
            console.log('Display mode switched to: ' + localStorage.getItem('display-mode'));
        });
    }
}

/* Here lies a little bug that each time we change language
 * will cause dynamic styles for different languages not to
 * be added into pages(such as tab titles of item selectors).
 * We may fix it by calling some additional functions when
 * initLanguage() is called, but I think it makes little
 * differences to this project so I let it go. If you notice
 * this bug and think it essential to be fixed, you can try
 * completing it yourself or simply tell me, thanks!
 */
function initLanguage(currLang)
{
    lang = currLang;
    let prevLang = localStorage.getItem('lang') || 'zh';
    localStorage.setItem('lang', lang);

    tooltipContainer.classList.remove(prevLang);
    tooltipContainer.classList.add(lang);

    document.querySelectorAll('[data-i18n]').forEach(element => updateText(element));
}

/* ===================================== Interfaces ===================================== */

/**
 * Load & merge i18n data
 * @param {string} filename filename without extensions
 * @param {string} type type of i18n, 'text'|'tooltip'
 */
export async function loadI18n(filename, type = 'text')
{
    if (type !== 'text' && type !== 'tooltip')
    {
        console.error('Invalid i18n type: ' + type,);
        return;
    }

    const targetObject = type === 'text' ? text : tooltip;

    // Load for all supported languages
    for (const langCode of supportedLang)
    {
        const data = await loadI18nFromFile(filename, type, langCode);

        // Merge i18n data
        for (const key in data)
        {
            if (data.hasOwnProperty(key))
            {
                if (targetObject[langCode][key])
                {
                    console.warn(`Duplicate key found in ${type}: ${key}`);
                }
                targetObject[langCode][key] = data[key];
            }
        }
    }
}

/**
 * Change text content based on text
 * @param {Element} element The element to change text
 * @param {string} key The text key for the text, keep origin if not defined
 */
export function updateText(element, key = null)
{
    if (key) element.dataset.i18n = key;
    else key = element.dataset.i18n;

    if (element.tagName === 'INPUT' && element.type === 'text')
    {
        element.placeholder = text[lang][key] || '_';
    }
    else
    {
        element.innerHTML = text[lang][key] || `<span style="color: red">Error: Key [${key}] not found in text!</span>`;
    }
}

/**
 * Update text with custom style for inventory tab titles
 * @param {Element} element The element to change text
 * @param {string} key The text key for the text
 * @param {string} style The CSS style to apply
 */
export function updateTextWithStyle(element, key, style)
{
    const textContent = text[lang][key];
    if (textContent)
    {
        element.dataset.i18n = key;
        element.innerHTML = `<span style="${style}">${textContent}</span>`;
    }
    else
    {
        element.innerHTML = `<span style="color: red">Error: Key [${key}] not found in text!</span>`;
    }
}

/**
 * Change tooltip instantly rather than mouse leave & enter
 * @param {Element} element The element tooltip based on
 * @param {string} key The tooltip key for update, keep origin if left empty
 */
export function updateTooltip(element, key = null)
{
    if (key) element.dataset.tooltip = key;
    else key = element.dataset.tooltip;
    let text = tooltip[lang][key] || `<span style="color: red">Error: Key [${key}] not found in tooltip!</span>`;
    let html = `<span ${tooltipAttr[lang]}>${text}</span>`;
    tooltipContainer.innerHTML = html;
}

/**
 * Change button icons for selectors or similar
 * @param {Element} button The button that changes icon
 * @param {string} src Path to the icon image
 * @returns 
 */
export function changeIcon(button, src)
{
    let icon = button.querySelector('img');
    if (icon)
    {
        if (src.length === 0)
        {
            icon.src = '';
            return;
        }
        button.dataset.icon = src;

        if (src.startsWith('item'))
        {
            icon.classList.add('pixel');
        }
        else if (src.startsWith('block'))
        {
            icon.classList.remove('pixel');
        }
        else
        {
            icon.classList.add('pixel');
            icon.src = base + 'assets/images/item/barrier.png';
            console.error('Bad image URL: ' + src);
            return;
        }

        icon.src = base + 'assets/images/' + src;
    }
    else
    {
        console.error(`Icon for item button [${button.dataset.id}] not found!`);
    }
}

/* ===================================== Misc ===================================== */

/**
 * Load i18n fron json files
 * @param {string} filename filename without extensions
 * @param {string} type type of i18n, 'text'|'tooltip'
 * @param {string} currentLang The language to load
 * @returns {Promise<Object>} I18n data
 */
async function loadI18nFromFile(filename, type, currentLang)
{
    try
    {
        const response = await fetch(`${base}json/i18n/${type}/${currentLang}/${filename}.json`);
        if (!response.ok)
        {
            console.warn(`Failed to load ${type} file [${filename}.json] for language [${currentLang}]`);
            return {};
        }
        return await response.json();
    }
    catch (error)
    {
        console.error(`Error loading ${type} file [${filename}.json] for language [${currentLang}]!`, error);
        return {};
    }
}