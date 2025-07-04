let currLang = localStorage.getItem('lang') || 'zh';
let tooltipContainer;
let isDev = !window.location.origin.includes('https://mapleandmayfly.github.io');
export const base = isDev ? '/' : 'https://mapleandmayfly.github.io/MinecraftCommandGenerator/';

const i18n =
{
    zh:
    {
        // page titles
        'page.main': '主页 - MC指令生成器',
        'page.give': 'give指令 - MC指令生成器',
        // header.html
        'languageTitle': '语言:',
        'editionTitle': '发行版:',
        'versionTitle': '版本号:',
        'currLang': '简体中文',
        'java': 'Java',
        'bedrock': '基岩',
        // index.html
        'index.top': '置顶',
        // give.html
        'give.mainItem': '给予的物品'
    },
    en:
    {
        // page titles
        'page.main': 'Main Page - MC Command Generator',
        'page.give': 'give - MC Command Generator',
        // header.html
        'languageTitle': 'Language:',
        'editionTitle': 'Edition:',
        'versionTitle': 'Version:',
        'currLang': 'English',
        'java': 'Java',
        'bedrock': 'Bedrock',
        // index.html
        'index.top': 'Top',
        // give.html
        'give.mainItem': 'Item Given'
    }
}

const tooltip =
{
    zh:
    {
        'desc.give': '将物品给予实体',
        'desc.locate': '定位群系或结构',
        'tip.openSelector': '点击打开物品选择器',
        'tip.closeSelector': '点击关闭物品选择器'
    },
    en:
    {
        'desc.give': 'Give item to entity',
        'desc.locate': 'Locate boime or structure',
        'tip.openSelector': 'Click to open item selector',
        'tip.closeSelector': 'Click to close item selector'
    }
}

/**
 * Initializing function for all pages
 * @param {Function} additionalFunction Another function for initializing
 * @param {boolean} needItemSelector Whether or not current page uses MCG Item Selector
 */
export function init(additionalFunction = null, needItemSelector = false)
{
    let pagesUrl = base + 'pages/';
    // Ensure the whole page translated
    Promise.all(
    [
        loadHeader(pagesUrl),
        loadItemSelector(pagesUrl, base, needItemSelector)
    ]).then(() => onInit(additionalFunction));
}

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

        initDropdownMenus();
        initThemeSwitcher();
    }
    catch (error)
    {
        console.error('Header loading failed!\n' + error);
    }
}

async function loadItemSelector(pagesUrl, base, needItemSelector)
{
    if (!needItemSelector) return;
    try
    {
        const response = await fetch(pagesUrl + 'common/inventory.html');
        const html = await response.text();
        const script = document.createElement('script');
        script.src = base + 'js/inventory.js';
        script.type = 'module';
        document.body.appendChild(script);

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const itemSelector = doc.querySelector('#MCG-item-selector').content.cloneNode(true);
        document.querySelectorAll('.item-selector')
            .forEach(selector => selector.appendChild(itemSelector));

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = base + 'css/inventory.css';
        document.head.appendChild(link);
    }
    catch (error)
    {
        console.error('Inventory Selector loading failed!\n' + error);
    }
}

function onInit(additionalFunction)
{
    // Run additional initializing functions
    if (typeof additionalFunction === 'function') additionalFunction();
    else if (!additionalFunction)
        console.error('Type of additionalFunction expected to be Function, but ' + typeof(additionalFunction) + ' found.');

    initTooltip();
    initLanguage();
}

function initLanguage()
{
    currLang = localStorage.getItem('lang') || 'zh';
    document.querySelectorAll('[data-i18n]').forEach(function(element)
    {
        const key = element.getAttribute('data-i18n');
        element.textContent = i18n[currLang][key] || 'Error: Key [' + key + '] not found in i18n!';
    });
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
            currLang = this.getAttribute('data-value');
            localStorage.setItem('lang', currLang);
            initLanguage();

            console.log('Language switched to: ' + currLang);
        });
    });

    // Listener for edition switching button
    document.querySelectorAll('.edition-option').forEach(function(item)
    {
        item.addEventListener('click', function(e)
        {
            e.preventDefault();
            let currEdition = this.getAttribute('data-i18n');
            let elementToChange = document.getElementById('current-edition');

            elementToChange.setAttribute('data-i18n', currEdition);
            elementToChange.textContent = i18n[currLang][currEdition];
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

function initTooltip()
{
    tooltipContainer = document.getElementById('tooltip');

    // Listener for elements with tooltip
    document.querySelectorAll('[data-tooltip]').forEach(function(element)
    {
        element.addEventListener('mouseenter', () => setTooltipAuto(element));
        element.addEventListener('mousemove', e => moveTooltip(e));
        element.addEventListener('mouseleave', () => hideTooltip());
    });
}

export function setTooltip(html = 'Error: No text set for tooltip!')
{
    tooltipContainer.innerHTML = html;
    tooltipContainer.classList.remove('hide');
}
export function setTooltipAuto(element)
{
    let key = element.dataset.tooltip;
    setTooltip(tooltip[currLang][key] || 'Error: Key [' + key + '] not found in tooltip!');
}
export function hideTooltip()
{
    tooltipContainer.classList.add('hide');
}
export function moveTooltip(event)
{
    tooltipContainer.style.left = (event.clientX + 4) + 'px';
    tooltipContainer.style.top = (event.clientY - 48) + 'px';
}