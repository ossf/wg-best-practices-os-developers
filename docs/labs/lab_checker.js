// lab_checker - check and report if lab attempt is correct

// Copyright (C) Open Source Security Foundation (OpenSSF)
// SPDX-License-Identifier: MIT

// See create_labs.md for more information.

// Currently a lot of data is in the HTML in <div> sections, and
// hints are currently in JSON. This may cause problems;
// NestedText format might be an improvement.

// Global variables. We set these on load to provide good response time.
let correctRe = []; // Array of compiled regex of correct answer
let expected = []; // Array of an expected (correct) answer
let info = {}; // General info
let hints = []; // Array of hint objects

/**
 * Trim newlines (LF or CRLF) from beginning and end of given String.
 */
function trimNewlines(s) {
    return ((s + '').replace(/^\r?\n(\r?\n)+/, '')
            .replace(/^\r?\n(\r?\n)+$/, ''));
}

/*
 * Given a regex as a string, process it to support our extensions and
 * return a compiled regex.
 * In particular, *ignore* newlines and treat spaces as "allow 0+ spaces".
 */
function processRegex(regexString, fullMatch = true) {
    let processedRegexString = (
                  regexString.replace(/\r?\n( *\r?\n)+/g,'')
                             .replace(/\s+/g,'\\s*')
                  );
    if (fullMatch) {
        processedRegexString = '^' + processedRegexString + ' *$';
    }
    return new RegExp(processedRegexString);
}

/**
 * Return true iff attempt matches correct.
 * @attempt Array of strings that might be correct
 * @correct Array of compiled regexes describing correct answer
 */
function calcMatch(attempt, correct = correctRe) {
    if (!correct) { // Defensive test, should never happen.
        alert('Internal failure, correct value not defined or empty.');
        return false;
    }
    for (let i = 0; i < correct.length; i++) {
        // If we find a failure, return false immediately (short circuit)
        if (!correct[i].test(attempt)) return false;
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
    let isCorrect = calcMatch(attempt, correctRe);
    let oldGrade = document.getElementById('grade').innerHTML;
    let newGrade = isCorrect ? 'COMPLETE!' : 'to be completed';
    document.getElementById('grade').innerHTML = newGrade;
    for (let i = 0; i < correctRe.length; i++) {
        document.getElementById(`attempt${i}`).style.backgroundColor =
            isCorrect ?  'lightgreen' : 'yellow';
    };
    if (isCorrect && (oldGrade !== newGrade)) {
        // Use a timeout so the underlying page will *re-render* before the
	// alert shows. If we don't do this, the alert would be confusing
	// because the underlying page would say we hadn't completed it.
	setTimeout(function() {
            alert('Congratulations! Your answer is correct!');
        }, 100);
    }
}

/** Return the best-matching hint given attempt. */
function findHint(attempt) {
    // Find a matching hint (matches present and NOT absent)
    for (hint of hints) {
      if ((!hint.presentRe ||
           hint.presentRe.test(attempt[hint.entry])) &&
          (!hint.absentRe ||
           !hint.absentRe.test(attempt[hint.entry]))) {
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
    alert(`We were expecting an answer like this:\n${expected}`);
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

/** Accept hints in JSON format, return cleaned-up array of hints */
function processHints(requestedHints) {
    if (!(requestedHints instanceof Array)) {
        alert('Error: hints must be JSON array. Use [...].');
    }
    let compiledHints = [];
    // TODO: Do more sanity checking.
    for (let hint of requestedHints) {
        let newHint = {};
        newHint.entry = hint.entry ? Number(hint.entry) : 0;
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
 * @info: String of JSON data
 */
function processInfo(configurationInfo) {
    // TODO: handle parse failures more gracefully & check more

    // This would only allow JSON, but then we don't need to load YAML lib:
    // let parsedJson = JSON.parse(configurationInfo);

    let parsedData = jsyaml.load(configurationInfo);
    // alert(`DEBUG: results = ${parsedData}`);

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
                actualHint = findHint(example);
                if (actualHint != hint.text) {
                    alert(`Lab Error: Unexpected hint! Example ${example} should produce hint ${hint.text} but instead produced ${actualHint}`);
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
}

function initPage() {
    loadData();
    // Run a selftest on page load, to prevent later problems
    runSelftest();
    // Set up user interaction.
    // This will cause us to sometimes check twice, but this also ensures
    // that we always catch changes to the attempt.
    let current = 0;
    while (true) {
        attempt = document.getElementById('attempt' + current);
        if (!attempt) break;
        attempt.onchange = runCheck;
        attempt.onkeyup = runCheck;
        current++;
    }
    hintButton = document.getElementById('hintButton');
    if (hintButton) {
        hintButton.onclick = (() => showHint());
        if (!hintButton.title) {
            hintButton.title = 'Provide a hint given current attempt.';
        }
    }
    resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.onclick = (() => resetForm());
        if (!resetButton.title) {
            resetButton.title = 'Reset initial state (throwing away current attempt).';
        }
    }
    giveUpButton = document.getElementById('giveUpButton');
    if (giveUpButton) {
        giveUpButton.onclick = (() => showAnswer());
        if (!giveUpButton.title) {
            giveUpButton.title = 'Give up and show an answer.';
        }
    }
    // Run check of the answer so its visual appearance matches its content.
    runCheck();
}

// When the requesting web page loads, initialize things
window.onload = initPage;
