
let prevLang = localStorage.getItem('lang') || 'zh';
let href;
switch (prevLang)
{
    case 'en':
        href = 'https://minecraft.wiki/w/Commands';
        break;

    case 'zh':
    default:
        href = 'https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4';
        break;
}
window.location.href = href;