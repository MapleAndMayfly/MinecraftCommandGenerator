import { init, mergeI18n, mergeTooltip, base } from "./global.js";
let selectedLang = localStorage.getItem('lang') || 'zh';

const i18n =
{
  zh:
  {
    'page.index': '主页 - MC指令生成器',
    'index.top': '置顶'
  },
  en:
  {
    'page.index': 'Main Page - MC Command Generator',
    'index.top': 'Top'
  }
}

const tooltip =
{
  zh:
  {
    'desc.give': '将物品给予实体',
    'desc.locate': '定位群系或结构'
  },
  en:
  {
    'desc.give': 'Give item to entity',
    'desc.locate': 'Locate boime or structure'
  }
}

init(onInit);

function onInit()
{
    mergeI18n(i18n);
    mergeTooltip(tooltip);
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