fetch('src/templates.html')
    .then(response => response.text())
    .then(html => {
        document.baseURI = '';

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const headerBar = doc.querySelector('#MCG-header').content.cloneNode(true);
        document.getElementById('header').appendChild(headerBar);

        init();
    })
    .catch(error => console.error('Header loading failed') );

function init()
{
    initDropdownMenus();
    initThemeSwitcher();
}

function initDropdownMenus()
{
    document.querySelectorAll('.dropdown-button').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            const menu = this.nextElementSibling;
            const isOpen = !menu.classList.contains('hide');
            document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hide'));
            if (!isOpen) {
                menu.classList.remove('hide');
            }
        });
    });
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hide'));
    });
}

function initThemeSwitcher()
{
    document.querySelector(".display-mode-button").addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const btn = document.querySelector('.display-mode-button');
        const sun = btn.querySelector('.light-mode');
        const moon = btn.querySelector('.dark-mode');
        if(document.body.classList.contains('dark-mode')) {
            sun.classList.add('hide');
            moon.classList.remove('hide');
        } else {
            sun.classList.remove('hide');
            moon.classList.add('hide');
        }
    });
}