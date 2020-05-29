#!/bin/sh

VERSION=3.0.0-SNAPSHOT

cd atlas/webapp

CP=""
for i in `find target/atlas-webapp-$VERSION/WEB-INF/lib -name *.jar`; do CP="$CP:$i"; done

# echo $CP

java \
 -Dlog4j.configuration=file:../distro/src/conf/atlas-log4j.xml \
 -Datlas.home=target \
 -Datlas.data=target/data \
 -Dembedded.solr.directory=target \
 -Datlas.log.dir=target/logs \
 -Datlas.log.file=application.log \
 -Datlas.conf=target/test-classes \
 -classpath $CP \
 org.apache.atlas.Atlas \
 -app target/atlas-webapp-$VERSION
