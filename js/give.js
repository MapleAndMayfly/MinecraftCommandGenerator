import { init, loadI18n} from "./global.js";
import { initItemSelector } from "./itemSelector.js";

init(onInit);

async function onInit()
{
    await loadI18n('give', 'text');
    await initItemSelector();
}