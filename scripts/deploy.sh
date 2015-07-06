#! /bin/bash
#
aws configure set region us-east-1


ARCHIVE_NAME="${CIRCLE_SHA1}-besafe-package.zip"

zip $ARCHIVE_NAME start.sh Dockerrun.aws.json Dockerfile

# Create new Elastic Beanstalk version
#DOCKERRUN_FILE=$CIRCLE_SHA1-Dockerrun.aws.json
#sed "s/<TAG>/$CIRCLE_SHA1/" < Dockerrun.aws.json.template > $DOCKERRUN_FILE
aws s3 cp $ARCHIVE_NAME s3://elasticbeanstalk-us-east-1-143133207860/$ARCHIVE_NAME
aws elasticbeanstalk create-application-version --application-name be-safe-docker\
  --version-label $CIRCLE_SHA1 --source-bundle S3Bucket=elasticbeanstalk-us-east-1-143133207860,S3Key=$ARCHIVE_NAME

# 
# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment --environment-name beSafeDocker-envii \
    --version-label $CIRCLE_SHA1