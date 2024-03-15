// lab_checker - check and report if lab attempt is correct

// See create_labs.md for more information.

// Global variables. We set these on load to provide good response time.
let correct_re; // Compiled regex of correct answer, precomputed for speed

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
 */
function process_regex(regex_string) {
    let processed_regex_string = ('^' +
                  (regex_string.replace(/\r?\n( *\r?\n)+/g,'')
                               .replace(/\s+/g,'\\s*')) +
                  ' *$');
    // alert(`Processed="${processed_regex_string}"`);
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

/**
 * Run simple selftest; we presume it runs only during page initialization.
 * Must run load_data first, to set up globals like correct_re.
 * Ensure the initial attempt is incorrect AND the expected value is correct.
 */
function run_selftest() {
    let attempt = retrieve_attempt();
    let expected = trimNewlines(
        document.getElementById('expected').textContent
    );
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
            correct_re = process_regex(correct);
      }
      catch(e) {
          // This can only happen if the correct answer pattern is missing
          // or badly wrong.
          alert("Lab Error: Unparsable correct answer");
      }
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
    run_check();
}

// When the requesting web page loads, initialize things
window.onload = init_page;
