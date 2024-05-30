""" Non-compliant Code Example """
import re
import unicodedata
import sys

sys.stdout.reconfigure(encoding='UTF-8')


class TagFilter:
    """Input validation for human language"""

    def filter_string(self, input_string: str) -> str:
        """ Normalize and validate untrusted string

            Parameters:
                input_string(string): String to validate
        """
        # normalize
        _str = unicodedata.normalize("NFKC", input_string)

        # validate, exclude dangerous tags
        for tag in re.findall("<[^>]*>", _str):
            if tag in ["<script>", "<img", "<a href"]:
                raise ValueError("Invalid input tag")

        # modify, keep only trusted human words
        # _filtered_str = "".join(re.findall(r'([\//\w<>\s_-]+)', _str))
        _filtered_str = "".join(re.findall(r"[/\w<>\s-]+", _str))
        if len(_str) - len(_filtered_str) != 0:
            raise ValueError("Invalid input string")


#####################
# attempting to exploit above code example
#####################
names = [
    "YES 毛泽东先生",
    "YES María Quiñones Marqués",
    "YES Борис Николаевич Ельцин",
    "YES Björk Guðmundsdóttir",
    "YES 0123456789",
    "YES <b>",
    "YES <p>foo</p>",
    "YES underscore_",
    "YES dash-",
    "NOK semicolon;",
    "NOK noprint " + "\uFDD0",
    "NOK noprint " + "\uFDEF",
    "NOK <script" + "\uFDEF" + ">",
    "NOK <script生>",
    "NOK and &",
]
for name in names:
    print(name, end=" ")
    try:
        TagFilter().filter_string(name)
    except ValueError as e:
        print(" Error: " + str(e))
    else:
        print(" OK")
