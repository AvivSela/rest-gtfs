#!/usr/bin/env python

from setuptools import setup, find_packages

with open('requirements.txt') as f:
    requirements = f.read().splitlines()

version = '0.0'

setup(
    name='gtfs db and loader',
    version=version,
    install_requires=requirements,
    author='Aviv Sela',
    author_email='AvivSela10@gmail.com',
    packages=find_packages(),
    include_package_data=True,
    url='https://github.com/AvivSela/rest-gtfs',
    license='MIT',
    description='',
    long_description='',
    classifiers=[
        'License :: OSI Approved :: MIT License',
        'Operating System :: POSIX',
        'Intended Audience :: Developers',
        'Natural Language :: English',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
    ],
)
