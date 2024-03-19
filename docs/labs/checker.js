// lab_checker - check and report if lab attempt is correct

// Copyright (C) Open Source Security Foundation (OpenSSF)
// SPDX-License-Identifier: MIT

// See create_labs.md for more information.

// Global variables. We set these on load to provide good response time.
let correctRe = []; // Array of compiled regex of correct answer
let expected = []; // Array of an expected (correct) answer
let info = {}; // General info
let hints = []; // Array of hint objects

// This array contains the pattern preprocessing commands, in order.
// We process every pattern through these (in order) to create a final regex
// to be used to match a pattern.
// We preprocess regexes so the pattern language we use is simpler;
// we can also use preprocessing to optimize the resulting performance.
// Each item in the array has two elements: a regex and its replacement.
// In other words, these are regexes that process regexes
// (so that we can use a simpler input pattern language)
// In the future we may allow people to define their *own* sequence of
// preprocessing commands, to make certain languages easier to handle
// (e.g., Python).
let preprocessRegexes = [
  [/[\n\r]+/g, ''],
  [/(\\s\*)?\s+(\\s\*)?/g, '\\s*']
];

/**
 * Trim newlines (LF or CR) from beginning and end of given String.
 */
function trimNewlines(s) {
    return ((s + '').replace(/^[\n\r]+/, '')
            .replace(/[\n\r]+$/, ''));
}

function escapeHTML(unsafe)
{
    return (unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/\'/g, "&#039;"));
 }

/**
 * Given take a regex string, preprocess it & return compiled regex.
 * @fullMatch - require full match (insert "^" at beginning, "$" at end).
 *
 * In particular, *ignore* newlines and treat spaces as "allow 0+ spaces".
 *
 * As an optimization, spaces can be preceded or followed by `\s*`
 * to also means "\s*" (match 0+ spaces).
 * YAML doesn't like spaces at the beginning or ends of lines,
 * and we'll encourage that as the alternative.
 */
function processRegex(regexString, fullMatch = true) {
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
    return new RegExp(processedRegexString);
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
 * Return true iff all attempt matches all correct.
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
            isCorrect ?  'lightgreen' : 'yellow';
    };
    // isCorrect is now true only if everything matched
    let oldGrade = document.getElementById('grade').innerHTML;
    let newGrade = isCorrect ? 'COMPLETE!' : 'to be completed';
    document.getElementById('grade').innerHTML = newGrade;

    if (isCorrect && (oldGrade !== newGrade)) {
        // Hooray! User has a newly-correct answer!
        // Use a timeout so the underlying page will *re-render* before the
	// alert shows. If we don't do this, the alert would be confusing
	// because the underlying page would say we hadn't completed it.
	setTimeout(function() {
            alert('Congratulations! Your answer is correct!');
        }, 100);
    }
}

/** Return the best-matching hint string given an attempt.
 * @attempt - array of strings of attempt to give hints on
 */
function findHint(attempt) {
    // Find a matching hint (matches present and NOT absent)
    for (hint of hints) {
      if ((!hint.presentRe ||
           hint.presentRe.test(attempt[hint.index])) &&
          (!hint.absentRe ||
           !hint.absentRe.test(attempt[hint.index]))) {
        return hint.text;
      }
    };
    return 'Sorry, I cannot find a hint that matches your attempt.';
}

/** Show a hint to the user. */
function showHint() {
    let attempt = retrieveAttempt();
    if (calcMatch(attempt, correctRe)) {
        alert('The answer is already correct!');
    } else if (!hints) {
        alert('Sorry, there are no hints for this lab.');
    } else {
        alert(findHint(attempt));
    }
}

function showAnswer() {
    alert(`We were expecting an answer like this:\n${expected.join('\n\n')}`);
}

/**
 * Reset form.
 * We have to implement this in JavaScript to ensure that the final
 * displayed state matches the final condition. E.g., if the user
 * had correctly answered it, and we reset, then we need to show
 * the visual indicators that it's no longer correctly answered.
 */
function resetForm() {
    form = document.getElementById('lab');
    form.reset();
    runCheck();
}

/** Accept input array of hints, return cleaned-up array of hints */
function processHints(requestedHints) {
    if (!(requestedHints instanceof Array)) {
        alert('Error: hints must be array. E.g., in JSON use [...].');
    }
    let compiledHints = [];
    // TODO: Do more sanity checking.
    for (let hint of requestedHints) {
        let newHint = {};
        newHint.index = hint.index ? Number(hint.index) : 0;
        newHint.text = hint.text;
        // Precompile all regular expressions
        if (hint.present) {
            newHint.presentRe = processRegex(hint.present, false);
        };
        if (hint.absent) {
            newHint.absentRe = processRegex(hint.absent, false);
        };
        if (hint.examples) {newHint.examples = hint.examples};
        compiledHints.push(newHint); // append result.
    };
    return compiledHints;
}

/** Set global values based on info.
 * @info: String with YAML (including JSON) data to use
 */
function processInfo(configurationInfo) {
    // TODO: handle parse failures more gracefully & check more

    // This would only allow JSON, but then we don't need to load YAML lib:
    // let parsedJson = JSON.parse(configurationInfo);

    let parsedData = jsyaml.load(configurationInfo);

    // Set global variable
    info = parsedData;
    if (parsedData && parsedData.hints) {
        hints = processHints(parsedData.hints);
    };
}

/**
 * Run simple selftest; we presume it runs only during page initialization.
 * Must run loadData first, to set up globals like correctRe.
 * Ensure the initial attempt is incorrect AND the expected value is correct.
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
                alert(`Expected value considered incorrect at index ${i}`);
            } else {
                alert(`Expected value is fine at index ${i}`);
            }
       }
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
                actualHint = findHint(testAttempt);
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
    // Set global correct and expected arrays
    let current = 0;
    while (true) {
        correctElement = document.getElementById('correct' + current);
        if (!correctElement) break;
        try {
                // Ignore empty lines at beginning & end of correct answer
                let correct = (
                    trimNewlines(correctElement.textContent));
                // Append global variable with compiled correct answer
                correctRe.push(processRegex(correct, true));
        }
        catch(e) {
            // This can only happen if the correct answer pattern is missing
            // or badly wrong.
            alert(`Lab Error: Unparsable correct answer $${current}`);
        }
        // Set expected answer. Used for self test and give up.
        expected.push(trimNewlines(
            document.getElementById('expected' + current).textContent));
        current++;
    };
    // If there is info (e.g., hints), set up global variable hints.
    let infoElement = document.getElementById('info');
    if (infoElement) {
        processInfo(infoElement.textContent);
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
    hintButton = document.getElementById('hintButton');
    if (hintButton) {
        hintButton.onclick = (() => showHint());
        if (hintButton.title == null) {
            hintButton.title = 'Provide a hint given current attempt.';
        }
    }
    resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.onclick = (() => resetForm());
        if (resetButton.title == null) {
            resetButton.title = 'Reset initial state (throwing away current attempt).';
        }
    }
    giveUpButton = document.getElementById('giveUpButton');
    if (giveUpButton) {
        giveUpButton.onclick = (() => showAnswer());
        if (giveUpButton.title == null) {
            giveUpButton.title = 'Give up and show an answer.';
        }
    }
    if (info.debug) {
        let debugOutput = (
           "DEBUG DATA:\n\nPATTERN FOR CORRECT ANSWER:\n" +
           correctRe.join("\n\n") +
           "\n\nSAMPLE EXPECTED ANSWER:\n" +
           expected.join("\n\n") +
           `\n\nINFO SECTION (as JSON):\n${JSON.stringify(info, null, 2)}\n`
        );
        debugDataRegion = document.getElementById('debugData');
        if (debugDataRegion) {
            // Use textContent to see the raw unfiltered results
            debugDataRegion.textContent = debugOutput;
            debugDataRegion.style.display = 'block';
        } else {
            // Debug data requested, but we have nowhere to put it.
            // Show the debug data as an alert instead.
            alert(debugOutput);
        };
    };

    // Run check of the answer so its visual appearance matches its content.
    runCheck();
}

// When the requesting web page loads, initialize things
window.onload = initPage;