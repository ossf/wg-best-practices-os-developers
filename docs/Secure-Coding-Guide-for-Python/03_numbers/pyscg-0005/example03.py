# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Code Example """

class TruncateableString:
    """String wrapper that supports ellipsis truncation."""
    def __init__(self, text : str):
        self.text = text

    def __round__(self, ncharacters : int=None):
        """Truncates the string value to the given number of characters.
            If ncharacters is not provided, or if it equal or higher than
            the length of the text, the text won't be truncated.
            Raises ValueError if ncharacters is not a positive value"""
        if not ncharacters:
            return self
        if ncharacters <= 0:
            raise ValueError(f"The minimal number of characters must be greater than 0. Instead provided {ncharacters}")
        if ncharacters >= len(self.text):
            return self
        return TruncateableString(self.text[0:ncharacters] + '...')
   
    def __repr__(self):
        return self.text

my_text = TruncateableString("Particularly long text that you might want to truncate.")

# No truncation as per the docstring
print(round(my_text))
print(round(my_text, 2000))
# Raised exception
try:
    print(round(my_text, -10))
except ValueError as e:
    print(e)
# Truncated example
print(round(my_text, 22))
