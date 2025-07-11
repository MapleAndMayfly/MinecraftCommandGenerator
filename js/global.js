let lang = localStorage.getItem('lang') || 'zh';
let tooltipContainer;
let isDev = !window.location.origin.includes('https://mapleandmayfly.github.io');
export const base = isDev ? '/' : 'https://mapleandmayfly.github.io/MinecraftCommandGenerator/';

const i18n =
{
  zh:
  {
    'title.language': '语言:',
    'title.edition': '发行版:',
    'title.version': '版本号:',
    'option.lang': '简体中文',
    'option.java': 'Java',
    'option.bedrock': '基岩'
  },
  en:
  {
    'title.language': 'Language:',
    'title.edition': 'Edition:',
    'title.version': 'Version:',
    'option.lang': 'English',
    'option.java': 'Java',
    'option.bedrock': 'Bedrock'
  }
}

const tooltip =
{
  zh:
  {
    'tip.beforeAll': '<span class="tip-text zh normal" style="margin-top: 16px">',
    'tip.afterAll': '</span>',
    'tip.openItemSelector': '点击打开物品选择器',
    'tip.closeItemSelector': '点击关闭物品选择器'
  },
  en:
  {
    'tip.beforeAll': '<span class="tip-text en normal">',
    'tip.afterAll': '</span>',
    'tip.openItemSelector': 'Click to open item selector',
    'tip.closeItemSelector': 'Click to close item selector'
  }
}

/**
 * Initializing function for all pages
 * @param {Function} additionalFunction Additional functions for initializing
 * @param {boolean} needItemSelector Whether or not current page uses MCG Item Selector
 */
export function init(additionalFunction = null, needItemSelector = false)
{
    let pagesUrl = base + 'pages/';
    Promise.all(
    [
        loadHeader(pagesUrl),
        loadItemSelector(pagesUrl, base, needItemSelector)
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
        console.error(`Type of additionalFunction expected to be Function, but ${typeof(additionalFunction)} found.`);

    // Init tooltip
    tooltipContainer = document.getElementById('tooltip');
    document.querySelectorAll('[data-tooltip]').forEach(function(element)
    {
        element.addEventListener('mouseenter', function()
        {
            let key = element.dataset.tooltip;
            let text = tooltip[lang][key] || `<span style="color: red">Error: Key [${key}] not found in tooltip!</span>`;
            let html = tooltip[lang]['tip.beforeAll'] + text + tooltip[lang]['tip.afterAll'];
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
            currEdtnLabel.textContent = i18n[lang][currEdition];
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

function initLanguage(currLang)
{
    lang = currLang;
    let prevLang = localStorage.getItem('lang') || 'zh';
    localStorage.setItem('lang', lang);

    tooltipContainer.classList.remove(prevLang);
    tooltipContainer.classList.add(lang);

    document.querySelectorAll('[data-i18n]').forEach(element => updateText(element));
}

/* ===================================== Interface part ===================================== */
/**
 * Merge additional i18n entries into global i18n
 * @param {Object} additionalI18n Object with the same structure as global i18n
 */
export function mergeI18n(additionalI18n)
{
    if (!additionalI18n || !typeof additionalI18n === 'object')
    {
        console.error('Invalid type for i18n: ' + additionalI18n);
        return;
    }
    for (const langKey in additionalI18n)
    {
        if (!additionalI18n.hasOwnProperty(langKey))
        {
            console.error('Invalid structure for i18n: ' + additionalI18n);
            return;
        }
        const entries = additionalI18n[langKey];
        for (const key in entries)
        {
            if (!entries.hasOwnProperty(key))
            {
                console.error('Invalid structure for i18n: ' + additionalI18n);
                return;
            }
            if (!i18n[langKey])
            {
                console.error('Not supported language code for i18n: ' + langKey);
                return;
            }
            if (i18n[langKey][key])
            {
                console.error('Repeated key for i18n: ' + key);
                return;
            }
            i18n[langKey][key] = entries[key];
        }
    }
}
/**
 * Merge additional tooltip entries into global tooltip
 * @param {Object} additionalTooltip Object with the same structure as global tooltip
 */
export function mergeTooltip(additionalTooltip)
{
    if (!additionalTooltip || typeof additionalTooltip !== 'object')
    {
        console.error('Invalid type for tooltip: ' + additionalTooltip);
        return;
    }
    for (const langKey in additionalTooltip)
    {
        if (!additionalTooltip.hasOwnProperty(langKey))
        {
            console.error('Invalid structure for tooltip: ' + additionalTooltip);
            return;
        }
        const entries = additionalTooltip[langKey];
        for (const key in entries)
        {
            if (!entries.hasOwnProperty(key))
            {
                console.error('Invalid structure for tooltip: ' + additionalTooltip);
                return;
            }
            if (!tooltip[langKey])
            {
                console.error('Not supported language code for tooltip: ' + langKey);
                return;
            }
            if (tooltip[langKey][key])
            {
                console.error('Repeated key for tooltip: ' + key);
                return;
            }
            tooltip[langKey][key] = entries[key];
        }
    }
}

/**
 * Change text content based on i18n
 * @param {Element} element The element to change text
 * @param {string} key The i18n key for the text, keep origin if not defined
 */
export function updateText(element, key = null)
{
    if (key) element.dataset.i18n = key;
    else key = element.dataset.i18n;

    if (element.tagName === 'INPUT' && element.type === 'text')
    {
        element.placeholder = i18n[lang][key] || '_';
    }
    else
    {
        element.innerHTML = i18n[lang][key] || `<span style="color: red">Error: Key [${key}] not found in i18n!</span>`;;
    }
}
/**
 * Change tooltip instantly rather than mouse leave & enter
 * @param {Element} element The element tooltip based on
 * @param {string} key The tooltip key for update, keep origin if not defined
 */
export function updateTooltip(element, key = null)
{
    if (key) element.dataset.tooltip = key;
    else key = element.dataset.tooltip;
    let text = tooltip[lang][key] || `<span style="color: red">Error: Key [${key}] not found in tooltip!</span>`;
    let html = tooltip[lang]['tip.beforeAll'] + text + tooltip[lang]['tip.afterAll'];
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
        console.error(`'Icon for item button [${button.dataset.id}] not found!'`);
    }
}