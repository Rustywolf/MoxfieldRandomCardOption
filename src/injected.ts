import AddButtonHook from './hooks/AddButtonHook';
import GrabFunctionsHook from './hooks/GrabFunctionsHook';
import Hook from './hooks/Hook';
import { error, getRandomCard } from './utils';

const WINDOW_HOOKED_VAR = 'MRCOInjected';
const HOOK_ATTEMPTS_TIMEOUT = 100;
const HOOK_ATTEMPTS_MAX = 50;


function injectHook<T extends Hook>(hook: T): Promise<T> {
  return new Promise((resolve, reject) => {
    function attemptInjection(hook: T, attempt: number = 0) {
      if (attempt >= HOOK_ATTEMPTS_MAX) {
        error(`Unable to hook ${hook.name}`);
        reject();
        return;
      }

      let success = false;
      try {
        success = hook.inject();
      } catch (e) {
        console.error(e);
        success = false;
      }

      if (!success) {
        setTimeout(() => attemptInjection(hook, attempt + 1), HOOK_ATTEMPTS_TIMEOUT);
      } else {
        resolve(hook);
      }
    }

    attemptInjection(hook, 0);
  });
}

async function injectHooks() {
  try {
    const functions = await injectHook(new GrabFunctionsHook());
    await injectHook(new AddButtonHook(functions));
  } catch (e) {
    console.error(e);
    error("There was an issue initializing Moxfield Card Randomizer");
  }
}

const isGoldfishUrl = /goldfish\/?/.test(window.location.pathname);
const isInjected = !!window[WINDOW_HOOKED_VAR];

if (isGoldfishUrl && !isInjected) {
  window[WINDOW_HOOKED_VAR] = true;
  injectHooks();
} else if (!isGoldfishUrl && isInjected) {
  window[WINDOW_HOOKED_VAR] = false;

}