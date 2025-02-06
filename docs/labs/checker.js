// lab_checker - check and report if lab attempt is correct

// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

// See create_labs.md for more information.

// Global variables. We set these on load to provide good response time.
let correctRe = []; // Array of compiled regex of correct answer
let expected = []; // Array of an expected (correct) answer
let info = {}; // General info
let info2 = {}; // Transitional info - if it exists, compare to info
let hints = []; // Array of hint objects
let page_definitions = {}; // Definitions used when preprocessing regexes

let user_solved = false; // True if user has *ever* solved it on this load
let user_gave_up = false; // True if user ever gave up before user solved it

let startTime = Date.now(); // Time this lab started.
let lastHintTime = null; // Last time we showed a hint.

// Has the input changed since we showed a hint?
// We track this so people can re-see a hint they've already seen.
// This initial value of "true" forces users to wait a delay time before
// they are allowed to see their first hint on an unchanged page.
let changedInputSinceHint = true;

let BACKQUOTE = "`"; // Make it easy to use `${BACKQUOTE}`
let DOLLAR = "$"; // Make it easy to use `${DOLLAR}`

// Current language. Guess English until we learn otherwise.
let lang = "en";

const resources = {
    en: {
	translation: {
            already_correct: 'The answer is already correct!',
            complete: 'COMPLETE!',
            completed: 'Completed',
            congrats: 'Congratulations! Your answer is correct!',
            congrats_all: 'Great work! All your answers are correct!',
            expecting: "We were expecting an answer like this:\n{0}",
            give_up_title: 'Give up and show an answer.',
            hint_title: 'Provide a hint given current attempt.',
            no_hints: 'Sorry, there are no hints for this lab.',
            no_matching_hint: 'Sorry, I cannot find a hint that matches your attempt.',
            reset_title: 'Reset initial state (throwing away current attempt).',
            to_be_completed: 'to be completed',
            try_harder_give_up: "Try harder! Don't give up so soon. Current time spent since start or last hint (in seconds): {0}",
            try_harder_hint: "Try harder! Don't ask for a hint so soon, wait at least {0} seconds.",
        },
    },
    ja: {
	translation: {
            already_correct: '答えはすでに正しいです!',
            complete: '完了',
            completed: '完了しました',
            congrats: '「おめでとうございます！」あなたの答えは正解です!',
            congrats_all: '素晴らしい仕事でした!あなたの答えはすべて正解です!',
            expecting: "次のような答えを期待していました:\n{0}",
            give_up_title: '諦めて答えを示してください。',
            hint_title: '現在の試行に関するヒントを提供します。',
            no_hints: '申し訳ありませんが、このラボにはヒントがありません。',
            no_matching_hint: '申し訳ありませんが、あなたの試みに一致するヒントが見つかりません。',
            reset_title: '初期状態をリセットします (現在の試行を破棄します)。',
            to_be_completed: '完成する',
            try_harder_give_up: 'もっと頑張れ！そんなにすぐに諦めないでください。開始または最後のヒントから経過した現在の時間 (秒単位): {0}',
            try_harder_hint: "もっと頑張れ！すぐにヒントを求めず、少なくとも {0} 秒待ちます。",
        },
    },
    fr: {
	translation: {
            already_correct: 'La réponse est déjà correcte !',
            complete: 'COMPLET !',
            completed: 'Terminé',
            congrats: 'Félicitations ! Votre réponse est correcte !',
            congrats_all: 'Excellent travail ! Toutes vos réponses sont correctes !',
            expecting: "Nous attendions une réponse comme celle-ci :\n{0}",
            give_up_title: 'Abandonnez et montrez une réponse.',
            hint_title: 'Fournir un indice compte tenu de la tentative en cours.',
            no_hints: "Désolé, il n'y a aucun indice pour cet atelier.",
            no_matching_hint: "Désolé, je ne trouve pas d'indice correspondant à votre tentative.",
            reset_title: "Réinitialiser l'état initial (abandonner la tentative actuelle).",
            to_be_completed: 'à compléter',
            try_harder_give_up: "Essayez plus fort ! N'abandonnez pas si tôt. Temps actuel passé (en secondes) : {0}",
            try_harder_give_up: "Essayez plus fort ! N'abandonnez pas si tôt. Temps actuel passé depuis le début ou le dernier indice (en secondes) : {0}",
            try_harder_hint: "Essayez plus fort ! Ne demandez pas d'indice si tôt, attendez au moins {0} secondes.",
        },
    },
};

/** Provide an "assert" (JavaScript doesn't have one built-in).
 * This one uses "Error" to provide a stack trace.
 */
function myAssert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

// Format a string, replacing {NUM} with item NUM.
// We use this function to simplify internationalization.
// Use as: myFormat("Demo {0} result", ["Name"])
// https://www.geeksforgeeks.org/what-are-the-equivalent-of-printf-string-format-in-javascript/
// This is *not* set as a property on String; if we did that,
// we'd modify the global namespace, possibly messing up something
// already there.
function myFormat(s, replacements) {
    return s.replace(/{(\d+)}/g, function (match, number) {
        return typeof replacements[number] != 'undefined'
            ? replacements[number]
            : match;
    });
};

// Run some built-in tests on startup, to ensure all is okay.
myAssert(myFormat("Hello", []) === "Hello");
myAssert(myFormat("Hello {0}, are you {1}?", ["friend", "well"]) ===
       "Hello friend, are you well?");

// Retrieve translation for given key from resources.
function t(key) {
    let result = resources[lang]['translation'][key];

    if (result === undefined) {
        result = resources['en']['translation'][key];
    }
    return result;
}

// Retrieve translation from object for given field
function retrieve_t(obj, field) {
    let result = obj[field + "_" + lang];

    if (result === undefined) {
        result = obj[field];
    }
    return result;
}

// Determine language of document. Set with <html lang="...">.
function determine_locale() {
    let lang = document.documentElement.lang;
    if (!lang) {
        lang = 'en';
    }
    return lang;
}

// This array contains the default pattern preprocessing commands, in order.
// We process every pattern through these (in order) to create a final regex
// to be used to match a pattern.
//
// We preprocess regexes to (1) simplify the pattern language and
// (2) optimize performance.
// Each item in this array has two elements:
// a regex and its replacement string on match.
// Yes, these preprocess patterns are regexes that process regexes.
//
// People can instead define their *own* sequence of
// preprocessing commands, to make their language easier to handle
// (e.g., Python). Do this by setting `info.preprocessing`.
// Its format is a sequence of arrays, each element is an array of
// 2 or 3 strings of form pattern, replacementString [, flags]
//
// Our default pattern preprocessing commands include some optimizations;
// we want people to get rapid feedback even with complex correct patterns.
//
let preprocessRegexes = [
  // Remove end-of-line characters (\n and \r)
  [/[\n\r]+/g, ''],

  // Optimization: remove useless spaces & tabs if they surround `\s+`
  // (speeding up processing).
  // This optimization ONLY occurs when spaces/tabs are on both sides,
  // to prevent false matches.
  [/[ \t]+\\s\+[ \t]+/g, '\\s+'],

  // 1+ spaces/tabs are instead interpreted as \s* (0+ whitespace)
  // The (?:\\s\*)? expressions before and after it are an optimization -
  // if you use \s* next to spaces/tabs, they coalesce for speed.
  // We use non-capturing groups (?:...) for speed. Preprocessing is only
  // done once on startup, so speed isn't important, but it's often good
  // to avoid capturing groups when you don't need to.
  [/(?:\\s\*)?[ \t]+(?:\\s\*)?/g, '\\s*']
];

/**
 * Trim LF and CR from beginning and end of given String.
 */
function trimNewlines(s) {
    return ((s + '').replace(/^[\n\r]+/, '')
            .replace(/[\n\r]+$/, ''));
}

/**
 * Apply all page_definitions to string s (which is presumably a regex
 * in string form). These are simple text replacements.
 */
function processDefinitions(s) {
    let result = s;
    for (definition in page_definitions) {
        result = result.replaceAll(definition, page_definitions[definition]);
    };
    return result;
}

/**
 * Escape unsafe HTML, e.g., & becomes &amp;
 */
function escapeHTML(unsafe) {
    return (unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/\'/g, "&#039;"));
}

/* Compute Set difference lhs \ rhs.
 * @lhs - Set to start with
 * @rhs - Set to remove from the lhs
 * Set difference is in Firefox nightly, but is not yet released.
 * So we compute it ourselves. This is equivalent to lhs.difference(rhs)
 */
function setDifference(lhs, rhs) {
    let lhsArray = Array.from(lhs);
    let result = lhsArray.filter((x) => {!rhs.has(x)});
    return new Set(result);
}

/* Return differences between two objects
 */
function objectDiff(obj1, obj2) {
    let diff = {};
  
    function compare(obj1, obj2, path = '') {
        for (const key in obj1) {
          if (obj1.hasOwnProperty(key)) {
            const newPath = path ? `${path}.${key}` : key;
    
            if (!obj2.hasOwnProperty(key)) {
              diff[newPath] = [obj1[key], undefined];
            } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
              compare(obj1[key], obj2[key], newPath);
            } else if (obj1[key] !== obj2[key]) {
              diff[newPath] = [obj1[key], obj2[key]];
            }
          }
        }
  
        for (const key in obj2) {
          if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
            const newPath = path ? `${path}.${key}` : key;
            diff[newPath] = [undefined, obj2[key]];
          }
        }
    }
  
    compare(obj1, obj2);
    return diff;
}

/*
 * Show debug output in debug region and maybe via alert box
 * @debugOutput - the debug information to show
 * @alwaysAlert - if true, ALWAYS show an alert
 * This does *not* raise or re-raise an exception; it may be just informative.
 */
function showDebugOutput(debugOutput, alwaysAlert = true) {
    let debugDataRegion = document.getElementById('debugData');
    let debugOutputString = String(debugOutput);
    if (debugDataRegion) {
        // Use textContent to see the raw unfiltered results
        debugDataRegion.textContent = (
            String(debugDataRegion.textContent) + debugOutputString + "\n\n");
        debugDataRegion.classList.remove('displayNone');
        // Force display, just in case:
        debugDataRegion.style.display = 'block';
        if (alwaysAlert) alert(debugOutputString);
    } else {
        // Debug data requested, but we have nowhere to put it.
        // Show the debug data as an alert instead.
        alert(debugOutputString);
    };
}

/**
 * Given take a regex string, preprocess it (using our array of
 * definitions and preprocessing regexes),
 * and return a processed regex as a String.
 * @regexString - String to be converted into a compiled Regex
 * @fullMatch - require full match (insert "^" at beginning, "$" at end).
 */
function processRegexToString(regexString, fullMatch = true) {
    // Replace all definitions. This makes regexes much easier to use,
    // as we can now defined named fragments.
    let processedRegexString = processDefinitions(regexString);
    // Preprocess. This lets us define what whitespace etc. means.
    for (preprocessRegex of preprocessRegexes) {
        processedRegexString = processedRegexString.replace(
          preprocessRegex[0], preprocessRegex[1]
        );
    };
    if (fullMatch) {
        // Use non-capturing group, so if someone uses ..|.. it will
        // work correctly and the first capturing (...) will be the first.
        processedRegexString = '^(?:' + processedRegexString + ')$';
    }
    return processedRegexString;
}

/**
 * Given take a regex string, preprocess it (using our array of
 * preprocessing regexes), and return a final compiled Regexp.
 * @regexString - String to be converted into a compiled Regexp
 * @description - Description of @regexString's purpose (for error reports)
 * @fullMatch - require full match (insert "^" at beginning, "$" at end).
 */
function processRegex(regexString, description, fullMatch = true) {
    let processedRegexString = processRegexToString(regexString, fullMatch);
    try {
        let compiledRegex = new RegExp(processedRegexString);
        return compiledRegex;
    }
    catch (e) {
        showDebugOutput(
            `Lab Error: Cannot process ${description}\nFor regex: /${regexString}/\nDue to:\n${e}`);
        throw e; // Rethrow, so containing browser also gets it
    }
}

/*
 * Determine if preprocessing produces the expected final regex answer.
 * @example - 2-element array. LHS is to be processed, RHS is expected result
 */
function validProcessing(example) {
    let [unProcessed, expectedProcessed] = example;
    let actualProcessed = processRegexToString(unProcessed, false);
    // alert(`actual\n${actualProcessed}\nexpected\n${expectedProcessed}`);
    // alert(`actual length\n${actualProcessed.length}\nexpected length\n${expectedProcessed.length}`);
    return (actualProcessed == expectedProcessed);
}

/**
 * Return true iff the indexed attempt matches the indexed correct.
 * @attempt - Array of strings that might be correct
 * @index - Integer index (0+)
 * @correct - Array of compiled regexes describing correct answer
 */
function calcOneMatch(attempt, index = 0, correct = correctRe) {
    return correct[index].test(attempt[index]);
}

/**
 * Return true iff all of attempt matches all of correct.
 * @attempt - Array of strings that might be correct
 * @correct - Array of compiled regexes describing correct answer
 */
function calcMatch(attempt, correct = correctRe) {
    if (!correct) { // Defensive test, should never happen.
        alert('Error: Internal failure, correct value not defined or empty.');
        return false;
    }
    for (let i = 0; i < correct.length; i++) {
        // If we find a failure, return false immediately (short circuit)
        if (!calcOneMatch(attempt, i, correctRe)) return false;
    }
    // Everything passed.
    return true;
}

/**
 * Retrieve array of attempted answers
 */
function retrieveAttempt() {
    let result = [];
    for (let i = 0; i < correctRe.length; i++) {
        // Ignore empty lines at beginning & end of attempt
        result.push(
            trimNewlines(document.getElementById(`attempt${i}`).value));
    };
    return result;
}

const attemptIdPattern = /^attempt(\d+)$/;

/*
 * Given Node @form in document, return array of indexes of input/textareas
 * that are relevant for that form.
 * The values retrieved are *input* field indexes (`inputIndexes`),
 * starting at 0 for the first user input.
 *
 * When there's only one form, this is simply the array of all valid indexes.
 * However, a page can have multiple forms; in that case this returns
 * only the indexes valid for this specific form.
 *
 * Note: At one time we ran this calculation when a user pressed
 * a button. However, if you *translate* the page using Chrome's translator,
 * that will cause this routine to fail because querySelectorAll will fail.
 * To work around this,
 * it's better to calculate all of these values on page load and store it
 * (e.g., as dataset.inputIndexes values on the buttons).
 * If you run this early, users can use the web browser's built-in translator,
 * see the translated HTML, and have the lab work (though the lab
 * responses won't be translated).
 */
function findIndexes(form) {
    try {
        let inputs = form.querySelectorAll(
            "input[type='text']:not(:read-only),textarea:not(:read-only)");
        if (!inputs) {
            // Shouldn't happen. Reaching this means the current form
            // has no inputs.
            // We'll do a "reasonable thing" - act as if all is in scope.
            return correctRe.map((_, i) => i);
        } else {
            let result = [];
            // Turn "approach0", "approach1" into [0, 1].
            for (input of inputs) {
                // alert(`findIndexes: ${input.id}`);
                let matchResult = input.id.match(attemptIdPattern);
                if (matchResult) {
                    let index = Number(matchResult[1]);
                    result.push(index);
    	        }
            }
            // alert(`findIndexes = ${result}`);
            // Return as JSON string so it's easily stored, etc.
            return JSON.stringify(result);
        }
    } catch (e) {
        showDebugOutput(
            `Lab Error: findIndexes raises exception ${e}`);
        throw e; // Rethrow, so containing browser also gets it
    }
}

/** Compute cyrb53 non-cryptographic hash */
// cyrb53 (c) 2018 bryc (github.com/bryc). License: Public domain. Attribution appreciated.
// A fast and simple 64-bit (or 53-bit) string hash function with decent collision resistance.
// Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
// See https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript/52171480#52171480
// https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
// https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
const cyrb64 = (str, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for(let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  // For a single 53-bit numeric return value we could return
  // 4294967296 * (2097151 & h2) + (h1 >>> 0);
  // but we instead return the full 64-bit value:
  return [h2>>>0, h1>>>0];
};

// An improved, *insecure* 64-bit hash that's short, fast, and has no dependencies.
// Output is always 14 characters.
// https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
const cyrb64Hash =  (str, seed = 0) => {
  const [h2, h1] = cyrb64(str, seed);
  return h2.toString(36).padStart(7, '0') + h1.toString(36).padStart(7, '0');
}

/** Create a stamp to indicate completion. */
function makeStamp() {
    let timeStamp = (new Date()).toISOString();
    let uuid = crypto.randomUUID();
    let resultBeginning = `${timeStamp} ${uuid}`;
    // Browsers have a SHA-256 cryptographic hash available, but *only*
    // when they're in a "secure state". We don't need the hash to be
    // cryptographic, since the data is clearly in view. Use a simple one.
    let hash = cyrb64Hash(resultBeginning);
    let gave_up_indicator = '';
    if (user_gave_up) { // If user gave up first, subtly indicate this.
        // The user could reload this and cause this marking to be omitted.
        gave_up_indicator = ' (GA)';
    }
    return `${t('completed')} ${resultBeginning} ${hash}${gave_up_indicator}`;
}

/**
 * Check the document's user input "attempt" to see if matches "correct".
 * Then set "grade" in document depending on that answer.
 */
function runCheck() {
    // This is only called when *something* has changed in the input.
    // From now on, enforce hint delays.
    changedInputSinceHint = true;

    let attempt = retrieveAttempt();

    // Calculate grade and set in document.
    let isCorrect = true;
    for (let i = 0; i < correctRe.length; i++) {
        let result = calcOneMatch(attempt, i, correctRe);
        if (!result) isCorrect = false;
        document.getElementById(`attempt${i}`).style.backgroundColor =
            result ?  'lightgreen' : 'yellow';
    };
    // isCorrect is now true only if everything matched
    let oldGrade = document.getElementById('grade').innerHTML;
    let newGrade = isCorrect ? t('complete') : t('to_be_completed');
    document.getElementById('grade').innerHTML = newGrade;

    if (isCorrect && (oldGrade !== newGrade)) {
        // Hooray! User has a newly-correct answer!
        user_solved = true;

        // Set `correctStamp` id (if present) with timestamp and UUID
        // This makes it easy to detect someone simply copying a final result.
        correctStamp = document.getElementById('correctStamp');
        if (correctStamp) {
            correctStamp.innerHTML = makeStamp();
            correctStamp.title =
                'This completion stamp is for instructors using these labs.';
	}

        // Use a timeout so the underlying page will *re-render* before the
	// alert shows. If we don't use a timeout, the alert would be confusing
	// because the underlying page would show that it wasn't completed.
	setTimeout(function() {
            let congrats_text;
            if (correctRe.length > 1) {
                congrats_text = t('congrats_all');
	    } else {
                congrats_text = t('congrats');
	    }
            alert(congrats_text);
        }, 100);
    }
}

/** Return the best-matching hint string given an attempt.
 * @attempt - array of strings of attempt to give hints on
 */
function findHint(attempt, validIndexes = undefined) {
    // Find a matching hint (matches present and NOT absent)
    for (hint of hints) {
      if (
	  ((validIndexes === undefined) ||
           (validIndexes.includes(hint.index))) &&
	  (!hint.presentRe ||
           hint.presentRe.test(attempt[hint.index])) &&
          (!hint.absentRe ||
           !hint.absentRe.test(attempt[hint.index]))) {
        return retrieve_t(hint, 'text');
      }
    };
    return t('no_matching_hint');
}

/** Show a hint to the user. */
function showHint(e) {
    // Get data-indexes value using e.target.dataset.indexes
    // alert(`Form id = ${e.target.form.id}`);
    let attempt = retrieveAttempt();
    if (calcMatch(attempt, correctRe)) {
        alert(t('already_correct'));
    } else if (!hints) {
        alert(t('no_hints'));
    } else {
        // Use *precalculated* input field indexes to work around
        // problem in Chrome translator.
        let validIndexes = e.target.dataset.inputIndexes;
        alert(findHint(attempt, validIndexes));
    }
}

/** Show the answer to the user */
function showAnswer(e) {
    // Get indexes in *this* form.
    let formIndexes = JSON.parse(e.target.dataset.inputIndexes);
    let goodAnswer = formIndexes.map(i => expected[i]).join('\n\n');
    if (!user_solved) {
        user_gave_up = true;
    }
    alert(myFormat(t('expecting'), [goodAnswer]));
}

// "Give up" only shows the answer after this many seconds have elapsed
// since a clue (lab start or a hint given).
const GIVE_UP_DELAY_TIME = 60;

// "Hint" only shows hint after this many seconds have elapsed
// since a clue (lab start or a hint given).
// WARNING: If you change this value, you *may* need to adjust some of
// the translated texts for try_harder_hint.
// Pluralization rules vary depending on the natural language,
// yet we want to tell the user the exact delay value for hints.
// English, French, German, and some others have two forms, "one" and "other"
// (aka "singular" and "plural" forms of words).
// For Chinese and Japanese it doesn't matter (there's no difference).
// In those cases, you only need to change translations if you change between
// not-1 to 1, which is unlikely. However,
// for some languages like Arabic, Hebrew, and Russian it's more complicated.
// See: https://localizely.com/language-plural-rules/
// If we needed to, we could use JavaScript's Intl.PluralRules
// which is widely supported and addresses this (unless you use IE),
// but at this point there's no evidence we need it. See:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
// https://caniuse.com/mdn-javascript_builtins_intl_pluralrules
const HINT_DELAY_TIME = 15;

/** return time (in seconds) since start and/or last hint */
function elapsedTimeSinceClue() {
    let currentTime = Date.now();
    let lastTime = (lastHintTime == null) ? startTime : lastHintTime;
    return ((currentTime - lastTime) / 1000); // in seconds
}

/** Maybe show the answer to the user (depending on timer). */
function maybeShowAnswer(e) {
    let elapsedTime = elapsedTimeSinceClue();
    if (elapsedTime < GIVE_UP_DELAY_TIME) {
        alert(myFormat(t('try_harder_give_up'), [elapsedTime.toString()]));
    } else {
        showAnswer(e);
    }
}

/** Maybe show a hint to the user (depending on timer). */
function maybeShowHint(e) {
    let elapsedTime = elapsedTimeSinceClue();
    // Only enforce delay timer if changedInputSinceHint is true. That way,
    // people can re-see a previously-seen hint as long as they
    // have not changed anything since seeing the hint.
    if (changedInputSinceHint && (elapsedTime < HINT_DELAY_TIME)) {
        alert(myFormat(t('try_harder_hint'), [HINT_DELAY_TIME.toString()]));
    } else {
        lastHintTime = Date.now(); // Set new delay time start
        changedInputSinceHint = false; // Allow redisplay of hint
        showHint(e);
    }
}

/**
 * Reset form.
 * We have to implement this in JavaScript to ensure that the final
 * displayed state matches the final condition. E.g., if the user
 * had correctly answered it, and we reset, then we need to show
 * the visual indicators that it's no longer correctly answered.
 */
function resetForm(e) {
    form = e.target.form;
    form.reset();
    runCheck();
}

/** Accept input array of hints, return cleaned-up array of hints */
function processHints(requestedHints) {
    if (!(requestedHints instanceof Array)) {
        alert('Error: hints must be array. E.g., in JSON use [...].');
    }
    let compiledHints = [];

    // Hints must only contain these fields, since we ignore the rest.
    const allowedHintFields = new Set(
        ['present', 'absent', 'text', 'text_ja', 'examples', 'index',
         'preprocessing']);

    // Process each hint
    for (let i = 0; i < requestedHints.length; i++) {
        hint = requestedHints[i];

        // Complain about unknown fields
        let usedFields = new Set(Object.keys(hint));
        let forbiddenFields = setDifference(usedFields, allowedHintFields);
        if (forbiddenFields.size != 0) {
            showDebugOutput(
                `Unknown field(s) in hint[${i}]: ` +
		Array.from(forbiddenFields).join(' '));
	}

        let newHint = { ...hint }; // Copy everything over, incl. translations
        newHint.index = hint.index ? Number(hint.index) : 0;
        // Precompile all regular expressions & report any failures
        if (hint.present) {
            newHint.presentRe = processRegex(hint.present,
                `hint[${i}].present`, false);
        };
        if (hint.absent) {
            newHint.absentRe = processRegex(hint.absent,
                `hint[${i}].absent`, false);
        };
        if (!hint.absent && !hint.present && (i != requestedHints.length - 1)) {
            showDebugOutput(
                `Hint[${i} lacks absent and present, yet is not last`);
	}
        if (hint.examples) {newHint.examples = hint.examples};
        compiledHints.push(newHint); // append result.
    };
    return compiledHints;
}

/** Set global values based on other than "correct" and "expected" values.
 * The correct and expected values may come from elsewhere, but we have to set up the
 * info-based values first, because info can change how those are interpreted.
 * @configurationInfo: Data to use
 */
function processInfo(configurationInfo) {
    const allowedInfoFields = new Set([
        'hints', 'successes', 'failures', 'correct', 'expected',
         'definitions', 'preprocessing', 'preprocessingTests', 'debug']);
    let usedFields = new Set(Object.keys(info));
    let forbiddenFields = setDifference(usedFields, allowedInfoFields);
    if (forbiddenFields.size != 0) {
        showDebugOutput(
            `Unknown field(s) in info: ` +
	    Array.from(forbiddenFields).join(' '));
    }
    if (info.definitions) {
	for (let definition of info.definitions) {
            // Preprocess with all existing definitions
            newValue = trimNewlines(processDefinitions(definition.value));
            page_definitions[definition.term] = newValue;
	}
    }

    // Set up pattern preprocessing, if set. ADVANCED USERS ONLY.
    // This must be done *before* we load & process any other patterns.
    if (info.preprocessing) {
        preprocessRegexes = [] // Erase defaults, use these instead.
        for (let preprocess of info.preprocessing) {
            // Use 'g' (global) if there isn't a third parameter.
            let flags = (preprocess.length < 3) ? 'g' : preprocess[2];
            // Use trimNewlines to avoid a nasty hard-to-detect bug.
            // We want to use "|" on patterns to make them simpler, but by
            // default that will include a trailing \n which is confusing.
            let preprocessRegex = new RegExp(
                trimNewlines(preprocess[0]), flags);
            let replacement = preprocess[1];
            let addition = [preprocessRegex, replacement];
            preprocessRegexes.push(addition);
        };
    };

    // Set up hints
    if (info && info.hints) {
        hints = processHints(info.hints);
    };
}

/**
 * Run a simple selftest.
 * Run setupInfo *before* calling this, to set up globals like correctRe.
 * This ensures that:
 * - the initial attempt is incorrect (as expected)
 * - the expected value is correct (as expected)
 * - all tests in "successes" succeed and all tests in "failures" fail
 * - all hints with tests produce their corresponding hint text
 */
function runSelftest() {
    let attempt = retrieveAttempt();
    if (calcMatch(attempt, correctRe)) {
        alert('Lab Error: Initial attempt value is correct and should not be!');
    };

    if (!calcMatch(expected, correctRe)) {
        alert('Lab Error: expected value is incorrect and should be correct!');
        // Provide more info
        for (let i = 0; i < correctRe.length; i++) {
            if (!(correctRe[i].test(attempt[i]))) {
                alert(`Lab error: Expected value considered incorrect at index ${i}`);
            } else {
                alert(`Lab error: Expected value is fine at index ${i}`);
            }
       }
    };

    const buttonsNotInForms =
        document.querySelectorAll('button:not(form button)');
    if (buttonsNotInForms.length != 0) {
        showDebugOutput(
            `Lab Error: Buttons not in a form: ${buttonsNotInForms}`);
    };

    // Run tests of the preprocessing process, if present
    for (let example of (info.preprocessingTests || [])) {
        if (!validProcessing(example)) {
            alert(`Lab Error: preprocessing\n${example.join("\n\n")}\nshould pass but fails.`);
	    };
    };

    // Run tests in successes and failures, if present
    if (info.successes) {
        for (let example of info.successes) {
            if (!calcMatch(example, correctRe)) {
                alert(`Lab Error: success ${example} should pass but fails.`);
	    };
        };
    };
    if (info.failures) {
        for (let example of info.failures) {
            if (calcMatch(example, correctRe)) {
                alert(`Lab Error: failure ${example} should fail but passes.`);
	    };
        };
    };

    // Test all examples in hints, to ensure they provide the expected reports.
    for (let hint of hints) {
        if (hint.examples) {
            for (let example of hint.examples) {
		// We directly pass our example.
		// This means that examples will need to contain multiple
		// values if the index > 0. We only return hints with the
		// given hint index.
                actualHint = findHint(example, [hint.index]);
                expectedHint = retrieve_t(hint, 'text');
                if (actualHint != expectedHint) {
                    alert(`Lab Error: Unexpected hint!\n\nExample:\n${example}\n\n\nExpected hint:\n${expectedHint}\n\nActual hint:\n${actualHint}\n\nExample:\n${JSON.stringify(example)}\n\nFailing hint=${JSON.stringify(hint)}`);
                };
            };
        };
    };
}

/**
 * Load "info" data and set up all other variables that depend on "info".
 * The "info" data includes the regex preprocessing steps, hints, etc.
 */
function setupInfo() {
    // We no longer need a *separate* step to load info, we presume the
    // HTML loaded it.
    // As a safety check, let's make sure some data *was* loaded.

    if (Object.keys(info).length == 0) {
        alert(`ERROR: info has no values set. Load/modify your lab .js file.`);
    };

    // If an "info2" exists, report any differences between it and "info".
    // This makes it safer to change how info is recorded.
    if (Object.keys(info2).length > 0) {
        let differences = objectDiff(info, info2);
        if (Object.keys(differences).length > 0) {
            alert(`ERROR: info2 exists, but info and info2 differ: ${JSON.stringify(differences)}`);
        }
    };

    // Set global values *except* correct and expected arrays
    processInfo(info);

    // Set global correct and expected arrays
    let current = 0;
    while (true) {
        correctElement = document.getElementById('correct' + current);
        if (!correctElement) break;
        // Ignore empty lines at beginning & end of correct answer
        let correct = trimNewlines(correctElement.textContent);
        // Append global variable with compiled correct answer
        correctRe.push(processRegex(correct,
            `correct answer correct[${current}]`, true));
        // Set expected answer. Used for self test and give up.
        expected.push(trimNewlines(
            document.getElementById('expected' + current).textContent));
        current++;
    };

    // Allow "correct" and "expected" to be defined as info fields.
    if (info.expected != null) {
        if (expected.length > 0) {
            alert("Error: Info defines expected value but it's overridden.");
	} else if (!(info.expected instanceof Array)) {
            alert('Error: Info expected hints must be array.');
        } else {
            expected = info.expected.map((s) => trimNewlines(s));
        };
    };
    if (info.correct != null) {
        if (correctRe.length > 0) {
            alert("Error: Info defines correct value but it's overridden.");
	} else if (!(info.correct instanceof Array)) {
            alert('Error: Info correct hints must be array.');
        } else {
            let correct = info.correct.map((s) => trimNewlines(s));
            // Set global variable with compiled correct answer
            correctRe = correct.map((s) =>
              processRegex(s, `correct answer ${s}`, true));
        };
    };
}

function initPage() {
    // Set current locale
    lang = determine_locale();

    // Use configuration info to set up all relevant global values.
    setupInfo();

    // Run a selftest on page load, to prevent later problems
    runSelftest();

    // Set up user interaction for all attempts.
    let current = 0;
    while (true) {
        attempt = document.getElementById('attempt' + current);
        if (!attempt) break;
        attempt.oninput = runCheck;
        current++;
    }
    for (let hintButton of document.querySelectorAll("button.hintButton")){
        hintButton.addEventListener('click', (e) => { maybeShowHint(e); });
        // Precompute inputIndexes to work around problems that occur
        // if a user uses a browser's built-in natural language translation.
        // Presumes button's parent is the form
        hintButton.dataset.inputIndexes = findIndexes(hintButton.parentNode);
        if (!hintButton.title) {
            hintButton.title = t('hint_title');
	}
    }
    for (let resetButton of document.querySelectorAll("button.resetButton")) {
        resetButton.addEventListener('click', (e) => { resetForm(e); });
        if (!resetButton.title) {
            resetButton.title = t('reset_title');
        }
    }
    for (let giveUpButton of document.querySelectorAll("button.giveUpButton")) {
        giveUpButton.addEventListener('click', (e) => { maybeShowAnswer(e); });
        // Presumes button's parent is the form
        giveUpButton.dataset.inputIndexes = findIndexes(giveUpButton.parentNode);
        if (!giveUpButton.title) {
            giveUpButton.title = t('give_up_title');
        }
    }
    if (info.debug) {
        let debugOutput = (
           "DEBUG DATA:\n\nPATTERN FOR CORRECT ANSWER:\n" +
           correctRe.join("\n\n") +
           "\n\nSAMPLE EXPECTED ANSWER:\n" +
           expected.join("\n\n") +
           `\n\nINFO SECTION (as JSON):\n${JSON.stringify(info, null, 2)}\n\n` +
           `\nPREPROCESS REGEXES:\n${preprocessRegexes.join("\n")}`
        );
        showDebugOutput(debugOutput, false);
    };

    // Run check of the answer so its visual appearance matches its content.
    runCheck();
}

// When the requesting web page loads, initialize things
window.onload = initPage;
