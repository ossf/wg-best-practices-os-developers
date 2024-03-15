// lab_checker - check and report if lab attempt is correct

// See create_labs.md for more information.

// Global variables. We set these on load to provide good response time.
let correct_re; // Compiled regex of correct answer, precomputed for speed
let expected; // Expected answer (a correct answer)
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
 * Return if attempt matches the regex correct.
 * @attempt String from user
 * @correct String of regex describing correct answer
 *
 * This shows an alert if "correct" isn't syntactically valid.
 */
function calcMatch(attempt, correct) {
    // "correct" is a compiled regex
    if (!correct) { // Defensive test, should never happen.
        alert('Internal failure, correct value not defined.');
        return false;
    } else {
        return (correct.test(attempt));
    }
}

function retrieve_attempt() {
    // Ignore empty lines at beginning & end of attempt
    return trimNewlines(document.getElementById('attempt').value);
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
    document.getElementById('attempt').style.backgroundColor =
        isCorrect ?  'lightgreen' : 'yellow';
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
      if ((!hint.present_re || hint.present_re.test(attempt)) &&
          (!hint.absent_re || !hint.absent_re.test(attempt))) {
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
        let newHint = { ...hint}; // clone so we can modify it
        // Precompile all regular expressions
        if (newHint.present) {
            newHint.present_re = process_regex(newHint.present, false);
        } else { // Defensive programming - don't accept external code
            delete newHint.present_re;
        }
        if (newHint.absent) {
            newHint.absent_re = process_regex(newHint.absent, false);
        } else { // Defensive programming - don't accept external code
            delete newHint.absent_re;
        }
        // parsed_json[i] = newHint;
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
    // Set global correct regex correct_re
    try {
            // Ignore empty lines at beginning & end of correct answer
            let correct = (
                trimNewlines(document.getElementById('correct').textContent));
            // Set global variable with compiled correct answer
            correct_re = process_regex(correct, true);
      }
      catch(e) {
          // This can only happen if the correct answer pattern is missing
          // or badly wrong.
          alert("Lab Error: Unparsable correct answer");
      }
    // Set expected answer. Used for self test and give up.
    expected = trimNewlines(
        document.getElementById('expected').textContent
    );
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
    document.getElementById('attempt').onchange = run_check;
    document.getElementById('attempt').onkeyup = run_check;
    hint_button = document.getElementById('hint_button');
    if (hint_button) {hint_button.onclick = (() => show_hint());}
    give_up_button = document.getElementById('give_up_button');
    if (give_up_button) {give_up_button.onclick = (() => show_answer());}
    // Run check of the answer so its visual appearance matches its content.
    run_check();
}

// When the requesting web page loads, initialize things
window.onload = init_page;
