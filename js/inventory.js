import { setTooltip, hideTooltip, moveTooltip, base } from "./global.js";

const invTabList =
{
    zh:
    [ '建筑方块', '染色方块', '自然方块', '功能方块', '红石方块', '已保存的快捷栏', '搜索物品',
      '工具与实用物品', '战斗用品', '食物与饮品', '原材料', '刷怪蛋', '管理员用品', '生存模式物品栏'
    ],
    en:
    [ 'Building Blocks', 'Colored Blocks', 'Natural Blocks', 'Functional Blocks',
      'Redstone Blocks', 'Saved Hotbars', 'Search Items', 'Tools & Utilities', 'Combat',
      'Food & Drinks', 'Ingredients', 'Spawn Eggs', 'Operator Utilities', 'Survival Inventory'
    ]
};

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

        if (this.dataset.id === '6')
        {
            document.querySelector('.tab-items > div').classList.add('with-search');
        }
        else
        {
            document.querySelector('.tab-items > div').classList.remove('with-search');
        }
    });

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
        console.error('Icon for item button [' + button.dataset.id + '] not found!');
    }

    // Init tooltip
    button.addEventListener('mouseenter', function()
    {
        let currLang = localStorage.getItem('lang') || 'zh';
        let idx = this.dataset.id;
        setTooltip(invTabList[currLang][idx] || 'Error: Id [' + idx + '] not defined in invTabList!');
    });
    button.addEventListener('mousemove', e => moveTooltip(e));
    button.addEventListener('mouseleave', () => hideTooltip());
});

if(tabButtons.length > 0)
{
    tabButtons[0].classList.add('active');
    tabButtons[0].parentElement.classList.add('active');
}
