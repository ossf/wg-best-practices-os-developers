// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      index: 0,
      absent: "; $",
      text: "This code uses the convention of terminating each line with a semicolon; please follow the conventions of the code being modified.\n",
      text_ja: "このコードは各行の末尾にセミコロンをつけるコンベンションを使用しています。修正するコードのコンベンションに従ってください。",
    },
    {
      index: 0,
      present: "(Throw|THROW|New|NEW|error|ERROR)",
      text: "JavaScript is case-sensitive. use throw new Error(...).",
      text_ja: "JavaScriptは大文字小文字を区別します。throw new Error(...)としてください。",
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
      text_ja: "throwキーワードを使って例外を投げてください。例: throw new Error(\"Message\")",
      examples: [
        [ "  return { success: false, message: \"Division by zero is forbidden\" };" ],
        [ " return \"Division by zero is forbidden\" ;" ]
      ],
    },
    {
      index: 1,
      absent: "return",
      text: "Use the return keyword to return the result of the division.",
      text_ja: "returnキーワードを使って、割り算の結果を返してください。",
      examples: [
        [ "  a / b ;" ]
      ],
    },
    {
      index: 1,
      present: "{ (.*?)} ",
      text: "Try simply returning the result of the division.",
      text_ja: "シンプルに割り算の結果だけを返すようにしてください。",
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
      text_ja: "tryブロックを使って投げられる可能性のある例外を受けられるようにしてください。try { ... } catch(err) { ... } のようになるはずです (...の部分を埋めてください)",
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
      text_ja: "tryブロックの中では、結果は成功しているとみなしてかまいません。",
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
      text_ja: "結果はオブジェクトではなく数値です。",
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
      text_ja: "catchブロックでエラーを処理してください。try {...} の後に、catch(err){...} でエラーをキャッチする必要があります。",
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
      text_ja: "catch (...) {...}を用いて、エラーオブジェクトをキャッチするようにしてください。",
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
      text_ja: "このラボでは、catch (err) {...} を用いてください。",
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
      text_ja: "エラーをレポートするには、catchブロックの中でerr変数としてキャッチしたものを使います。したがって、エラーはerr.messageであるため、resultやresult.messageではなくerr.messageを使う必要があります。result変数はtryブロック内で宣言されており、どのみちcatchブロックのスコープ外であることに注意してください。",
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
