import os
import psycopg2 as psycopg2
from dotenv import load_dotenv
import tempfile
import zipfile
from ftplib import FTP

load_dotenv()

postges_conn = psycopg2.connect("host=localhost dbname=gtfs_db user=postgres password=123"
                                .format(os.getenv("POSTGRES_PASSWORD")))


SQL_STATEMENT = """ COPY %s FROM STDIN WITH CSV HEADER DELIMITER AS ',' QUOTE AS '`' """


def process_file(conn, table_name, file_path):
    print("start: " + table_name)
    with open(file_path) as file_object:
        cursor = conn.cursor()
        cursor.copy_expert(sql=SQL_STATEMENT % table_name, file=file_object)
        conn.commit()
        cursor.close()


def init_db_schema():
    postges_conn.cursor().execute(open('sql/db_init.sql').read())
    postges_conn.commit()


def upload_data_to_mirror(folder_path):
    process_file(postges_conn, 'mirror.agency',          os.path.join(folder_path, 'agency.txt'))
    process_file(postges_conn, 'mirror.calendar',        os.path.join(folder_path, 'calendar.txt'))
    process_file(postges_conn, 'mirror.fare_attributes', os.path.join(folder_path, 'fare_attributes.txt'))
    process_file(postges_conn, 'mirror.fare_rules',      os.path.join(folder_path, 'fare_rules.txt'))
    process_file(postges_conn, 'mirror.routes',          os.path.join(folder_path, 'routes.txt'))
    process_file(postges_conn, 'mirror.shapes',          os.path.join(folder_path, 'shapes.txt'))
    process_file(postges_conn, 'mirror.stops',           os.path.join(folder_path, 'stops.txt'))
    process_file(postges_conn, 'mirror.stop_times',      os.path.join(folder_path, 'stop_times.txt'))
    process_file(postges_conn, 'mirror.trips',           os.path.join(folder_path, 'trips.txt'))


def download_and_extract_gtfs(target_folder, url="199.203.58.18", filename='israel-public-transportation.zip'):
    ftp = FTP(url)
    ftp.login()

    with tempfile.TemporaryFile() as lf:
        ftp.retrbinary("RETR " + filename, lf.write, 8 * 1024)
        with zipfile.ZipFile(lf) as zip_ref:
            zip_ref.extractall(target_folder)


if __name__ == '__main__':

    init_db_schema()

    with tempfile.TemporaryDirectory() as gtfs_folder:
        download_and_extract_gtfs(gtfs_folder)
        upload_data_to_mirror(gtfs_folder)



