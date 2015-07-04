#! /bin/bash
#
aws configure set region us-east-1

# Create new Elastic Beanstalk version
DOCKERRUN_FILE=$CIRCLE_SHA1-Dockerrun.aws.json
sed "s/<TAG>/$CIRCLE_SHA1/" < Dockerrun.aws.json.template > $DOCKERRUN_FILE
aws s3 cp $DOCKERRUN_FILE s3://elasticbeanstalk-us-east-1-143133207860/$DOCKERRUN_FILE
#aws elasticbeanstalk create-application-version --application-name RFQ-4QTFHS150004\
#  --version-label $CIRCLE_SHA1 --source-bundle S3Bucket=elasticbeanstalk-us-east-1-143133207860,S3Key=$DOCKERRUN_FILE

# 
# Update Elastic Beanstalk environment to new version
#aws elasticbeanstalk update-environment --environment-name be-safe-docker \
#    --version-label $CIRCLE_SHA1