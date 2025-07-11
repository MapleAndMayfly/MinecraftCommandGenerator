import { mergeI18n, mergeTooltip, updateText, changeIcon, base } from "./global.js";

const tabListTooltip =
{
  zh:
  {
    'desc.tab.top.1': '建筑方块',
    'desc.tab.top.2': '染色方块',
    'desc.tab.top.3': '自然方块',
    'desc.tab.top.4': '功能方块',
    'desc.tab.top.5': '红石方块',
    'desc.tab.top.6': '已保存的快捷栏',
    'desc.tab.top.7': '搜索物品',
    'desc.tab.bottom.1': '工具与实用物品',
    'desc.tab.bottom.2': '战斗用品',
    'desc.tab.bottom.3': '食物与饮品',
    'desc.tab.bottom.4': '原材料',
    'desc.tab.bottom.5': '刷怪蛋',
    'desc.tab.bottom.6': '管理员用品',
    'desc.tab.bottom.7': '生存模式物品栏'
  },
  en:
  {
    'desc.tab.top.1': 'Building Blocks',
    'desc.tab.top.2': 'Colored Blocks',
    'desc.tab.top.3': 'Natural Blocks',
    'desc.tab.top.4': 'Functional Blocks',
    'desc.tab.top.5': 'Redstone Blocks',
    'desc.tab.top.6': 'Saved Hotbars',
    'desc.tab.top.7': 'Search Items',
    'desc.tab.bottom.1': 'Tools & Utilities',
    'desc.tab.bottom.2': 'Combat',
    'desc.tab.bottom.3': 'Food & Drinks',
    'desc.tab.bottom.4': 'Ingredients',
    'desc.tab.bottom.5': 'Spawn Eggs',
    'desc.tab.bottom.6': 'Operator Utilities',
    'desc.tab.bottom.7': 'Survival Inventory'
  }
};

const i18n =
{
  zh:
  {
    'placeholder.tab.search': '输入文本以搜索...'
  },
  en:
  {
    'placeholder.tab.search': 'Enter text to search...'
  }
}

const titleStyle =
{
    zh: 'color: #333; font-size: 22px; margin-top: 4px;',
    en: 'color: #333; font-size: 25px'
};

initItemSelector();

function initItemSelector()
{
    mergeTooltip(tabListTooltip);

    // Generate and merge i18n
    initTabTitleI18n();
    document.querySelectorAll('.tab-title').forEach(element => updateText(element));
    document.querySelectorAll('.tab-search').forEach(element => updateText(element));

    // Init tab buttons
    initButtonSet();
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(function(button)
    {
        // Listener for tab buttons
        button.addEventListener('mousedown', function()
        {
            tabButtons.forEach(function(btn)
            {
                btn.classList.remove('active');
                btn.parentElement.classList.remove('active');
            });
            this.classList.add('active');
            this.parentElement.classList.add('active');

            // Change background when it's Search Item Tab
            if (this.dataset.tooltip === 'desc.tab.top.7')
            {
                document.querySelector('.tab-search').classList.remove('hide');
            }
            else
            {
                document.querySelector('.tab-search').classList.add('hide');
            }

            Array.from(document.querySelectorAll('.tab-title'))
                 .filter(el => !el.classList.contains('hide'))
                 .forEach(element => updateText(element, this.dataset.tooltip));
        });

        // Disable Survival Inventory Button
        if (button.dataset.tooltip === 'desc.tab.bottom.7')
        {
            button.disabled = true;
        }


        // Init button icon
        let icon = button.querySelector('img');
        if (icon)
        {
            let src = button.dataset.icon;
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
                console.error('Bad image URL: ' + src);
                src = 'item/empty_slot_sword.png';
            }

            icon.src = base + 'assets/images/' + src;
        }
        else
        {
            console.error(`Icon for item button [${button.dataset.id}] not found!`);
        }
    });
}

function initTabTitleI18n()
{
    const tabTitleI18n =
    {
      zh: {},
      en: {}
    };

    for (const lang in tabListTooltip)
    {
        for (const key in tabListTooltip[lang])
        {
            tabTitleI18n[lang][key] = `<span style="${titleStyle[lang]}">${tabListTooltip[lang][key]}</span>`;
        }
    }
    mergeI18n(tabTitleI18n);
    mergeI18n(i18n);
}

function initButtonSet()
{
    const rows = 5;
    const cols = 9;
    const tabItems = document.querySelectorAll('.tab-items');
    for (let r = 0; r <= rows; r++)
    {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'tab-row';
        for (let c = 0; c < cols; c++)
        {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'slot';
            slotDiv.innerHTML = `
            <button class="slot-button" data-id="" data-icon="item/empty_slot_sword.png">
                <img src="">
            </button>`;
            rowDiv.appendChild(slotDiv);
        }
        if (r === rows) document.querySelectorAll('.tab-hotbar').forEach(element => element.appendChild(rowDiv))
        else tabItems.forEach(element => element.appendChild(rowDiv));
    }
    document.querySelectorAll('.slot-button').forEach(element => changeIcon(element, element.dataset.icon));
}
