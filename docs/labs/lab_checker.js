// lab_checker - check and report if lab attempt is correct

// Copyright (C) Open Source Security Foundation (OpenSSF)
// SPDX-License-Identifier: MIT

// See create_labs.md for more information.

// Hints are currently in JSON.
// JSON is well-known & easily supported, but it requires a lot of escaping.
// YAML would be a little clearer, and is a common format,
// but you still have to escape a lot.
// NestedText format might be a nice format for hints
// <https://nestedtext.org/en/stable/>, because it doesn't require
// any escaping of the data (structural information is a prefix).
// However, it's an uncommon format and
// it's not clear how well it's supported on *client-side* JavaScript.

// Global variables. We set these on load to provide good response time.
let correct_re = []; // Array of compiled regex of correct answer
let expected = []; // Array of an expected (correct) answer
let hints; // Array of hint objects

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
function process_regex(regex_string, full_match = true) {
    let processed_regex_string = (
                  regex_string.replace(/\r?\n( *\r?\n)+/g,'')
                              .replace(/\s+/g,'\\s*')
                  );
    if (full_match) {
        processed_regex_string = '^' + processed_regex_string + ' *$';
    }
    return new RegExp(processed_regex_string);
}

/**
 * Return true iff attempt matches correct.
 * @attempt Array of strings that might be correct
 * @correct Array of compiled regexes describing correct answer
 */
function calcMatch(attempt, correct) {
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
function retrieve_attempt() {
    let result = [];
    for (let i = 0; i < correct_re.length; i++) {
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
function run_check() {
    let attempt = retrieve_attempt();

    // Calculate grade and set in document.
    let isCorrect = calcMatch(attempt, correct_re);
    let oldGrade = document.getElementById('grade').innerHTML;
    let newGrade = isCorrect ? 'COMPLETE!' : 'to be completed';
    document.getElementById('grade').innerHTML = newGrade;
    for (let i = 0; i < correct_re.length; i++) {
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
function find_hint(attempt) {
    // Find a matching hint (matches present and NOT absent)
    for (hint of hints) {
      if ((!hint.present_re ||
           hint.present_re.test(attempt[hint.entry])) &&
          (!hint.absent_re ||
           !hint.absent_re.test(attempt[hint.entry]))) {
        return hint.text;
      }
    };
    return 'Sorry, I cannot find a hint that matches your attempt.';
}

/** Show a hint to the user. */
function show_hint() {
    let attempt = retrieve_attempt();
    if (calcMatch(attempt, correct_re)) {
        alert('The answer is already correct!');
    } else if (!hints) {
        alert('Sorry, there are no hints for this lab.');
    } else {
        alert(find_hint(attempt));
    }
}

function show_answer() {
    alert(`We were expecting an answer like this:\n${expected}`);
}

/**
 * Reset form.
 * We have to implement this in JavaScript to ensure that the final
 * displayed state matches the final condition. E.g., if the user
 * had correctly answered it, and we reset, then we need to show
 * the visual indicators that it's no longer correctly answered.
 */
function reset_form() {
    form = document.getElementById('lab');
    form.reset();
    run_check();
}

function process_hints(potential_hints) {
    // Accept String potential_hints in JSON format.
    // return a cleaned-up array of objects.
    let parsed_json = JSON.parse(potential_hints);
    if (!(parsed_json instanceof Array)) {
        alert('Error: hints must be JSON array. Use [...].');
    }
    let compiled_hints = [];
    // TODO: Do more sanity checking.
    for (let hint of parsed_json) {
        let newHint = {};
        newHint.entry = hint.entry ? Number(hint.entry) : 0;
        newHint.text = hint.text;
        // Precompile all regular expressions
        if (hint.present) {
            newHint.present_re = process_regex(hint.present, false);
        };
        if (hint.absent) {
            newHint.absent_re = process_regex(hint.absent, false);
        };
        compiled_hints.push(newHint); // append result.
    };
    // alert(`compiled_hints[0].pattern=${compiled_hints[0].pattern}`);
    // alert(`compiled_hints[0].pattern_re=${compiled_hints[0].pattern_re}`);
    return compiled_hints;
}

/**
 * Run simple selftest; we presume it runs only during page initialization.
 * Must run load_data first, to set up globals like correct_re.
 * Ensure the initial attempt is incorrect AND the expected value is correct.
 */
function run_selftest() {
    let attempt = retrieve_attempt();
    if (calcMatch(attempt, correct_re)) {
        alert('Lab Error: Initial attempt value is correct and should not be!');
    }
    if (!calcMatch(expected, correct_re)) {
        alert('Lab Error: expected value is incorrect and should be correct!');
    }
}

/**
 * Load data from HTML page and initialize our local variables from it.
 */
function load_data() {
    // Set global correct and expected arrays
    let current = 0;
    while (true) {
        correct_element = document.getElementById('correct' + current);
        if (!correct_element) break;
        try {
                // Ignore empty lines at beginning & end of correct answer
                let correct = (
                    trimNewlines(correct_element.textContent));
                // Append global variable with compiled correct answer
                correct_re.push(process_regex(correct, true));
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
    // If there are hints, set up global variable hints.
    let potential_hints = document.getElementById('hints').textContent;
    if (potential_hints) {
        hints = process_hints(potential_hints);
    };
}

function init_page() {
    load_data();
    // Run a selftest on page load, to prevent later problems
    run_selftest();
    // Set up user interaction.
    // This will cause us to sometimes check twice, but this also ensures
    // that we always catch changes to the attempt.
    let current = 0;
    while (true) {
        attempt = document.getElementById('attempt' + current);
        if (!attempt) break;
        attempt.onchange = run_check;
        attempt.onkeyup = run_check;
        current++;
    }
    hint_button = document.getElementById('hint_button');
    if (hint_button) {
        hint_button.onclick = (() => show_hint());
        if (!hint_button.title) {
            hint_button.title = 'Provide a hint given current attempt.';
        }
    }
    reset_button = document.getElementById('reset_button');
    if (reset_button) {
        reset_button.onclick = (() => reset_form());
        if (!reset_button.title) {
            reset_button.title = 'Reset initial state (throwing away current attempt).';
        }
    }
    give_up_button = document.getElementById('give_up_button');
    if (give_up_button) {
        give_up_button.onclick = (() => show_answer());
        if (!give_up_button.title) {
            give_up_button.title = 'Give up and show an answer.';
        }
    }
    // Run check of the answer so its visual appearance matches its content.
    run_check();
}

// When the requesting web page loads, initialize things
window.onload = init_page;
