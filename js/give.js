import { init, base, setTooltipAuto } from "./global.js";
let selectedLang = localStorage.getItem('lang') || 'zh';

init(initButtons, true);

function initButtons()
{
    document.querySelectorAll('.slot-button').forEach(function(button)
    {
        changeIcon(button);

        // Listener for slot button
        button.addEventListener('click', function()
        {
            let itemSelector = document.getElementById(this.dataset.id);
            itemSelector.classList.toggle('hide');
            if (this.dataset.icon === 'item/empty_slot_sword.png')
            {
                this.dataset.tooltip = itemSelector.classList.contains('hide') ? 'tip.openSelector' : 'tip.closeSelector';
                setTooltipAuto(this);
            }
        });
    });
}

function changeIcon(button, src = 'item/empty_slot_sword.png')
{
    let icon = button.querySelector('img');
    if (icon)
    {
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
            icon.src = base + 'assets/images/item/empty_slot_sword.png';
            console.error('Bad image URL: ' + src);
            return;
        }

        icon.src = base + 'assets/images/' + src;
    }
    else
    {
        console.error('Icon for item button [' + button.dataset.id + '] not found!');
    }
}