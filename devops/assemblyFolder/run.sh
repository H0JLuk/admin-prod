#!/bin/sh

cd /srv/common-distributor-admin
grep -r -l _REACT_APP_BACKEND_URL_ * | xargs sed -i 's|_REACT_APP_BACKEND_URL_|'"$REACT_APP_BACKEND_URL"'|g'

echo "common-distributor-admin" && exec nginx -g 'daemon off;'
