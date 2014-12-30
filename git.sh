#!/bin/bash

# author
# author email
# date (ISO 8601)
# commit title
# commit content
# files
git log --name-only --pretty="format:%an%n%ce%n%ai%n%s"
