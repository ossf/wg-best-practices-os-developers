// lab_checker - check if lab entry is correct

/**
 * Return HTML response by determining if attempt matches the regex correct.
 * @attempt String from user
 * @correct String of regex describing correct answer
 */
function calcMatch(attempt, correct) {
  try {
    let re = new RegExp(correct);
    if (re.test(attempt)) {
      return '<span class="success">MATCHES</span>';
    } else {
      return '<span class="fail">DOES NOT MATCH</span>';
    }
  }
  catch(e) {
    // alert(e);
    return '<span class="fail">Invalid regex pattern for correct answer</span>';
  }
}


/**
 * Check the document's user input "attempt" to see if matches "correct".
 * Then set "grade" in document depending on that answer.
 */
function run_check() {
    let attempt = document.getElementById('attempt').value.trim();

    // We could optimize this by creating the regex once per page.
    // However, JavaScript regexes are stateful, so we'd need to be careful,
    // and it's currently so fast that it doesn't matter.
    let correct = document.getElementById('correct').textContent.trim();

    // Calculate grade and set in document.
    document.getElementById('grade').innerHTML = calcMatch(attempt, correct);
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
