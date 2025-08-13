import { loadI18n, updateText, updateTextWithStyle, updateTooltip, changeIcon, base } from "./global.js";

const titleStyle =
{
    zh: 'color: #333; font-size: 22px; margin-top: 4px;',
    en: 'color: #333; font-size: 25px'
};

const tabTopIcons =
[
    "block/bricks.png",
    "block/cyan_wool.png",
    "block/grass_block.png",
    "item/oak_sign.png",
    "item/redstone.png",
    "block/bookshelf.png",
    "item/compass.png"
];

const tabBottomIcons =
[
    "item/diamond_pickaxe.png",
    "item/netherite_sword.png",
    "item/golden_apple.png",
    "item/iron_ingot.png",
    "item/pig_spawn_egg.png",
    "block/impulse_command_block.gif",
    "block/chest.png"
];

export async function initItemSelector()
{
    await loadI18n('itemSelector', 'text');
    await loadI18n('itemSelector', 'tooltip');

    loadToggleBtn();
    loadTabBtn();
    loadButtonSet();
    document.querySelectorAll('.tab-search').forEach(element => updateText(element));
}

function loadToggleBtn()
{
    document.querySelectorAll('.item-selector').forEach(function(element)
    {
        const button = element.querySelector('.slot.with-margin').querySelector('button');
        changeIcon(button, 'item/empty_slot_sword.png');

        // Listener for buttons
        button.addEventListener('click', function()
        {
            let inventory = element.querySelector('.inventory');
            if (inventory)
            {
                inventory.classList.toggle('hide');
                if (this.dataset.icon === 'item/empty_slot_sword.png')
                {
                    updateTooltip(this, inventory.classList.contains('hide') ? 'tip.openItemSelector' : 'tip.closeItemSelector');
                }
                
                if (!inventory.classList.contains('hide'))
                {
                    const currentLang = localStorage.getItem('lang') || 'zh';
                    const title = element.querySelector('.tab-title');
                    if (title)
                    {
                        updateTextWithStyle(title, title.dataset.i18n, titleStyle[currentLang]);
                    }
                }
            }
            else
            {
                console.error(`Item selector with id [${element.id}] not found!`);
            }
        });
    });
}

function loadTabBtn()
{
    // Create buttons for top tab list
    const tabTop = document.querySelector('.tab-list.tab-top');
    const topUl = [document.createElement('ul'), document.createElement('ul')];
    tabTopIcons.forEach(function(icon, idx)
    {
        const li = createTabButton(icon, idx, true, idx === 0);
        topUl[idx < 5 ? 0 : 1].appendChild(li);
    });
    tabTop.append(...topUl);

    // Create buttons for bottom tab list
    const tabBottom = document.querySelector('.tab-list.tab-bottom');
    const bottomUl = [document.createElement('ul'), document.createElement('ul')];
    tabBottomIcons.forEach(function(icon, idx)
    {
        const li = createTabButton(icon, idx, false);
        bottomUl[idx < 5 ? 0 : 1].appendChild(li);
    });
    tabBottom.append(...bottomUl);

    // Listeners for tab list buttons
    document.querySelectorAll('.tab-button').forEach(function(button)
    {
        button.addEventListener('mousedown', function()
        {
            const currentSelector = this.closest('.item-selector');
            if (!currentSelector) return;
            const btns = currentSelector.querySelectorAll('.tab-button');
            btns.forEach(function(btn)
            {
                btn.classList.remove('active');
                btn.parentElement.classList.remove('active');
            });
            this.classList.add('active');
            this.parentElement.classList.add('active');

            // Change for tab Search Items
            if (this.dataset.tooltip === 'desc.tab.top.7')
            {
                currentSelector.querySelector('.tab-search').classList.remove('hide');
            }
            else
            {
                currentSelector.querySelector('.tab-search').classList.add('hide');
            }

            // Update tab title
            const currentTitle = currentSelector.querySelector('.tab-title');
            if (currentTitle)
            {
                const currentLang = localStorage.getItem('lang') || 'zh';
                updateTextWithStyle(currentTitle, this.dataset.tooltip, titleStyle[currentLang]);
            }
        });

        // Disable tab Survival Inventory & Saved Hotbars
        if (button.dataset.tooltip === 'desc.tab.bottom.7' ||
            button.dataset.tooltip === 'desc.tab.top.6')
        {
            button.disabled = true;
        }

        // Init button icon
        let icon = button.querySelector('img');
        if (icon)
        {
            let src = button.dataset.icon;
            if (src.length === 0)
            {
                icon.src = '';
                return;
            }
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
                return;
            }
            icon.src = base + 'assets/images/' + src;
        }
    });
}

function loadButtonSet()
{
    const rows = 5;
    const cols = 9;
    const tabHotbar = document.querySelectorAll('.tab-hotbar');
    const tabItems = document.querySelectorAll('.tab-items');

    tabHotbar.forEach(function(container)
    {
        for (let i = 0; i < cols; i++)
        {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'slot';
            slotDiv.innerHTML = `
            <button class="slot-button" data-idx="${i}" data-icon="">
                <img src="">
            </button>`;
            container.appendChild(slotDiv);
        }
    });

    tabItems.forEach(function(container)
    {
        for (let i = 0; i < rows * cols; i++)
        {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'slot';
            slotDiv.innerHTML = `
            <button class="slot-button" data-idx="${i + cols}" data-icon="" data-tooltip="">
                <img src="">
            </button>`;
            container.appendChild(slotDiv);

            // Listener for item buttons
            slotDiv.querySelector(".slot-button").addEventListener('click', function()
            {
                if (this.dataset.icon === '') return;           // Skip empty icon
                const selector = this.closest('.item-selector');
                if (selector)
                {
                    const target = selector.querySelector(`.slot.with-margin`).querySelector('button');
                    changeIcon(target, this.dataset.icon);
                }
                else
                {
                    console.error(`Item selector with slot button [${this}] not found!`);
                }
                console.log(`Item ${this.dataset.tooltip} selected.`);
            });
        }
    });

    document.querySelectorAll('.slot-button').forEach(element => changeIcon(element, element.dataset.icon));
}

function createTabButton(icon, idx, isTop = true, isActive = false)
{
    const li = document.createElement('li');
    if (isActive) li.classList.add('active');

    const btn = document.createElement('button');
    btn.className = 'tab-button' + (isActive ? ' active' : '');
    btn.dataset.tooltip = `desc.tab.${isTop ? 'top' : 'bottom'}.${idx + 1}`;
    btn.dataset.icon = icon;
    btn.innerHTML = '<img src="">';
    
    li.appendChild(btn);
    return li;
}