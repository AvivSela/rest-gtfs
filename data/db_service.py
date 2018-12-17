import os
import sys

from dotenv import load_dotenv
import subprocess

ENV_FILE_PATH = os.path.join(os.path.dirname(__file__),'../.env')

def start():
    if os.path.exists(ENV_FILE_PATH):
        load_dotenv(dotenv_path=ENV_FILE_PATH)

    bash_command = '''docker run --name some-postgis -e POSTGRES_PASSWORD={} -e POSTGRES_USER={}
                                 -e POSTGRES_DB={} -p {}:5432 --rm -d mdillon/postgis'''.format(os.getenv("POSTGRES_PASSWORD"),
                            os.getenv("POSTGRES_USER"),
                            os.getenv("POSTGRES_DB"),
                            os.getenv("POSTGRES_PORT"))

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
