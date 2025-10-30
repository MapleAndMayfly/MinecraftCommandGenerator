import { loadI18n, updateText, updateTextWithStyle, updateTooltip, changeIcon, base } from "./global.js";

const rows = 5;
const cols = 9;
let offset = 1;

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
    document.querySelectorAll('.tab-button[data-tooltip="desc.tab.top.1"]')
            .forEach(element => element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
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

                // updateTextWithStyle() does not work in initItemSelector(), so I put it here
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
        button.addEventListener('mousedown', async function()
        {
            const currentSelector = this.closest('.item-selector');
            if (!currentSelector) return;

            currentSelector.querySelectorAll('.tab-button').forEach(function(btn)
            {
                btn.classList.remove('active');
                btn.parentElement.classList.remove('active');
            });
            this.classList.add('active');
            this.parentElement.classList.add('active');

            // Change visibility of search bar
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

            // Update slot buttons
            offset = 1; // Set offset as 1 to skip hotbar
            await updateSlotButtons(currentSelector, this.dataset.tooltip);
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
            slotDiv.querySelector("button").addEventListener('click', function()
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

async function updateSlotButtons(itemSelector, tooltip)
{
    const items = await loadSlotItem(tooltip);
    if (!Array.isArray(items)) return;

    itemSelector.querySelectorAll('[data-idx]').forEach(function(btn)
    {
        const idx = Number(btn.dataset.idx);
        const mappedIndex = idx - (offset * cols);
        if (mappedIndex < 0) return;                // Hidden by offset, skip

        const item = items[mappedIndex + 1] || {};  // +1 to skip void(default) item
        changeIcon(btn, item.texture || items[0].texture || '');
        btn.dataset.tooltip = item.i18n || items[0].i18n || 'item.void';
    });
}

async function loadSlotItem(tooltip)
{
    const parts = tooltip.split('.');
    const position = parts[2];
    const index = parts[3];

    if (parts.length !== 4 || parts[0] !== 'desc' || parts[1] !== 'tab' ||
        (position !== 'top' && position !== 'bottom') ||
        !/^\d+$/.test(index))
    {
        console.log(`Bad tooltip format [${tooltip}]!`);
        return {};
    }

    try
    {
        const response = await fetch(`${base}json/inventory/${position}_${index}.json`);
        if (!response.ok)
        {
            console.warn(`Failed to load items of [${tooltip}]`);
            return {};
        }
        return await response.json();
    }
    catch (error)
    {
        console.error(`Error loading items of [${tooltip}]!`, error);
        return {};
    }
}