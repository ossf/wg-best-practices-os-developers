info =
{
  hints: [
    {
      index: 0,
      absent: "; $",
      text: "This code uses the convention of terminating each line with a semicolon; please follow the conventions of the code being modified.\n"
    },
    {
      index: 0,
      present: "(Throw|THROW|New|NEW|error|ERROR)",
      text: "JavaScript is case-sensitive. use throw new Error(...).",
      examples: [
        [ "  Throw new Error(\"Division by zero is forbidden\");" ],
        [ "  THROW new Error(\"Division by zero is forbidden\");" ],
        [ "  throw New Error(\"Division by zero is forbidden\");" ],
        [ "  throw NEW Error(\"Division by zero is forbidden\");" ],
        [ "  throw new error(\"Division by zero is forbidden\");" ],
        [ "  throw new ERROR(\"Division by zero is forbidden\");" ]
      ],
    },
    {
      index: 0,
      absent: "throw",
      text: "Try using the throw keyword to raise an exception, E.g., throw new Error(\"Message\").",
      examples: [
        [ "  return { success: false, message: \"Division by zero is forbidden\" };" ],
        [ " return \"Division by zero is forbidden\" ;" ]
      ],
    },
    {
      index: 1,
      absent: "return",
      text: "Use the return keyword to return the result of the division.",
      examples: [
        [ "  a / b ;" ]
      ],
    },
    {
      index: 1,
      present: "{ (.*?)} ",
      text: "Try simply returning the result of the division.",
      examples: [
        [
          "throw new Error(\"Division by zero is forbidden\");",
          "  return { success: true, result: a / b };"
        ],
        [
          "throw new Error(\"Division by zero is forbidden\");",
          "  return { result: a / b };"
        ],
      ],
    },
    {
      index: 2,
      absent: String.raw`\s*try\s*{\s* `,
      text: "Use a try block to catch any exceptions that might be thrown. It should look something like `try { ... } catch(err) {...}` (fill in the `...` sections).",
      examples: [
        [
          "throw new Error(\"Division by zero is forbidden\");",
          "return a / b;",
          "  const result = divide(10, 2);"
        ],
      ],
    },
    {
      index: 2,
      present: String.raw`\s* try \s* { .*? if \( result.success \) .*?`,
      text: "You may assume that the result is successful within the try block.",
      examples: [
        [
          "throw new Error(\"Division by zero is forbidden\");",
          "return a / b;",
          " try { const result = divide(10 ,2); if( result.success) { console.log ( \"Result:\", result ); "
        ],
      ],
    },
    {
      index: 2,
      present: ".*? result.result .*?",
      text: "The result is not an object, it is a number.",
      examples: [
        [
          "throw new Error(\"Division by zero is forbidden\");",
          "return a / b;",
          " try { const result = divide(10 ,2); console.log ( \"Result:\", result.result ); "
        ],
      ],
    },
    {
      index: 2,
      absent: ".*? catch .*? ",
      text: "Handle the error within the catch block. You need `catch(err) {...}` after `try {...}` to catch an error in the try block.",
      examples: [
        [
          "throw new Error(\"Division by zero is forbidden\");",
          "return a / b;",
          " try { const result = divide(10 ,2); console.log ( \"Result:\", result ); }"
        ],
      ],
    },
    {
      index: 2,
      absent: String.raw`\s* catch \s* \( .*? \) { \s* `,
      text: "Use 'catch (...) {...}' to catch an error object within the catch block.",
      examples: [
        [
          "throw new Error(\"Division by zero is forbidden\");",
          "return a / b;",
          " try { const result = divide(10 ,2); console.log ( \"Result:\", result ); } catch {}"
        ],
      ],
    },
    {
      index: 2,
      absent: String.raw`catch \( err \)`,
      text: "Please use `catch(err) {...}` for purposes of this lab.",
      examples: [
        [
          "throw new Error(\"Division by zero is forbidden\");",
          "return a / b;",
          " try { const result = divide(10 ,2); console.log ( \"Result:\", result ); } catch (foo) {"
        ],
      ],
    },
    {
      index: 2,
      present: String.raw`catch .* console \. error \( ["'][^"']*["'] , result`,
      text: "When reporting the error, you need to report it in the catch block, which catches it as the variable `err`. Thus, you need to use `err.message` not `result` or `result.message`, since the error is in `err.message`. Note that  the variable `result` is out of scope in the catch block anyway; it was declared in the try block.",
      examples: [
        [
          "throw new Error(\"Division by zero is forbidden\");",
          "return a / b;",
          " try { const result = divide(10 ,2); console.log ( \"Result:\", result ); } catch (err) { console.error('Error', result.message);"
        ],
        [
          "throw new Error(\"Division by zero is forbidden\");",
          "return a / b;",
          " try { const result = divide(10 ,2); console.log ( \"Result:\", result ); } catch (err) { console.error('Error', result );"
        ],
      ],
    },
  ],
  expected: [
    'throw new Error("Division by zero is forbidden");',
    'return a / b;',
`try {
  const result = divide(10, 2);
  console.log("Result:", result);
} catch (err) {
  console.error("Error:", err.message);
}`
  ],
  correct: [
    String.raw`\s* throw new Error \( ("(.*)"|'(.*)'|${BACKQUOTE}(.*)${BACKQUOTE}) \) ; \s*`,
    String.raw`\s* return a \/ b ; \s*`,
    String.raw`\s* try \{
      const result = divide \( 10 , 2 \) ;
      console \. log \(
        ("Result:" | 'Result:' | ${BACKQUOTE}Result:${BACKQUOTE}) , result \) ;
      \} catch \( err \) {
        console.error \(
	  ("Error:" | 'Error:' | ${BACKQUOTE}Error:${BACKQUOTE}) ,
	  err \. message \) ;
      \} \s*`
  ],
};
