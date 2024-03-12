// lab_checker - check and report if lab attempt is correct

// Correct answers are embedded in the web page in a div area with
// the id "correct".
// Answers are expressed using regular expression patterns, to make it easy to
// indicate the many different forms that are all correct. E.g.:
//
// * Pattern `(a|b)` matches `a` or `b`, while `foo\(a\)` matches `foo(a)`.
// * Pattern `\{\\\}` matches the literal text `{\}`.
// * Pattern `9_?999` matches `9`, an optional `_`, then `999`.
//
// To make the correct answer regular expressions easier to read, the
// pattern for correct answers is preprocessed as follows:
// * A completely blank line in the middle of a pattern is interpreted as
//   a required end of line.
// * Otherwise, any sequence of 1+ whitespace (spaces, tabs, and newlines)
//   is interpreted as "0 or more whitespace is allowed here".
//   This can also be expressed as `\s*`, but whitespace is easier to read,
//   and this circumstance repeatedly occurs in correct answers.
// * Use \s to match a whitespace character, and \x20 for a space character.
// * The given pattern much be exactly matched - it's case-sensitive.
// * The *entire* input must match the correct answer. Leading and trailing
//   newlines are removed. Answers can match with leading and trailing spaces
//   by default (if your pattern *requires* spaces, then they'll be required).

/**
 * Trim newlines (LF or CRLF) from beginning and end of given String.
 */
function trimNewlines(s) {
    return ((s + '').replace(/^\r?\n(\r?\n)+/, '')
            .replace(/^\r?\n(\r?\n)+$/, ''));
}

/**
 * Return if attempt matches the regex correct.
 * @attempt String from user
 * @correct String of regex describing correct answer
 *
 * This shows an alert if "correct" isn't syntactically valid.
 */
function calcMatch(attempt, correct) {
    try {
          let unsweetened_re = ('^ *' +
                  (correct.replace(/\r?\n( *\r?\n)+/g,'\\r?\\n')
                          .replace(/\s+/g,'\\s*')) +
                  ' *$');
          let re = new RegExp(unsweetened_re);

          return (re.test(attempt));
      }
      catch(e) {
          alert(`Unparsable correct answer "${correct}"`);
          return false;
      }
}

/**
 * Check the document's user input "attempt" to see if matches "correct".
 * Then set "grade" in document depending on that answer.
 */
function run_check() {
    // Ignore empty lines at beginning & end of both attempt and correct.
    let attempt = trimNewlines(document.getElementById('attempt').value);

    // We could optimize this by creating the regex once per page.
    // However, JavaScript regexes are stateful, so we'd need to be careful,
    // and it's currently so fast that it doesn't matter.
    let correct = trimNewlines(document.getElementById('correct').textContent);

    // Calculate grade and set in document.
    let isCorrect = calcMatch(attempt, correct);
    document.getElementById('grade').innerHTML = isCorrect ?
      '<span class="success">SUCCESS! That is correct.</span>' :
      '<span class="fail">Sorry, that is not correct.</span>';
    document.getElementById('attempt').style.backgroundColor = isCorrect ?
      'lightgreen' : 'yellow';

}

function init_page() {
    // This will cause us to sometimes check twice, but this also ensures
    // that we always catch changes to the attempt.
    document.getElementById('attempt').onchange = run_check;
    document.getElementById('attempt').onkeyup = run_check;
    run_check();
}

// When the requesting web page loads, initialize things
window.onload = init_page;
