// lab_checker - check and report if lab attempt is correct

// Copyright (C) Open Source Security Foundation (OpenSSF)
// SPDX-License-Identifier: MIT

// See create_labs.md for more information.

// Global variables. We set these on load to provide good response time.
let correctRe = []; // Array of compiled regex of correct answer
let expected = []; // Array of an expected (correct) answer
let info = {}; // General info
let hints = []; // Array of hint objects

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
 * preprocessing regexes), and return a processed regex as a String.
 * @regexString - String to be converted into a compiled Regex
 * @fullMatch - require full match (insert "^" at beginning, "$" at end).
 */
function processRegexToString(regexString, fullMatch = true) {
    let processedRegexString = regexString;
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
        alert('Internal failure, correct value not defined or empty.');
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
 */
function findIndexes(form) {
    let inputs = form.querySelectorAll(
        "input[type='text']:not(:read-only),textarea:not(:read-only)");
    if (!inputs) {
        // Shouldn't happen. Reaching this means the current form has no inputs.
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
        return result;
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
    return `Completed ${resultBeginning} ${hash}`;
}

/**
 * Check the document's user input "attempt" to see if matches "correct".
 * Then set "grade" in document depending on that answer.
 */
function runCheck() {
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
    let newGrade = isCorrect ? 'COMPLETE!' : 'to be completed';
    document.getElementById('grade').innerHTML = newGrade;

    if (isCorrect && (oldGrade !== newGrade)) {
        // Hooray! User has a newly-correct answer!

        // Set `correctStamp` id (if present) with timestamp and UUID
        // This makes it easy to detect someone simply copying a final result.
        correctStamp = document.getElementById('correctStamp');
        if (correctStamp) {
            correctStamp.innerHTML = makeStamp();
            correctStamp.title =
                'This completion stamp is for instructors using these labs.';
	}

        // Use a timeout so the underlying page will *re-render* before the
	// alert shows. If we don't do this, the alert would be confusing
	// because the underlying page would show that it wasn't completed.
	setTimeout(function() {
            let congrats_text;
            if (correctRe.length > 1) {
                congrats_text = 'Great work! All your answers are correct!';
	    } else {
                congrats_text = 'Congratulations! Your answer is correct!';
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
        return hint.text;
      }
    };
    return 'Sorry, I cannot find a hint that matches your attempt.';
}

/** Show a hint to the user. */
function showHint(e) {
    // Get data-indexes value using e.target.dataset.indexes
    // alert(`Form id = ${e.target.form.id}`);
    let attempt = retrieveAttempt();
    if (calcMatch(attempt, correctRe)) {
        alert('The answer is already correct!');
    } else if (!hints) {
        alert('Sorry, there are no hints for this lab.');
    } else {
        let validIndexes = findIndexes(e.target.form);
        alert(findHint(attempt, validIndexes));
    }
}

function showAnswer(e) {
    let formIndexes = findIndexes(e.target.form); // Indexes in this form
    let goodAnswer = formIndexes.map(i => expected[i]).join('\n\n');
    alert(`We were expecting an answer like this:\n${goodAnswer}`);
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
        ['present', 'absent', 'text', 'examples', 'index',
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

        let newHint = {};
        newHint.index = hint.index ? Number(hint.index) : 0;
        newHint.text = hint.text;
        // Precompile all regular expressions & report any failures
        if (hint.present) {
            newHint.presentRe = processRegex(hint.present,
                `hint[${i}].present`, false);
        };
        if (hint.absent) {
            newHint.absentRe = processRegex(hint.absent,
                `hint[${i}].present`, false);
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

/** Set global values based on info.
 * @info: String with YAML (including JSON) data to use
 */
function processInfo(configurationInfo) {
    // This would only allow JSON, but then we don't need to load YAML lib:
    // let parsedJson = JSON.parse(configurationInfo);

    let parsedData; // Parsed data, *if* we manage to parse it.
    try {
        parsedData = jsyaml.load(configurationInfo);
    }
    catch (e) {
        showDebugOutput(
            `Lab Error: Cannot process YAML of info.\n${e}`);
        throw e; // Rethrow, so containing browser also gets exception
    }

    // Set global variable
    info = parsedData;

    const allowedInfoFields = new Set([
        'hints', 'successes', 'failures', 'correct', 'expected',
         'preprocessing', 'preprocessingTests', 'debug']);
    let usedFields = new Set(Object.keys(info));
    let forbiddenFields = setDifference(usedFields, allowedInfoFields);
    if (forbiddenFields.size != 0) {
        showDebugOutput(
            `Unknown field(s) in info: ` +
	    Array.from(forbiddenFields).join(' '));
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
    if (parsedData && parsedData.hints) {
        hints = processHints(parsedData.hints);
    };
}

/**
 * Run a simple selftest.
 * Run loadData *before* calling this, to set up globals like correctRe.
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
		// Create a testAttempt
                let testAttempt = expected.slice(); // shallow copy of expected
                testAttempt[hint.index] = example;
		// What hint does our new testAttempt give?
                actualHint = findHint(testAttempt, [hint.index]);
                if (actualHint != hint.text) {
                    alert(`Lab Error: Unexpected hint!\n\nExample:\n${example}\n\nExpected hint:\n${hint.text}\n\nProduced hint:\n${actualHint}\n\nExpected (passing example)=${JSON.stringify(expected)}\n\ntestAttempt=${JSON.stringify(testAttempt)}\nFailing hint=${JSON.stringify(hint)}`);
                };
            };
        };
    };
}

/**
 * Load data from HTML page and initialize our local variables from it.
 */
function loadData() {
    // If there is info (e.g., hints), load it & set up global variable hints.
    // We must load info *first*, because it can affect how other things
    // (like pattern preprocessing) is handled.
    let infoElement = document.getElementById('info');
    if (infoElement) {
        processInfo(infoElement.textContent);
    };

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
        if (correct.length > 0) {
            alert("Error: Info defines correct value but it's overridden.");
	} else if (!(info.correct instanceof Array)) {
            alert('Error: Info correct hints must be array.');
        } else {
            correct = info.correct.map((s) => trimNewlines(s));
        };
    };
}

function initPage() {
    loadData();

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
    for (let hintButton of document.querySelectorAll("button.hintButton")) {
        hintButton.addEventListener('click', (e) => { showHint(e); });
        if (!hintButton.title) {
            hintButton.title = 'Provide a hint given current attempt.';
	}
    }
    for (let resetButton of document.querySelectorAll("button.resetButton")) {
        resetButton.addEventListener('click', (e) => { resetForm(e); });
        if (!resetButton.title) {
            resetButton.title = 'Reset initial state (throwing away current attempt).';
        }
    }
    for (let giveUpButton of document.querySelectorAll("button.giveUpButton")) {
        giveUpButton.addEventListener('click', (e) => { showAnswer(e); });
        if (!giveUpButton.title) {
            giveUpButton.title = 'Give up and show an answer.';
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
