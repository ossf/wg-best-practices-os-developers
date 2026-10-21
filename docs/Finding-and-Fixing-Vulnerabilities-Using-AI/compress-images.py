#!/usr/bin/env python3
"""Make the served copies of this guide's images from the originals.

Called by cleanup-markdown. Usage:
    python3 compress-images.py ORIGINALS_DIR SERVED_DIR

For each image in ORIGINALS_DIR, writes the copy the guide serves to
SERVED_DIR, and prints "ORIGINAL<TAB>SERVED" (file names) so
cleanup-markdown can point Finding.md at the served copies. Opaque
raster images become JPEGs at quality 90: the originals (from Google
Docs) are lossless PNGs, mostly photo-like illustrations, so this
makes them about 6x smaller with no difference you can see. Images
that are already JPEGs, have transparency (which JPEG can't do), or
aren't raster images Pillow can read (e.g., SVG) are copied unchanged.
"""

# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT

import os
import shutil
import sys

from PIL import Image

QUALITY = 90


def to_jpeg(path):
    """Return the image at path as RGB if it should become a JPEG,
    else None."""
    if os.path.splitext(path)[1].lower() in (".jpg", ".jpeg"):
        return None
    try:
        im = Image.open(path)
        im.load()
    except (OSError, Image.UnidentifiedImageError):
        return None
    if im.convert("RGBA").getextrema()[3][0] < 255:
        return None
    return im.convert("RGB")


def main():
    originals, served = sys.argv[1], sys.argv[2]
    owner = {}
    for name in sorted(os.listdir(originals)):
        src = os.path.join(originals, name)
        im = to_jpeg(src)
        out_name = name
        if im is not None:
            out_name = os.path.splitext(name)[0] + ".jpg"
        # Two originals differing only in extension would both become
        # the same served file.
        if out_name in owner:
            sys.exit(f"compress-images.py: {owner[out_name]} and {name} "
                     f"would both be served as {out_name}; rename one")
        owner[out_name] = name
        dst = os.path.join(served, out_name)
        if im is not None:
            im.save(dst, "JPEG", quality=QUALITY, optimize=True,
                    progressive=True)
        else:
            shutil.copyfile(src, dst)
        print(f"{name}\t{out_name}")


if __name__ == "__main__":
    main()
