cd
CWD=$(pwd)
mkdir -p temp/http
touch temp/http/__init__.py
echo "print('hello there')" > temp/http/server.py
export PYTHONPATH=$CWD/temp/
 
# and now launch again
python3 -m http.server -b 127.0.0.42 8080