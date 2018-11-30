import os
import sys

from dotenv import load_dotenv
import subprocess


def start():
    load_dotenv()

    bash_command = "docker run --name some-postgis -e POSTGRES_PASSWORD={} -e POSTGRES_DB=gtfs_db -p 5432:5432 --rm \
    -d mdillon/postgis".format(os.getenv("POSTGRES_PASSWORD"))

    process = subprocess.Popen(bash_command.split())
    process.communicate()
    print(process.returncode)


def stop():
    process = subprocess.Popen('docker stop some-postgis'.split())
    process.communicate()
    print(process.returncode)


def print_usage():
    print('USAGE: {} [stop|start]'.format(os.path.basename(__file__)))
    exit(1)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print_usage()
    if sys.argv[1] == 'start':
        start()
    elif sys.argv[1] == 'stop':
        stop()
    elif sys.argv[1] == 'restart':
        stop()
        start()
    else:
        print_usage()
