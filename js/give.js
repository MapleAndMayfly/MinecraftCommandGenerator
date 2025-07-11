import { init, mergeI18n, updateTooltip, changeIcon } from "./global.js";
let selectedLang = localStorage.getItem('lang') || 'zh';

const i18n =
{
  zh:
  {
    'page.give': 'give指令 - MC指令生成器',
    'give.mainItem': '给予的物品'
  },
  en:
  {
    'page.give': 'give - MC Command Generator',
    'give.mainItem': 'Item Given'
  }
}

init(onInit, true);

function onInit()
{
    mergeI18n(i18n);
    initButtons();
}

function initButtons()
{
    document.querySelectorAll('.slot-button.with-selector').forEach(function(button)
    {
        changeIcon(button, 'item/empty_slot_sword.png');

        // Listener for slot button
        button.addEventListener('click', function()
        {
            let itemSelector = document.getElementById(this.dataset.id);
            itemSelector.classList.toggle('hide');
            if (this.dataset.icon === 'item/empty_slot_sword.png')
            {
                updateTooltip(this, itemSelector.classList.contains('hide') ? 'tip.openItemSelector' : 'tip.closeItemSelector');
            }
        });
    });
}